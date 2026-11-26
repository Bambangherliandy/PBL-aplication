"use client";

import { useState, useRef } from "react";
import { Plus, Wand2, X } from "lucide-react";
import { PblState, HardWord } from "@/types/pbl";
import { TASKS, METHODS } from "@/constants/pbl";

interface Props {
  state: PblState;
  setState: React.Dispatch<React.SetStateAction<PblState>>;
  showToast: (msg: string) => void;
}

export function Step1Understand({ state, setState, showToast }: Props) {
  const [editingCase, setEditingCase] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  const caseBoxRef = useRef<HTMLDivElement>(null);

  const recommendedMethods = state.task
    ? TASKS.find((t) => t[0] === state.task)?.[3] || []
    : [];

  const addTerm = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    setState((prev) => {
      if (prev.words.some((w) => w.t.toLowerCase() === cleaned.toLowerCase())) return prev;
      return { ...prev, words: [...prev.words, { t: cleaned, m: "", s: "Belum paham" }] };
    });
  };

  const handleAddSelected = () => {
    const sel = window.getSelection();
    if (sel && caseBoxRef.current?.contains(sel.anchorNode)) {
      addTerm(sel.toString());
    }
  };

  const handleAutoDetect = () => {
    const text = state.case || "";
    const found = new Set<string>();
    const ignore = new Set(["USD", "IDR", "EUR", "US", "UK", "THE", "AND", "OR"]);

    (text.match(/\b[A-Z]{2,6}\b/g) || []).forEach((w) => !ignore.has(w) && found.add(w));
    text.split(/[.!?]\s+/).forEach((sentence) => {
      (sentence.match(/(?<=\s)[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g) || []).forEach((phrase) => {
        if (phrase.length > 3) found.add(phrase);
      });
    });

    const candidates = [...found].slice(0, 15);
    let added = 0;
    setState((prev) => {
      const nextWords = [...prev.words];
      candidates.forEach((c) => {
        if (!nextWords.some((w) => w.t.toLowerCase() === c.toLowerCase())) {
          nextWords.push({ t: c, m: "", s: "Belum paham" });
          added++;
        }
      });
      return { ...prev, words: nextWords };
    });

    showToast(added > 0 ? `${added} istilah berhasil ditambahkan.` : "Tidak ada istilah baru yang terdeteksi.");
  };

  const updateWord = (idx: number, field: keyof HardWord, val: string) => {
    setState((prev) => {
      const words = [...prev.words];
      words[idx] = { ...words[idx], [field]: val } as HardWord;
      return { ...prev, words };
    });
  };

  const removeWord = (idx: number) => {
    setState((prev) => ({
      ...prev,
      words: prev.words.filter((_, i) => i !== idx),
    }));
  };

  const renderHighlightedCase = () => {
    if (!state.words.length) return state.case;
    const escaped = state.words
      .map((w) => w.t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length)
      .join("|");
    const parts = state.case.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) => {
      const isMatch = state.words.some((w) => w.t.toLowerCase() === part.toLowerCase());
      return isMatch ? (
        <mark key={i} className="rounded bg-amber-200/80 px-1 font-medium text-slate-900 dark:bg-amber-500/30 dark:text-amber-200">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      );
    });
  };

  const showEditor = editingCase || !state.case.trim();

  return (
    <div className="space-y-4">
      {/* 1.1 Hard Words */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                1.1
              </span>
              Hard Words & Terminology
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Tempel teks kasus, sorot istilah sulit lalu klik Tambah Kata Terpilih, atau gunakan deteksi otomatis.
            </p>
          </div>
          <button
            onClick={() => setEditingCase((v) => !v)}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {showEditor ? "Selesai & Tandai Istilah" : "Ubah Teks Kasus"}
          </button>
        </div>

        {showEditor ? (
          <textarea
            rows={6}
            value={state.case}
            onChange={(e) => setState((prev) => ({ ...prev, case: e.target.value }))}
            placeholder="Tempel teks kasus lengkap di sini..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm leading-relaxed text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        ) : (
          <div
            ref={caseBoxRef}
            className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-serif text-[15px] leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            {renderHighlightedCase()}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={handleAddSelected}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Kata Terpilih
          </button>
          <button
            onClick={handleAutoDetect}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Wand2 className="h-3.5 w-3.5 text-blue-600" /> Deteksi Otomatis
          </button>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTerm(newTerm);
                  setNewTerm("");
                }
              }}
              placeholder="Ketik istilah manual..."
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              onClick={() => {
                addTerm(newTerm);
                setNewTerm("");
              }}
              className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
            >
              Tambah
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.words.map((w, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={w.t}
                  onChange={(e) => updateWord(i, "t", e.target.value)}
                  className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900"
                />
                <select
                  value={w.s}
                  onChange={(e) => updateWord(i, "s", e.target.value)}
                  className="rounded border border-slate-300 bg-white px-1.5 py-1 text-[11px] dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="Belum paham">Belum paham</option>
                  <option value="Paham">Paham</option>
                </select>
                <button
                  onClick={() => removeWord(i)}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={w.m}
                onChange={(e) => updateWord(i, "m", e.target.value)}
                placeholder="Arti dengan bahasa sendiri..."
                className="w-full rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 1.2 Type of Task */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            1.2
          </span>
          Type of Task
        </h2>
        <p className="mb-3 mt-1 text-xs text-slate-500">
          Pilih kategori tugas yang paling merepresentasikan fokus persoalan pada kasus.
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {TASKS.map(([name, sub, desc]) => {
            const selected = state.task === name;
            return (
              <button
                key={name}
                onClick={() => setState((prev) => ({ ...prev, task: name }))}
                className={`flex flex-col items-start rounded-lg border p-3.5 text-left transition ${
                  selected
                    ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/40"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</span>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{sub}</span>
                <span className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 1.3 Task Method */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            1.3
          </span>
          Task Method
        </h2>
        <p className="mb-3 mt-1 text-xs text-slate-500">
          {state.task
            ? `Metode berlabel Rekomendasi sesuai untuk ${state.task}. Pilihan ini menentukan template di Step 3.`
            : "Pilih tipe task terlebih dahulu untuk melihat metode yang direkomendasikan."}
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {METHODS.map(([name, desc]) => {
            const selected = state.method === name;
            const isRec = recommendedMethods.includes(name);
            return (
              <button
                key={name}
                onClick={() => setState((prev) => ({ ...prev, method: name }))}
                className={`flex flex-col items-start rounded-lg border p-3.5 text-left transition ${
                  selected
                    ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/40"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</span>
                  {isRec && (
                    <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      Rekomendasi
                    </span>
                  )}
                </div>
                <span className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{desc}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}