"use client";

import { Plus, X } from "lucide-react";
import { PblState } from "@/types/pbl";
import { TableAndDiagramEditor } from "@/components/TableAndDiagramEditor";

interface Props {
  state: PblState;
  setState: React.Dispatch<React.SetStateAction<PblState>>;
}

export function Step7Synthesis({ state, setState }: Props) {
  const sections = state.synthSections || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-base font-bold">Step 7: Synthesize and Solve the Problem</h2>
          <p className="text-xs text-slate-500">
            Susun sub-bagian sintesis (Integrated Analysis, Proposed Solution Flowchart, RACI, Roadmap, KPI, Risks).
          </p>
        </div>
        <button
          onClick={() =>
            setState((prev) => ({
              ...prev,
              synthSections: [
                ...(prev.synthSections || []),
                { title: `7.${sections.length + 1} Sub-bagian Baru`, body: "", tables: [] },
              ],
            }))
          }
          className="inline-flex items-center gap-1 rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
        >
          <Plus className="h-3.5 w-3.5" /> Tambah Sub-bagian 7.x
        </button>
      </div>

      {sections.map((sec, i) => (
        <section
          key={i}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={sec.title}
              onChange={(e) =>
                setState((prev) => {
                  const next = [...(prev.synthSections || [])];
                  next[i] = { ...next[i], title: e.target.value };
                  return { ...prev, synthSections: next };
                })
              }
              className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-blue-800 dark:border-slate-700 dark:bg-slate-950 dark:text-blue-300"
            />
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  synthSections: (prev.synthSections || []).filter((_, idx) => idx !== i),
                }))
              }
              className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <textarea
            rows={4}
            value={sec.body}
            onChange={(e) =>
              setState((prev) => {
                const next = [...(prev.synthSections || [])];
                next[i] = { ...next[i], body: e.target.value };
                return { ...prev, synthSections: next };
              })
            }
            placeholder="Uraian analisis sintesis..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />

          <TableAndDiagramEditor
            diagram={sec.diagram}
            onChangeDiagram={(diagram) =>
              setState((prev) => {
                const next = [...(prev.synthSections || [])];
                next[i] = { ...next[i], diagram };
                return { ...prev, synthSections: next };
              })
            }
            tables={sec.tables || []}
            onChangeTables={(tables) =>
              setState((prev) => {
                const next = [...(prev.synthSections || [])];
                next[i] = { ...next[i], tables };
                return { ...prev, synthSections: next };
              })
            }
          />

          <input
            type="text"
            value={sec.note || ""}
            onChange={(e) =>
              setState((prev) => {
                const next = [...(prev.synthSections || [])];
                next[i] = { ...next[i], note: e.target.value };
                return { ...prev, synthSections: next };
              })
            }
            placeholder="Catatan kaki di bawah tabel/bagian (opsional, misal: R = Responsible...)"
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-950"
          />
        </section>
      ))}
    </div>
  );
}