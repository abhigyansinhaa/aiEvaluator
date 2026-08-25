'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { ChevronLeft, ChevronRight, Eye, MapPin, AlertCircle, FileCheck } from 'lucide-react';

export const AnswerViewer: React.FC = () => {
  const { data, activeQuestionId, activeMapping } = useAssessment();
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const images = data?.answerPageImages || [];

  // When active mapping changes, automatically switch to the page containing the answer region!
  useEffect(() => {
    if (activeMapping?.regions?.[0]) {
      const targetPage = activeMapping.regions[0].pageIndex;
      if (targetPage !== undefined && targetPage < images.length) {
        setCurrentPage(targetPage);
      }
    }
  }, [activeQuestionId, activeMapping, images.length]);

  if (!data || images.length === 0) {
    return (
      <div className="viewer-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No answer sheet loaded.</p>
      </div>
    );
  }

  const region = activeMapping?.regions?.[0];
  const isAnswered = activeMapping?.status === 'answered';

  return (
    <div className="viewer-panel">
      {/* Viewer Toolbar */}
      <div className="viewer-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCheck size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
            Student Handwritten Answer Sheet
          </span>
        </div>

        <div className="page-controls">
          <button
            className="btn-icon"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={18} />
          </button>

          <span>
            Page {currentPage + 1} of {images.length}
          </span>

          <button
            className="btn-icon"
            onClick={() => setCurrentPage(p => Math.min(images.length - 1, p + 1))}
            disabled={currentPage === images.length - 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Answer Region Status Bar */}
      <div
        style={{
          padding: '0.6rem 1.5rem',
          background: isAnswered ? 'var(--primary-light)' : 'var(--danger-bg)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
        }}
      >
        {isAnswered && region ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
            <MapPin size={16} />
            <span>
              Mapped Answer Region for <strong>Q{activeMapping?.questionNumber}</strong> (Highlighted below)
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 600 }}>
            <AlertCircle size={16} />
            <span>
              Q{activeMapping?.questionNumber || ''} is <strong>Unanswered</strong> — No region highlighted on answer sheet.
            </span>
          </div>
        )}

        {isAnswered && activeMapping?.answerText && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            "{activeMapping.answerText}"
          </span>
        )}
      </div>

      {/* Image & Bounding Box Viewer Container */}
      <div className="viewer-canvas-container" ref={containerRef}>
        <div className="sheet-page-wrapper">
          <img
            src={images[currentPage]}
            alt={`Answer Sheet Page ${currentPage + 1}`}
            className="sheet-image"
          />

          {/* Bounding Box Highlight Overlay */}
          {isAnswered && region && region.pageIndex === currentPage && (
            <div
              className={`highlight-box ${activeMapping?.isCorrect ? 'correct' : ''}`}
              style={{
                top: `${region.box.ymin / 10}%`,
                left: `${region.box.xmin / 10}%`,
                height: `${(region.box.ymax - region.box.ymin) / 10}%`,
                width: `${(region.box.xmax - region.box.xmin) / 10}%`,
              }}
            >
              <div className="highlight-label">
                <Eye size={12} />
                <span>Answer Q{activeMapping?.questionNumber}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
