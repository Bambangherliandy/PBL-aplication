export interface HardWord {
    t: string;
    m: string;
    s: "Belum paham" | "Paham";
  }
  
  export interface StickyIdea {
    t: string;
    x: number;
    y: number;
  }
  
  export interface MindMapNode {
    id: number;
    t: string;
    p: number;
    x: number;
    y: number;
  }
  
  export interface SubProblem {
    t: string;
    lens: Record<string, string>;
    q: string[];
  }
  
  export interface ReportTable {
    title: string;
    headers: string[];
    rows: string[][];
  }
  
  export type TheoryDiagramType = "none" | "addie" | "iceberg" | "shannon" | "flowchart";
  
  export interface TheoryDiagramSpec {
    type: TheoryDiagramType;
    caption: string;
    // Untuk ADDIE & Shannon-Weaver (5 tahap + footer feedback + top noise opsional)
    stages?: { title: string; desc: string }[];
    footerNote?: string;
    topNote?: string;
    // Untuk Competency Iceberg (1 atas air + 3 bawah air)
    aboveWater?: { label: string; callout: string };
    belowWater?: { label: string; callout: string }[];
    // Untuk Flowchart Keputusan
    flowSteps?: {
      start: string;
      inspect: string;
      decision1: string;
      noBranch: string;
      yesStep1: string;
      yesStep2: string;
      yesStep3: string;
      decision2: string;
      rejectBox: string;
      rejectClose: string;
      finalCheck: string;
      end: string;
    };
  }
  
  export interface LearningObjective {
    t: string;
    theory: string;
    applied: string;
    synth: string;
    sum: string;
    diagram?: TheoryDiagramSpec;
    tables?: ReportTable[];
  }
  
  export interface SynthesisSection {
    title: string;
    body: string;
    note?: string;
    diagram?: TheoryDiagramSpec;
    tables?: ReportTable[];
  }
  
  export interface ReportCover {
    title: string;
    course: string;
    lect: string;
    year: string;
    members: string[];
  }
  
  export interface PblState {
    step: number;
    case: string;
    words: HardWord[];
    task: string | null;
    method: string | null;
    label: string;
    problem: string;
    color: string;
    lists: Record<string, string[]>;
    why: string[];
    ideas: StickyIdea[];
    mm: MindMapNode[];
    refs: string[];
    subs: SubProblem[];
    los: LearningObjective[];
    step6Intro?: string;
    synthSections?: SynthesisSection[];
    src: string;
    concl: string;
    cover: ReportCover;
  }