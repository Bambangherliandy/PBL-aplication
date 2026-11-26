"use client";

import { useState, useEffect } from "react";
import {
  Undo2,
  Redo2,
  Play,
  Pause,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Sun,
  Moon,
  Timer,
} from "lucide-react";
import { TRISAKTI_LOGO_PATH } from "@/utils/trisaktiLogo";
import { usePblWorkspace } from "@/hooks/usePblWorkspace";
import { STEP_NAMES, STEP_TIPS, INITIAL_STATE } from "@/constants/pbl";
import { Step1Understand } from "@/components/steps/Step1Understand";
import { Step2MainProblem } from "@/components/steps/Step2MainProblem";
import { Step3Analysis } from "@/components/steps/Step3Analysis";
import { Step4Perspectives } from "@/components/steps/Step4Perspectives";
import { Step5Objectives } from "@/components/steps/Step5Objectives";
import { Step6Theory } from "@/components/steps/Step6Theory";
import { Step7Synthesis } from "@/components/steps/Step7Synthesis";
import { Step8Export } from "@/components/steps/Step8Export";

/* Font: Figtree (antarmuka) + Newsreader (judul). Dimuat lewat @import agar tidak perlu mengubah layout.tsx */
const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap');
.pbl-root { font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif; }
.pbl-serif { font-family: 'Newsreader', Georgia, 'Times New Roman', serif; }
.pbl-nums { font-variant-numeric: tabular-nums; }
.pbl-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
.pbl-scroll::-webkit-scrollbar-thumb { background: rgba(100,116,139,.35); border-radius: 999px; }
@media (prefers-reduced-motion: reduce) {
  .pbl-root *, .pbl-root *::before, .pbl-root *::after { transition-duration: 0.01ms !important; }
}
`;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";

/* Setiap langkah punya warna sendiri agar navigasi lebih mudah dikenali.
   Class ditulis lengkap (bukan dirakit) supaya terbaca oleh Tailwind. */
const STEP_THEME = [
  { hex: "#0ea5e9", badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { hex: "#f59e0b", badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { hex: "#10b981", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { hex: "#8b5cf6", badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  { hex: "#f43f5e", badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
  { hex: "#14b8a6", badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" },
  { hex: "#f97316", badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
  { hex: "#6366f1", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" },
];

export default function PblWorkspacePage() {
  const {
    state,
    setState,
    hydrated,
    saveStatus,
    toastMsg,
    showToast,
    undo,
    redo,
    canUndo,
    canRedo,
    secondsLeft,
    timerRunning,
    toggleTimer,
    isStepDone,
    completedCount,
    progressPercent,
    loadSampleData,
  } = usePblWorkspace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("pbl-theme");
    // Default awal: gelap. Hanya berubah jika pengguna pernah memilih mode terang.
    const isDark = savedTheme ? savedTheme === "dark" : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("pbl-theme", next ? "dark" : "light");
      return next;
    });
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb] text-sm text-slate-500 dark:bg-[#0c111b] dark:text-slate-400">
        <style>{FONT_CSS}</style>
        <span className="pbl-root">Memuat workspace...</span>
      </div>
    );
  }

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, step }));
    setMobileMenuOpen(false);
  };

  const handleReset = () => {
    if (!window.confirm("Hapus semua data dan mulai ulang dari kosong?")) return;
    setState(INITIAL_STATE);
    showToast("Workspace berhasil direset.");
  };

  const currentTheme = STEP_THEME[(state.step - 1) % STEP_THEME.length];

  return (
    <div className="pbl-root flex min-h-screen items-start bg-[#f4f6fb] text-slate-900 dark:bg-[#0c111b] dark:text-slate-100">
      <style>{FONT_CSS}</style>

      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* SIDEBAR KIRI FIXED / STICKY (Tidak ikut ter-scroll) */}
      <aside
        className={`pbl-scroll fixed inset-y-0 left-0 z-40 flex h-screen w-72 shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200 bg-white p-5 text-slate-900 shadow-xl shadow-slate-900/5 transition-transform duration-200 dark:border-white/5 dark:bg-[#0a0f1a] dark:text-slate-100 dark:shadow-none lg:sticky lg:top-0 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-5">
          {/* Brand & Status Simpan */}
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-transparent">
                  <img
                    src={TRISAKTI_LOGO_PATH}
                    alt="Logo Universitas Trisakti"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="pbl-serif text-lg font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">
                    Universitas Trisakti
                  </h1>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {saveStatus || "Auto-save aktif"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className={`rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white lg:hidden ${FOCUS}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Garis warna identitas */}
            <div className="mt-4 flex h-1 gap-1 overflow-hidden rounded-full" aria-hidden="true">
              <span className="flex-[3] bg-sky-500" />
              <span className="flex-[2] bg-amber-400" />
              <span className="flex-[1] bg-emerald-500" />
              <span className="flex-[1] bg-rose-400" />
            </div>
          </div>

          {/* Progress Penyelesaian */}
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50 p-4 dark:border-amber-400/15 dark:bg-amber-400/[0.07]">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <BookOpen className="h-3.5 w-3.5" />
              Progres Laporan
            </div>
            <div className="mt-2 flex items-end justify-between">
              <p className="pbl-nums text-3xl font-semibold leading-none text-slate-900 dark:text-white">
                {progressPercent}
                <span className="ml-0.5 text-base font-medium text-slate-400">%</span>
              </p>
              <p className="pbl-nums text-xs text-slate-500 dark:text-slate-400">
                {completedCount} dari 7 selesai
              </p>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-200/60 dark:bg-white/10"
            >
              <div
                style={{ width: `${progressPercent}%`, backgroundColor: state.color }}
                className="h-full rounded-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Pomodoro Focus Timer */}
          <div className="flex items-center justify-between rounded-2xl border border-sky-200/70 bg-sky-50 px-4 py-3 dark:border-sky-400/15 dark:bg-sky-400/[0.07]">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-800 dark:text-sky-300">
                <Timer className="h-3.5 w-3.5" /> Focus Timer
              </p>
              <p className="pbl-nums text-2xl font-semibold tracking-wide text-slate-900 dark:text-white">
                {mins}:{secs}
              </p>
            </div>
            <button
              onClick={toggleTimer}
              className={`inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-amber-300 ${FOCUS}`}
            >
              {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {timerRunning ? "Jeda" : "Mulai"}
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-40 disabled:hover:bg-violet-50 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300 dark:hover:bg-violet-400/20 ${FOCUS}`}
            >
              <Undo2 className="h-3.5 w-3.5" /> Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100 disabled:opacity-40 disabled:hover:bg-teal-50 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-300 dark:hover:bg-teal-400/20 ${FOCUS}`}
            >
              <Redo2 className="h-3.5 w-3.5" /> Redo
            </button>
          </div>

          {/* Toggle Dark / Light Mode */}
          <button
            onClick={toggleDarkMode}
            className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10 ${FOCUS}`}
          >
            <span className="flex items-center gap-2">
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-500" />
              )}
              {darkMode ? "Mode Terang (Light)" : "Mode Gelap (Dark)"}
            </span>
            <span
              className={`relative h-5 w-9 rounded-full transition ${
                darkMode ? "bg-emerald-500" : "bg-slate-300"
              }`}
              aria-hidden="true"
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                  darkMode ? "left-[18px]" : "left-0.5"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Aksi Cepat (Isi Contoh & Reset) */}
        <div className="mt-6 space-y-2 border-t border-slate-200 pt-5 dark:border-white/10">
          <button
            onClick={loadSampleData}
            style={{ backgroundColor: state.color }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-3.5 py-3 text-xs font-semibold text-white shadow-md transition hover:brightness-110 ${FOCUS}`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Isi Contoh Lengkap
          </button>
          <button
            onClick={handleReset}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300 dark:hover:bg-rose-400/20 ${FOCUS}`}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Workspace
          </button>
        </div>
      </aside>

      {/* AREA UTAMA KANAN */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* NAVIGASI STEP HORIZONTAL DI BAGIAN ATAS (Sticky) */}
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-[#0f1624]/90">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden ${FOCUS}`}
              aria-label="Buka menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <nav
              aria-label="Langkah PBL"
              className="pbl-scroll flex flex-1 items-center overflow-x-auto py-1"
            >
              {STEP_NAMES.map((name, idx) => {
                const stepNum = idx + 1;
                const active = state.step === stepNum;
                const done = isStepDone(stepNum);
                const theme = STEP_THEME[idx % STEP_THEME.length];

                return (
                  <div key={name} className="flex shrink-0 items-center">
                    <button
                      onClick={() => setStep(stepNum)}
                      aria-current={active ? "step" : undefined}
                      style={active ? { backgroundColor: state.color } : undefined}
                      className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-xs font-semibold transition ${FOCUS} ${
                        active
                          ? "text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                          active ? "bg-white/25 text-white" : theme.badge
                        }`}
                      >
                        {done && !active ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                      </span>
                      <span>{name}</span>
                    </button>
                    {idx < STEP_NAMES.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="mx-1 h-px w-4 shrink-0"
                        style={{ backgroundColor: done ? theme.hex : undefined, opacity: done ? 0.6 : 1 }}
                      >
                        {!done && <span className="block h-px w-4 bg-slate-200 dark:bg-white/10" />}
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </header>

        {/* KONTEN STEP AKTIF */}
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-5 px-4 py-7 sm:px-6">
          <section
            style={{ borderLeftColor: currentTheme.hex }}
            className="relative overflow-hidden rounded-2xl border border-l-4 border-slate-200/80 bg-white px-5 py-4 shadow-sm dark:border-white/5 dark:bg-[#131c2e]"
          >
            <div
              aria-hidden="true"
              style={{ backgroundColor: currentTheme.hex }}
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[0.12]"
            />
            <h2 className="pbl-serif relative text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Step {state.step}: {STEP_NAMES[state.step - 1]}
            </h2>
            <p className="relative mt-1 max-w-3xl text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
              {STEP_TIPS[state.step - 1]}
            </p>
          </section>

          {state.step === 1 && <Step1Understand state={state} setState={setState} showToast={showToast} />}
          {state.step === 2 && <Step2MainProblem state={state} setState={setState} />}
          {state.step === 3 && <Step3Analysis state={state} setState={setState} />}
          {state.step === 4 && <Step4Perspectives state={state} setState={setState} showToast={showToast} />}
          {state.step === 5 && <Step5Objectives state={state} setState={setState} showToast={showToast} />}
          {state.step === 6 && <Step6Theory state={state} setState={setState} />}
          {state.step === 7 && <Step7Synthesis state={state} setState={setState} />}
          {state.step === 8 && (
            <Step8Export
              state={state}
              setState={setState}
              isStepDone={isStepDone}
              showToast={showToast}
            />
          )}

          {/* Navigasi Sebelumnya / Selanjutnya */}
          <div className="flex items-center justify-between border-t border-slate-200/80 pt-5 dark:border-white/5">
            <button
              onClick={() => setStep(Math.max(1, state.step - 1))}
              disabled={state.step === 1}
              className={`inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-white/10 dark:bg-[#131c2e] dark:text-slate-200 dark:hover:bg-[#1a2540] ${FOCUS}`}
            >
              <ChevronLeft className="h-4 w-4" /> Sebelumnya
            </button>
            <button
              onClick={() => setStep(Math.min(8, state.step + 1))}
              disabled={state.step === 8}
              style={{ backgroundColor: state.color }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:brightness-110 disabled:opacity-40 ${FOCUS}`}
            >
              Selanjutnya <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>

      {/* Notifikasi Toast */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl ring-1 ring-white/10"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}