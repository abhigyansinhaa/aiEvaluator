import { NextRequest, NextResponse } from "next/server";
import { box2dToBBox, callGeminiJSON, GeminiError } from "@/lib/gemini";
import type { ExtractedQuestion } from "@/lib/types";

export const maxDuration = 60;

const SYSTEM_INSTRUCTION = `You are an exam question-paper parser. You are given page images of a printed
(or typed) question paper, in reading order, page 0 first. Extract every question exactly as printed.

Rules:
- Preserve the original printed numbering verbatim (e.g. "1", "2.", "Q3", "11").
- If a question has labelled sub-parts, treat EACH sub-part as its own separate question entry,
  with number formatted as "<parent> (<sub>)", e.g. "11 (a)" and "11 (b)".
- Keep questions in the correct printed order.
- "text" should be the full question text (transcribed), excluding the number itself.
- "box_2d" is the tight bounding box of that question's text block (sub-parts get their own boxes),
  as [ymin, xmin, ymax, xmax] normalized to 0-1000 — this is the standard Gemini bounding-box format.
  It MUST cover every line of the question's text, not just the first line.
- "page" is the 0-indexed image index this question appears on (matching the order pages were given).
- If a question spans two pages, use the page and box_2d of where its number/main body starts.
- Do not invent questions that are not present. Do not skip any.`;

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json();
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const prompt = `Here are ${images.length} page image(s) of a question paper, in order (page 0 first).
Return ONLY a JSON array of questions, each shaped as:
{"number": string, "text": string, "page": number, "box_2d": [ymin,xmin,ymax,xmax]}`;

    const result = await callGeminiJSON<
      Array<{ number: string; text: string; page: number; box_2d: [number, number, number, number] }>
    >({
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt,
      images: images.map((b64: string) => ({ base64: b64, mimeType: "image/jpeg" })),
    });

    const questions: ExtractedQuestion[] = result.map((q, i) => ({
      id: `q-${i}-${q.number.replace(/[^a-zA-Z0-9]/g, "")}`,
      number: q.number,
      text: q.text,
      page: q.page,
      bbox: box2dToBBox(q.box_2d),
    }));

    return NextResponse.json({ questions });
  } catch (err) {
    const message = err instanceof GeminiError ? err.message : "Failed to extract questions";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
