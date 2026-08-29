# <img src="public/veda-logo.png" width="32" height="32" alt="VedaAI" /> AI Evaluator — VedaAI

An AI-powered exam evaluation tool built for **VedaAI's Teacher Toolkit**. Upload a **question paper** and a **student's handwritten answer sheet**, and the system automatically:

1. **Extracts** every printed question with spatial bounding boxes
2. **Reads** handwritten answers via OCR and maps them to the correct question
3. **Interactive Bidirectional Mapping** — click any question to jump to its answer on the sheet, or click any answer bounding box to select its question
4. **Grades** each answer with marks, verdict, and constructive AI feedback

---

## ✨ Features

- **Drag-and-drop upload** — supports PDF and image files with page count detection
- **Real-time processing pipeline** — visual stage indicators (rendering → extracting → mapping)
- **Split-pane workspace** — questions panel + zoomable answer sheet with highlighted bboxes
- **AI grading** — per-question marks, percentage score, and written feedback
- **Editable student name** — inline editing in the grading summary bar
- **Fully responsive** — mobile-first design with breakpoints at `sm` (640px), `md` (768px), and `lg` (1024px)
- **VedaAI branding** — official logo, Figtree + Bricolage Grotesque fonts, brand color palette

---

## 🚀 Quick Start

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

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx                    # Main UI — upload → processing → workspace → grading
│   ├── layout.tsx                  # Root layout (Figtree + Bricolage Grotesque fonts, metadata)
│   ├── globals.css                 # Design tokens + Tailwind theme (brand palette)
│   └── api/
│       ├── extract-questions/      # Gemini vision → structured question list
│       ├── extract-answers/        # Gemini vision → handwriting OCR + bboxes
│       └── grade/                  # Gemini text → marks + feedback
├── components/
│   ├── AppShell.tsx                # Sidebar + header shell with responsive nav drawer
│   ├── UploadZone.tsx              # Drag-and-drop upload with floating file cards
│   ├── QuestionList.tsx            # Extracted questions with answer mapping + grading
│   ├── AnswerSheetViewer.tsx       # Zoomable page viewer with bbox overlays
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

## 📱 Responsive Design

The UI is fully responsive with mobile-first styling:

| Breakpoint | Layout |
|---|---|
| **Mobile** (<640px) | Single column, mobile top bar, nav drawer, tab-switched workspace |
| **Tablet** (640–768px) | Collapsed sidebar, header with avatar only (no name), split-pane workspace |
| **Desktop** (768px+) | Expanded sidebar with nav labels, full header with user name, side-by-side panels |

Key responsive adaptations:
- **Sidebar** → collapses to icon-only on tablet, becomes a slide-out drawer on mobile
- **Header** → user name hidden below `md`, icon sizes scale down on smaller viewports
- **Upload screen** → title scales from `text-2xl` → `text-3xl` → `text-[40px]`, sparkles circle shrinks, grid stacks vertically
- **File cards** → padding, font sizes, and PDF badge scale down on mobile
- **Workspace** — questions/sheet panels switch via segmented tab control on mobile

---

## 🎨 Design System

### Typography
| Role | Font | Weights |
|---|---|---|
| Body / UI | [Figtree](https://fonts.google.com/specimen/Figtree) | 400, 500, 600, 700, 800 |
| Display / Headings | [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) | 600, 700, 800 |

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--orange` | `#ff5500` | Primary accent, CTA, highlights |
| `--ink` | `#111215` | Body text, buttons, active elements |
| `--bg` | `#f8f8f7` | Page background |
| `--surface` | `#ffffff` | Cards, panels, headers |
| `--green` | `#238b45` | Success states, answered indicators |
| `--amber` | `#c57616` | Warning states, unanswered indicators |
| `--red` | `#d93829` | Error states, low-score indicators |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Fonts | Figtree + Bricolage Grotesque (Google Fonts) |
| AI | Google Gemini Flash (REST API, JSON mode) |
| PDF | pdfjs-dist (client-side rendering) |
| Icons | Lucide React |

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `GEMINI_MODEL` | ❌ | Override model (default: `gemini-2.5-flash`) |

---

## 📄 License

This project was built as part of the VedaAI hiring assignment.