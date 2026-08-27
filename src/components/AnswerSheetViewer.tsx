"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import type { ExtractedAnswerBlock, PageImage } from "@/lib/types";

interface AnswerSheetViewerProps {
  pages: PageImage[];
  answers: ExtractedAnswerBlock[];
  highlightedAnswerIds: string[];
  highlightedLabel: string | null;
  jumpToPage: number | null;
  onAnswerClick?: (answer: ExtractedAnswerBlock) => void;
}

/** Adds a small fixed visual margin around a bbox so the highlight doesn't hug the ink exactly. */
function padBBox([x0, y0, x1, y1]: ExtractedAnswerBlock["bbox"], margin = 0.006): ExtractedAnswerBlock["bbox"] {
  return [Math.max(0, x0 - margin), Math.max(0, y0 - margin), Math.min(1, x1 + margin), Math.min(1, y1 + margin)];
}

export function AnswerSheetViewer({
  pages,
  answers,
  highlightedAnswerIds,
  highlightedLabel,
  jumpToPage,
  onAnswerClick,
}: AnswerSheetViewerProps) {
  const [activePage, setActivePage] = useState(0);
  const [zoom, setZoom] = useState(100);

  // Move to the page containing the newly-selected question, without re-deriving
  // state in an effect (react.dev/learn/you-might-not-need-an-effect).
  const [lastJump, setLastJump] = useState<number | null>(null);
  if (jumpToPage !== null && jumpToPage !== lastJump) {
    setLastJump(jumpToPage);
    setActivePage(jumpToPage);
  }

  const page = pages[activePage];
  const blocksOnPage = useMemo(() => answers.filter((a) => a.page === activePage), [answers, activePage]);
  const paddedBlocks = useMemo(
    () => blocksOnPage.map((block) => ({ block, bbox: padBBox(block.bbox) })),
    [blocksOnPage]
  );

  if (!page) {
    return (
      <div className="flex h-full items-center justify-center text-ink-faint text-sm">
        No answer sheet pages to display.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between bg-ink px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10"
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>
          <span className="text-white text-xs font-medium w-11 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10"
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>
        </div>
        {pages.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage((p) => Math.max(0, p - 1))}
              disabled={activePage === 0}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-white text-xs font-medium">
              Page {activePage + 1} of {pages.length}
            </span>
            <button
              onClick={() => setActivePage((p) => Math.min(pages.length - 1, p + 1))}
              disabled={activePage === pages.length - 1}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6 bg-bg">
        <div
          className="relative mx-auto bg-surface shadow-sm border border-line rounded-md p-2 transition-[width] duration-150"
          style={{ width: `${zoom}%`, maxWidth: `${Math.max(zoom, 100)}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.dataUrl}
            alt={`Answer sheet page ${activePage + 1}`}
            className="block w-full h-auto rounded-sm"
          />
          {paddedBlocks.map(({ block, bbox: [px0, py0, px1, py1] }) => {
            const isHighlighted = highlightedAnswerIds.includes(block.id);
            const isMatched = block.matchedNumber !== null;
            const defaultBorder = isMatched ? "1.5px dashed rgba(37,99,168,0.4)" : "1.5px dashed rgba(201,121,26,0.5)";
            return (
              <div
                key={block.id}
                title={block.text}
                onClick={() => block.matchedNumber !== null && onAnswerClick?.(block)}
                className={`absolute rounded-lg transition-all duration-300 ${block.matchedNumber !== null ? "cursor-pointer" : ""}`}
                style={{
                  left: `${px0 * 100}%`,
                  top: `${py0 * 100}%`,
                  width: `${(px1 - px0) * 100}%`,
                  height: `${(py1 - py0) * 100}%`,
                  border: isHighlighted ? "2.5px solid var(--green)" : defaultBorder,
                  background: isHighlighted ? "rgba(47,158,79,0.18)" : "transparent",
                  boxShadow: isHighlighted ? "0 2px 12px rgba(47,158,79,0.3)" : "none",
                }}
              >
                {isHighlighted && highlightedLabel && (
                  <span className="absolute -top-3 -left-1 bg-green text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    {highlightedLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-2 border-t border-line bg-surface shrink-0 text-[11px] text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm border border-dashed" style={{ borderColor: "rgba(37,99,168,0.6)" }} />
          Matched answer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm border border-dashed" style={{ borderColor: "rgba(201,121,26,0.6)" }} />
          Unmatched / rough work
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-green" />
          Selected
        </span>
      </div>
    </div>
  );
}
