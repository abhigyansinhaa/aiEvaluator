'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const QuestionList: React.FC = () => {
  const { data, activeQuestionId, selectQuestion } = useAssessment();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    q2: true, // Q2 expanded by default matching Figma Page 7
  });

  if (!data) return null;

  const { questions, mappings } = data;

  const allExpanded = questions.every(q => expandedIds[q.id]);

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedIds({});
    } else {
      const all: Record<string, boolean> = {};
      questions.forEach(q => {
        all[q.id] = true;
      });
      setExpandedIds(all);
    }
  };

  const handleCardClick = (questionId: string) => {
    selectQuestion(questionId);
    // Also expand when clicked
    setExpandedIds(prev => ({
      ...prev,
      [questionId]: true,
    }));
  };

  // Helper to get score badge styling
  const getMarksBadge = (marksObtained: number | undefined, maxMarks: number | undefined, isAnswered: boolean) => {
    if (!isAnswered || marksObtained === undefined || maxMarks === undefined) {
      return {
        text: `0 / ${maxMarks ?? 2}`,
        className: 'marks-pill-badge badge-zero',
      };
    }

    if (marksObtained === maxMarks) {
      return {
        text: `${marksObtained} / ${maxMarks}`,
        className: 'marks-pill-badge badge-full',
      };
    }

    if (marksObtained === 0) {
      return {
        text: `0 / ${maxMarks}`,
        className: 'marks-pill-badge badge-zero',
      };
    }

    return {
      text: `${marksObtained} / ${maxMarks}`,
      className: 'marks-pill-badge badge-partial',
    };
  };

  return (
    <div className="figma-questions-panel">
      {/* Panel Header */}
      <div className="questions-panel-top-bar">
        <h2 className="panel-title-text">Extracted Questions (from question paper)</h2>
        <button
          type="button"
          className="expand-all-text-btn"
          onClick={toggleExpandAll}
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Scrollable Questions List */}
      <div className="questions-scroll-area">
        {questions.map(q => {
          const mapping = mappings.find(m => m.questionId === q.id);
          const isAnswered = mapping?.status === 'answered';
          const isActive = activeQuestionId === q.id;
          const isExpanded = expandedIds[q.id] || isActive;
          const marksObtained = mapping?.marksObtained;
          const maxMarks = q.maxMarks;
          const badge = getMarksBadge(marksObtained, maxMarks, isAnswered);

          return (
            <div
              key={q.id}
              className={`figma-question-card ${isActive ? 'active-selected' : ''}`}
              onClick={() => handleCardClick(q.id)}
            >
              {/* Question Row Header */}
              <div className="question-card-main-row">
                {/* Number Circle (coral when active, dark charcoal when inactive) */}
                <div className={`question-number-circle ${isActive ? 'active-coral' : ''}`}>
                  <span>{q.number}</span>
                </div>

                {/* Question Text */}
                <div className="question-text-content">
                  <p>{q.text}</p>
                </div>

                {/* Score Pill Badge */}
                <div className="question-card-actions">
                  <span className={badge.className}>
                    {badge.text}
                  </span>

                  <button
                    type="button"
                    className="accordion-chevron-btn"
                    onClick={(e) => toggleExpand(q.id, e)}
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded Section: AI Feedback Box */}
              {isExpanded && mapping?.feedback && (
                <div className="ai-feedback-container">
                  <div className="ai-feedback-label">AI Feedback</div>
                  <p className="ai-feedback-text">{mapping.feedback}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
