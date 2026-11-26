import { TheoryDiagramSpec } from "@/types/pbl";

const esc = (s: string) =>
  String(s ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch] || ch));

function wrapLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = (text || "").trim().split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= maxChars) {
      cur = (cur + " " + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
      if (lines.length >= maxLines) break;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines.map(esc);
}

export function buildAddieSVG(spec: TheoryDiagramSpec): string {
  const stages = spec.stages || [];
  const W = 900;
  const H = 340;
  const boxW = 154;
  const gap = 20;
  const startX = 25;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Arial, sans-serif">
    <rect width="${W}" height="${H}" fill="#ffffff"/>`;

  stages.slice(0, 5).forEach((st, i) => {
    const x = startX + i * (boxW + gap);
    // Top Navy Box
    svg += `<rect x="${x}" y="22" width="${boxW}" height="52" rx="10" fill="#1b365d"/>`;
    const titleLines = wrapLines(st.title, 16, 2);
    titleLines.forEach((line, lIdx) => {
      const ty = titleLines.length === 1 ? 53 : 44 + lIdx * 16;
      svg += `<text x="${x + boxW / 2}" y="${ty}" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">${line}</text>`;
    });

    // Arrow to next stage
    if (i < stages.length - 1 && i < 4) {
      const ax1 = x + boxW + 3;
      const ax2 = x + boxW + gap - 4;
      svg += `<line x1="${ax1}" y1="48" x2="${ax2}" y2="48" stroke="#1b365d" stroke-width="2.5"/>
              <polygon points="${ax2 - 5},43 ${ax2 + 1},48 ${ax2 - 5},53" fill="#1b365d"/>`;
    }

    // Bottom Light Blue Card
    svg += `<rect x="${x}" y="88" width="${boxW}" height="182" rx="10" fill="#dbeafe" stroke="#1b365d" stroke-width="1.5"/>`;
    const descLines = wrapLines(st.desc, 20, 8);
    descLines.forEach((line, lIdx) => {
      svg += `<text x="${x + boxW / 2}" y="${116 + lIdx * 18}" fill="#0f172a" font-size="11.5" text-anchor="middle">${line}</text>`;
    });
  });

  if (spec.footerNote) {
    svg += `<line x1="105" y1="294" x2="795" y2="294" stroke="#dc2626" stroke-width="2" stroke-dasharray="6,4"/>
            <polygon points="110,289 100,294 110,299" fill="#dc2626"/>
            <text x="450" y="318" fill="#dc2626" font-size="12" font-style="italic" text-anchor="middle">${esc(spec.footerNote)}</text>`;
  }

  return svg + "</svg>";
}

export function buildIcebergSVG(spec: TheoryDiagramSpec): string {
  const W = 900;
  const H = 520;
  const above = spec.aboveWater || { label: "KNOWLEDGE & SKILLS", callout: "" };
  const below = spec.belowWater || [];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Arial, sans-serif">
    <rect width="${W}" height="${H}" fill="#ffffff"/>
    <!-- Water background -->
    <rect x="0" y="190" width="${W}" height="330" fill="#eff6ff"/>
    <!-- Iceberg Polygon -->
    <polygon points="280,26 355,95 390,68 485,190 545,285 415,478 265,468 155,380 120,275 185,190" fill="#dbeafe" stroke="#1b365d" stroke-width="2.5"/>
    <polygon points="280,26 355,95 390,68 485,190 185,190" fill="#ffffff" stroke="#1b365d" stroke-width="2.5"/>
    <!-- Waterline -->
    <line x1="10" y1="190" x2="890" y2="190" stroke="#60a5fa" stroke-width="3" stroke-dasharray="10,6"/>
    <text x="20" y="182" fill="#1e3a8a" font-size="12" font-style="italic">Waterline</text>
    <text x="880" y="30" fill="#1b365d" font-size="12" font-weight="bold" text-anchor="end">ABOVE WATER</text>
    <text x="880" y="46" fill="#1b365d" font-size="12" font-weight="bold" text-anchor="end">(visible)</text>
    <text x="880" y="502" fill="#1b365d" font-size="12" font-weight="bold" text-anchor="end">BELOW WATER (hidden, harder to develop)</text>`;

  // Above water label + green callout
  const aboveLabels = wrapLines(above.label, 20, 2);
  aboveLabels.forEach((l, i) => {
    svg += `<text x="330" y="${138 + i * 17}" fill="#1b365d" font-size="13" font-weight="bold" text-anchor="middle">${l}</text>`;
  });
  svg += `<line x1="485" y1="115" x2="555" y2="115" stroke="#1b365d" stroke-width="1.5"/>
          <rect x="555" y="78" width="275" height="72" rx="6" fill="#dcfce7" stroke="#1b365d" stroke-width="1.2"/>`;
  wrapLines(above.callout, 38, 4).forEach((l, i) => {
    svg += `<text x="565" y="${98 + i * 15}" fill="#0f172a" font-size="11.5">${l}</text>`;
  });

  // Below water 3 layers + yellow callouts
  const yPositions = [245, 335, 425];
  below.slice(0, 3).forEach((item, idx) => {
    const y = yPositions[idx];
    const lblLines = wrapLines(item.label, 30, 2);
    lblLines.forEach((l, lIdx) => {
      svg += `<text x="330" y="${y - 6 + lIdx * 16}" fill="#1b365d" font-size="12.5" font-weight="bold" text-anchor="middle">${l}</text>`;
    });
    svg += `<line x1="495" y1="${y}" x2="555" y2="${y}" stroke="#1b365d" stroke-width="1.5"/>
            <rect x="555" y="${y - 34}" width="275" height="68" rx="6" fill="#fef3c7" stroke="#1b365d" stroke-width="1.2"/>`;
    wrapLines(item.callout, 38, 4).forEach((l, lIdx) => {
      svg += `<text x="565" y="${y - 15 + lIdx * 15}" fill="#0f172a" font-size="11.5">${l}</text>`;
    });
  });

  return svg + "</svg>";
}

export function buildShannonSVG(spec: TheoryDiagramSpec): string {
  const stages = spec.stages || [];
  const W = 900;
  const H = 410;
  const boxW = 154;
  const gap = 20;
  const startX = 25;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Arial, sans-serif">
    <rect width="${W}" height="${H}" fill="#ffffff"/>`;

  // Top Noise Box pointing to middle stage (Channel)
  if (spec.topNote) {
    svg += `<rect x="260" y="16" width="380" height="54" rx="8" fill="#fef3c7" stroke="#dc2626" stroke-width="1.8"/>`;
    wrapLines(spec.topNote, 52, 2).forEach((l, i) => {
      svg += `<text x="450" y="${38 + i * 17}" fill="#0f172a" font-size="11.5" text-anchor="middle">${l}</text>`;
    });
    svg += `<line x1="450" y1="70" x2="450" y2="114" stroke="#dc2626" stroke-width="2"/>
            <polygon points="445,109 455,109 450,116" fill="#dc2626"/>`;
  }

  stages.slice(0, 5).forEach((st, i) => {
    const x = startX + i * (boxW + gap);
    svg += `<rect x="${x}" y="118" width="${boxW}" height="52" rx="10" fill="#1b365d"/>`;
    const titleLines = wrapLines(st.title, 16, 2);
    titleLines.forEach((line, lIdx) => {
      const ty = titleLines.length === 1 ? 149 : 140 + lIdx * 16;
      svg += `<text x="${x + boxW / 2}" y="${ty}" fill="#ffffff" font-size="12.5" font-weight="bold" text-anchor="middle">${line}</text>`;
    });

    if (i < stages.length - 1 && i < 4) {
      const ax1 = x + boxW + 3;
      const ax2 = x + boxW + gap - 4;
      svg += `<line x1="${ax1}" y1="144" x2="${ax2}" y2="144" stroke="#1b365d" stroke-width="2.5"/>
              <polygon points="${ax2 - 5},139 ${ax2 + 1},144 ${ax2 - 5},149" fill="#1b365d"/>`;
    }

    svg += `<rect x="${x}" y="182" width="${boxW}" height="162" rx="10" fill="#dbeafe" stroke="#1b365d" stroke-width="1.5"/>`;
    wrapLines(st.desc, 20, 7).forEach((line, lIdx) => {
      svg += `<text x="${x + boxW / 2}" y="${208 + lIdx * 18}" fill="#0f172a" font-size="11" text-anchor="middle">${line}</text>`;
    });
  });

  if (spec.footerNote) {
    svg += `<line x1="105" y1="366" x2="795" y2="366" stroke="#dc2626" stroke-width="2" stroke-dasharray="6,4"/>
            <polygon points="110,361 100,366 110,371" fill="#dc2626"/>
            <text x="450" y="390" fill="#dc2626" font-size="12" font-style="italic" text-anchor="middle">${esc(spec.footerNote)}</text>`;
  }

  return svg + "</svg>";
}

export function buildFlowchartSVG(spec: TheoryDiagramSpec): string {
  const f = spec.flowSteps;
  if (!f) return "";
  const W = 760;
  const H = 860;

  const drawBox = (x: number, y: number, w: number, h: number, fill: string, stroke: string, textColor: string, text: string, bold = false) => {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
    const lines = wrapLines(text, Math.floor(w / 7.2), 3);
    lines.forEach((l, i) => {
      const ty = y + h / 2 - ((lines.length - 1) * 8) + i * 16 + 4;
      s += `<text x="${x + w / 2}" y="${ty}" fill="${textColor}" font-size="12" font-weight="${bold ? "bold" : "normal"}" text-anchor="middle">${l}</text>`;
    });
    return s;
  };

  const drawDiamond = (cx: number, cy: number, rx: number, ry: number, text: string) => {
    let s = `<polygon points="${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}" fill="#fef3c7" stroke="#1b365d" stroke-width="1.6"/>`;
    const lines = wrapLines(text, 20, 2);
    lines.forEach((l, i) => {
      const ty = cy - ((lines.length - 1) * 8) + i * 16 + 4;
      s += `<text x="${cx}" y="${ty}" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">${l}</text>`;
    });
    return s;
  };

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Arial, sans-serif">
    <rect width="${W}" height="${H}" fill="#ffffff"/>`;

  // 1. Start
  svg += drawBox(140, 20, 280, 50, "#1b365d", "#1b365d", "#ffffff", f.start, true);
  svg += `<line x1="280" y1="70" x2="280" y2="96" stroke="#1b365d" stroke-width="2"/><polygon points="275,92 285,92 280,98" fill="#1b365d"/>`;

  // 2. Inspect
  svg += drawBox(130, 98, 300, 48, "#dbeafe", "#1b365d", "#0f172a", f.inspect);
  svg += `<line x1="280" y1="146" x2="280" y2="174" stroke="#1b365d" stroke-width="2"/><polygon points="275,170 285,170 280,176" fill="#1b365d"/>`;

  // 3. Decision 1
  svg += drawDiamond(280, 232, 115, 56, f.decision1);
  // No branch right
  svg += `<line x1="395" y1="232" x2="475" y2="232" stroke="#1b365d" stroke-width="2"/><polygon points="471,227 477,232 471,237" fill="#1b365d"/>`;
  svg += `<text x="432" y="224" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">No</text>`;
  svg += drawBox(478, 206, 220, 52, "#dcfce7", "#1b365d", "#0f172a", f.noBranch);

  // Yes branch down
  svg += `<line x1="280" y1="288" x2="280" y2="320" stroke="#1b365d" stroke-width="2"/><polygon points="275,316 285,316 280,322" fill="#1b365d"/>`;
  svg += `<text x="298" y="308" fill="#0f172a" font-size="12" font-weight="bold">Yes</text>`;

  // 4. Yes Step 1, 2, 3
  svg += drawBox(120, 322, 320, 48, "#dbeafe", "#1b365d", "#0f172a", f.yesStep1);
  svg += `<line x1="280" y1="370" x2="280" y2="394" stroke="#1b365d" stroke-width="2"/><polygon points="275,390 285,390 280,396" fill="#1b365d"/>`;

  svg += drawBox(120, 396, 320, 48, "#dbeafe", "#1b365d", "#0f172a", f.yesStep2);
  svg += `<line x1="280" y1="444" x2="280" y2="468" stroke="#1b365d" stroke-width="2"/><polygon points="275,464 285,464 280,470" fill="#1b365d"/>`;

  svg += drawBox(120, 470, 320, 48, "#dbeafe", "#1b365d", "#0f172a", f.yesStep3);
  svg += `<line x1="280" y1="518" x2="280" y2="544" stroke="#1b365d" stroke-width="2"/><polygon points="275,540 285,540 280,546" fill="#1b365d"/>`;

  // 5. Decision 2
  svg += drawDiamond(280, 602, 115, 56, f.decision2);
  // No branch right
  svg += `<line x1="395" y1="602" x2="475" y2="602" stroke="#1b365d" stroke-width="2"/><polygon points="471,597 477,602 471,607" fill="#1b365d"/>`;
  svg += `<text x="432" y="594" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">No</text>`;
  svg += drawBox(478, 568, 220, 68, "#fef3c7", "#dc2626", "#0f172a", f.rejectBox);
  svg += `<line x1="588" y1="636" x2="588" y2="668" stroke="#1b365d" stroke-width="2"/><polygon points="583,664 593,664 588,670" fill="#1b365d"/>`;
  svg += drawBox(478, 670, 220, 42, "#f1f5f9", "#1b365d", "#0f172a", f.rejectClose);

  // Yes branch down + line from No-1
  svg += `<line x1="280" y1="658" x2="280" y2="714" stroke="#1b365d" stroke-width="2"/><polygon points="275,710 285,710 280,716" fill="#1b365d"/>`;
  svg += `<text x="298" y="688" fill="#0f172a" font-size="12" font-weight="bold">Yes</text>`;

  // Line from No-1 box down to Final Check
  svg += `<polyline points="698,232 728,232 728,740 426,740" fill="none" stroke="#1b365d" stroke-width="2"/>
          <polygon points="430,735 422,740 430,745" fill="#1b365d"/>`;

  // 6. Final Check & End
  svg += drawBox(140, 716, 280, 48, "#dbeafe", "#1b365d", "#0f172a", f.finalCheck);
  svg += `<line x1="280" y1="764" x2="280" y2="790" stroke="#1b365d" stroke-width="2"/><polygon points="275,786 285,786 280,792" fill="#1b365d"/>`;
  svg += drawBox(140, 792, 280, 50, "#1b365d", "#1b365d", "#ffffff", f.end, true);

  return svg + "</svg>";
}

export function getTheoryDiagramSVG(spec?: TheoryDiagramSpec): string {
  if (!spec || spec.type === "none") return "";
  if (spec.type === "addie") return buildAddieSVG(spec);
  if (spec.type === "iceberg") return buildIcebergSVG(spec);
  if (spec.type === "shannon") return buildShannonSVG(spec);
  if (spec.type === "flowchart") return buildFlowchartSVG(spec);
  return "";
}

export async function renderTheoryDiagramPNG(
  spec?: TheoryDiagramSpec
): Promise<{ ab: ArrayBuffer; url: string; w: number; h: number } | null> {
  const svgStr = getTheoryDiagramSVG(spec);
  if (!svgStr) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      const vb = svgStr.match(/viewBox="0 0 (\d+) (\d+)"/);
      canvas.height = vb ? Math.round((1600 * Number(vb[2])) / Number(vb[1])) : 900;
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