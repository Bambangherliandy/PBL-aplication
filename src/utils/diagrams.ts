import { PblState } from "@/types/pbl";
import { FISHBONE_CATS, TEMPLATES } from "@/constants/pbl";

const esc = (s: string) =>
  String(s ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch] || ch));

const truncate = (str: string, max: number) =>
  esc((str || "").length > max ? (str || "").slice(0, max - 1) + "…" : str || "");

function wrapTextLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = (text || "").trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const w of words) {
    if ((current + " " + w).trim().length <= maxChars) {
      current = (current + " " + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
      if (lines.length >= maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines.map((l) => esc(l));
}

export function buildFishboneSVG(state: PblState): string {
  const palette = ["#1b365d", "#0f766e", "#b45309", "#4338ca", "#be123c", "#047857"];
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 420" font-family="Arial, sans-serif" font-size="12">
    <rect width="840" height="420" fill="#ffffff"/>
    <line x1="30" y1="210" x2="660" y2="210" stroke="#1b365d" stroke-width="3"/>
    <polygon points="660,203 674,210 660,217" fill="#1b365d"/>
    <rect x="674" y="175" width="150" height="70" rx="8" fill="#1b365d"/>
    <text x="749" y="206" fill="#ffffff" font-weight="bold" text-anchor="middle">${truncate(state.problem || "Main Problem", 20)}</text>
    <text x="749" y="224" fill="#cbd5e1" font-size="10" text-anchor="middle">(Core Effect)</text>`;

  FISHBONE_CATS.forEach((cat, i) => {
    const x = 115 + (i % 3) * 205;
    const isTop = i < 3;
    const y = isTop ? 58 : 362;
    svg += `<line x1="${x}" y1="${y}" x2="${x + 62}" y2="210" stroke="${palette[i]}" stroke-width="2.2"/>
            <rect x="${x - 48}" y="${isTop ? 24 : 368}" width="96" height="24" rx="5" fill="${palette[i]}"/>
            <text x="${x}" y="${isTop ? 40 : 384}" fill="#ffffff" font-weight="bold" font-size="11" text-anchor="middle">${cat}</text>`;

    (state.lists[cat] || [])
      .filter((v) => v.trim())
      .slice(0, 4)
      .forEach((item, j) => {
        const yy = isTop ? y + 32 + j * 29 : y - 32 - j * 29;
        const xx = x + (62 * (yy - y)) / (210 - y);
        svg += `<line x1="${xx - 8}" y1="${yy - 4}" x2="${xx}" y2="${yy - 4}" stroke="${palette[i]}" stroke-width="1.5"/>
                <text x="${xx - 12}" y="${yy}" text-anchor="end" fill="#1e293b" font-size="11">${truncate(item, 24)}</text>`;
      });
  });

  return svg + "</svg>";
}

export function buildMindMapSVG(state: PblState): string {
  const coords = (n?: { x: number; y: number }): [number, number] => (n ? [n.x * 8.4, n.y * 5.2] : [420, 260]);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 520" font-family="Arial, sans-serif" font-size="12">
    <rect width="840" height="520" fill="#ffffff"/>`;

  state.mm.forEach((n) => {
    const a = coords(state.mm.find((z) => z.id === n.p));
    const b = coords(n);
    svg += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#2563eb" stroke-width="2"/>`;
  });

  svg += `<rect x="340" y="232" width="160" height="56" rx="10" fill="#1b365d"/>
          <text x="420" y="264" fill="#ffffff" font-weight="bold" text-anchor="middle">${truncate(state.problem || "Main Problem", 20)}</text>`;

  state.mm.forEach((n) => {
    const [x, y] = coords(n);
    const label = truncate(n.t || "...", 26);
    const w = Math.max(90, label.length * 7.2 + 22);
    const isRootBranch = n.p === 0;
    svg += `<rect x="${x - w / 2}" y="${y - 16}" width="${w}" height="32" rx="7" fill="${isRootBranch ? "#eff6ff" : "#ffffff"}" stroke="#1e40af" stroke-width="1.75"/>
            <text x="${x}" y="${y + 4}" text-anchor="middle" font-weight="${isRootBranch ? "bold" : "normal"}" fill="#1e293b">${label}</text>`;
  });

  return svg + "</svg>";
}

export function buildGridSVG(state: PblState, method: string): string {
  const tpl = TEMPLATES[method];
  if (!tpl) return "";
  const count = tpl.boxes.length;
  const cols = tpl.cols;
  const rows = Math.ceil(count / cols);
  const W = 840;
  const w = W / cols - 14;
  const h = Math.max(155, Math.min(280, 520 / rows));
  const H = rows * (h + 14) + 14;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Arial, sans-serif" font-size="12">
    <rect width="${W}" height="${H}" fill="#ffffff"/>`;

  tpl.boxes.forEach((box, idx) => {
    const X = 7 + (idx % cols) * (w + 14);
    const Y = 10 + Math.floor(idx / cols) * (h + 14);
    svg += `<rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="8" fill="#f8fafc" stroke="${box.c}" stroke-width="1.75"/>
            <rect x="${X}" y="${Y}" width="${w}" height="28" rx="6" fill="${box.c}"/>
            <text x="${X + 12}" y="${Y + 18}" fill="#ffffff" font-weight="bold">${esc(box.t)}</text>`;

    (state.lists[box.k] || [])
      .filter((v) => v.trim())
      .slice(0, Math.floor((h - 44) / 19))
      .forEach((item, j) => {
        svg += `<text x="${X + 12}" y="${Y + 48 + j * 19}" fill="#1e293b">• ${truncate(item, Math.floor(w / 6.6))}</text>`;
      });
  });

  return svg + "</svg>";
}

export function buildFiveWhySVG(state: PblState): string {
  const filledWhys = state.why.map((w, i) => ({ idx: i + 1, text: w.trim() })).filter((w) => w.text);
  const items = filledWhys.length ? filledWhys : [{ idx: 1, text: "Belum ada data 5 WHY yang diisi." }];
  const H = 110 + items.length * 76;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 ${H}" font-family="Arial, sans-serif" font-size="12">
    <rect width="840" height="${H}" fill="#ffffff"/>
    <rect x="60" y="16" width="720" height="52" rx="8" fill="#1b365d"/>
    <text x="420" y="38" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">PROBLEM STATEMENT</text>
    <text x="420" y="55" fill="#ffffff" font-weight="bold" text-anchor="middle">${truncate(state.problem || "Main Problem", 88)}</text>`;

  items.forEach((item, i) => {
    const y = 92 + i * 76;
    const isLast = i === items.length - 1;
    svg += `<line x1="420" y1="${y - 24}" x2="420" y2="${y - 2}" stroke="#1e40af" stroke-width="2"/>
            <polygon points="415,${y - 6} 425,${y - 6} 420,${y}" fill="#1e40af"/>
            <rect x="60" y="${y}" width="720" height="52" rx="8" fill="${isLast ? "#fef2f2" : "#eff6ff"}" stroke="${isLast ? "#be123c" : "#2563eb"}" stroke-width="1.75"/>
            <rect x="60" y="${y}" width="84" height="52" rx="6" fill="${isLast ? "#be123c" : "#1e40af"}"/>
            <text x="102" y="${y + 30}" fill="#ffffff" font-weight="bold" text-anchor="middle">${isLast ? "ROOT CAUSE" : `WHY ${item.idx}`}</text>
            <text x="160" y="${y + 30}" fill="#0f172a" font-weight="${isLast ? "bold" : "normal"}">${truncate(item.text, 76)}</text>`;
  });

  return svg + "</svg>";
}

export function buildBrainstormSVG(state: PblState): string {
  const ideas = state.ideas.filter((d) => d.t.trim());
  const list = ideas.length ? ideas : [{ t: "Belum ada catatan ide brainstorming.", x: 0, y: 0 }];
  const cols = 3;
  const rows = Math.ceil(list.length / cols);
  const H = Math.max(220, rows * 115 + 30);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 ${H}" font-family="Arial, sans-serif" font-size="12">
    <rect width="840" height="${H}" fill="#ffffff"/>`;

  list.forEach((idea, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const X = 20 + col * 270;
    const Y = 18 + row * 112;
    const lines = wrapTextLines(idea.t, 34, 3);

    svg += `<rect x="${X}" y="${Y}" width="252" height="96" rx="8" fill="#fef9c3" stroke="#d97706" stroke-width="1.5"/>
            <rect x="${X}" y="${Y}" width="252" height="22" rx="6" fill="#f59e0b"/>
            <text x="${X + 12}" y="${Y + 15}" fill="#ffffff" font-size="10" font-weight="bold">IDEA #${idx + 1}</text>`;

    lines.forEach((line, lIdx) => {
      svg += `<text x="${X + 12}" y="${Y + 42 + lIdx * 17}" fill="#1e293b" font-size="11.5">${line}</text>`;
    });
  });

  return svg + "</svg>";
}

export function getCurrentDiagramSVG(state: PblState): string {
  const m = state.method || "Brainstorm";
  if (m === "Mind Map") return buildMindMapSVG(state);
  if (m === "Fishbone") return buildFishboneSVG(state);
  if (m === "5 WHY") return buildFiveWhySVG(state);
  if (m === "Brainstorm") return buildBrainstormSVG(state);
  if (TEMPLATES[m]) return buildGridSVG(state, m);
  return "";
}

export async function renderDiagramPNG(
  state: PblState
): Promise<{ ab: ArrayBuffer; url: string; w: number; h: number } | null> {
  const svgStr = getCurrentDiagramSVG(state);
  if (!svgStr) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1680;
      const vb = svgStr.match(/viewBox="0 0 (\d+) (\d+)"/);
      canvas.height = vb ? Math.round((1680 * Number(vb[2])) / Number(vb[1])) : 900;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        blob.arrayBuffer().then((ab) =>
          resolve({ ab, url: canvas.toDataURL("image/png"), w: canvas.width, h: canvas.height })
        );
      });
    };
    img.onerror = () => resolve(null);
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
  });
}