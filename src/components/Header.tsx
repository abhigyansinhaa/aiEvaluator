'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { Sparkles, RefreshCw, FileText } from 'lucide-react';

export const Header: React.FC = () => {
  const { data, resetAssessment } = useAssessment();

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <span className="brand-title">VedaAI</span>
          <span className="brand-tag" style={{ marginLeft: '0.5rem' }}>AI Evaluator</span>
        </div>
      </div>

      {data && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <FileText size={16} />
            <span>Assessment Loaded ({data.questions.length} Questions)</span>
          </div>

          <button
            onClick={resetAssessment}
            className="btn-icon"
            title="Upload New Assessment"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} />
            <span>Upload New</span>
          </button>
        </div>
      )}
    </header>
  );
};
