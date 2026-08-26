import { NextRequest, NextResponse } from "next/server";
import { callGeminiJSON, GeminiError } from "@/lib/gemini";
import type { GradeResult } from "@/lib/types";

export const maxDuration = 60;

const SYSTEM_INSTRUCTION = `You are an experienced exam grader. You will receive a JSON array of
question/answer pairs. For each one:
1. Decide a fair "maxMarks" for that question based on its complexity and depth (e.g. 2 for a
   short factual question, 3-5 for an "explain"/"describe" question, 4-5 for a labelled diagram
   question). Be consistent: similar questions should get similar maxMarks.
2. Decide "marksAwarded" (an integer from 0 to maxMarks) based on how complete and correct the
   student's answer is relative to the question.
3. Decide a "verdict": "correct" if marksAwarded === maxMarks, "incorrect" if marksAwarded === 0,
   otherwise "partially_correct".
4. Write one or two sentences of specific, constructive feedback.

If the answer text is empty or exactly "(no answer found)", marksAwarded must be 0, verdict
"incorrect", and feedback should note it was left unanswered. Be fair and consistent; judge only
the text given, not handwriting neatness.`;

interface GradeInput {
  questionId: string;
  questionNumber: string;
  questionText: string;
  answerText: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items } = (await req.json()) as { items: GradeInput[] };
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const prompt = `Grade each of these question/answer pairs:
${JSON.stringify(items, null, 2)}

Return ONLY a JSON array, one entry per input item in the same order, shaped as:
{"questionId": string, "verdict": "correct" | "partially_correct" | "incorrect", "marksAwarded": number, "maxMarks": number, "feedback": string}`;

    const result = await callGeminiJSON<
      Array<Pick<GradeResult, "questionId" | "verdict" | "marksAwarded" | "maxMarks" | "feedback">>
    >({
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt,
      images: [],
      temperature: 0.2,
    });

    const grades: GradeResult[] = result.map((g) => ({
      questionId: g.questionId,
      verdict: g.verdict,
      marksAwarded: g.marksAwarded,
      maxMarks: g.maxMarks,
      feedback: g.feedback,
    }));

    return NextResponse.json({ grades });
  } catch (err) {
    const message = err instanceof GeminiError ? err.message : "Failed to grade answers";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
