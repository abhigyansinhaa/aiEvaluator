'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { FileUploadZone } from '@/components/FileUploadZone';
import { ProcessingOverlay } from '@/components/ProcessingOverlay';
import { QuestionList } from '@/components/QuestionList';
import { AnswerViewer } from '@/components/AnswerViewer';
import { useAssessment } from '@/context/AssessmentContext';

export default function Home() {
  const { data } = useAssessment();
  const [mobileTab, setMobileTab] = useState<'questions' | 'answers'>('questions');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="figma-app-layout">
      {/* Left Navigation Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed || Boolean(data)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="figma-main-column">
        <Header />
        <ProcessingOverlay />

        {!data ? (
          <main className="figma-page-body upload-mode">
            <FileUploadZone />
          </main>
        ) : (
          <main className="figma-page-body results-mode">
            {/* Mobile Segmented Toggle Tabs matching Figma Pages 8 & 9 */}
            <div className="mobile-segmented-bar">
              <button
                type="button"
                className={`segmented-tab-btn ${mobileTab === 'questions' ? 'active' : ''}`}
                onClick={() => setMobileTab('questions')}
              >
                Questions
              </button>
              <button
                type="button"
                className={`segmented-tab-btn ${mobileTab === 'answers' ? 'active' : ''}`}
                onClick={() => setMobileTab('answers')}
              >
                Answer Sheet
              </button>
            </div>

            {/* Split Screen Container (Desktop 2-columns / Mobile tabbed) */}
            <div className={`figma-results-split ${mobileTab}`}>
              <div className="results-left-col">
                <QuestionList />
              </div>
              <div className="results-right-col">
                <AnswerViewer />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
