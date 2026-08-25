export interface BoundingBox {
  /** ymin normalized 0-1000 */
  ymin: number;
  /** xmin normalized 0-1000 */
  xmin: number;
  /** ymax normalized 0-1000 */
  ymax: number;
  /** xmax normalized 0-1000 */
  xmax: number;
}

export interface AnswerRegion {
  /** 0-indexed page in answer sheet */
  pageIndex: number;
  /** Normalized bounding box [0-1000] */
  box: BoundingBox;
}

export interface Question {
  id: string;
  /** Preserved original number, e.g. "1", "11 (a)", "11 (b)" */
  number: string;
  /** Question text content */
  text: string;
  maxMarks?: number;
  /** Labelled parent if this is a subpart */
  parentNumber?: string;
}

export interface ExtractedAnswer {
  id: string;
  /** Question number written by student, e.g. "Q11(a)" or null if unlabelled */
  detectedQuestionNumber?: string | null;
  /** Transcribed handwritten text */
  text: string;
  /** Bounding region(s) on answer sheet pages */
  regions: AnswerRegion[];
}

export interface QuestionAnswerMapping {
  questionId: string;
  questionNumber: string;
  questionText: string;
  maxMarks?: number;
  status: 'answered' | 'unanswered';
  answerId?: string;
  answerText?: string;
  /** Region(s) highlighting answer location on answer sheet */
  regions: AnswerRegion[];
  marksObtained?: number;
  isCorrect?: boolean;
  feedback?: string;
}

export interface UnmappedAnswer {
  id: string;
  detectedQuestionNumber?: string | null;
  text: string;
  regions: AnswerRegion[];
  note?: string;
}

export interface GradingSummary {
  totalMarksObtained: number;
  totalMaxMarks: number;
  percentage: number;
  answeredCount: number;
  unansweredCount: number;
  overallFeedback: string;
}

export interface AssessmentData {
  questions: Question[];
  answers: ExtractedAnswer[];
  mappings: QuestionAnswerMapping[];
  unmappedAnswers: UnmappedAnswer[];
  questionPageImages: string[]; // Base64 PNGs
  answerPageImages: string[];   // Base64 PNGs
  gradingSummary?: GradingSummary;
}

export interface ProcessingProgress {
  step: 'idle' | 'uploading' | 'extracting_questions' | 'extracting_answers' | 'mapping_and_grading' | 'completed' | 'error';
  percentage: number;
  message: string;
  errorDetails?: string;
}
