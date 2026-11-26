"use client";

import { useRef } from "react";
import { Plus, X, LayoutGrid, GripVertical } from "lucide-react";
import { PblState } from "@/types/pbl";
import { METHODS, FISHBONE_CATS, TEMPLATES } from "@/constants/pbl";
import { buildFishboneSVG } from "@/utils/diagrams";

interface Props {
  state: PblState;
  setState: React.Dispatch<React.SetStateAction<PblState>>;
}

export function Step3Analysis({ state, setState }: Props) {
  const method = state.method || "Brainstorm";
  const boardRef = useRef<HTMLDivElement>(null);

  const updateListItem = (key: string, idx: number, val: string) => {
    setState((prev) => {
      const arr = [...(prev.lists[key] || [""])];
      arr[idx] = val;
      return { ...prev, lists: { ...prev.lists, [key]: arr } };
    });
  };

  const addListItem = (key: string) => {
    setState((prev) => ({
      ...prev,
      lists: { ...prev.lists, [key]: [...(prev.lists[key] || []), ""] },
    }));
  };

  const removeListItem = (key: string, idx: number) => {
    setState((prev) => ({
      ...prev,
      lists: { ...prev.lists, [key]: (prev.lists[key] || []).filter((_, i) => i !== idx) },
    }));
  };

  const renderListEditor = (key: string) => {
    const items = state.lists[key] || [""];
    return (
      <div className="space-y-1.5">
        {items.map((val, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <input
              type="text"
              value={val}
              onChange={(e) => updateListItem(key, idx, e.target.value)}
              placeholder="Tulis poin di sini..."
              className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              onClick={() => removeListItem(key, idx)}
              className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          onClick={() => addListItem(key)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <Plus className="h-3 w-3" /> Tambah poin
        </button>
      </div>
    );
  };

  // Mind Map Actions
  const addMindMapNode = (parentId: number) => {
    const parent = state.mm.find((n) => n.id === parentId) || { x: 50, y: 50 };
    const angle = Math.random() * Math.PI * 2;
    const dist = parentId ? 16 : 30;
    const newNode = {
      id: Date.now(),
      t: "",
      p: parentId,
      x: Math.max(8, Math.min(92, parent.x + dist * 1.35 * Math.cos(angle))),
      y: Math.max(10, Math.min(90, parent.y + dist * Math.sin(angle))),
    };
    setState((prev) => ({ ...prev, mm: [...prev.mm, newNode] }));
  };

  const removeMindMapNode = (id: number) => {
    const toRemove = new Set([id]);
    let expanded = true;
    while (expanded) {
      expanded = false;
      state.mm.forEach((n) => {
        if (!toRemove.has(n.id) && toRemove.has(n.p)) {
          toRemove.add(n.id);
          expanded = true;
        }
      });
    }
    setState((prev) => ({ ...prev, mm: prev.mm.filter((n) => !toRemove.has(n.id)) }));
  };

  const tidyMindMap = () => {
    const roots = state.mm.filter((n) => !n.p);
    const updated = state.mm.map((n) => ({ ...n }));
    const place = (node: (typeof updated)[0], x: number, y: number, angle: number) => {
      node.x = Math.max(8, Math.min(92, x));
      node.y = Math.max(10, Math.min(90, y));
      const children = updated.filter((c) => c.p === node.id);
      children.forEach((child, idx) => {
        const b = angle + (idx - (children.length - 1) / 2) * 0.65;
        place(child, node.x + 19 * Math.cos(b), node.y + 17 * Math.sin(b), angle);
      });
    };
    roots.forEach((root, idx) => {
      const a = (idx * 2 * Math.PI) / roots.length - Math.PI / 2;
      place(root, 50 + 30 * Math.cos(a), 50 + 30 * Math.sin(a), a);
    });
    setState((prev) => ({ ...prev, mm: updated }));
  };

  const handleNodeDrag = (e: React.PointerEvent, id: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const x = Math.max(5, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(6, Math.min(94, ((ev.clientY - rect.top) / rect.height) * 100));
      setState((prev) => ({
        ...prev,
        mm: prev.mm.map((n) => (n.id === id ? { ...n, x, y } : n)),
      }));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleIdeaDrag = (e: React.PointerEvent, idx: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const x = Math.max(2, Math.min(76, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(2, Math.min(84, ((ev.clientY - rect.top) / rect.height) * 100));
      setState((prev) => {
        const ideas = [...prev.ideas];
        ideas[idx] = { ...ideas[idx], x, y };
        return { ...prev, ideas };
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            3.1
          </span>
          {method}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Template:</span>
          <select
            value={method}
            onChange={(e) => setState((prev) => ({ ...prev, method: e.target.value }))}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium dark:border-slate-700 dark:bg-slate-800"
          >
            {METHODS.map(([name]) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MIND MAP */}
      {method === "Mind Map" && (
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => addMindMapNode(0)}
              className="inline-flex items-center gap-1 rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
            >
              <Plus className="h-3.5 w-3.5" /> Cabang Utama
            </button>
            <button
              onClick={tidyMindMap}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Rapikan Tata Letak
            </button>
          </div>

          <div
            ref={boardRef}
            className="relative h-[460px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] dark:border-slate-800 dark:bg-slate-950 dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]"
          >
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {state.mm.map((n) => {
                const parent = state.mm.find((z) => z.id === n.p) || { x: 50, y: 50 };
                return (
                  <line
                    key={n.id}
                    x1={`${parent.x}%`}
                    y1={`${parent.y}%`}
                    x2={`${n.x}%`}
                    y2={`${n.y}%`}
                    stroke="#2563eb"
                    strokeWidth="1.75"
                    strokeOpacity="0.65"
                  />
                );
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-10 max-w-[175px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-center text-xs font-semibold text-white shadow-md dark:bg-slate-100 dark:text-slate-900">
              {state.problem || "Main Problem"}
            </div>

            {state.mm.map((node) => (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute z-20 flex max-w-[220px] -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-lg border border-blue-600 bg-white px-2 py-1 text-xs shadow-sm dark:border-blue-400 dark:bg-slate-900"
              >
                <span
                  onPointerDown={(e) => handleNodeDrag(e, node.id)}
                  className="cursor-grab touch-none text-slate-400 hover:text-blue-600"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  value={node.t}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      mm: prev.mm.map((n) => (n.id === node.id ? { ...n, t: e.target.value } : n)),
                    }))
                  }
                  placeholder="Cabang..."
                  className="w-28 min-w-0 bg-transparent text-xs font-medium focus:outline-none"
                />
                <button
                  onClick={() => addMindMapNode(node.id)}
                  title="Tambah sub-cabang"
                  className="rounded p-0.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => removeMindMapNode(node.id)}
                  title="Hapus"
                  className="rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FISHBONE */}
      {method === "Fishbone" && (
        <div className="space-y-4">
          <div
            className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            dangerouslySetInnerHTML={{ __html: buildFishboneSVG(state) }}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FISHBONE_CATS.map((cat) => (
              <div
                key={cat}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-2 text-xs font-semibold text-blue-700 dark:text-blue-400">{cat}</div>
                {renderListEditor(cat)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRID TEMPLATES (SWOT, PESTEL, etc.) */}
      {TEMPLATES[method] && (
        <div
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
          style={{
            gridTemplateColumns: TEMPLATES[method].cols === 1 ? "1fr" : undefined,
          }}
        >
          {TEMPLATES[method].boxes.map((box) => (
            <div
              key={box.k}
              style={{ borderTopColor: box.c }}
              className="rounded-lg border border-t-4 border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{box.t}</div>
              <p className="mb-2.5 text-xs text-slate-500">{box.h}</p>
              {renderListEditor(box.k)}
            </div>
          ))}
        </div>
      )}

      {/* 5 WHY */}
      {method === "5 WHY" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-slate-900 dark:border-blue-900 dark:bg-blue-950/50 dark:text-slate-100">
            {state.problem || "Main Problem"}
          </div>
          {state.why.map((val, i) => (
            <label key={i} className="block space-y-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Why {i + 1}?</span>
              <input
                type="text"
                value={val}
                onChange={(e) =>
                  setState((prev) => {
                    const why = [...prev.why];
                    why[i] = e.target.value;
                    return { ...prev, why };
                  })
                }
                placeholder="Karena..."
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
          ))}
        </div>
      )}

      {/* BRAINSTORM STICKY BOARD */}
      {method === "Brainstorm" && (
        <div>
          <div className="mb-3">
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  ideas: [
                    ...prev.ideas,
                    { t: "", x: 8 + Math.random() * 55, y: 10 + Math.random() * 60 },
                  ],
                }))
              }
              className="inline-flex items-center gap-1 rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Catatan Ide
            </button>
          </div>
          <div
            ref={boardRef}
            className="relative h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] dark:border-slate-800 dark:bg-slate-950"
          >
            {state.ideas.map((idea, idx) => (
              <div
                key={idx}
                style={{ left: `${idea.x}%`, top: `${idea.y}%` }}
                className="absolute flex max-w-[210px] items-start gap-1.5 rounded-lg border border-amber-300 bg-amber-100 p-2 text-xs text-slate-900 shadow-xs"
              >
                <span
                  onPointerDown={(e) => handleIdeaDrag(e, idx)}
                  className="mt-0.5 cursor-grab touch-none text-slate-500"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
                <textarea
                  rows={2}
                  value={idea.t}
                  onChange={(e) =>
                    setState((prev) => {
                      const ideas = [...prev.ideas];
                      ideas[idx] = { ...ideas[idx], t: e.target.value };
                      return { ...prev, ideas };
                    })
                  }
                  placeholder="Tulis ide..."
                  className="w-36 resize-none bg-transparent text-xs focus:outline-none"
                />
                <button
                  onClick={() =>
                    setState((prev) => ({ ...prev, ideas: prev.ideas.filter((_, i) => i !== idx) }))
                  }
                  className="text-slate-500 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}