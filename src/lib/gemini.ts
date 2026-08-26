// Thin wrapper around the Gemini API (generous free tier, strong vision + handwriting OCR).
// Docs: https://ai.google.dev/gemini-api/docs

const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export interface ImagePart {
  base64: string;
  mimeType?: string;
}

interface GeminiCallOptions {
  systemInstruction: string;
  prompt: string;
  images: ImagePart[];
  temperature?: number;
}

export class GeminiError extends Error {}

/**
 * Gemini's vision grounding is trained specifically on bounding boxes as
 * box_2d: [ymin, xmin, ymax, xmax], normalized to 0-1000, y-axis first. Asking
 * it for a different axis order or scale (e.g. [x0,y0,x1,y1] on 0-1) produces
 * inconsistent, undersized boxes, because that isn't the format it was tuned
 * on. Always prompt for box_2d in its native format, then convert here.
 * See: https://ai.google.dev/gemini-api/docs/image-understanding
 */
export function box2dToBBox(box2d: [number, number, number, number]): [number, number, number, number] {
  const [ymin, xmin, ymax, xmax] = box2d;
  return [xmin / 1000, ymin / 1000, xmax / 1000, ymax / 1000];
}

/** Calls Gemini with a text prompt + images, forcing a JSON response, and returns the parsed JSON. */
export async function callGeminiJSON<T>(opts: GeminiCallOptions): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError(
      "GEMINI_API_KEY is not set. Add it to your environment (see .env.example)."
    );
  }

  const parts: Record<string, unknown>[] = [{ text: opts.prompt }];
  for (const img of opts.images) {
    parts.push({
      inline_data: {
        mime_type: img.mimeType || "image/png",
        data: img.base64,
      },
    });
  }

  const body = {
    system_instruction: { parts: [{ text: opts.systemInstruction }] },
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: opts.temperature ?? 0.1,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(
    `${API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new GeminiError(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    const finishReason = data?.candidates?.[0]?.finishReason;
    throw new GeminiError(
      `Gemini returned no content${finishReason ? ` (finishReason: ${finishReason})` : ""}.`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new GeminiError(`Gemini response was not valid JSON: ${text.slice(0, 300)}`);
  }
}
