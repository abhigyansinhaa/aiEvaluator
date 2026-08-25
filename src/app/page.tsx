'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { FileUploadZone } from '@/components/FileUploadZone';
import { ProcessingOverlay } from '@/components/ProcessingOverlay';
import { QuestionList } from '@/components/QuestionList';
import { AnswerViewer } from '@/components/AnswerViewer';
import { useAssessment } from '@/context/AssessmentContext';

export default function Home() {
  const { data } = useAssessment();

  return (
    <main className="main-content">
      <Header />
      <ProcessingOverlay />

      {!data ? (
        <FileUploadZone />
      ) : (
        <div className="results-container">
          <QuestionList />
          <AnswerViewer />
        </div>
      )}
    </main>
  );
}
