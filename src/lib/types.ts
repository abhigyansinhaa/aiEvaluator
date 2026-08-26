// Normalized bounding box: [x0, y0, x1, y1] as fractions (0-1) of the page image dimensions.
export type BBox = [number, number, number, number];

export interface PageImage {
  page: number; // 0-indexed
  dataUrl: string; // base64 PNG data URL, used for on-screen rendering
  base64: string; // raw base64 (no data: prefix), sent to the AI
  width: number;
  height: number;
}

export interface ExtractedQuestion {
  id: string; // stable id, e.g. "q-11a"
  number: string; // printed numbering, e.g. "11 (a)"
  text: string;
  page: number;
  bbox: BBox;
}

export interface ExtractedAnswerBlock {
  id: string; // stable id, e.g. "a-0"
  matchedNumber: string | null; // the question number the model believes this answers
  text: string;
  page: number;
  bbox: BBox;
}

export interface QuestionMapping {
  questionId: string;
  answerIds: string[]; // supports multi-page / multi-block answers; empty = unanswered
}

export interface GradeResult {
  questionId: string;
  verdict: "correct" | "partially_correct" | "incorrect" | "ungraded";
  marksAwarded: number;
  maxMarks: number;
  feedback: string;
}

export type ProcessingStage =
  | "idle"
  | "rendering"
  | "extracting-questions"
  | "extracting-answers"
  | "mapping"
  | "done"
  | "error";