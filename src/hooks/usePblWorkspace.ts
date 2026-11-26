"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PblState } from "@/types/pbl";
import { INITIAL_STATE, FULL_SAMPLE_DATA } from "@/constants/pbl";

const STORAGE_KEY = "pbl-workspace-v1";

export function usePblWorkspace() {
  const [state, setState] = useState<PblState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Undo / Redo stacks
  const [history, setHistory] = useState<PblState[]>([INITIAL_STATE]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const isRestoringRef = useRef(false);

  // Pomodoro timer
  const [secondsLeft, setSecondsLeft] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2800);
    return () => clearTimeout(t);
  }, [toastMsg]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...INITIAL_STATE, ...parsed };
        setState(merged);
        setHistory([merged]);
      }
    } catch (_) {}
    setHydrated(true);
  }, []);

  // Auto-save & record history
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const timeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      setSaveStatus(`Tersimpan ${timeStr}`);
    } catch (_) {
      setSaveStatus("Gagal menyimpan");
    }

    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIdx + 1);
        const next = [...sliced, state].slice(-50);
        setHistoryIdx(next.length - 1);
        return next;
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [state, hydrated]);

  // Pomodoro interval
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          showToast("Sesi fokus 25 menit selesai.");
          return 1500;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, showToast]);

  const undo = useCallback(() => {
    if (historyIdx <= 0) return showToast("Tidak ada perubahan untuk diurungkan.");
    const nextIdx = historyIdx - 1;
    isRestoringRef.current = true;
    setHistoryIdx(nextIdx);
    setState(history[nextIdx]);
  }, [history, historyIdx, showToast]);

  const redo = useCallback(() => {
    if (historyIdx >= history.length - 1) return showToast("Tidak ada perubahan untuk diulang.");
    const nextIdx = historyIdx + 1;
    isRestoringRef.current = true;
    setHistoryIdx(nextIdx);
    setState(history[nextIdx]);
  }, [history, historyIdx, showToast]);

  const isStepDone = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return state.words.length > 0 && Boolean(state.task) && Boolean(state.method);
        case 2:
          return state.problem.trim().length > 0;
        case 3:
          return (
            Object.values(state.lists).some((arr) => arr.some((x) => x.trim())) ||
            state.ideas.some((d) => d.t.trim()) ||
            state.why.some((x) => x.trim()) ||
            state.mm.some((n) => n.t.trim())
          );
        case 4:
          return state.subs.some((s) => Object.values(s.lens).some((x) => x.trim()));
        case 5:
          return state.los.length > 0;
        case 6:
          return state.los.some((l) => l.theory.trim() || l.applied.trim());
        case 7:
          return state.los.some((l) => l.synth.trim()) || state.concl.trim().length > 0;
        default:
          return false;
      }
    },
    [state]
  );

  const completedCount = [1, 2, 3, 4, 5, 6, 7].filter(isStepDone).length;
  const progressPercent = Math.round((completedCount / 7) * 100);

  const loadSampleData = () => {
    const hasExistingData =
      state.words.length > 0 || state.problem.trim().length > 0 || state.los.length > 0;

    if (
      hasExistingData &&
      !window.confirm("Workspace sudah berisi data. Timpa seluruh isian dengan contoh lengkap dari laporan?")
    ) {
      return;
    }

    setState((prev) => ({
      ...INITIAL_STATE,
      ...FULL_SAMPLE_DATA,
      step: prev.step,
      color: prev.color,
      cover: {
        ...INITIAL_STATE.cover,
        ...FULL_SAMPLE_DATA.cover,
      },
    }));
    showToast("Contoh lengkap (Step 1–8) dari laporan berhasil dimuat.");
  };

  return {
    state,
    setState,
    hydrated,
    saveStatus,
    toastMsg,
    showToast,
    undo,
    redo,
    canUndo: historyIdx > 0,
    canRedo: historyIdx < history.length - 1,
    secondsLeft,
    timerRunning,
    toggleTimer: () => setTimerRunning((v) => !v),
    isStepDone,
    completedCount,
    progressPercent,
    loadSampleData,
  };
}