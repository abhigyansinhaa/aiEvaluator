import { ChevronDown, ChevronUp } from "lucide-react";
import type { ExtractedAnswerBlock, ExtractedQuestion, GradeResult, QuestionMapping } from "@/lib/types";

interface QuestionListProps {
  questions: ExtractedQuestion[];
  mappings: QuestionMapping[];
  answersById: Map<string, ExtractedAnswerBlock>;
  grades: Map<string, GradeResult>;
  selectedQuestionId: string | null;
  expandAll: boolean;
  onSelect: (id: string) => void;
}

function splitNumber(raw: string): { main: string; sub: string | null } {
  const match = raw.trim().match(/^(\d+)\s*\(?\s*([a-zA-Z]+)\)?\s*$/);
  if (match) return { main: match[1], sub: `${match[2].toLowerCase()}.` };
  return { main: raw, sub: null };
}

function statusLabel(mapping: QuestionMapping | undefined): string {
  if (!mapping || mapping.answerIds.length === 0) return "Unanswered";
  if (mapping.answerIds.length > 1) return "Multi-page";
  return "Answered";
}

function statusTone(mapping: QuestionMapping | undefined): string {
  if (!mapping || mapping.answerIds.length === 0) return "bg-amber-soft text-amber border border-amber-border";
  if (mapping.answerIds.length > 1) return "bg-blue-soft text-blue border border-blue-border";
  return "bg-green-soft text-green border border-green-border";
}

const marksTone = (awarded: number, max: number) => {
  if (awarded <= 0) return "bg-red-soft text-red border border-red-border";
  if (awarded >= max) return "bg-green-soft text-green border border-green-border";
  return "bg-amber-soft text-amber border border-amber-border";
};

export function QuestionList({
  questions,
  mappings,
  answersById,
  grades,
  selectedQuestionId,
  expandAll,
  onSelect,
}: QuestionListProps) {
  const mappingById = new Map(mappings.map((m) => [m.questionId, m]));

  return (
    <div className="space-y-3">
      {questions.map((q) => {
        const mapping = mappingById.get(q.id);
        const grade = grades.get(q.id);
        const selected = selectedQuestionId === q.id;
        const expanded = selected || expandAll;
        const { main, sub } = splitNumber(q.number);
        const answerTexts = (mapping?.answerIds ?? [])
          .map((id) => answersById.get(id)?.text)
          .filter(Boolean) as string[];

        return (
          <div
            key={q.id}
            className={`rounded-2xl border bg-surface transition-all ${
              selected ? "border-2 border-orange shadow-sm" : "border-line/80 hover:border-line"
            }`}
          >
            <button onClick={() => onSelect(q.id)} className="w-full text-left px-4 py-3.5">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                    selected ? "bg-orange" : "bg-ink"
                  }`}
                >
                  {main}
                </span>
                {sub && <span className="mt-1.5 text-sm text-ink-soft font-semibold shrink-0">{sub}</span>}
                <p className="flex-1 text-sm text-ink font-medium leading-snug pt-1">{q.text}</p>
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  {grade ? (
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${marksTone(grade.marksAwarded, grade.maxMarks)}`}>
                      {grade.marksAwarded}/{grade.maxMarks}
                    </span>
                  ) : (
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusTone(mapping)}`}>
                      {statusLabel(mapping)}
                    </span>
                  )}
                  {expanded ? (
                    <ChevronUp size={16} className="text-ink-faint" />
                  ) : (
                    <ChevronDown size={16} className="text-ink-faint" />
                  )}
                </div>
              </div>
            </button>

            {expanded && (
              <div className="px-4 pb-4 space-y-2.5">
                {grade ? (
                  <div className="rounded-xl bg-surface-muted/70 px-3.5 py-3 border border-line/40">
                    <p className="text-xs font-bold text-ink mb-1">AI Feedback</p>
                    <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">{grade.feedback}</p>
                  </div>
                ) : answerTexts.length > 0 ? (
                  <div className="rounded-xl bg-surface-muted/70 px-3.5 py-3 border border-line/40">
                    <p className="text-xs font-bold text-ink mb-1">Transcribed answer</p>
                    {answerTexts.map((t, i) => (
                      <p key={i} className="text-xs sm:text-sm text-ink-soft mb-1 last:mb-0 leading-relaxed">
                        {t}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-ink-faint italic pl-1">No matching answer found on the sheet.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
