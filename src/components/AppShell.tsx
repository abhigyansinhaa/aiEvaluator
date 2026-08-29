"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  FileText,
  Files,
  HelpCircle,
  LayoutGrid,
  Library,
  Menu,
  Presentation,
  School,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

interface AppShellProps {
  sidebarExpanded?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Home" },
  { icon: Presentation, label: "My Classroom" },
  { icon: Files, label: "Assignments" },
  { icon: FileText, label: "Exams", active: true },
  { icon: Library, label: "My Library" },
];

function BrandMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative ${className} rounded-lg overflow-hidden shrink-0 shadow-sm border border-line/40`}>
      <Image
        src="/veda-logo.png"
        alt="VedaAI Logo"
        fill
        sizes="32px"
        className="object-cover"
        priority
      />
    </div>
  );
}

function ToolkitPill({ compact }: { compact: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border-2 border-orange bg-ink text-white transition-all ${
        compact ? "w-10 h-10 justify-center p-0" : "px-4 py-2"
      }`}
      title="AI Teacher's Toolkit"
    >
      <Sparkles size={16} className="text-orange shrink-0" />
      {!compact && <span className="text-xs font-semibold whitespace-nowrap">AI Teacher&apos;s Toolkit</span>}
    </div>
  );
}

function SchoolBadge({ compact }: { compact: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface-muted transition-all ${compact ? "p-1.5 justify-center" : "px-3 py-2.5"}`}>
      <div className="w-8 h-8 rounded-md bg-green-soft border border-green-border flex items-center justify-center shrink-0">
        <School size={16} className="text-green" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink truncate">Delhi Public School</p>
          <p className="text-[11px] text-ink-faint truncate">Bokaro Steel City</p>
        </div>
      )}
    </div>
  );
}

function NavList({ expanded, onNavigate }: { expanded: boolean; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-2.5 space-y-0.5">
      {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          onClick={onNavigate}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left relative transition-colors ${
            active ? "text-ink font-semibold" : "text-ink-soft hover:text-ink hover:bg-surface-muted"
          } ${expanded ? "" : "justify-center px-0"}`}
          title={expanded ? undefined : label}
        >
          {active && (
            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.75 rounded-r-full bg-ink ${
              expanded ? "h-6" : "h-5"
            }`} />
          )}
          <Icon size={18} className="shrink-0" />
          {expanded && <span>{label}</span>}
        </button>
      ))}

      {/* Settings item with separator */}
      <div className="pt-2 mt-2 border-t border-line">
        <button
          onClick={onNavigate}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left text-ink-soft hover:text-ink hover:bg-surface-muted ${
            expanded ? "" : "justify-center px-0"
          }`}
          title={expanded ? undefined : "Settings"}
        >
          <Settings size={18} className="shrink-0" />
          {expanded && <span>Settings</span>}
        </button>
      </div>
    </nav>
  );
}

export function AppShell({ sidebarExpanded = false, onBack, children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(sidebarExpanded);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg">
      {/* Mobile top bar */}
      <header className="sm:hidden flex items-center justify-between bg-surface px-4 py-3 shrink-0 mx-2 mt-2 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={onBack} aria-label="Back to upload" className="text-ink-soft hover:text-ink">
            <ArrowLeft size={18} />
          </button>
          <BrandMark />
          <span className="font-display font-bold text-ink tracking-tight text-base">VedaAI</span>
        </div>
        <div className="flex items-center gap-3.5 text-ink-soft">
          <div className="relative">
            <Bell size={19} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange" />
          </div>
          <div className="w-7 h-7 rounded-full bg-orange-soft border border-orange/30 shrink-0" />
          <button onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileNavOpen(false)} />
          <div className="relative w-[78%] max-w-70 bg-surface flex flex-col h-full shadow-xl rounded-r-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-line">
              <div className="flex items-center gap-2">
                <BrandMark />
                <span className="font-display font-bold text-lg text-ink tracking-tight">VedaAI</span>
              </div>
              <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                <X size={20} className="text-ink-soft" />
              </button>
            </div>
            <div className="px-4 py-4">
              <ToolkitPill compact={false} />
            </div>
            <NavList expanded onNavigate={() => setMobileNavOpen(false)} />
            <div className="px-3 pb-4">
              <SchoolBadge compact={false} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex min-h-0 p-2 gap-2">
        {/* Desktop/tablet sidebar — floating rounded panel */}
        <aside
          className={`hidden sm:flex shrink-0 flex-col bg-surface rounded-2xl shadow-sm transition-all duration-300 ${
            isExpanded ? "w-64" : "w-17"
          }`}
        >
          <div className={`flex items-center gap-2.5 px-4 py-5 ${isExpanded ? "justify-between" : "justify-center px-0"}`}>
            <div className="flex items-center gap-2.5">
              <BrandMark />
              {isExpanded && <span className="font-display font-bold text-lg text-ink tracking-tight">VedaAI</span>}
            </div>
            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-ink-soft hover:text-ink transition-colors"
                aria-label="Collapse sidebar"
              >
                <Copy size={16} />
              </button>
            )}
          </div>

          <div className={`mb-4 flex justify-center ${isExpanded ? "px-4" : "px-2"}`}>
            <ToolkitPill compact={!isExpanded} />
          </div>

          <NavList expanded={isExpanded} />

          <div className={`px-2.5 pb-2 flex flex-col items-center gap-2`}>
            <SchoolBadge compact={!isExpanded} />
            <button
              onClick={() => setIsExpanded((v) => !v)}
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
              className="w-full py-1.5 flex items-center justify-center text-ink-soft hover:text-ink hover:bg-surface-muted rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
            </button>
          </div>
        </aside>

        {/* Main content column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-2">
          {/* Desktop/tablet header — floating rounded panel */}
          <header className="hidden sm:flex items-center justify-between bg-surface rounded-2xl shadow-sm px-4 md:px-6 py-3 md:py-3.5 shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5 text-ink-soft">
              <button
                onClick={onBack}
                className="flex items-center gap-2 sm:gap-2.5 text-ink-soft hover:text-ink transition-colors"
              >
                <ArrowLeft size={18} />
                <FileText size={16} className="text-ink-faint" />
                <span className="text-sm font-medium">Exams</span>
              </button>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-ink-soft">
              <HelpCircle size={18} className="sm:hidden" />
              <HelpCircle size={20} className="hidden sm:block" />
              <div className="relative">
                <Bell size={18} className="sm:hidden" />
                <Bell size={20} className="hidden sm:block" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange" />
              </div>
              <Sparkles size={18} className="sm:hidden" />
              <Sparkles size={20} className="hidden sm:block" />
              <div className="flex items-center gap-2 pl-2 border-l border-line">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-soft border border-orange/30" />
                <span className="text-sm font-medium text-ink hidden md:inline">Madhur Rastogi</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </header>

          {/* Main content area — floating rounded panel */}
          <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-surface rounded-2xl shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}