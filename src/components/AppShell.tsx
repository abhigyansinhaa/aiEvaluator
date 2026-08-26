"use client";

import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Circle,
  Files,
  HelpCircle,
  LayoutGrid,
  Library,
  Presentation,
  School,
  Sparkles,
} from "lucide-react";

interface AppShellProps {
  sidebarExpanded: boolean;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Home" },
  { icon: Presentation, label: "My Classroom" },
  { icon: Files, label: "Assignments" },
  { icon: Circle, label: "Exams", active: true },
  { icon: Library, label: "My Library" },
];

export function AppShell({ sidebarExpanded, children }: AppShellProps) {
  return (
    <div className="flex-1 flex min-h-0 bg-bg">
      <aside
        className={`shrink-0 flex flex-col border-r border-line bg-surface transition-all duration-300 ${
          sidebarExpanded ? "w-[260px]" : "w-[72px]"
        }`}
      >
        <div className={`flex items-center gap-2 px-4 py-5 ${sidebarExpanded ? "" : "justify-center px-0"}`}>
          <div className="w-8 h-8 rounded-md bg-ink flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">V</span>
          </div>
          {sidebarExpanded && <span className="font-bold text-lg text-ink">VedaAI</span>}
        </div>

        <div className={`px-4 mb-4 ${sidebarExpanded ? "" : "px-2 flex justify-center"}`}>
          <div
            className={`flex items-center gap-2 rounded-full border-2 border-orange bg-ink text-white ${
              sidebarExpanded ? "px-4 py-2" : "p-2"
            }`}
          >
            <Sparkles size={16} className="text-orange shrink-0" />
            {sidebarExpanded && <span className="text-xs font-semibold whitespace-nowrap">AI Teacher&apos;s Toolkit</span>}
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                active ? "bg-surface-muted text-ink font-medium" : "text-ink-soft"
              } ${sidebarExpanded ? "" : "justify-center px-0"}`}
              title={sidebarExpanded ? undefined : label}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarExpanded && <span>{label}</span>}
            </div>
          ))}
        </nav>

        <div className={`px-3 pb-4 ${sidebarExpanded ? "" : "px-2 flex justify-center"}`}>
          <div className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface-muted ${sidebarExpanded ? "px-3 py-2.5" : "p-2"}`}>
            <div className="w-8 h-8 rounded-md bg-green-soft border border-green-border flex items-center justify-center shrink-0">
              <School size={16} className="text-green" />
            </div>
            {sidebarExpanded && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink truncate">Delhi Public School</p>
                <p className="text-[11px] text-ink-faint truncate">Bokaro Steel City</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between border-b border-line bg-surface px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-2.5 text-ink-soft">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium text-ink-soft">Exams</span>
          </div>
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
  );
}
