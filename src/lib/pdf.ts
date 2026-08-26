import type { PageImage } from "./types";

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  return pdfjs;
}

function canvasToPageImage(
  canvas: HTMLCanvasElement,
  page: number
): PageImage {
  // JPEG keeps payloads well under serverless request-body limits even for
  // multi-page scans, while retaining enough contrast for handwriting OCR.
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return {
    page,
    dataUrl,
    base64: dataUrl.split(",")[1] ?? "",
    width: canvas.width,
    height: canvas.height,
  };
}

async function fileToImagePage(file: File): Promise<PageImage> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not decode image"));
    el.src = dataUrl;
  });

  // Re-encode through a canvas so we always ship consistent PNG data + known dimensions.
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0);

  return canvasToPageImage(canvas, 0);
}

async function pdfToImagePages(file: File): Promise<PageImage[]> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const pages: PageImage[] = [];
  const SCALE = 2; // higher scale = sharper handwriting for OCR

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    pages.push(canvasToPageImage(canvas, i - 1));
  }

  return pages;
}

/** Converts a user-uploaded PDF or image file into one PageImage per page. */
export async function fileToPageImages(file: File): Promise<PageImage[]> {
  if (file.type === "application/pdf") {
    return pdfToImagePages(file);
  }
  if (file.type.startsWith("image/")) {
    return [await fileToImagePage(file)];
  }
  throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
}

/** Converts a list of user-uploaded files (mixed PDFs/images) into a flat, ordered page list. */
export async function filesToPageImages(files: File[]): Promise<PageImage[]> {
  const pages: PageImage[] = [];
  for (const file of files) {
    const filePages = await fileToPageImages(file);
    for (const p of filePages) {
      pages.push({ ...p, page: pages.length });
    }
  }
  return pages;
}