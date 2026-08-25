'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { Sparkles, AlertCircle } from 'lucide-react';

export const ProcessingOverlay: React.FC = () => {
  const { progress, resetAssessment } = useAssessment();

  if (progress.step === 'idle' || progress.step === 'completed') {
    return null;
  }

  const isError = progress.step === 'error';

  return (
    <div className="processing-overlay">
      <div className="processing-card">
        {isError ? (
          <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
            <AlertCircle size={56} style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Processing Error</h3>
          </div>
        ) : (
          <div>
            <div className="spinner-circle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
              <Sparkles size={18} />
              <span>VedaAI Intelligence Engine</span>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          {isError ? 'Evaluation Failed' : progress.message}
        </h3>

        {!isError && (
          <>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Extracting questions, preserving sub-part numbering, and locating answer bounding boxes...
            </p>
          </>
        )}

        {isError && (
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--danger)', marginBottom: '1.5rem' }}>
              {progress.errorDetails || progress.message}
            </p>
            <button className="btn-primary" onClick={resetAssessment}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
