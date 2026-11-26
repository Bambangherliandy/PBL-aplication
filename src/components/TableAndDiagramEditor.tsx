"use client";

import { Plus, Trash2, Image as ImageIcon, Table as TableIcon } from "lucide-react";
import { ReportTable, TheoryDiagramSpec, TheoryDiagramType } from "@/types/pbl";
import { getTheoryDiagramSVG } from "@/utils/theoryDiagrams";

interface Props {
  diagram?: TheoryDiagramSpec;
  onChangeDiagram: (next?: TheoryDiagramSpec) => void;
  tables: ReportTable[];
  onChangeTables: (next: ReportTable[]) => void;
}

const DEFAULT_SPECS: Record<Exclude<TheoryDiagramType, "none">, TheoryDiagramSpec> = {
  addie: {
    type: "addie",
    caption: "Figure. ADDIE Model Applied",
    stages: [
      { title: "Analysis", desc: "Identify competency and skill gaps." },
      { title: "Design", desc: "Set learning objectives and modules." },
      { title: "Development", desc: "Prepare SOPs, checklists, and materials." },
      { title: "Implementation", desc: "Run orientation and daily application." },
      { title: "Evaluation", desc: "Monthly reviews and track compliance." },
    ],
    footerNote: "Evaluation results feed back into the next analysis cycle (continuous improvement)",
  },
  iceberg: {
    type: "iceberg",
    caption: "Figure. Competency Iceberg Model",
    aboveWater: {
      label: "KNOWLEDGE & SKILLS",
      callout: "Visible technical skills and knowledge.",
    },
    belowWater: [
      { label: "SELF-CONCEPT (attitudes, values)", callout: "Values and professional responsibility." },
      { label: "TRAITS (consistent ways of responding)", callout: "Judgment and communication under pressure." },
      { label: "MOTIVES (drives behind action)", callout: "Underlying motivation behind decisions." },
    ],
  },
  shannon: {
    type: "shannon",
    caption: "Figure. Shannon-Weaver Communication Model",
    topNote: "NOISE: Unclear instructions or assumptions distorting the message",
    stages: [
      { title: "Information source", desc: "Technical finding or core message." },
      { title: "Transmitter", desc: "Encodes finding into proposal/question." },
      { title: "Channel", desc: "Communication medium used." },
      { title: "Receiver", desc: "Decodes the incoming message." },
      { title: "Destination", desc: "Final decision or action taken." },
    ],
    footerNote: "FEEDBACK: Formal loop to confirm understanding",
  },
  flowchart: {
    type: "flowchart",
    caption: "Figure. Decision-Making & Escalation Process",
    flowSteps: {
      start: "Customer submits request (recorded in writing)",
      inspect: "Technician inspects and performs assessment",
      decision1: "Safety concern identified?",
      noBranch: "Proceed per standard SOP",
      yesStep1: "Document findings with evidence and alternatives",
      yesStep2: "Supervisor technical and safety review",
      yesStep3: "Customer consultation and informed consent",
      decision2: "Customer accepts safe solution?",
      rejectBox: "Manager decides: decline unsafe work or apply policy",
      rejectClose: "Case documented and closed",
      finalCheck: "Quality check and function test",
      end: "Delivery, record keeping and feedback",
    },
  },
};

export function TableAndDiagramEditor({ diagram, onChangeDiagram, tables, onChangeTables }: Props) {
  const currentType: TheoryDiagramType = diagram?.type || "none";
  const svgPreview = getTheoryDiagramSVG(diagram);

  const handleSelectType = (type: TheoryDiagramType) => {
    if (type === "none") return onChangeDiagram(undefined);
    onChangeDiagram(structuredClone(DEFAULT_SPECS[type]));
  };

  const addTable = () => {
    onChangeTables([
      ...tables,
      {
        title: `Table ${tables.length + 1}. Analysis Table`,
        headers: ["Element", "Observation in the case", "Data needed"],
        rows: [["", "", ""]],
      },
    ]);
  };

  return (
    <div className="space-y-4 border-t border-slate-200 pt-3 dark:border-slate-800">
      {/* DIAGRAM VISUAL BUILDER */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <ImageIcon className="h-3.5 w-3.5" /> Visual Diagram (Gambar Otomatis)
          </span>
          <select
            value={currentType}
            onChange={(e) => handleSelectType(e.target.value as TheoryDiagramType)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="none">Tanpa Diagram</option>
            <option value="addie">ADDIE Model (5 Fase)</option>
            <option value="iceberg">Competency Iceberg Model</option>
            <option value="shannon">Shannon-Weaver Communication Model</option>
            <option value="flowchart">Process & Escalation Flowchart</option>
          </select>
        </div>

        {diagram && diagram.type !== "none" && (
          <div className="mt-3 space-y-3">
            <input
              type="text"
              value={diagram.caption}
              onChange={(e) => onChangeDiagram({ ...diagram, caption: e.target.value })}
              placeholder="Judul gambar (contoh: Figure 2. ADDIE model applied...)"
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
            />

            {/* Editor ADDIE & Shannon */}
            {(diagram.type === "addie" || diagram.type === "shannon") && diagram.stages && (
              <div className="space-y-2">
                {diagram.type === "shannon" && (
                  <input
                    type="text"
                    value={diagram.topNote || ""}
                    onChange={(e) => onChangeDiagram({ ...diagram, topNote: e.target.value })}
                    placeholder="Kotak Noise di bagian atas..."
                    className="w-full rounded border border-amber-300 bg-amber-50/70 px-2.5 py-1 text-xs dark:border-amber-800 dark:bg-amber-950/40"
                  />
                )}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                  {diagram.stages.map((st, idx) => (
                    <div key={idx} className="space-y-1 rounded border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => {
                          const stages = [...diagram.stages!];
                          stages[idx] = { ...stages[idx], title: e.target.value };
                          onChangeDiagram({ ...diagram, stages });
                        }}
                        className="w-full rounded border border-slate-200 px-1.5 py-1 text-[11px] font-bold dark:border-slate-700"
                      />
                      <textarea
                        rows={3}
                        value={st.desc}
                        onChange={(e) => {
                          const stages = [...diagram.stages!];
                          stages[idx] = { ...stages[idx], desc: e.target.value };
                          onChangeDiagram({ ...diagram, stages });
                        }}
                        className="w-full rounded border border-slate-200 p-1.5 text-[11px] dark:border-slate-700"
                      />
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={diagram.footerNote || ""}
                  onChange={(e) => onChangeDiagram({ ...diagram, footerNote: e.target.value })}
                  placeholder="Teks panah umpan balik (merah putus-putus di bawah)..."
                  className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            )}

            {/* Editor Iceberg */}
            {diagram.type === "iceberg" && diagram.aboveWater && diagram.belowWater && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={diagram.aboveWater.label}
                    onChange={(e) =>
                      onChangeDiagram({
                        ...diagram,
                        aboveWater: { ...diagram.aboveWater!, label: e.target.value },
                      })
                    }
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-bold dark:border-slate-700 dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    value={diagram.aboveWater.callout}
                    onChange={(e) =>
                      onChangeDiagram({
                        ...diagram,
                        aboveWater: { ...diagram.aboveWater!, callout: e.target.value },
                      })
                    }
                    className="rounded border border-emerald-300 bg-emerald-50/70 px-2 py-1 text-xs dark:border-emerald-800 dark:bg-emerald-950/30"
                  />
                </div>
                {diagram.belowWater.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const belowWater = [...diagram.belowWater!];
                        belowWater[idx] = { ...belowWater[idx], label: e.target.value };
                        onChangeDiagram({ ...diagram, belowWater });
                      }}
                      className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      value={item.callout}
                      onChange={(e) => {
                        const belowWater = [...diagram.belowWater!];
                        belowWater[idx] = { ...belowWater[idx], callout: e.target.value };
                        onChangeDiagram({ ...diagram, belowWater });
                      }}
                      className="rounded border border-amber-300 bg-amber-50/70 px-2 py-1 text-xs dark:border-amber-800 dark:bg-amber-950/30"
                    />
                  </div>
                ))}
              </div>
            )}

            {svgPreview && (
              <div
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                dangerouslySetInnerHTML={{ __html: svgPreview }}
              />
            )}
          </div>
        )}
      </div>

      {/* DYNAMIC TABLES BUILDER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <TableIcon className="h-3.5 w-3.5" /> Tabel Terstruktur ({tables.length})
          </span>
          <button
            type="button"
            onClick={addTable}
            className="inline-flex items-center gap-1 rounded-md border border-teal-300 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300"
          >
            <Plus className="h-3 w-3" /> Tambah Tabel
          </button>
        </div>

        {tables.map((tbl, tIdx) => (
          <div key={tIdx} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tbl.title}
                onChange={(e) => {
                  const next = [...tables];
                  next[tIdx] = { ...next[tIdx], title: e.target.value };
                  onChangeTables(next);
                }}
                placeholder="Judul Tabel (contoh: Table 14. ADDIE applied to the case)"
                className="flex-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-blue-800 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300"
              />
              <button
                type="button"
                onClick={() => onChangeTables(tables.filter((_, i) => i !== tIdx))}
                className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    {tbl.headers.map((h, cIdx) => (
                      <th key={cIdx} className="border border-slate-300 p-1">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => {
                            const next = [...tables];
                            const headers = [...tbl.headers];
                            headers[cIdx] = e.target.value;
                            next[tIdx] = { ...tbl, headers };
                            onChangeTables(next);
                          }}
                          className="w-full bg-transparent px-1.5 py-0.5 font-bold text-white focus:outline-none"
                        />
                      </th>
                    ))}
                    <th className="w-8 border border-slate-300 bg-blue-950" />
                  </tr>
                </thead>
                <tbody>
                  {tbl.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="bg-white dark:bg-slate-900">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="border border-slate-300 p-1 align-top dark:border-slate-700">
                          <textarea
                            rows={2}
                            value={cell}
                            onChange={(e) => {
                              const next = [...tables];
                              const rows = tbl.rows.map((r) => [...r]);
                              rows[rIdx][cIdx] = e.target.value;
                              next[tIdx] = { ...tbl, rows };
                              onChangeTables(next);
                            }}
                            className="w-full resize-y bg-transparent p-1 text-xs focus:outline-none"
                          />
                        </td>
                      ))}
                      <td className="border border-slate-300 text-center dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...tables];
                            next[tIdx] = { ...tbl, rows: tbl.rows.filter((_, i) => i !== rIdx) };
                            onChangeTables(next);
                          }}
                          className="text-slate-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = [...tables];
                  next[tIdx] = { ...tbl, rows: [...tbl.rows, tbl.headers.map(() => "")] };
                  onChangeTables(next);
                }}
                className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              >
                + Baris
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = [...tables];
                  next[tIdx] = {
                    ...tbl,
                    headers: [...tbl.headers, `Kolom ${tbl.headers.length + 1}`],
                    rows: tbl.rows.map((r) => [...r, ""]),
                  };
                  onChangeTables(next);
                }}
                className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              >
                + Kolom
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}