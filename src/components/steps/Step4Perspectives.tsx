"use client";

import { Plus, Download, X, ArrowUpRight } from "lucide-react";
import { PblState } from "@/types/pbl";
import { LENSES } from "@/constants/pbl";

interface Props {
  state: PblState;
  setState: React.Dispatch<React.SetStateAction<PblState>>;
  showToast: (msg: string) => void;
}

export function Step4Perspectives({ state, setState, showToast }: Props) {
  const importFromStep3 = () => {
    const candidates = [
      ...Object.values(state.lists).flat(),
      ...state.why,
      ...state.ideas.map((d) => d.t),
      ...state.mm.map((m) => m.t),
    ]
      .map((x) => x.trim())
      .filter((x) => x && !state.subs.some((s) => s.t === x));

    if (!candidates.length) {
      showToast("Tidak ada poin baru untuk diimpor dari Step 3.");
      return;
    }

    setState((prev) => ({
      ...prev,
      subs: [...prev.subs, ...candidates.map((t) => ({ t, lens: {}, q: [""] }))],
    }));
    showToast(`${candidates.length} sub-masalah berhasil diimpor.`);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            4
          </span>
          Sub-Masalah & Multi-Perspektif
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Uraikan setiap sub-masalah dari berbagai sudut pandang, lalu konversi pertanyaan kritis menjadi Learning Objective.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={importFromStep3}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
        >
          <Download className="h-3.5 w-3.5" /> Impor Poin dari Step 3
        </button>
        <button
          onClick={() =>
            setState((prev) => ({
              ...prev,
              subs: [...prev.subs, { t: "", lens: {}, q: [""] }],
            }))
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <Plus className="h-3.5 w-3.5" /> Tambah Sub-Masalah
        </button>
      </div>

      <div className="space-y-4">
        {state.subs.map((sub, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={sub.t}
                onChange={(e) =>
                  setState((prev) => {
                    const subs = [...prev.subs];
                    subs[i] = { ...subs[i], t: e.target.value };
                    return { ...prev, subs };
                  })
                }
                placeholder="Judul sub-masalah..."
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, subs: prev.subs.filter((_, idx) => idx !== i) }))
                }
                className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {LENSES.map((lens) => (
                <label
                  key={lens}
                  className="flex flex-col gap-1 border-l-2 border-blue-600 pl-2.5"
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{lens}</span>
                  <textarea
                    rows={2}
                    value={sub.lens[lens] || ""}
                    onChange={(e) =>
                      setState((prev) => {
                        const subs = [...prev.subs];
                        subs[i] = {
                          ...subs[i],
                          lens: { ...subs[i].lens, [lens]: e.target.value },
                        };
                        return { ...prev, subs };
                      })
                    }
                    placeholder={`Analisis perspektif ${lens.toLowerCase()}...`}
                    className="rounded border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                  />
                </label>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pertanyaan / Kesenjangan Pengetahuan
              </span>
              {sub.q.map((q, j) => (
                <div key={j} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) =>
                      setState((prev) => {
                        const subs = [...prev.subs];
                        const qs = [...subs[i].q];
                        qs[j] = e.target.value;
                        subs[i] = { ...subs[i], q: qs };
                        return { ...prev, subs };
                      })
                    }
                    placeholder="Pertanyaan yang perlu dicari jawabannya..."
                    className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                  />
                  <button
                    onClick={() => {
                      if (!q.trim()) return;
                      setState((prev) => ({
                        ...prev,
                        los: [...prev.los, { t: q.trim(), theory: "", applied: "", synth: "", sum: "" }],
                      }));
                      showToast("Ditambahkan ke Learning Objectives (Step 5).");
                    }}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  >
                    Jadikan LO <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setState((prev) => {
                    const subs = [...prev.subs];
                    subs[i] = { ...subs[i], q: [...subs[i].q, ""] };
                    return { ...prev, subs };
                  })
                }
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Plus className="h-3 w-3" /> Pertanyaan
              </button>
            </div>
          </div>
        ))}
        {!state.subs.length && (
          <p className="text-xs text-slate-500">
            Belum ada sub-masalah. Klik &ldquo;Impor Poin dari Step 3&rdquo; untuk menarik hasil analisis sebelumnya.
          </p>
        )}
      </div>
    </section>
  );
}