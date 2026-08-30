import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { formatQuestionBadge } from "@/lib/mapping";
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
  const [zoom, setZoom] = useState(100);
  const [activePage, setActivePage] = useState(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to a specific page
  const scrollToPage = useCallback((pageIdx: number) => {
    const el = pageRefs.current[pageIdx];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActivePage(pageIdx);
    }
  }, []);

  // Jump to page when a question is selected
  const lastJumpRef = useRef<number | null>(null);
  useEffect(() => {
    if (jumpToPage !== null && jumpToPage !== lastJumpRef.current) {
      lastJumpRef.current = jumpToPage;
      // Small delay so the DOM is settled
      requestAnimationFrame(() => scrollToPage(jumpToPage));
    }
  }, [jumpToPage, scrollToPage]);

  // Track which page is most visible during scroll to update the page indicator
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || pages.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const idx = pageRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx >= 0) setActivePage(idx);
          }
        }
      },
      { root: container, threshold: 0.4 }
    );

    pageRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [pages.length]);

  // Per-page answer blocks
  const blocksByPage = useMemo(() => {
    const map = new Map<number, { block: ExtractedAnswerBlock; bbox: ExtractedAnswerBlock["bbox"] }[]>();
    for (const a of answers) {
      if (!map.has(a.page)) map.set(a.page, []);
      map.get(a.page)!.push({ block: a, bbox: padBBox(a.bbox) });
    }
    return map;
  }, [answers]);

  if (pages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-ink-faint text-sm">
        No answer sheet pages to display.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Dark top header bar matching Figma screenshot */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#18191d] text-white shrink-0 border-b border-white/10">
        <span className="text-sm font-semibold text-white tracking-tight">Answer Sheet</span>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-[#2a2b30] rounded-full px-1 py-0.5 border border-white/10">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Zoom out"
            >
              <Minus size={13} />
            </button>
            <span className="text-white text-xs font-medium w-10 text-center select-none">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Zoom in"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Page navigation */}
          {pages.length > 1 && (
            <div className="flex items-center gap-0.5 bg-[#2a2b30] rounded-full px-1 py-0.5 border border-white/10">
              <button
                onClick={() => scrollToPage(Math.max(0, activePage - 1))}
                disabled={activePage === 0}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-white text-xs font-medium px-1.5 select-none whitespace-nowrap">
                Page {activePage + 1} of {pages.length}
              </span>
              <button
                onClick={() => scrollToPage(Math.min(pages.length - 1, activePage + 1))}
                disabled={activePage === pages.length - 1}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Continuous scrollable page canvas */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 bg-[#eef0f3]">
        <div
          className="mx-auto space-y-4 transition-[width] duration-150"
          style={{ width: `${zoom}%`, maxWidth: `${Math.max(zoom, 100)}%` }}
        >
          {pages.map((pg, pageIdx) => {
            const pageBlocks = blocksByPage.get(pageIdx) ?? [];
            return (
              <div
                key={pageIdx}
                ref={(el) => { pageRefs.current[pageIdx] = el; }}
              >
                {/* Page image with bounding boxes */}
                <div className="relative bg-white shadow-md border border-line/60 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pg.dataUrl}
                    alt={`Answer sheet page ${pageIdx + 1}`}
                    className="block w-full h-auto"
                  />
                  {pageBlocks.map(({ block, bbox: [px0, py0, px1, py1] }) => {
                    const isHighlighted = highlightedAnswerIds.includes(block.id);
                    const isMatched = block.matchedNumber !== null;
                    const defaultBorder = isMatched ? "1.5px dashed rgba(37,99,168,0.35)" : "1.5px dashed rgba(201,121,26,0.45)";
                    return (
                      <div
                        key={block.id}
                        title={block.text}
                        onClick={() => block.matchedNumber !== null && onAnswerClick?.(block)}
                        className={`absolute rounded-md transition-all duration-200 ${block.matchedNumber !== null ? "cursor-pointer" : ""}`}
                        style={{
                          left: `${px0 * 100}%`,
                          top: `${py0 * 100}%`,
                          width: `${(px1 - px0) * 100}%`,
                          height: `${(py1 - py0) * 100}%`,
                          border: isHighlighted ? "2px solid #238b45" : defaultBorder,
                          background: isHighlighted ? "rgba(35,139,69,0.12)" : "transparent",
                        }}
                      >
                        {isHighlighted && (
                          <span className="absolute -top-3.5 left-0 bg-[#238b45] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10">
                            {highlightedLabel || (block.matchedNumber ? formatQuestionBadge(block.matchedNumber) : "Answer")}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 border-t border-line bg-surface shrink-0 text-[11px] text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm border border-dashed" style={{ borderColor: "rgba(37,99,168,0.6)" }} />
          Matched answer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm border border-dashed" style={{ borderColor: "rgba(201,121,26,0.6)" }} />
          Unmatched / rough work
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#238b45]" />
          Selected
        </span>
      </div>
    </div>
  );
}

