'use client';

import React, { createContext, useContext, useState } from 'react';
import { AssessmentData, ProcessingProgress, QuestionAnswerMapping, AnswerRegion } from '@/types';

interface AssessmentContextType {
  data: AssessmentData | null;
  activeQuestionId: string | null;
  activeRegion: AnswerRegion | null;
  activeMapping: QuestionAnswerMapping | null;
  progress: ProcessingProgress;
  processAssessment: (questionFiles: File[], answerFiles: File[]) => Promise<void>;
  selectQuestion: (questionId: string) => void;
  resetAssessment: () => void;
  setDemoData: (data: AssessmentData) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AssessmentData | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProcessingProgress>({
    step: 'idle',
    percentage: 0,
    message: '',
  });

  const selectQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
  };

  const resetAssessment = () => {
    setData(null);
    setActiveQuestionId(null);
    setProgress({ step: 'idle', percentage: 0, message: '' });
  };

  const setDemoData = (demoData: AssessmentData) => {
    setData(demoData);
    if (demoData.questions.length > 0) {
      setActiveQuestionId(demoData.questions[0].id);
    }
    setProgress({
      step: 'completed',
      percentage: 100,
      message: 'Processing complete!',
    });
  };

  const processAssessment = async (questionFiles: File[], answerFiles: File[]) => {
    try {
      setProgress({
        step: 'uploading',
        percentage: 10,
        message: 'Uploading question paper and answer sheet...',
      });

      const formData = new FormData();
      questionFiles.forEach(file => formData.append('questionFiles', file));
      answerFiles.forEach(file => formData.append('answerFiles', file));

      setProgress({
        step: 'extracting_questions',
        percentage: 30,
        message: 'Extracting questions from paper using Gemini AI...',
      });

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(errorRes.error || 'Failed to process assessment');
      }

      setProgress({
        step: 'mapping_and_grading',
        percentage: 75,
        message: 'Mapping student answers and grading results...',
      });

      const result: AssessmentData = await response.json();

      setData(result);
      if (result.questions.length > 0) {
        setActiveQuestionId(result.questions[0].id);
      }

      setProgress({
        step: 'completed',
        percentage: 100,
        message: 'Extraction & Mapping completed successfully!',
      });
    } catch (err: any) {
      console.error('Error processing assessment:', err);
      setProgress({
        step: 'error',
        percentage: 0,
        message: err.message || 'An unexpected error occurred during processing.',
        errorDetails: err.stack || String(err),
      });
    }
  };

  const activeMapping = data?.mappings.find(m => m.questionId === activeQuestionId) || null;
  const activeRegion = activeMapping?.regions?.[0] || null;

  return (
    <AssessmentContext.Provider
      value={{
        data,
        activeQuestionId,
        activeRegion,
        activeMapping,
        progress,
        processAssessment,
        selectQuestion,
        resetAssessment,
        setDemoData,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
