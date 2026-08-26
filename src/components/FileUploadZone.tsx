'use client';

import React, { useState, useRef } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { demoAssessmentData } from '@/lib/demo-data';
import {
  UploadCloud,
  X,
  ArrowRight,
  Sparkles,
  FileCheck,
  FileCode,
} from 'lucide-react';

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

  const handleUseFigmaDemo = () => {
    setDemoData(demoAssessmentData);
  };

  const isFormValid = questionFiles.length > 0 && answerFiles.length > 0;

  // Format file size nicely
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="upload-screen-container">
      {/* Title & Header */}
      <div className="upload-header-section">
        <h1 className="upload-main-title">
          Upload <span className="title-coral-gradient">Question Paper &amp; Answer Sheets</span>
        </h1>
        <p className="upload-subtitle-text">Upload both files to get started</p>
      </div>

      {/* Center Avatar / Teacher Illustration with concentric glowing rings */}
      <div className="teacher-illustration-wrapper">
        <div className="outer-glow-ring">
          <div className="middle-glow-ring">
            <div className="inner-glow-ring">
              {/* Teacher Image / SVG Graphic */}
              <div className="teacher-avatar-circle">
                <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="34" cy="34" r="34" fill="#FFEDD5" />
                  {/* Hair */}
                  <path d="M22 28C22 18 46 18 46 28C46 36 43 42 43 42L25 42C25 42 22 36 22 28Z" fill="#3B2314" />
                  {/* Face */}
                  <ellipse cx="34" cy="30" rx="10" ry="12" fill="#FDBA74" />
                  {/* Glasses */}
                  <rect x="26" y="27" width="6" height="5" rx="1.5" stroke="#1E293B" strokeWidth="1.2" fill="#FFFFFF" fillOpacity="0.4" />
                  <rect x="36" y="27" width="6" height="5" rx="1.5" stroke="#1E293B" strokeWidth="1.2" fill="#FFFFFF" fillOpacity="0.4" />
                  <line x1="32" y1="29.5" x2="36" y2="29.5" stroke="#1E293B" strokeWidth="1.2" />
                  {/* Smile */}
                  <path d="M31 36C32.5 37.5 35.5 37.5 37 36" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" />
                  {/* Torso & Suit */}
                  <path d="M20 58C20 47 26 44 34 44C42 44 48 47 48 58Z" fill="#1E293B" />
                  {/* Blouse */}
                  <path d="M31 44L34 50L37 44Z" fill="#FFFFFF" />
                  {/* Folder / Book */}
                  <rect x="25" y="47" width="18" height="15" rx="2" fill="#FF6B4A" />
                  <line x1="28" y1="52" x2="40" y2="52" stroke="#FFFFFF" strokeWidth="1.2" />
                  <line x1="28" y1="56" x2="36" y2="56" stroke="#FFFFFF" strokeWidth="1.2" />
                </svg>
              </div>

              {/* Floating accent badges around ring */}
              <div className="floating-badge badge-top-right">
                <span className="badge-dot" />
              </div>
              <div className="floating-badge badge-left">
                <span className="badge-mini-doc">📄</span>
              </div>
              <div className="floating-badge badge-bottom-left">
                <span className="badge-mini-check">✓</span>
              </div>
              <div className="floating-badge badge-right">
                <span className="badge-mini-star">✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Cards Grid */}
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-cards-pair">
          {/* Question Paper Dropzone */}
          <div
            className={`figma-upload-card ${questionFiles.length > 0 ? 'file-selected' : ''} ${isDragQuestion ? 'dragging' : ''}`}
            onClick={() => questionFiles.length === 0 && questionInputRef.current?.click()}
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

            {questionFiles.length === 0 ? (
              <div className="empty-dropzone-content">
                <div className="figma-upload-icon-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V16M12 4L7.5 8.5M12 4L16.5 8.5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 17V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V17" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="upload-card-heading">
                  Upload <span className="coral-text">Question Paper</span>
                </div>
                <div className="upload-card-sublabel">Max 10MB</div>
              </div>
            ) : (
              /* Uploaded State matching Figma Page 3 & 4 */
              <div className="uploaded-file-row">
                <div className="pdf-badge-tag">PDF</div>
                <div className="file-meta-info">
                  <div className="file-main-name" title={questionFiles[0].name}>
                    {questionFiles[0].name}
                  </div>
                  <div className="file-sub-info">
                    {formatSize(questionFiles[0].size)} • {questionFiles.length > 1 ? `${questionFiles.length} Files` : 'Question Paper'}
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-file-round-btn"
                  onClick={e => {
                    e.stopPropagation();
                    setQuestionFiles([]);
                  }}
                  title="Remove file"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Answer Sheet Dropzone */}
          <div
            className={`figma-upload-card ${answerFiles.length > 0 ? 'file-selected' : ''} ${isDragAnswer ? 'dragging' : ''}`}
            onClick={() => answerFiles.length === 0 && answerInputRef.current?.click()}
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

            {answerFiles.length === 0 ? (
              <div className="empty-dropzone-content">
                <div className="figma-upload-icon-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V16M12 4L7.5 8.5M12 4L16.5 8.5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 17V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V17" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="upload-card-heading">
                  Upload <span className="coral-text">Answer Sheet</span>
                </div>
                <div className="upload-card-sublabel">Max 10MB</div>
              </div>
            ) : (
              /* Uploaded State matching Figma Page 3 & 4 */
              <div className="uploaded-file-row">
                <div className="pdf-badge-tag">PDF</div>
                <div className="file-meta-info">
                  <div className="file-main-name" title={answerFiles[0].name}>
                    {answerFiles[0].name}
                  </div>
                  <div className="file-sub-info">
                    {formatSize(answerFiles[0].size)} • {answerFiles.length > 1 ? `${answerFiles.length} Pages` : 'Answer Sheet'}
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-file-round-btn"
                  onClick={e => {
                    e.stopPropagation();
                    setAnswerFiles([]);
                  }}
                  title="Remove file"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Start Mapping CTA Button */}
        <div className="cta-button-container">
          <button
            type="submit"
            className={`start-mapping-btn ${isFormValid ? 'active' : 'disabled'}`}
            disabled={!isFormValid}
          >
            <span>Start Mapping</span>
            <ArrowRight size={18} />
          </button>

          <p className="start-mapping-helper-text">
            Once both files are uploaded, you’ll able to map answers with questions
          </p>
        </div>
      </form>

      {/* 1-Click Interactive Figma Demo Dataset */}
      <div className="demo-launcher-bar">
        <button type="button" className="demo-pill-btn" onClick={handleUseFigmaDemo}>
          <Sparkles size={16} className="demo-sparkle" />
          <span>Launch Figma Demo (Class 10 Biology Unit Test • 13 Questions)</span>
        </button>
      </div>
    </div>
  );
};
