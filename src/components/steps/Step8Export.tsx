"use client";

import { useState, useRef } from "react";
import { FileText, Download, Plus, X, Upload } from "lucide-react";
import { PblState } from "@/types/pbl";
import { STEP_NAMES } from "@/constants/pbl";
import { buildReportBlocks, exportReportFile } from "@/utils/exportReport";
import { getCurrentDiagramSVG } from "@/utils/diagrams";
import { getTheoryDiagramSVG } from "@/utils/theoryDiagrams";
import { TRISAKTI_LOGO_PATH } from "@/utils/trisaktiLogo";

interface Props {
  state: PblState;
  setState: React.Dispatch<React.SetStateAction<PblState>>;
  isStepDone: (step: number) => boolean;
  showToast: (msg: string) => void;
}

export function Step8Export({ state, setState, isStepDone, showToast }: Props) {
  const [exporting, setExporting] = useState(false);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const incomplete = [1, 2, 3, 4, 5, 6, 7].filter((n) => !isStepDone(n));

  const handleExport = async (format: "docx" | "pdf") => {
    setExporting(true);
    try {
      await exportReportFile(state, format);
      showToast(`Dokumen .${format} berhasil diunduh.`);
    } catch (_) {
      showToast("Gagal mengekspor dokumen.");
    } finally {
      setExporting(false);
    }
  };

  const handleBackupDownload = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pbl-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== "object" || !("words" in parsed)) throw new Error();
        setState((prev) => ({ ...prev, ...parsed, step: 1 }));
        showToast("Data cadangan berhasil dipulihkan.");
      } catch (_) {
        showToast("Berkas cadangan tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  const diagramSVG = getCurrentDiagramSVG(state);

  return (
    <div className="space-y-4">
      {/* 8.1 Cover */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            8.1
          </span>
          Informasi Sampul (Cover)
        </h2>

        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              ["title", "Judul Laporan"],
              ["course", "Mata Kuliah"],
              ["lect", "Dosen Pengampu"],
              ["year", "Tahun Akademik"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</span>
              <input
                type="text"
                value={state.cover[key]}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    cover: { ...prev.cover, [key]: e.target.value },
                  }))
                }
                placeholder={label}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
          ))}
        </div>

        <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
          Anggota Kelompok
        </span>
        <div className="space-y-2">
          {state.cover.members.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={m}
                onChange={(e) =>
                  setState((prev) => {
                    const members = [...prev.cover.members];
                    members[i] = e.target.value;
                    return { ...prev, cover: { ...prev.cover, members } };
                  })
                }
                placeholder="Nama Lengkap (NIM)"
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              />
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    cover: {
                      ...prev.cover,
                      members: prev.cover.members.filter((_, idx) => idx !== i),
                    },
                  }))
                }
                className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setState((prev) => ({
              ...prev,
              cover: { ...prev.cover, members: [...prev.cover.members, ""] },
            }))
          }
          className="mt-2 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <Plus className="h-3 w-3" /> Tambah Anggota
        </button>
      </section>

      {/* 8.2 Preview & Export */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            8.2
          </span>
          Pratinjau & Unduh Dokumen
        </h2>
        <p className="mb-4 mt-1 text-xs text-slate-500">
          {incomplete.length
            ? `Catatan: Langkah berikut masih kosong — ${incomplete.map((n) => STEP_NAMES[n - 1]).join(", ")}.`
            : "Seluruh bagian laporan telah lengkap dan siap diunduh."}
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          <button
            disabled={exporting}
            onClick={() => handleExport("docx")}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-blue-800 disabled:opacity-50"
          >
            <FileText className="h-4 w-4" /> Unduh Word (.docx)
          </button>
          <button
            disabled={exporting}
            onClick={() => handleExport("pdf")}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            <Download className="h-4 w-4" /> Unduh PDF (.pdf)
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <button
            onClick={handleBackupDownload}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Ekspor Cadangan (.json)
          </button>
          <button
            onClick={() => backupInputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Upload className="h-3 w-3" /> Pulihkan Cadangan
          </button>
          <input ref={backupInputRef} type="file" accept=".json,.txt" onChange={handleBackupRestore} hidden />
        </div>

        {/* Document Preview — Simulasi Lembar Kerja A4 Microsoft Word (210mm x 297mm, Margin 2.54cm) */}
        <div className="overflow-x-auto rounded-xl border border-slate-300 bg-slate-200/90 p-4 sm:p-8 dark:border-slate-700 dark:bg-slate-950">
          <div
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
            className="mx-auto flex w-[210mm] flex-col gap-6 text-[16px] leading-[1.38] text-slate-900"
          >
            {/* LEMBAR 1: HALAMAN SAMPUL (A4: 210mm x 297mm, Margin 25.4mm) */}
            <div className="flex min-h-[297mm] w-[210mm] flex-col justify-between bg-white p-[25.4mm] text-center shadow-md ring-1 ring-slate-300">
              <div>
                <p className="text-[16pt] font-bold tracking-wide">REPORT</p>
                <p className="mt-1 text-[14pt] font-bold uppercase">
                  {state.cover.title || "PROBLEM BASED LEARNING"}
                </p>

                <div className="mt-8 text-[12pt] font-bold">
                  <p>Lecturer:</p>
                  <p className="mt-1">{state.cover.lect || "-"}</p>
                </div>

                <div className="mx-auto my-8 flex justify-center">
                  <img
                    src={TRISAKTI_LOGO_PATH}
                    alt="Logo Universitas Trisakti"
                    className="h-44 w-auto object-contain"
                  />
                </div>

                <div className="space-y-1 text-[12pt] font-bold">
                  {state.cover.members.filter(Boolean).map((m, i) => (
                    <p key={i}>{i === 0 ? `By: ${m}` : m}</p>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-[12pt] font-bold uppercase">
                {(state.cover.course ||
                  "MANAGEMENT\nFACULTY OF ECONOMICS AND BUSINESS\nTRISAKTI UNIVERSITY\nJAKARTA")
                  .split(/\n|—|,/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                {state.cover.year && <p>{state.cover.year}</p>}
              </div>
            </div>

            {/* LEMBAR 2 DST: ISI LAPORAN (A4: 210mm, Margin 25.4mm) */}
            <div className="min-h-[297mm] w-[210mm] bg-white p-[25.4mm] text-justify shadow-md ring-1 ring-slate-300">
              {buildReportBlocks(state)
                .slice(5)
                .map(([type, content], idx) => {
                  if (type === "tbl" && Array.isArray(content)) {
                    return (
                      <table key={idx} className="my-3 w-full table-fixed border-collapse text-left text-[10.5pt] leading-snug">
                        <thead>
                          <tr style={{ backgroundColor: state.color }} className="text-white">
                            {content[0].map((cell, cIdx) => (
                              <th key={cIdx} className="border border-slate-300 px-2.5 py-2 font-bold">
                                {cell}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {content.slice(1).map((row, rIdx) => (
                            <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-slate-50" : "bg-white"}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="border border-slate-300 px-2.5 py-2 align-top break-words">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  }
                  if (type === "imgMain") {
                    return diagramSVG ? (
                      <div
                        key={idx}
                        className="my-3 overflow-hidden border border-slate-200 bg-white"
                        dangerouslySetInnerHTML={{ __html: diagramSVG }}
                      />
                    ) : null;
                  }
                  if (type === "imgTheory" && typeof content === "object") {
                    const svg = getTheoryDiagramSVG(content);
                    return svg ? (
                      <div
                        key={idx}
                        className="my-3 overflow-hidden border border-slate-200 bg-white"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                    ) : null;
                  }
                  if (type === "caption") {
                    return (
                      <p key={idx} className="mb-4 text-center text-[10.5pt] font-bold italic text-teal-700">
                        {String(content)}
                      </p>
                    );
                  }
                  if (type === "tblTitle") {
                    return (
                      <p key={idx} style={{ color: state.color }} className="mt-4 text-left text-[11pt] font-bold italic">
                        {String(content)}
                      </p>
                    );
                  }
                  if (type === "h" || type === "t") {
                    return (
                      <h3
                        key={idx}
                        style={{ color: state.color, borderColor: state.color }}
                        className="mb-2.5 mt-6 border-b-2 pb-1 text-left text-[14pt] font-bold first:mt-0"
                      >
                        {String(content)}
                      </h3>
                    );
                  }
                  if (type === "h3") {
                    return (
                      <h4 key={idx} className="mb-2 mt-4 text-left text-[12.5pt] font-bold text-teal-700">
                        {String(content)}
                      </h4>
                    );
                  }
                  if (type === "kv" && Array.isArray(content)) {
                    return (
                      <p key={idx} className="mb-2.5 whitespace-pre-wrap">
                        <strong style={{ color: state.color }}>{content[0]}: </strong>
                        <span>{content[1]}</span>
                      </p>
                    );
                  }
                  return content ? (
                    <p key={idx} className="mb-2.5 whitespace-pre-wrap">
                      {String(content)}
                    </p>
                  ) : null;
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}