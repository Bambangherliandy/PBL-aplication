"use client";

import { useState, useEffect } from "react";
import { Undo2, Redo2, HelpCircle, Sparkles, Timer, Sun, Moon } from "lucide-react";

interface TopbarProps {
  completedCount: number;
  progressPercent: number;
  saveStatus: string;
  canUndo: boolean;
  canRedo: boolean;
  secondsLeft: number;
  timerRunning: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenGuide: () => void;
  onLoadDemo: () => void;
  onToggleTimer: () => void;
}

export function Topbar({
  completedCount,
  progressPercent,
  saveStatus,
  canUndo,
  canRedo,
  secondsLeft,
  timerRunning,
  onUndo,
  onRedo,
  onOpenGuide,
  onLoadDemo,
  onToggleTimer,
}: TopbarProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            PBL Workspace
          </h1>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            7-Jump Framework
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {progressPercent === 100
            ? "Seluruh tahapan PBL telah terisi. Laporan siap diekspor."
            : completedCount > 0
            ? `Progres pengerjaan: ${completedCount} dari 7 langkah selesai.`
            : "Mulai dari Step 1: tempel teks kasus dan identifikasi istilah sulit."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {saveStatus && (
          <span className="mr-1 text-xs text-slate-400 dark:text-slate-500">{saveStatus}</span>
        )}

        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Urungkan (Ctrl+Z)"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Ulangi (Ctrl+Y)"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={onOpenGuide}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Panduan
        </button>

        <button
          onClick={onLoadDemo}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Isi Contoh
        </button>

        <button
          onClick={onToggleTimer}
          className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 font-mono text-xs font-medium transition ${
            timerRunning
              ? "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          }`}
        >
          <Timer className="h-3.5 w-3.5" />
          {mins}:{secs}
        </button>

        <button
          onClick={toggleTheme}
          title="Ganti tema"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        <div className="ml-1 inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-2.5 font-mono text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-600">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300 dark:bg-teal-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>{progressPercent}%</span>
        </div>
      </div>
    </header>
  );
}