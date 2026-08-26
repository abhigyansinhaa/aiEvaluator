import { NextRequest, NextResponse } from "next/server";
import { callGeminiJSON, GeminiError } from "@/lib/gemini";
import type { ExtractedAnswerBlock } from "@/lib/types";

export const maxDuration = 60;

const SYSTEM_INSTRUCTION = `You are an exam answer-sheet parser handling a STUDENT'S HANDWRITTEN answer sheet.
You are given page images in reading order, page 0 first, plus the list of question numbers from the
matching question paper for context.

Rules:
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
  work, or an answer to a question number that isn't in the provided list.
- "bbox" is a GENEROUS bounding box of the block, as fractions of the page width/height:
  [x0, y0, x1, y1], (0,0) top-left, (1,1) bottom-right.
  IMPORTANT: The bbox MUST encompass ALL of the student's writing for that answer — including:
  * The question label written by the student (e.g. "Ans 1.", "Q1.")
  * ALL continuation lines of the answer text
  * Any diagrams, chemical equations, formula boxes, or tables drawn as part of the answer
  * Any rough work or crossed-out text adjacent to the answer
  Err on the side of making the bbox slightly LARGER than needed rather than too tight.
  Add a small margin (~2-3% of page dimensions) around the text edges.
- "page" is the 0-indexed image index (matching the order pages were given).`;

export async function POST(req: NextRequest) {
  try {
    const { images, questionNumbers } = await req.json();
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const prompt = `Here are ${images.length} page image(s) of a student's handwritten answer sheet, in order (page 0 first).
Known question numbers from the question paper: ${JSON.stringify(questionNumbers ?? [])}

Return ONLY a JSON array of answer blocks, each shaped as:
{"matchedNumber": string | null, "text": string, "page": number, "bbox": [x0,y0,x1,y1]}`;

    const result = await callGeminiJSON<
      Array<{
        matchedNumber: string | null;
        text: string;
        page: number;
        bbox: [number, number, number, number];
      }>
    >({
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt,
      images: images.map((b64: string) => ({ base64: b64, mimeType: "image/jpeg" })),
    });

    const answers: ExtractedAnswerBlock[] = result.map((a, i) => ({
      id: `a-${i}`,
      matchedNumber: a.matchedNumber,
      text: a.text,
      page: a.page,
      bbox: a.bbox,
    }));

    return NextResponse.json({ answers });
  } catch (err) {
    const message = err instanceof GeminiError ? err.message : "Failed to extract answers";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
