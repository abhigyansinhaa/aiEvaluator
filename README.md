# AI Evaluator — VedaAI

An AI-powered exam evaluation tool that lets teachers upload a **question paper** and a **student's handwritten answer sheet**, then automatically:

1. **Extracts** every printed question (with bounding boxes)
2. **Reads** handwritten answers via OCR and maps them to the correct question
3. **Interactive Bidirectional Mapping**:
   - Click any question to highlight and jump to its mapped answer on the answer sheet.
   - Click any highlighted answer bounding box on the sheet to instantly select and focus the corresponding question.
4. **Grades** each answer with marks, verdict, and constructive feedback

Built with **Next.js 16**, **Tailwind CSS 4**, and **Google Gemini Flash** for vision + language.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Gemini API key
cp .env.example .env
# Edit .env and paste your key (get one free at https://aistudio.google.com/apikey)

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — upload both files and hit **Start Mapping →**.

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Main UI — upload → workspace → grading
│   ├── layout.tsx                  # Root layout (Inter font, metadata)
│   ├── globals.css                 # Design tokens + Tailwind theme
│   └── api/
│       ├── extract-questions/      # Gemini vision → structured question list
│       ├── extract-answers/        # Gemini vision → handwriting OCR + bboxes
│       └── grade/                  # Gemini text → marks + feedback
├── components/
│   ├── AppShell.tsx                # Sidebar + header navigation shell
│   ├── UploadZone.tsx              # Drag-and-drop file upload cards
│   ├── QuestionList.tsx            # Extracted questions with answer mapping
│   ├── AnswerSheetViewer.tsx       # Page viewer with bbox overlays + zoom
│   └── GradingSummary.tsx          # Score banner with editable student name
└── lib/
    ├── types.ts                    # Shared TypeScript interfaces
    ├── gemini.ts                   # Gemini REST API client (JSON mode)
    ├── pdf.ts                      # Client-side PDF → page images (pdfjs-dist)
    └── mapping.ts                  # Fuzzy question-number → answer matching
```

### Pipeline

| Stage | Where | What happens |
|---|---|---|
| Render | Client (`pdf.ts`) | PDF pages → JPEG images via `pdfjs-dist` + Canvas |
| Extract Questions | Server (`/api/extract-questions`) | Gemini reads printed text, returns structured JSON with `box_2d` |
| Extract Answers | Server (`/api/extract-answers`) | Gemini performs handwriting OCR, returns answer blocks with bboxes |
| Map | Client (`mapping.ts`) | Fuzzy-normalizes question numbers and groups answer blocks |
| Grade | Server (`/api/grade`) | Gemini evaluates each Q/A pair, assigns marks and feedback |

### Bounding Box Format

Gemini's vision grounding returns boxes as `[ymin, xmin, ymax, xmax]` on a 0–1000 scale (y-axis first). The `box2dToBBox()` helper converts these to `[x0, y0, x1, y1]` as 0–1 fractions for CSS positioning.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| AI | Google Gemini Flash (REST API, JSON mode) |
| PDF | pdfjs-dist (client-side rendering) |
| Icons | Lucide React |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `GEMINI_MODEL` | ❌ | Override model (default: `gemini-2.5-flash`) |