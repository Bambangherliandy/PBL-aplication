import * as docx from "docx";
import { jsPDF } from "jspdf";
import { PblState, TheoryDiagramSpec } from "@/types/pbl";
import { renderDiagramPNG } from "./diagrams";
import { renderTheoryDiagramPNG } from "./theoryDiagrams";
import { renderTrisaktiLogoPNG } from "./trisaktiLogo";

export type ReportBlock =
  | ["t" | "h" | "h3" | "p" | "caption" | "tblTitle", string]
  | ["kv", [string, string]]
  | ["imgMain", string]
  | ["imgTheory", TheoryDiagramSpec]
  | ["tbl", string[][]];

const DOC_FONT = "Times New Roman";

function cleanHex(hex: string, fallback = "1B365D"): string {
  const c = (hex || "").replace("#", "").trim();
  return /^[0-9A-Fa-f]{6}$/.test(c) ? c.toUpperCase() : fallback;
}

function hexToRgb(hex: string): [number, number, number] {
  const c = cleanHex(hex);
  return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)];
}

export function buildReportBlocks(state: PblState): ReportBlock[] {
  const c = state.cover;
  const methodName = state.method || "Brainstorm";

  const blocks: ReportBlock[] = [
    ["t", c.title || "REPORT: PROBLEM BASED LEARNING"],
    ["p", c.course],
    ["p", c.lect ? "Lecturer: " + c.lect : ""],
    ["p", c.members.filter(Boolean).length ? "By: " + c.members.filter(Boolean).join(", ") : ""],
    ["p", c.year ? "Academic Year: " + c.year : ""],

    ["h", "Case Study"],
    ["p", state.case || "-"],

    ["h", "Step 1: Understanding the Task"],
    state.words.length
      ? ["tbl", [["Difficult Word", "Meaning", "Status"], ...state.words.map((w) => [w.t, w.m || "-", w.s])]]
      : ["kv", ["Difficult Words", "-"]],
    ["kv", ["Type of Task", state.task || "-"]],
    ["kv", ["Method of Analysis", methodName]],

    ["h", "Step 2: Identify the Main Problem"],
    ["p", state.problem || "-"],

    ["h", "Step 3: Analyzing the Problem"],
    ["imgMain", "Diagram"],
    ["caption", `Figure 1. ${methodName} Analysis Diagram`],

    ["h", "Step 4: Restructuring Ideas / Solutions & Strategies"],
  ];

  state.subs.forEach((sub, idx) => {
    blocks.push(["h3", `4.${idx + 1} ${sub.t || "Strategy"}`]);
    Object.entries(sub.lens).forEach(([k, v]) => {
      if (v.trim()) blocks.push(["kv", [k, v]]);
    });
  });

  blocks.push(["h", "Step 5: Learning Objectives"]);
  state.los.forEach((lo, i) => blocks.push(["kv", [`LO ${i + 1}`, lo.t || "-"]]));

  blocks.push(["h", "Step 6: Gather the Data Needed"]);
  if (state.step6Intro?.trim()) blocks.push(["p", state.step6Intro]);

  state.los.forEach((lo, i) => {
    blocks.push(["h3", `6.${i + 1} ${lo.t || `Learning Objective ${i + 1}`}`]);
    if (lo.theory.trim()) blocks.push(["p", lo.theory]);
    if (lo.diagram && lo.diagram.type !== "none") {
      blocks.push(["imgTheory", lo.diagram]);
      if (lo.diagram.caption) blocks.push(["caption", lo.diagram.caption]);
    }
    if (lo.applied.trim()) blocks.push(["p", lo.applied]);
    (lo.tables || []).forEach((tbl) => {
      if (tbl.title) blocks.push(["tblTitle", tbl.title]);
      blocks.push(["tbl", [tbl.headers, ...tbl.rows]]);
    });
  });

  blocks.push(["h", "Step 7: Synthesize and Solve the Problem"]);
  (state.synthSections || []).forEach((sec) => {
    blocks.push(["h3", sec.title]);
    if (sec.body.trim()) blocks.push(["p", sec.body]);
    if (sec.diagram && sec.diagram.type !== "none") {
      blocks.push(["imgTheory", sec.diagram]);
      if (sec.diagram.caption) blocks.push(["caption", sec.diagram.caption]);
    }
    (sec.tables || []).forEach((tbl) => {
      if (tbl.title) blocks.push(["tblTitle", tbl.title]);
      blocks.push(["tbl", [tbl.headers, ...tbl.rows]]);
    });
    if (sec.note?.trim()) blocks.push(["p", sec.note]);
  });

  if (state.concl.trim()) {
    blocks.push(["h", "Conclusion"], ["p", state.concl]);
  }

  if (state.refs.some((x) => x.trim())) {
    blocks.push(["h", "References"]);
    state.refs.filter((x) => x.trim()).forEach((x) => blocks.push(["p", x]));
  }

  return blocks;
}

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportReportFile(state: PblState, format: "docx" | "pdf") {
  const primaryHex = cleanHex(state.color, "1B365D");
  const secondaryHex = "0F766E";
  const [r, g, b] = hexToRgb(primaryHex);
  const [sr, sg, sb] = hexToRgb(secondaryHex);

  const c = state.cover;
  const members = c.members.filter(Boolean);
  const blocks = buildReportBlocks(state).slice(5);
  const mainDiagram = await renderDiagramPNG(state);
  const trisaktiLogo = await renderTrisaktiLogoPNG();

  const theoryPngs = new Map<TheoryDiagramSpec, { ab: ArrayBuffer; url: string; w: number; h: number }>();
  for (const [type, val] of blocks) {
    if (type === "imgTheory") {
      const rendered = await renderTheoryDiagramPNG(val);
      if (rendered) theoryPngs.set(val, rendered);
    }
  }

  const institutionLines = (
    c.course || "MANAGEMENT\nFACULTY OF ECONOMICS AND BUSINESS\nTRISAKTI UNIVERSITY\nJAKARTA"
  )
    .split(/\n|—|,/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (format === "docx") {
    const makePara = (txt: string, opts: docx.IParagraphOptions = {}, runOpts: docx.IRunOptions = {}) =>
      new docx.Paragraph({
        spacing: { line: 276, after: 120 },
        children: String(txt)
          .split("\n")
          .map(
            (line, idx) =>
              new docx.TextRun({
                text: line,
                break: idx ? 1 : 0,
                font: DOC_FONT,
                size: 24, // 12pt standar akademik
                ...runOpts,
              })
          ),
        ...opts,
      });

    const coverChildren: docx.Paragraph[] = [
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { before: 400, after: 80 },
        children: [new docx.TextRun({ text: "REPORT", font: DOC_FONT, bold: true, size: 32, color: "0F172A" })],
      }),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 360 },
        children: [
          new docx.TextRun({
            text: (c.title || "PROBLEM BASED LEARNING").toUpperCase(),
            font: DOC_FONT,
            bold: true,
            size: 30,
            color: "0F172A",
          }),
        ],
      }),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new docx.TextRun({ text: "Lecturer:", font: DOC_FONT, bold: true, size: 24, color: "0F172A" })],
      }),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 280 },
        children: [new docx.TextRun({ text: c.lect || "-", font: DOC_FONT, bold: true, size: 24, color: "0F172A" })],
      }),
    ];

    if (trisaktiLogo) {
      coverChildren.push(
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          spacing: { before: 120, after: 320 },
          children: [
            new docx.ImageRun({
              data: trisaktiLogo.ab,
              transformation: { width: 175, height: 180 },
              type: "png",
            }),
          ],
        })
      );
    }

    members.forEach((m, idx) => {
      coverChildren.push(
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new docx.TextRun({
              text: idx === 0 ? `By: ${m}` : m,
              font: DOC_FONT,
              bold: true,
              size: 24,
              color: "0F172A",
            }),
          ],
        })
      );
    });

    coverChildren.push(new docx.Paragraph({ spacing: { before: 480 } }));
    institutionLines.forEach((line) => {
      coverChildren.push(
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          spacing: { after: 50 },
          children: [new docx.TextRun({ text: line, font: DOC_FONT, bold: true, size: 24, color: "0F172A" })],
        })
      );
    });

    if (c.year) {
      coverChildren.push(
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new docx.TextRun({ text: c.year, font: DOC_FONT, bold: true, size: 24, color: "0F172A" })],
        })
      );
    }

    const children: (docx.Paragraph | docx.Table)[] = [
      ...coverChildren,
      new docx.Paragraph({ children: [new docx.PageBreak()] }),
    ];

    for (const [type, val] of blocks) {
      if (type === "h") {
        children.push(
          new docx.Paragraph({
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 140 },
            border: { bottom: { color: primaryHex, space: 4, style: docx.BorderStyle.SINGLE, size: 12 } },
            children: [new docx.TextRun({ text: val, font: DOC_FONT, bold: true, size: 28, color: primaryHex })],
          })
        );
      } else if (type === "h3") {
        children.push(
          new docx.Paragraph({
            heading: docx.HeadingLevel.HEADING_3,
            spacing: { before: 220, after: 90 },
            children: [new docx.TextRun({ text: val, font: DOC_FONT, bold: true, size: 25, color: secondaryHex })],
          })
        );
      } else if (type === "tblTitle") {
        children.push(
          new docx.Paragraph({
            spacing: { before: 140, after: 60 },
            children: [
              new docx.TextRun({ text: val, font: DOC_FONT, bold: true, italics: true, size: 22, color: primaryHex }),
            ],
          })
        );
      } else if (type === "kv") {
        const [label, content] = val;
        children.push(
          new docx.Paragraph({
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { line: 276, after: 110 },
            children: [
              new docx.TextRun({ text: `${label}: `, font: DOC_FONT, bold: true, size: 24, color: primaryHex }),
              new docx.TextRun({ text: content, font: DOC_FONT, size: 24, color: "1E293B" }),
            ],
          })
        );
      } else if (type === "caption") {
        children.push(
          new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { before: 60, after: 160 },
            children: [
              new docx.TextRun({ text: val, font: DOC_FONT, italics: true, bold: true, size: 21, color: secondaryHex }),
            ],
          })
        );
      } else if (type === "p" && val.trim()) {
        children.push(
          makePara(
            val,
            { alignment: docx.AlignmentType.JUSTIFIED, spacing: { line: 276, after: 120 } },
            { font: DOC_FONT, size: 24, color: "1E293B" }
          )
        );
      } else if (type === "tbl") {
        children.push(
          new docx.Table({
            width: { size: 100, type: docx.WidthType.PERCENTAGE },
            rows: val.map(
              (row, rIdx) =>
                new docx.TableRow({
                  tableHeader: rIdx === 0,
                  children: row.map(
                    (cell) =>
                      new docx.TableCell({
                        shading: rIdx === 0 ? { fill: primaryHex } : { fill: rIdx % 2 === 0 ? "F8FAFC" : "FFFFFF" },
                        margins: { top: 75, bottom: 75, left: 100, right: 100 },
                        children: [
                          makePara(
                            cell,
                            { spacing: { line: 240, after: 0 } },
                            {
                              font: DOC_FONT,
                              bold: rIdx === 0,
                              color: rIdx === 0 ? "FFFFFF" : "1E293B",
                              size: 21, // 10.5pt untuk tabel
                            }
                          ),
                        ],
                      })
                  ),
                })
            ),
          }),
          makePara(" ")
        );
      } else if (type === "imgMain" && mainDiagram) {
        children.push(
          new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { before: 100, after: 40 },
            children: [
              new docx.ImageRun({
                data: mainDiagram.ab,
                transformation: { width: 530, height: (530 * mainDiagram.h) / mainDiagram.w },
                type: "png",
              }),
            ],
          })
        );
      } else if (type === "imgTheory") {
        const png = theoryPngs.get(val);
        if (png) {
          children.push(
            new docx.Paragraph({
              alignment: docx.AlignmentType.CENTER,
              spacing: { before: 100, after: 40 },
              children: [
                new docx.ImageRun({
                  data: png.ab,
                  transformation: { width: 530, height: (530 * png.h) / png.w },
                  type: "png",
                }),
              ],
            })
          );
        }
      }
    }

    const doc = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: DOC_FONT, size: 24 },
            paragraph: { spacing: { line: 276 } },
          },
        },
      },
      sections: [{ children }],
    });
    const blob = await docx.Packer.toBlob(doc);
    triggerDownload("report-pbl.docx", blob);
  } else {
    // PDF menggunakan font "times" (Times New Roman)
    const pdf = new jsPDF();
    const maxWidth = 175;
    let y = 24;
    const ensureSpace = (height: number) => {
      if (y + height > 280) {
        pdf.addPage();
        y = 20;
      }
    };

    pdf.setFont("times", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(16);
    pdf.text("REPORT", 105, 34, { align: "center" });
    pdf.setFontSize(15);
    pdf.text((c.title || "PROBLEM BASED LEARNING").toUpperCase(), 105, 44, { align: "center" });

    pdf.setFontSize(12);
    pdf.text("Lecturer:", 105, 62, { align: "center" });
    pdf.text(c.lect || "-", 105, 70, { align: "center" });

    if (trisaktiLogo) {
      pdf.addImage(trisaktiLogo.url, "PNG", 78, 82, 54, 56);
    }

    pdf.setFontSize(12);
    members.forEach((m, i) => {
      pdf.text(i === 0 ? `By: ${m}` : m, 105, 152 + i * 7, { align: "center" });
    });

    const footerStartY = 225;
    pdf.setFontSize(12);
    institutionLines.forEach((line, i) => {
      pdf.text(line, 105, footerStartY + i * 7, { align: "center" });
    });
    if (c.year) {
      pdf.text(c.year, 105, footerStartY + institutionLines.length * 7, { align: "center" });
    }
    pdf.addPage();

    for (const [type, val] of blocks) {
      if (type === "imgMain" || type === "imgTheory") {
        const png = type === "imgMain" ? mainDiagram : theoryPngs.get(val);
        if (png) {
          const h = Math.min(220, (maxWidth * png.h) / png.w);
          const w = (h * png.w) / png.h;
          ensureSpace(h + 4);
          pdf.addImage(png.url, "PNG", 17 + (maxWidth - w) / 2, y, w, h);
          y += h + 5;
        }
        continue;
      }
      if (type === "caption") {
        ensureSpace(8);
        pdf.setFont("times", "italic");
        pdf.setFontSize(10.5);
        pdf.setTextColor(sr, sg, sb);
        pdf.text(val, 105, y, { align: "center" });
        y += 8;
        continue;
      }
      if (type === "h") {
        ensureSpace(12);
        pdf.setFont("times", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(r, g, b);
        pdf.text(val, 17, y);
        pdf.setDrawColor(r, g, b);
        pdf.line(17, y + 2, 192, y + 2);
        y += 9;
        continue;
      }
      if (type === "h3" || type === "tblTitle") {
        ensureSpace(9);
        pdf.setFont("times", type === "tblTitle" ? "bolditalic" : "bold");
        pdf.setFontSize(type === "h3" ? 12.5 : 11);
        pdf.setTextColor(type === "h3" ? sr : r, type === "h3" ? sg : g, type === "h3" ? sb : b);
        pdf.text(val, 17, y);
        y += 6.5;
        continue;
      }
      if (type === "kv") {
        const [label, content] = val;
        pdf.setFont("times", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(r, g, b);
        const labelW = pdf.getTextWidth(`${label}: `);
        ensureSpace(6);
        pdf.text(`${label}: `, 17, y);
        pdf.setFont("times", "normal");
        pdf.setTextColor(30, 41, 59);
        const lines = pdf.splitTextToSize(content, maxWidth - labelW);
        if (lines.length) {
          pdf.text(lines[0], 17 + labelW, y);
          y += 6;
          lines.slice(1).forEach((l: string) => {
            ensureSpace(6);
            pdf.text(l, 17, y);
            y += 6;
          });
        }
        y += 2;
        continue;
      }
      if (type === "p" && val.trim()) {
        pdf.setFont("times", "normal");
        pdf.setFontSize(12);
        pdf.setTextColor(30, 41, 59);
        pdf.splitTextToSize(val, maxWidth).forEach((l: string) => {
          ensureSpace(6);
          pdf.text(l, 17, y);
          y += 6;
        });
        y += 2.5;
        continue;
      }
      if (type === "tbl") {
        pdf.setFontSize(10);
        val.forEach((row, rIdx) => {
          pdf.setFont("times", rIdx === 0 ? "bold" : "normal");
          pdf.setTextColor(rIdx === 0 ? r : 30, rIdx === 0 ? g : 41, rIdx === 0 ? b : 59);
          pdf.splitTextToSize(row.join("  |  "), maxWidth).forEach((l: string) => {
            ensureSpace(5.5);
            pdf.text(l, 17, y);
            y += 5.5;
          });
        });
        y += 4;
      }
    }
    triggerDownload("report-pbl.pdf", pdf.output("blob"));
  }
}