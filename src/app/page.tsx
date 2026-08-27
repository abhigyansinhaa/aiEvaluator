"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { UploadZone } from "@/components/UploadZone";
import { QuestionList } from "@/components/QuestionList";
import { AnswerSheetViewer } from "@/components/AnswerSheetViewer";
import { GradingSummary } from "@/components/GradingSummary";
import { filesToPageImages } from "@/lib/pdf";
import { formatQuestionLabel, mapAnswersToQuestions, normalizeNumber } from "@/lib/mapping";
import type {
  ExtractedAnswerBlock,
  ExtractedQuestion,
  GradeResult,
  PageImage,
  ProcessingStage,
  QuestionMapping,
} from "@/lib/types";

const STAGE_LABEL: Record<ProcessingStage, string> = {
  idle: "",
  rendering: "Rendering pages…",
  "extracting-questions": "Reading the question paper…",
  "extracting-answers": "Reading handwritten answers…",
  mapping: "Mapping answers to questions…",
  done: "Done",
  error: "Error",
};

export default function Home() {
  const [questionFiles, setQuestionFiles] = useState<File[]>([]);
  const [answerFiles, setAnswerFiles] = useState<File[]>([]);
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [error, setError] = useState<string | null>(null);

  const [answerPages, setAnswerPages] = useState<PageImage[]>([]);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [answers, setAnswers] = useState<ExtractedAnswerBlock[]>([]);
  const [mappings, setMappings] = useState<QuestionMapping[]>([]);
  const [unmatched, setUnmatched] = useState<ExtractedAnswerBlock[]>([]);
  const [grades, setGrades] = useState<Map<string, GradeResult>>(new Map());
  const [grading, setGrading] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"questions" | "sheet">("questions");

  const answersById = useMemo(() => new Map(answers.map((a) => [a.id, a])), [answers]);
  const mappingById = useMemo(() => new Map(mappings.map((m) => [m.questionId, m])), [mappings]);

  const canProcess =
    questionFiles.length > 0 &&
    answerFiles.length > 0 &&
    stage !== "rendering" &&
    stage !== "extracting-questions" &&
    stage !== "extracting-answers" &&
    stage !== "mapping";
  const isProcessing = ["rendering", "extracting-questions", "extracting-answers", "mapping"].includes(stage);

  async function handleProcess() {
    setError(null);
    setSelectedQuestionId(null);
    try {
      setStage("rendering");
      const [qPages, aPages] = await Promise.all([
        filesToPageImages(questionFiles),
        filesToPageImages(answerFiles),
      ]);
      setAnswerPages(aPages);

      setStage("extracting-questions");
      const qRes = await fetch("/api/extract-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: qPages.map((p) => p.base64) }),
      });
      const qData = await qRes.json();
      if (!qRes.ok) throw new Error(qData.error || "Failed to extract questions");
      const extractedQuestions: ExtractedQuestion[] = qData.questions;
      setQuestions(extractedQuestions);

      setStage("extracting-answers");
      const aRes = await fetch("/api/extract-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: aPages.map((p) => p.base64),
          questionNumbers: extractedQuestions.map((q) => q.number),
        }),
      });
      const aData = await aRes.json();
      if (!aRes.ok) throw new Error(aData.error || "Failed to extract answers");
      const extractedAnswers: ExtractedAnswerBlock[] = aData.answers;
      setAnswers(extractedAnswers);
      setStudentName(aData.studentName ?? null);

      setStage("mapping");
      const { mappings: m, unmatchedAnswers } = mapAnswersToQuestions(extractedQuestions, extractedAnswers);
      setMappings(m);
      setUnmatched(unmatchedAnswers);

      setStage("done");
      if (extractedQuestions.length > 0) setSelectedQuestionId(extractedQuestions[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStage("error");
    }
  }

  async function handleGradeAll() {
    setGrading(true);
    setError(null);
    try {
      const items = questions.map((q) => {
        const mapping = mappingById.get(q.id);
        const text =
          (mapping?.answerIds ?? [])
            .map((id) => answersById.get(id)?.text)
            .filter(Boolean)
            .join("\n") || "(no answer found)";
        return {
          questionId: q.id,
          questionNumber: q.number,
          questionText: q.text,
          answerText: text,
        };
      });

      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to grade");
      const g: GradeResult[] = data.grades;
      setGrades(new Map(g.map((gr) => [gr.questionId, gr])));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grading failed");
    } finally {
      setGrading(false);
    }
  }

  function reset() {
    setQuestionFiles([]);
    setAnswerFiles([]);
    setStage("idle");
    setError(null);
    setAnswerPages([]);
    setStudentName(null);
    setQuestions([]);
    setAnswers([]);
    setMappings([]);
    setUnmatched([]);
    setGrades(new Map());
    setSelectedQuestionId(null);
    setExpandAll(false);
  }

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) ?? null;
  const selectedMapping = selectedQuestionId ? mappingById.get(selectedQuestionId) : undefined;
  const highlightedAnswerIds = selectedMapping?.answerIds ?? [];
  const jumpToPage =
    highlightedAnswerIds.length > 0 ? answersById.get(highlightedAnswerIds[0])?.page ?? null : null;

  const showWorkspace = stage === "done";

  function handleAnswerClick(answer: ExtractedAnswerBlock) {
    if (!answer.matchedNumber) return;
    const norm = normalizeNumber(answer.matchedNumber);
    const q = questions.find((q) => normalizeNumber(q.number) === norm);
    if (q) {
      setSelectedQuestionId(q.id);
      setMobileTab("questions");
    }
  }

  return (
    <AppShell
      sidebarExpanded={!showWorkspace && !isProcessing}
      onBack={reset}
    >
      {!showWorkspace && !isProcessing && (
        <div className="flex-1 overflow-auto flex items-start justify-center px-6 py-14">
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-ink">
              Upload{" "}
              <span className="bg-orange-soft text-orange px-2 py-0.5 rounded-md">
                Question Paper &amp; Answer Sheets
              </span>
            </h1>
            <p className="text-ink-soft mt-3">Upload both files to get started</p>

            <div className="w-20 h-20 rounded-full bg-orange-soft border-4 border-orange/10 mx-auto my-8 flex items-center justify-center">
              <Sparkles className="text-orange" size={28} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              <UploadZone
                label="Question paper"
                accentLabel="Question Paper"
                files={questionFiles}
                onChange={setQuestionFiles}
                disabled={isProcessing}
              />
              <UploadZone
                label="Student answer sheet"
                accentLabel="Answer Sheet"
                files={answerFiles}
                onChange={setAnswerFiles}
                disabled={isProcessing}
              />
            </div>

            <button
              onClick={handleProcess}
              disabled={!canProcess}
              className="mt-8 inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full bg-ink text-white hover:bg-ink/85 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            >
              Start Mapping →
            </button>
            <p className="text-xs text-ink-faint mt-3">
              Once both files are uploaded, you&apos;ll be able to map answers with questions
            </p>

            {error && (
              <p className="mt-5 text-sm text-red bg-red-soft border border-red-border rounded-lg px-4 py-2.5 inline-block">
                {error}
              </p>
            )}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Sparkles className="text-orange animate-pulse" size={56} strokeWidth={1.5} />
          <p className="text-xl font-bold text-ink">Extracting…</p>
          <p className="text-sm text-ink-faint">{STAGE_LABEL[stage]}</p>
        </div>
      )}

      {showWorkspace && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-end gap-3 border-b border-line bg-surface px-6 py-2.5 shrink-0">
            <button
              onClick={handleGradeAll}
              disabled={grading}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-orange text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {grading ? "Grading…" : "Grade all"}
            </button>
            <button
              onClick={reset}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-line text-ink-soft hover:bg-surface-muted transition-colors"
            >
              Start over
            </button>
          </div>

          {/* Mobile segmented tab control */}
          <div className="sm:hidden flex gap-1 p-1 m-3 rounded-full bg-surface-muted border border-line shrink-0">
            {(["questions", "sheet"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMobileTab(t)}
                className={`flex-1 text-sm font-medium py-1.5 rounded-full transition-colors ${
                  mobileTab === t ? "bg-ink text-white" : "text-ink-soft"
                }`}
              >
                {t === "questions" ? "Questions" : "Answer Sheet"}
              </button>
            ))}
          </div>

          <GradingSummary
            studentName={studentName}
            onStudentNameChange={setStudentName}
            grades={grades}
            totalQuestions={questions.length}
          />

          <div className="flex-1 flex min-h-0 overflow-hidden">
            <section
              className={`w-full sm:w-[44%] border-r border-line flex-col overflow-hidden ${
                mobileTab === "questions" ? "flex" : "hidden sm:flex"
              }`}
            >
              <div className="px-5 py-3 border-b border-line bg-surface flex items-center justify-between shrink-0">
                <p className="text-sm font-semibold text-ink">Extracted Questions (from question paper)</p>
                <button
                  onClick={() => setExpandAll((v) => !v)}
                  className="text-xs font-medium text-ink-soft hover:text-ink shrink-0"
                >
                  {expandAll ? "Collapse All" : "Expand All"}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-bg">
                <QuestionList
                  questions={questions}
                  mappings={mappings}
                  answersById={answersById}
                  grades={grades}
                  selectedQuestionId={selectedQuestionId}
                  expandAll={expandAll}
                  onSelect={setSelectedQuestionId}
                />
                {unmatched.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-amber-border bg-amber-soft overflow-hidden">
                    <div className="px-4 py-2 border-b border-amber-border">
                      <p className="text-xs font-semibold text-amber uppercase tracking-wide">
                        Unmatched answers · {unmatched.length}
                      </p>
                    </div>
                    <ul className="divide-y divide-amber-border/60 max-h-40 overflow-auto">
                      {unmatched.map((u) => (
                        <li key={u.id} className="px-4 py-2 text-xs text-ink-soft">
                          <span className="text-ink-faint mr-2">p.{u.page + 1}</span>
                          {u.text.slice(0, 120)}
                          {u.text.length > 120 ? "…" : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            <section
              className={`flex-1 flex-col overflow-hidden ${mobileTab === "sheet" ? "flex" : "hidden sm:flex"}`}
            >
              <div className="px-5 py-3 border-b border-line bg-surface shrink-0">
                <p className="text-sm font-semibold text-ink">Answer Sheet</p>
              </div>
              <div className="flex-1 overflow-hidden">
                <AnswerSheetViewer
                  pages={answerPages}
                  answers={answers}
                  highlightedAnswerIds={highlightedAnswerIds}
                  highlightedLabel={selectedQuestion ? formatQuestionLabel(selectedQuestion.number) : null}
                  jumpToPage={jumpToPage}
                  onAnswerClick={handleAnswerClick}
                />
              </div>
            </section>
          </div>
        </div>
      )}

      {error && showWorkspace && (
        <p className="text-sm text-red border-t border-red-border bg-red-soft px-6 py-2 shrink-0">{error}</p>
      )}
    </AppShell>
  );
}
