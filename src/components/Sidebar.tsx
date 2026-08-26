'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  Users,
  FileText,
  FileSpreadsheet,
  BookOpen,
  Settings,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed: externalCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Top Header / Brand */}
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="brand-logo-badge">V</div>
          {!isCollapsed && <span className="brand-logo-text">VedaAI</span>}
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={handleToggle}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* AI Teacher's Toolkit Pill */}
      <div className="sidebar-toolkit-container">
        <button className={`ai-toolkit-pill ${isCollapsed ? 'collapsed' : ''}`} title="AI Teacher's Toolkit">
          <Sparkles size={16} className="sparkle-glow-icon" />
          {!isCollapsed && <span>AI Teacher’s Toolkit</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-item" title="Home">
          <LayoutGrid size={20} />
          {!isCollapsed && <span>Home</span>}
        </div>

        <div className="nav-item" title="My Classroom">
          <Users size={20} />
          {!isCollapsed && <span>My Classroom</span>}
        </div>

        <div className="nav-item" title="Assignments">
          <FileText size={20} />
          {!isCollapsed && <span>Assignments</span>}
        </div>

        <div className="nav-item active" title="Exams">
          <FileSpreadsheet size={20} />
          {!isCollapsed && <span>Exams</span>}
        </div>

        <div className="nav-item" title="My Library">
          <BookOpen size={20} />
          {!isCollapsed && <span>My Library</span>}
        </div>
      </nav>

      {/* Bottom Section: Settings & School Info */}
      <div className="sidebar-bottom">
        <div className="nav-item settings-item" title="Settings">
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </div>

        {/* School Crest Card */}
        <div className={`school-card ${isCollapsed ? 'collapsed' : ''}`} title="Delhi Public School, Bokaro Steel City">
          <div className="school-emblem">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="1.5" fill="#f0fdf4" />
              <path d="M12 5L14.5 9.5H9.5L12 5Z" fill="#15803d" />
              <circle cx="12" cy="14" r="2.5" fill="#ca8a04" />
              <path d="M8 17C9 18.5 15 18.5 16 17" stroke="#15803d" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="school-info">
              <div className="school-name">Delhi Public School</div>
              <div className="school-location">Bokaro Steel City</div>
            </div>
          )}
        </div>

        {isCollapsed && (
          <button className="sidebar-expand-arrow-btn" onClick={handleToggle} title="Expand">
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </aside>
  );
};
