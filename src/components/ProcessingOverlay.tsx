'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { AlertCircle } from 'lucide-react';

export const ProcessingOverlay: React.FC = () => {
  const { progress, resetAssessment } = useAssessment();

  if (progress.step === 'idle' || progress.step === 'completed') {
    return null;
  }

  const isError = progress.step === 'error';

  return (
    <div className="figma-extracting-backdrop">
      <div className="extracting-content-box">
        {isError ? (
          <div className="extracting-error-wrapper">
            <AlertCircle size={56} className="error-icon" />
            <h2 className="extracting-title" style={{ color: '#EF4444' }}>Extraction Failed</h2>
            <p className="extracting-subtitle" style={{ color: '#6B7280' }}>
              {progress.errorDetails || progress.message || 'An error occurred while processing files.'}
            </p>
            <button className="start-mapping-btn active" style={{ marginTop: '1.5rem', width: 'auto' }} onClick={resetAssessment}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="extracting-active-wrapper">
            {/* Animated Coral Sparkles Icon matching Figma Page 5 & 6 */}
            <div className="figma-sparkles-container">
              <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Main Large Sparkle Star */}
                <path
                  className="sparkle-star-main"
                  d="M48 6C48 24 58 34 76 34C58 34 48 44 48 62C48 44 38 34 20 34C38 34 48 24 48 6Z"
                  fill="url(#sparkle_gradient_1)"
                />
                {/* Secondary Medium Sparkle Star */}
                <path
                  className="sparkle-star-secondary"
                  d="M24 38C24 48 30 54 40 54C30 54 24 60 24 70C24 60 18 54 8 54C18 54 24 48 24 38Z"
                  fill="url(#sparkle_gradient_2)"
                />
                {/* Small Accent Star */}
                <circle cx="64" cy="58" r="3.5" fill="#FFA07A" className="sparkle-dot-1" />
                <circle cx="16" cy="22" r="2.5" fill="#FF7F50" className="sparkle-dot-2" />

                <defs>
                  <linearGradient id="sparkle_gradient_1" x1="20" y1="6" x2="76" y2="62" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF7A59" />
                    <stop offset="1" stopColor="#FF4D2D" />
                  </linearGradient>
                  <linearGradient id="sparkle_gradient_2" x1="8" y1="38" x2="40" y2="70" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFA07A" />
                    <stop offset="1" stopColor="#FF6347" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h2 className="extracting-title">Extracting...</h2>
            <p className="extracting-subtitle">This may take a while</p>

            {/* Subtle Progress Track */}
            <div className="extracting-progress-track">
              <div
                className="extracting-progress-indicator"
                style={{ width: `${Math.max(15, progress.percentage)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
