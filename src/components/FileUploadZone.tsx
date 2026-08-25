'use client';

import React, { useState, useRef } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { demoAssessmentData } from '@/lib/demo-data';
import { Upload, FileText, CheckCircle2, X, ArrowRight, PlayCircle, Layers } from 'lucide-react';

export const FileUploadZone: React.FC = () => {
  const { processAssessment, setDemoData } = useAssessment();

  const [questionFiles, setQuestionFiles] = useState<File[]>([]);
  const [answerFiles, setAnswerFiles] = useState<File[]>([]);

  const [isDragQuestion, setIsDragQuestion] = useState(false);
  const [isDragAnswer, setIsDragAnswer] = useState(false);

  const questionInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setQuestionFiles(Array.from(e.target.files));
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAnswerFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questionFiles.length > 0 && answerFiles.length > 0) {
      await processAssessment(questionFiles, answerFiles);
    }
  };

  const handleUseDemo = () => {
    setDemoData(demoAssessmentData);
  };

  return (
    <div className="upload-hero">
      <div className="avatar-illustration">
        <div className="avatar-circle">👩‍🏫</div>
      </div>

      <h1 className="upload-title">Upload Question Paper &amp; Answer Sheet</h1>
      <p className="upload-subtitle">
        Automatically extract questions, map student answers, highlight answer regions, and generate grading insights.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="upload-cards-grid">
          {/* Question Paper Card */}
          <div
            className={`upload-card ${questionFiles.length > 0 ? 'has-file' : ''} ${isDragQuestion ? 'drag-over' : ''}`}
            onClick={() => questionInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragQuestion(true); }}
            onDragLeave={() => setIsDragQuestion(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragQuestion(false);
              if (e.dataTransfer.files.length > 0) {
                setQuestionFiles(Array.from(e.dataTransfer.files));
              }
            }}
          >
            <input
              ref={questionInputRef}
              type="file"
              accept=".pdf,image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleQuestionChange}
            />

            <div className="upload-icon-container">
              {questionFiles.length > 0 ? <CheckCircle2 size={28} color="var(--primary)" /> : <Upload size={28} />}
            </div>

            <div className="upload-card-title">
              Upload <span>Question Paper</span>
            </div>
            <p className="upload-card-desc">PDF or Images (Max 10MB)</p>

            {questionFiles.length > 0 && (
              <div className="file-preview" onClick={e => e.stopPropagation()}>
                <FileText size={18} color="var(--primary)" />
                <span className="file-name">{questionFiles.map(f => f.name).join(', ')}</span>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => setQuestionFiles([])}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Answer Sheet Card */}
          <div
            className={`upload-card ${answerFiles.length > 0 ? 'has-file' : ''} ${isDragAnswer ? 'drag-over' : ''}`}
            onClick={() => answerInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragAnswer(true); }}
            onDragLeave={() => setIsDragAnswer(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragAnswer(false);
              if (e.dataTransfer.files.length > 0) {
                setAnswerFiles(Array.from(e.dataTransfer.files));
              }
            }}
          >
            <input
              ref={answerInputRef}
              type="file"
              accept=".pdf,image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleAnswerChange}
            />

            <div className="upload-icon-container">
              {answerFiles.length > 0 ? <CheckCircle2 size={28} color="var(--primary)" /> : <Upload size={28} />}
            </div>

            <div className="upload-card-title">
              Upload <span>Answer Sheet</span>
            </div>
            <p className="upload-card-desc">Student Handwritten PDF/Images</p>

            {answerFiles.length > 0 && (
              <div className="file-preview" onClick={e => e.stopPropagation()}>
                <FileText size={18} color="var(--primary)" />
                <span className="file-name">{answerFiles.map(f => f.name).join(', ')}</span>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => setAnswerFiles([])}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={questionFiles.length === 0 || answerFiles.length === 0}
        >
          <span>Start Mapping</span>
          <ArrowRight size={20} />
        </button>
      </form>

      <div className="demo-trigger">
        <p>
          Don't have test files handy?{' '}
          <span className="demo-link" onClick={handleUseDemo}>
            <PlayCircle size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Try with Sample Physics Exam Dataset
          </span>
        </p>
      </div>
    </div>
  );
};
