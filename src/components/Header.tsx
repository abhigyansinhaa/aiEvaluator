'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import {
  ArrowLeft,
  HelpCircle,
  Bell,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { data, resetAssessment } = useAssessment();

  return (
    <header className="top-navbar">
      {/* Left side: Back arrow & breadcrumb title */}
      <div className="navbar-left">
        <button
          className="nav-back-btn"
          onClick={resetAssessment}
          title={data ? 'Back to Upload' : 'Exams'}
          aria-label="Back to Exams"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="navbar-title">Exams</span>
      </div>

      {/* Right side: Actions & User profile */}
      <div className="navbar-right">
        {/* Help Circle */}
        <button className="nav-action-icon-btn" title="Help & Support" aria-label="Help">
          <HelpCircle size={20} />
        </button>

        {/* Bell with red notification badge */}
        <button className="nav-action-icon-btn notification-btn" title="Notifications" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        {/* Sparkle AI Icon */}
        <button className="nav-action-icon-btn" title="AI Features" aria-label="AI Features">
          <Sparkles size={20} className="sparkle-tint" />
        </button>

        {/* User Profile */}
        <div className="user-profile-menu" title="User Profile">
          <div className="user-avatar-circle">
            <span className="user-avatar-initials">MR</span>
          </div>
          <span className="user-profile-name">Madhur Rastogi</span>
          <ChevronDown size={16} className="user-chevron" />
        </div>
      </div>
    </header>
  );
};
