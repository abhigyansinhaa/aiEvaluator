'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';

export const AnswerViewer: React.FC = () => {
  const { data, activeQuestionId, activeMapping } = useAssessment();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);

  const images = data?.answerPageImages || [];

  // Automatically switch page when active mapping is on a different page
  useEffect(() => {
    if (activeMapping?.regions?.[0]) {
      const targetPage = activeMapping.regions[0].pageIndex;
      if (targetPage !== undefined && targetPage < images.length) {
        setCurrentPage(targetPage);
      }
    }
  }, [activeQuestionId, activeMapping, images.length]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(175, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(75, prev - 25));
  };

  if (!data || images.length === 0) {
    return (
      <div className="figma-viewer-panel empty">
        <p className="no-sheet-text">No answer sheet loaded.</p>
      </div>
    );
  }

  const region = activeMapping?.regions?.[0];
  const isAnswered = activeMapping?.status === 'answered';
  const hasRegionOnCurrentPage = isAnswered && region && region.pageIndex === currentPage;

  // Format question badge tag e.g. "Q2", "Q1", "Q11 a"
  const questionBadgeTag = activeMapping?.questionNumber ? `Q${activeMapping.questionNumber.replace(/\s+/g, '')}` : 'Q';

  return (
    <div className="figma-viewer-panel">
      {/* Dark Toolbar Header matching Figma Page 7 & 9 */}
      <div className="figma-viewer-toolbar">
        {/* Left Title */}
        <div className="toolbar-sheet-title">Answer Sheet</div>

        {/* Center: Zoom Controls */}
        <div className="toolbar-zoom-controls">
          <button
            type="button"
            className="zoom-btn"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 75}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus size={14} />
          </button>

          <span className="zoom-percentage-text">{zoomLevel}%</span>

          <button
            type="button"
            className="zoom-btn"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 175}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Right: Page Navigation */}
        <div className="toolbar-page-navigation">
          <button
            type="button"
            className="page-nav-arrow-btn"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            title="Previous Page"
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="page-counter-text">
            Page {currentPage + 1} of {images.length}
          </span>

          <button
            type="button"
            className="page-nav-arrow-btn"
            onClick={() => setCurrentPage(p => Math.min(images.length - 1, p + 1))}
            disabled={currentPage === images.length - 1}
            title="Next Page"
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Sheet Canvas Container */}
      <div className="figma-sheet-canvas-area" ref={containerRef}>
        <div
          className="figma-paper-wrapper"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Answer Sheet Image */}
          <img
            src={images[currentPage]}
            alt={`Answer Sheet Page ${currentPage + 1}`}
            className="figma-sheet-img"
          />

          {/* Figma Green Bounding Box & "Q2" Green Pill Tag */}
          {hasRegionOnCurrentPage && (
            <div
              className="figma-green-highlight-box"
              style={{
                top: `${region.box.ymin / 10}%`,
                left: `${region.box.xmin / 10}%`,
                height: `${(region.box.ymax - region.box.ymin) / 10}%`,
                width: `${(region.box.xmax - region.box.xmin) / 10}%`,
              }}
            >
              {/* Green Tab Badge on top left matching Figma Page 7 & 9 */}
              <div className="figma-green-tag-badge">
                {questionBadgeTag}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
