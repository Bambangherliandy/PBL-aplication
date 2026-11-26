"use client";

import { Plus, X } from "lucide-react";
import { PblState } from "@/types/pbl";
import { TableAndDiagramEditor } from "@/components/TableAndDiagramEditor";

interface Props {
  state: PblState;
  setState: React.Dispatch<React.SetStateAction<PblState>>;
}

export function Step6Theory({ state, setState }: Props) {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            6
          </span>
          Gather the Data Needed (Teori, Diagram & Tabel Data)
        </h2>
        <textarea
          rows={2}
          value={state.step6Intro || ""}
          onChange={(e) => setState((prev) => ({ ...prev, step6Intro: e.target.value }))}
          placeholder="Paragraf pengantar Step 6 (opsional)..."
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-950"
        />
      </section>

      {state.los.map((lo, i) => (
        <section
          key={i}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300">
            6.{i + 1} {lo.t || "(Belum ditulis)"}
          </h3>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Uraian Teori & Konsep
            </span>
            <textarea
              rows={3}
              value={lo.theory}
              onChange={(e) =>
                setState((prev) => {
                  const los = [...prev.los];
                  los[i] = { ...los[i], theory: e.target.value };
                  return { ...prev, los };
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Catatan Tambahan / Analisis Kasus (Opsional)
            </span>
            <textarea
              rows={2}
              value={lo.applied}
              onChange={(e) =>
                setState((prev) => {
                  const los = [...prev.los];
                  los[i] = { ...los[i], applied: e.target.value };
                  return { ...prev, los };
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>

          <TableAndDiagramEditor
            diagram={lo.diagram}
            onChangeDiagram={(diagram) =>
              setState((prev) => {
                const los = [...prev.los];
                los[i] = { ...los[i], diagram };
                return { ...prev, los };
              })
            }
            tables={lo.tables || []}
            onChangeTables={(tables) =>
              setState((prev) => {
                const los = [...prev.los];
                los[i] = { ...los[i], tables };
                return { ...prev, los };
              })
            }
          />
        </section>
      ))}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Refs
          </span>
          Daftar Pustaka (References)
        </h2>
        <div className="space-y-2">
          {state.refs.map((ref, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={ref}
                onChange={(e) =>
                  setState((prev) => {
                    const refs = [...prev.refs];
                    refs[i] = e.target.value;
                    return { ...prev, refs };
                  })
                }
                placeholder="Author. (Year). Title. Publisher"
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              />
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, refs: prev.refs.filter((_, idx) => idx !== i) }))
                }
                className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setState((prev) => ({ ...prev, refs: [...prev.refs, ""] }))}
          className="mt-2.5 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <Plus className="h-3 w-3" /> Tambah Referensi
        </button>
      </section>
    </div>
  );
}