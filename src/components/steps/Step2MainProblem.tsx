"use client";

import { PblState } from "@/types/pbl";
import { ACCENT_COLORS } from "@/constants/pbl";

interface Props {
  state: PblState;
  setState: React.Dispatch<React.SetStateAction<PblState>>;
}

export function Step2MainProblem({ state, setState }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          2.1
        </span>
        Main Problem Statement
      </h2>
      <p className="mb-4 mt-1 text-xs text-slate-500">
        Rumuskan inti permasalahan kelompok dalam satu paragraf yang padat dan jelas.
      </p>

      <div
        className="overflow-hidden rounded-lg border-2"
        style={{ borderColor: state.color }}
      >
        <div className="px-3 py-2" style={{ backgroundColor: state.color }}>
          <input
            type="text"
            value={state.label}
            onChange={(e) => setState((prev) => ({ ...prev, label: e.target.value }))}
            aria-label="Judul masalah utama"
            className="w-full bg-transparent text-sm font-semibold text-white placeholder-white/70 focus:outline-none"
          />
        </div>
        <textarea
          rows={5}
          value={state.problem}
          onChange={(e) => setState((prev) => ({ ...prev, problem: e.target.value }))}
          placeholder="The main problem centers on how..."
          className="w-full bg-white p-3.5 text-sm leading-relaxed text-slate-900 focus:outline-none dark:bg-slate-950 dark:text-slate-100"
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-slate-500">Warna aksen:</span>
        {ACCENT_COLORS.map((hex) => (
          <button
            key={hex}
            onClick={() => setState((prev) => ({ ...prev, color: hex }))}
            style={{ backgroundColor: hex }}
            aria-label={`Pilih warna ${hex}`}
            className={`h-6 w-6 rounded-full border-2 border-white shadow-xs transition hover:scale-110 dark:border-slate-900 ${
              state.color === hex ? "ring-2 ring-slate-400" : ""
            }`}
          />
        ))}
      </div>
    </section>
  );
}