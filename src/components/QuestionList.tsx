'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { CheckCircle2, XCircle, Award, AlertTriangle, Layers } from 'lucide-react';

export const QuestionList: React.FC = () => {
  const { data, activeQuestionId, selectQuestion } = useAssessment();

  if (!data) return null;

  const { questions, mappings, unmappedAnswers, gradingSummary } = data;

  const answeredCount = mappings.filter(m => m.status === 'answered').length;
  const unansweredCount = mappings.filter(m => m.status === 'unanswered').length;

  return (
    <div className="questions-panel">
      {/* Grading Summary Top Bar */}
      {gradingSummary && (
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(135deg, #fff7f5, #ffffff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Score Overview</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              {gradingSummary.totalMarksObtained} / {gradingSummary.totalMaxMarks} ({gradingSummary.percentage}%)
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
            {gradingSummary.overallFeedback}
          </p>
        </div>
      )}

      <div className="panel-header">
        <div className="panel-title">
          <span>Extracted Questions</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
            {questions.length} Items
          </span>
        </div>

        <div className="question-stats">
          <span className="stat-badge answered">
            <CheckCircle2 size={12} />
            <span>{answeredCount} Answered</span>
          </span>
          <span className="stat-badge unanswered">
            <XCircle size={12} />
            <span>{unansweredCount} Unanswered</span>
          </span>
          {unmappedAnswers.length > 0 && (
            <span className="stat-badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
              <AlertTriangle size={12} />
              <span>{unmappedAnswers.length} Extra Notes</span>
            </span>
          )}
        </div>
      </div>

      <div className="questions-list">
        {questions.map(q => {
          const mapping = mappings.find(m => m.questionId === q.id);
          const isAnswered = mapping?.status === 'answered';
          const isActive = activeQuestionId === q.id;
          const isSubpart = Boolean(q.parentNumber || q.number.includes('('));

          return (
            <div
              key={q.id}
              className={`question-item ${isActive ? 'active' : ''} ${isSubpart ? 'subpart' : ''}`}
              onClick={() => selectQuestion(q.id)}
            >
              <div className="question-header">
                <span className="question-number">
                  Q{q.number}
                </span>

                <span
                  className={`stat-badge ${isAnswered ? 'answered' : 'unanswered'}`}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
                >
                  {isAnswered ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                  <span>{isAnswered ? 'Answered' : 'Unanswered'}</span>
                </span>
              </div>

              <div className="question-body">{q.text}</div>

              <div className="question-footer">
                <span className="marks-tag">
                  {q.maxMarks ? `Max Marks: ${q.maxMarks}` : 'Graded'}
                </span>

                {isAnswered && mapping?.marksObtained !== undefined && (
                  <span style={{ fontWeight: 700, color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Award size={14} />
                    <span>+{mapping.marksObtained} Marks</span>
                  </span>
                )}
              </div>

              {isActive && isAnswered && mapping?.feedback && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--primary-border)', fontSize: '0.8rem', color: 'var(--primary)' }}>
                  <strong>Feedback:</strong> {mapping.feedback}
                </div>
              )}
            </div>
          );
        })}

        {/* Extra Unmapped Answers Section */}
        {unmappedAnswers.length > 0 && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="var(--warning)" />
              <span>Unmapped Student Notes / Extra Answers</span>
            </h4>
            {unmappedAnswers.map(ans => (
              <div
                key={ans.id}
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#92400e',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>
                  {ans.detectedQuestionNumber ? `Detected Header: ${ans.detectedQuestionNumber}` : 'Unlabelled Handwritten Note'}
                </div>
                <div>{ans.text}</div>
                {ans.note && <div style={{ fontSize: '0.75rem', fontStyle: 'italic', marginTop: '0.2rem' }}>{ans.note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
