import { NextRequest, NextResponse } from "next/server";
import { box2dToBBox, callGeminiJSON, GeminiError } from "@/lib/gemini";
import type { ExtractedAnswerBlock } from "@/lib/types";

export const maxDuration = 60;

const SYSTEM_INSTRUCTION = `You are an exam answer-sheet parser handling a STUDENT'S HANDWRITTEN answer sheet.
You are given page images in reading order, page 0 first, plus the list of question numbers from the
matching question paper for context.

Rules:
- If the student's name (and/or roll number) is written on the sheet, usually near the top of the
  first page (e.g. "Name: ___", "Student Name: ___", "Roll No: ___"), extract it as "studentName".
  Combine name and roll number into one readable string if both are present (e.g. "Priya Sharma (Roll 14)").
  If no name is visible anywhere, set "studentName" to null — do not guess or invent one.
- Segment the handwriting into answer blocks: one block per contiguous chunk of writing that answers
  a single question.
- For each block, transcribe the text as best you can (handwriting OCR; approximate where illegible,
  wrapping uncertain words in [brackets]).
- "matchedNumber" MUST be the exact question number from the known question list that this answer
  corresponds to. The student may write it as "Ans 1", "Q1.", "1.", "1)", etc. Normalize to the
  original question number format from the provided list (e.g. if the list has "1", return "1").
  If you cannot confidently tell, set it to null — do not guess randomly.
- If a single answer continues across multiple pages, output separate blocks (one per page) that all
  share the same matchedNumber.
- Students may answer out of the printed order — that is expected and fine.
- Include blocks that don't match any known question number too (matchedNumber: null); e.g. rough
  work, or an answer to a question number that isn't in the provided list. Do NOT include the
  name/roll-number header itself as an answer block.
- "box_2d" is the bounding box of the block, as [ymin, xmin, ymax, xmax] normalized to 0-1000 — this
  is the standard Gemini bounding-box format.
  It MUST encompass ALL of the student's writing for that answer, top to bottom and left to right:
  * The question label written by the student (e.g. "Ans 1.", "Q1.")
  * ALL continuation lines of the answer text, including wrapped lines that run near the page edge
  * Any diagrams, chemical equations, formula boxes, or tables drawn as part of the answer
  Do not return a box that only covers the first line of a multi-line answer.
- "page" is the 0-indexed image index (matching the order pages were given).`;

interface AnswerApiResult {
  studentName: string | null;
  answers: Array<{
    matchedNumber: string | null;
    text: string;
    page: number;
    box_2d: [number, number, number, number];
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const { images, questionNumbers } = await req.json();
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const prompt = `Here are ${images.length} page image(s) of a student's handwritten answer sheet, in order (page 0 first).
Known question numbers from the question paper: ${JSON.stringify(questionNumbers ?? [])}

Return ONLY a JSON object shaped as:
{"studentName": string | null, "answers": [{"matchedNumber": string | null, "text": string, "page": number, "box_2d": [ymin,xmin,ymax,xmax]}]}`;

    const result = await callGeminiJSON<AnswerApiResult>({
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt,
      images: images.map((b64: string) => ({ base64: b64, mimeType: "image/jpeg" })),
    });

    const answers: ExtractedAnswerBlock[] = result.answers.map((a, i) => ({
      id: `a-${i}`,
      matchedNumber: a.matchedNumber,
      text: a.text,
      page: a.page,
      bbox: box2dToBBox(a.box_2d),
    }));

    return NextResponse.json({ answers, studentName: result.studentName ?? null });
  } catch (err) {
    const message = err instanceof GeminiError ? err.message : "Failed to extract answers";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
