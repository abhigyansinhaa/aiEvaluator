import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import type { GradeResult } from "@/lib/types";

interface GradingSummaryProps {
  studentName: string | null;
  onStudentNameChange: (name: string) => void;
  grades: Map<string, GradeResult>;
  totalQuestions: number;
}

function bandTone(pct: number): { text: string; bg: string; border: string } {
  if (pct >= 80) return { text: "text-green", bg: "bg-green-soft", border: "border-green-border" };
  if (pct >= 40) return { text: "text-amber", bg: "bg-amber-soft", border: "border-amber-border" };
  return { text: "text-red", bg: "bg-red-soft", border: "border-red-border" };
}

export function GradingSummary({ studentName, onStudentNameChange, grades, totalQuestions }: GradingSummaryProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(studentName ?? "");

  if (grades.size === 0) return null;

  const totalAwarded = [...grades.values()].reduce((sum, g) => sum + g.marksAwarded, 0);
  const totalMax = [...grades.values()].reduce((sum, g) => sum + g.maxMarks, 0);
  const pct = totalMax > 0 ? Math.round((totalAwarded / totalMax) * 100) : 0;
  const tone = bandTone(pct);
  const gradedCount = grades.size;

  function commit() {
    onStudentNameChange(draft.trim());
    setEditing(false);
  }

  return (
    <div className={`mx-4 mt-4 rounded-2xl border ${tone.border} ${tone.bg} px-4 py-3.5 flex items-center justify-between gap-4`}>
      <div className="min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              placeholder="Student name"
              className="text-sm font-semibold bg-white border border-line rounded-md px-2 py-1 text-ink outline-none focus:border-orange"
            />
            <button onClick={commit} aria-label="Save name" className="text-ink-soft hover:text-ink">
              <Check size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setDraft(studentName ?? "");
              setEditing(true);
            }}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink group"
          >
            <span className="truncate">{studentName || "Add student name"}</span>
            <Pencil size={12} className="text-ink-faint group-hover:text-ink-soft shrink-0" />
          </button>
        )}
        <p className="text-xs text-ink-soft mt-0.5">
          {gradedCount} of {totalQuestions} question{totalQuestions === 1 ? "" : "s"} graded
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-xl font-bold ${tone.text}`}>
          {totalAwarded}/{totalMax}
        </p>
        <p className="text-xs text-ink-soft">{pct}%</p>
      </div>
    </div>
  );
}
