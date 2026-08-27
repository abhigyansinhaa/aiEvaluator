import type { ExtractedAnswerBlock, ExtractedQuestion, QuestionMapping } from "./types";

/** Normalizes a printed/handwritten question number for comparison, e.g. "Q11 (a)" -> "11a". */
export function normalizeNumber(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .toLowerCase()
    // strip common prefixes: "q.", "q ", "ans", "ans.", "answer", "answer:", "sol", "sol."
    .replace(/^(ans\.?w?e?r?\.?\s*:?\s*|sol\.?\s*:?\s*|q\.?\s*)/i, "")
    // strip all punctuation, parens, hyphens, dots, colons, and whitespace
    .replace(/[().:\-\s]/g, "")
    .trim();
}

/** Formats a question number cleanly for display on badges, e.g. "8" or "Q8." -> "Q No. 8". */
export function formatQuestionLabel(raw: string | null | undefined): string {
  if (!raw) return "";
  const cleaned = raw
    .trim()
    .replace(/^(q(?:uestion)?\.?\s*(?:no\.?)?\s*)/i, "")
    .replace(/[.:]+$/, "")
    .trim();
  return `Q No. ${cleaned || raw}`;
}

export interface MappingResult {
  mappings: QuestionMapping[];
  unmatchedAnswers: ExtractedAnswerBlock[]; // answers whose matchedNumber didn't hit any known question
}

/** Groups extracted answer blocks under the question they answer, by normalized printed number. */
export function mapAnswersToQuestions(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswerBlock[]
): MappingResult {
  const byNorm = new Map<string, string[]>(); // normalized question number -> answer ids
  for (const q of questions) byNorm.set(normalizeNumber(q.number), []);

  const unmatchedAnswers: ExtractedAnswerBlock[] = [];

  for (const a of answers) {
    const norm = normalizeNumber(a.matchedNumber);
    if (norm && byNorm.has(norm)) {
      byNorm.get(norm)!.push(a.id);
    } else {
      unmatchedAnswers.push(a);
    }
  }

  const mappings: QuestionMapping[] = questions.map((q) => ({
    questionId: q.id,
    answerIds: byNorm.get(normalizeNumber(q.number)) ?? [],
  }));

  return { mappings, unmatchedAnswers };
}