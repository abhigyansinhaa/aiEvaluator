"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { getFilePageCount } from "@/lib/pdf";

interface UploadZoneProps {
  label: string;
  accentLabel: string;
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function UploadZone({ label, accentLabel, files, onChange, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pageCounts, setPageCounts] = useState<Map<string, number>>(new Map());

  // Resolve page counts whenever files change
  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      const counts = new Map<string, number>();
      for (const f of files) {
        const key = `${f.name}-${f.size}`;
        try {
          counts.set(key, await getFilePageCount(f));
        } catch {
          counts.set(key, 1);
        }
      }
      if (!cancelled) setPageCounts(counts);
    }
    if (files.length > 0) resolve();
    else setPageCounts(new Map());
    return () => { cancelled = true; };
  }, [files]);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming || incoming.length === 0) return;
      onChange([...files, ...Array.from(incoming)]);
    },
    [files, onChange]
  );

  const removeAt = (idx: number) => onChange(files.filter((_, i) => i !== idx));

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) addFiles(e.dataTransfer.files);
      }}
      onClick={() => !disabled && files.length === 0 && inputRef.current?.click()}
      className={`rounded-2xl border-2 border-dashed px-6 py-10 transition-colors ${
        disabled
          ? "opacity-50 border-line"
          : dragging
            ? "border-orange bg-orange-soft"
            : files.length === 0
              ? "border-line hover:border-ink-faint bg-surface cursor-pointer"
              : "border-line bg-surface"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="application/pdf,image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {files.length === 0 ? (
        <div className="text-center">
          <div className="w-11 h-11 mx-auto rounded-xl bg-surface-muted border border-line flex items-center justify-center mb-4">
            <Upload size={18} className="text-ink-soft" />
          </div>
          <p className="text-[15px] text-ink">
            Upload <span className="text-orange font-semibold underline underline-offset-2">{accentLabel}</span>
          </p>
          <p className="text-xs text-ink-faint mt-1">Max 10MB</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((f, i) => {
            const key = `${f.name}-${f.size}`;
            const pages = pageCounts.get(key);
            return (
              <div
                key={`${f.name}-${i}`}
                className="flex items-center justify-between rounded-xl bg-surface-muted border border-line px-3.5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-red-soft border border-red-border flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-red" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{f.name}</p>
                    <p className="text-xs text-ink-faint">
                      {formatSize(f.size)}
                      {pages != null && <> · {pages} {pages === 1 ? "Page" : "Pages"}</>}
                    </p>
                  </div>
                </div>
                {!disabled && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAt(i);
                    }}
                    aria-label={`Remove ${f.name}`}
                    className="w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center shrink-0 hover:opacity-80"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            );
          })}
          {!disabled && (
            <button
              onClick={() => inputRef.current?.click()}
              className="text-xs text-ink-soft hover:text-ink underline underline-offset-2"
            >
              Add another file
            </button>
          )}
        </div>
      )}
      <p className="sr-only">{label}</p>
    </div>
  );
}

