"use client";

import { useState } from "react";
import { Plus, Search, ArrowUp, ArrowDown, X } from "lucide-react";
import { PblState } from "@/types/pbl";

interface Props {
  state: PblState;
  setState: React.Dispatch<React.SetStateAction<PblState>>;
  showToast: (msg: string) => void;
}

export function Step5Objectives({ state, setState, showToast }: Props) {
  const [hits, setHits] = useState<Record<number, string[]>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (/\.pdf$/i.test(file.name)) {
      showToast("File PDF belum didukung langsung. Salin teks dari PDF lalu tempel di kolom referensi.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setState((prev) => ({ ...prev, src: String(reader.result) }));
    reader.readAsText(file);
  };

  const searchQuotes = (idx: number) => {
    const lo = state.los[idx];
    const source = state.src.slice(0, 20000);
    if (!lo?.t.trim() || !source.trim()) {
      setHits((prev) => ({
        ...prev,
        [idx]: ["Lengkapi teks Learning Objective dan sumber referensi terlebih dahulu."],
      }));
      return;
    }
    const keywords = lo.t.toLowerCase().match(/[a-z]{4,}/g) || [];
    const sentences = source.match(/[^.!?\n]+[.!?]/g) || [];
    const matched = sentences
      .map((s) => [s.trim(), keywords.filter((kw) => s.toLowerCase().includes(kw)).length] as const)
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sentence]) => sentence);

    setHits((prev) => ({
      ...prev,
      [idx]: matched.length ? matched : ["Tidak ditemukan kutipan yang relevan pada teks referensi."],
    }));
  };

  const moveLO = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= state.los.length) return;
    setState((prev) => {
      const los = [...prev.los];
      [los[idx], los[target]] = [los[target], los[idx]];
      return { ...prev, los };
    });
    setHits({});
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            5.1
          </span>
          Sumber Referensi Teks
        </h2>
        <p className="mb-3 mt-1 text-xs text-slate-500">
          Tempel materi bacaan atau unggah berkas .txt/.md untuk pencarian kutipan otomatis.
        </p>
        <input
          type="file"
          accept=".txt,.md,.pdf"
          onChange={handleFileUpload}
          className="mb-3 block text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        <textarea
          rows={5}
          value={state.src}
          onChange={(e) => setState((prev) => ({ ...prev, src: e.target.value }))}
          placeholder="Tempel teks referensi atau bab buku di sini..."
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-950"
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                5.2
              </span>
              Learning Objectives (LO)
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Daftar tujuan pembelajaran yang harus dijawab oleh kelompok.
            </p>
          </div>
          <button
            onClick={() =>
              setState((prev) => ({
                ...prev,
                los: [...prev.los, { t: "", theory: "", applied: "", synth: "", sum: "" }],
              }))
            }
            className="inline-flex items-center gap-1 rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah LO
          </button>
        </div>

        <div className="space-y-3">
          {state.los.map((lo, i) => (
            <div
              key={i}
              className="space-y-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <input
                  type="text"
                  value={lo.t}
                  onChange={(e) =>
                    setState((prev) => {
                      const los = [...prev.los];
                      los[i] = { ...los[i], t: e.target.value };
                      return { ...prev, los };
                    })
                  }
                  placeholder="Mahasiswa mampu menjelaskan / menganalisis..."
                  className="min-w-[200px] flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                />
                <button
                  onClick={() => searchQuotes(i)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Search className="h-3 w-3" /> Cari Kutipan
                </button>
                <button onClick={() => moveLO(i, -1)} className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => moveLO(i, 1)} className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() =>
                    setState((prev) => ({ ...prev, los: prev.los.filter((_, idx) => idx !== i) }))
                  }
                  className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {(hits[i] || []).map((quote, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between gap-2 rounded-md border border-blue-200 bg-white p-2.5 text-xs dark:border-blue-900 dark:bg-slate-900"
                >
                  <span className="text-slate-700 dark:text-slate-300">{quote}</span>
                  <button
                    onClick={() => {
                      setState((prev) => {
                        const los = [...prev.los];
                        los[i] = {
                          ...los[i],
                          theory: (los[i].theory ? los[i].theory + "\n" : "") + quote,
                        };
                        return { ...prev, los };
                      });
                      showToast("Kutipan disimpan ke bagian Teori (Step 6).");
                    }}
                    className="shrink-0 rounded bg-blue-50 px-2.5 py-1 font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                  >
                    Simpan ke Step 6
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}