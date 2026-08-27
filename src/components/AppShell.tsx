"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Circle,
  Files,
  HelpCircle,
  LayoutGrid,
  Library,
  Menu,
  Presentation,
  School,
  Sparkles,
  X,
} from "lucide-react";

interface AppShellProps {
  sidebarExpanded: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Home" },
  { icon: Presentation, label: "My Classroom" },
  { icon: Files, label: "Assignments" },
  { icon: Circle, label: "Exams", active: true },
  { icon: Library, label: "My Library" },
];

function BrandMark() {
  return (
    <div className="w-8 h-8 rounded-md bg-ink flex items-center justify-center shrink-0">
      <span className="text-white text-sm font-bold">V</span>
    </div>
  );
}

function ToolkitPill({ compact }: { compact: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border-2 border-orange bg-ink text-white ${
        compact ? "p-2" : "px-4 py-2"
      }`}
    >
      <Sparkles size={16} className="text-orange shrink-0" />
      {!compact && <span className="text-xs font-semibold whitespace-nowrap">AI Teacher&apos;s Toolkit</span>}
    </div>
  );
}

function SchoolBadge({ compact }: { compact: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface-muted ${compact ? "p-2" : "px-3 py-2.5"}`}>
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

function NavList({
  expanded,
  onNavigate,
  onExamsClick,
}: {
  expanded: boolean;
  onNavigate?: () => void;
  onExamsClick?: () => void;
}) {
  return (
    <nav className="flex-1 px-3 space-y-1">
      {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          onClick={() => {
            if (label === "Exams" && onExamsClick) {
              onExamsClick();
            }
            onNavigate?.();
          }}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left ${
            active ? "bg-surface-muted text-ink font-medium" : "text-ink-soft"
          } ${expanded ? "" : "justify-center px-0"}`}
          title={expanded ? undefined : label}
        >
          <Icon size={18} className="shrink-0" />
          {expanded && <span>{label}</span>}
        </button>
      ))}
    </nav>
  );
}

export function AppShell({ sidebarExpanded, onBack, children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg">
      {/* Mobile top bar — no sidebar at this width, matches the Figma mobile frames */}
      <header className="sm:hidden flex items-center justify-between border-b border-line bg-surface px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-ink-soft hover:text-ink transition-colors p-1 -ml-1 cursor-pointer"
            aria-label="Back to Exams"
          >
            <ArrowLeft size={18} />
          </button>
          <BrandMark />
          <span className="font-bold text-ink">VedaAI</span>
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
          <div className="relative w-[78%] max-w-[280px] bg-surface flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-line">
              <div className="flex items-center gap-2">
                <BrandMark />
                <span className="font-bold text-lg text-ink">VedaAI</span>
              </div>
              <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                <X size={20} className="text-ink-soft" />
              </button>
            </div>
            <div className="px-4 py-4">
              <ToolkitPill compact={false} />
            </div>
            <NavList
              expanded
              onNavigate={() => setMobileNavOpen(false)}
              onExamsClick={onBack}
            />
            <div className="px-3 pb-4">
              <SchoolBadge compact={false} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Desktop/tablet sidebar */}
        <aside
          className={`hidden sm:flex shrink-0 flex-col border-r border-line bg-surface transition-all duration-300 ${
            sidebarExpanded ? "w-[260px]" : "w-[72px]"
          }`}
        >
          <div className={`flex items-center gap-2 px-4 py-5 ${sidebarExpanded ? "" : "justify-center px-0"}`}>
            <BrandMark />
            {sidebarExpanded && <span className="font-bold text-lg text-ink">VedaAI</span>}
          </div>

          <div className={`px-4 mb-4 ${sidebarExpanded ? "" : "px-2 flex justify-center"}`}>
            <ToolkitPill compact={!sidebarExpanded} />
          </div>

          <NavList expanded={sidebarExpanded} onExamsClick={onBack} />

          <div className={`px-3 pb-4 ${sidebarExpanded ? "" : "px-2 flex justify-center"}`}>
            <SchoolBadge compact={!sidebarExpanded} />
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Desktop/tablet header */}
          <header className="hidden sm:flex items-center justify-between border-b border-line bg-surface px-6 py-3.5 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2.5 text-ink-soft hover:text-ink transition-colors cursor-pointer"
              aria-label="Back to Exams"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Exams</span>
            </button>
            <div className="flex items-center gap-4 text-ink-soft">
              <HelpCircle size={20} />
              <div className="relative">
                <Bell size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange" />
              </div>
              <Sparkles size={20} />
              <div className="flex items-center gap-2 pl-2 border-l border-line">
                <div className="w-8 h-8 rounded-full bg-orange-soft border border-orange/30" />
                <span className="text-sm font-medium text-ink">Madhur Rastogi</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </header>
          <main className="flex-1 min-h-0 flex flex-col overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}
