import { PblState } from "@/types/pbl";

export const STEP_NAMES = [
  "Understand",
  "Main Problem",
  "Analysis",
  "Perspectives",
  "Objectives",
  "Theory",
  "Synthesis",
  "Export",
];

export const STEP_TIPS = [
  "Baca teks kasus dengan saksama, tandai istilah sulit, lalu tentukan tipe tugas dan metode analisis.",
  "Rumuskan masalah utama kelompok dalam satu paragraf yang ringkas dan jelas.",
  "Eksplorasi akar masalah atau opsi solusi menggunakan template. Geser node untuk merapikan diagram.",
  "Tinjau tiap sub-masalah dari berbagai perspektif. Pertanyaan yang belum terjawab dapat dijadikan Learning Objective.",
  "Susun Learning Objective dan cari kutipan pendukung dari teks buku referensi.",
  "Lengkapi setiap Learning Objective dengan landasan teori serta contoh implementasi nyata.",
  "Sintesis teori dan penerapan menjadi analisis utuh, lalu tulis kesimpulan akhir kelompok.",
  "Lengkapi halaman sampul, periksa pratinjau laporan, dan unduh dalam format Word (.docx) atau PDF.",
];

export const TASKS: [string, string, string, string[]][] = [
  ["Problem Task", "Diagnostic & Root-Cause", "Menyelidiki kegagalan atau anomali untuk menemukan akar penyebabnya.", ["5 WHY", "Fishbone", "Problem Tree"]],
  ["Strategy Task", "Decision & Prioritization", "Menimbang berbagai opsi dan trade-off untuk menentukan keputusan terbaik.", ["Mind Map", "SWOT", "PESTEL"]],
  ["Discussion Task", "Perspective & Debate", "Mengkaji isu multi-pemangku kepentingan tanpa satu jawaban tunggal.", ["Six Thinking Hats", "Brainstorm"]],
  ["Study Task", "Inquiry & Knowledge Gap", "Membangun pemahaman topik baru dengan menutup kesenjangan pengetahuan.", ["KWL Chart", "Mind Map"]],
  ["Application Task", "Practical Application", "Menerapkan teori atau model tertentu untuk menyelesaikan kasus konkret.", ["Mind Map", "Fishbone"]],
  ["Action Task", "Implementation Plan", "Menyusun rencana kerja operasional lengkap dengan tahapan dan target.", ["Brainstorm", "Reverse Assumption"]],
];

export const METHODS: [string, string][] = [
  ["Brainstorm", "Ideasi divergen cepat untuk mengumpulkan hipotesis dan pertanyaan awal."],
  ["Mind Map", "Hierarki visual yang memetakan cabang ide dari masalah utama."],
  ["5 WHY", "Bertanya 'mengapa?' secara berulang untuk menelusuri gejala hingga akar masalah."],
  ["Fishbone", "Diagram Ishikawa yang mengelompokkan penyebab berdasarkan kategori terstruktur."],
  ["Reverse Assumption", "Membalik asumsi umum untuk menemukan celah dan sudut pandang tersembunyi."],
  ["SWOT", "Memetakan kekuatan dan kelemahan internal terhadap peluang dan ancaman eksternal."],
  ["PESTEL", "Menganalisis faktor Politik, Ekonomi, Sosial, Teknologi, Lingkungan, dan Hukum."],
  ["Problem Tree", "Memetakan dampak, masalah inti, dan akar penyebab dalam satu alur logis."],
  ["5W1H", "Memperjelas situasi melalui What, Who, Where, When, Why, dan How."],
  ["Stakeholder Map", "Memetakan pemangku kepentingan berdasarkan tingkat pengaruh dan kepentingan."],
  ["Six Thinking Hats", "Meninjau persoalan dari enam sudut pandang terpisah secara sistematis."],
  ["KWL Chart", "Memilah hal yang sudah diketahui (Know), ingin diketahui (Want), dan dipelajari (Learned)."],
];

export const FISHBONE_CATS = ["People", "Methods", "Machines", "Materials", "Measurement", "Environment"];
export const LENSES = ["Ekonomi", "Regulasi", "Sosial", "Teknis", "Lingkungan"];
export const ACCENT_COLORS = ["#1e40af", "#0f766e", "#be123c", "#b45309", "#334155"];

export interface GridTemplate {
  cols: number;
  boxes: { k: string; t: string; h: string; c: string }[];
}

const makeGrid = (cols: number, ...boxes: [string, string, string, string][]): GridTemplate => ({
  cols,
  boxes: boxes.map(([k, t, h, c]) => ({ k, t, h, c })),
});

export const TEMPLATES: Record<string, GridTemplate> = {
  SWOT: makeGrid(
    2,
    ["sw_s", "Strengths", "Keunggulan internal yang dapat dioptimalkan.", "#047857"],
    ["sw_w", "Weaknesses", "Keterbatasan internal yang perlu diatasi.", "#b45309"],
    ["sw_o", "Opportunities", "Peluang eksternal yang dapat dimanfaatkan.", "#1e40af"],
    ["sw_t", "Threats", "Ancaman eksternal yang harus dimitigasi.", "#be123c"]
  ),
  PESTEL: makeGrid(
    3,
    ["pe_p", "Political", "Kebijakan pemerintah, stabilitas, hubungan dagang.", "#1e40af"],
    ["pe_e", "Economic", "Pertumbuhan, inflasi, struktur biaya, nilai tukar.", "#0f766e"],
    ["pe_s", "Social", "Demografi, budaya, penerimaan masyarakat.", "#b45309"],
    ["pe_t", "Technological", "Inovasi, otomasi, kesiapan infrastruktur.", "#6d28d9"],
    ["pe_en", "Environmental", "Iklim, sumber daya alam, keberlanjutan.", "#047857"],
    ["pe_l", "Legal", "Undang-undang, regulasi, kepatuhan, kontrak.", "#be123c"]
  ),
  "Six Thinking Hats": makeGrid(
    3,
    ["hat_w", "White Hat", "Fakta, data objektif, dan informasi yang dibutuhkan.", "#475569"],
    ["hat_r", "Red Hat", "Intuisi, persepsi, dan reaksi emosional.", "#be123c"],
    ["hat_b", "Black Hat", "Risiko, kehati-hatian, dan potensi hambatan.", "#1e293b"],
    ["hat_y", "Yellow Hat", "Manfaat, nilai tambah, dan optimisme.", "#b45309"],
    ["hat_g", "Green Hat", "Gagasan baru, alternatif, dan kreativitas.", "#047857"],
    ["hat_u", "Blue Hat", "Proses berpikir, kendali, dan gambaran besar.", "#1e40af"]
  ),
  "KWL Chart": makeGrid(
    3,
    ["kw_k", "Know", "Hal yang sudah diketahui dari kasus.", "#1e40af"],
    ["kw_w", "Want to Know", "Pertanyaan yang perlu dicari jawabannya.", "#b45309"],
    ["kw_l", "Learned", "Temuan dan pemahaman baru yang diperoleh.", "#047857"]
  ),
  "Reverse Assumption": makeGrid(
    3,
    ["ra_a", "Standard Assumption", "Asumsi umum yang dianggap berlaku.", "#475569"],
    ["ra_i", "Inverted Assumption", "Kebalikan dari asumsi standar tersebut.", "#6d28d9"],
    ["ra_x", "Hidden Insight", "Peluang atau temuan baru dari pembalikan asumsi.", "#0f766e"]
  ),
  "Problem Tree": makeGrid(
    1,
    ["pt_e", "Effects", "Dampak nyata yang muncul akibat masalah inti.", "#be123c"],
    ["pt_c", "Core Problem", "Pernyataan masalah utama yang menjadi pusat kajian.", "#0f172a"],
    ["pt_r", "Root Causes", "Faktor mendasar yang memicu terjadinya masalah.", "#047857"]
  ),
  "5W1H": makeGrid(
    3,
    ["w_what", "What", "Apa persoalan atau kebutuhan utamanya?", "#1e40af"],
    ["w_who", "Who", "Siapa pihak yang terlibat atau terdampak?", "#0f766e"],
    ["w_where", "Where", "Di mana lokasi atau konteks kejadiannya?", "#b45309"],
    ["w_when", "When", "Kapan tenggat waktu atau urutannya?", "#6d28d9"],
    ["w_why", "Why", "Mengapa hal tersebut penting atau terjadi?", "#be123c"],
    ["w_how", "How", "Bagaimana mekanisme atau langkah penyelesaiannya?", "#047857"]
  ),
  "Stakeholder Map": makeGrid(
    2,
    ["st_m", "High Power, High Interest", "Kelola secara intensif (Manage Closely).", "#be123c"],
    ["st_s", "High Power, Low Interest", "Jaga kepuasan mereka (Keep Satisfied).", "#b45309"],
    ["st_i", "Low Power, High Interest", "Berikan informasi berkala (Keep Informed).", "#1e40af"],
    ["st_o", "Low Power, Low Interest", "Pantau secara berkala (Monitor).", "#475569"]
  ),
};

export const INITIAL_STATE: PblState = {
  step: 1,
  case: "",
  words: [],
  task: null,
  method: null,
  label: "Main Problem",
  problem: "",
  color: ACCENT_COLORS[0],
  lists: {
    L: [""],
    R: [""],
    People: [""],
    Methods: [""],
    Machines: [""],
    Materials: [""],
    Measurement: [""],
    Environment: [""],
  },
  why: ["", "", "", "", ""],
  ideas: [],
  mm: [],
  refs: [""],
  subs: [],
  los: [],
  src: "",
  concl: "",
  cover: {
    title: "",
    course: "",
    lect: "",
    year: "2026",
    members: [""],
  },
};

// Tambahkan atau perbarui bagian ini di src/constants/pbl.ts

export const SAMPLE_CASE =
  "Clare Bartlett Brad is a production engineer at a bicycle company. Part of his job includes inspecting broken bikes and drafting the design plans for their repair. One day, Brad receives instructions from his supervisor to repair a bike whose brake cables had snapped. When Brad inspects the bike, he notices the cables had snapped because they were made from a low-quality material. He suspects that this bike had been custom designed, and that the customer simply did not know what materials would be best suited for the brake cables. Therefore, when Brad drafts his design plans for the repair of the bike, he incorporates a more durable material for the cables. When Brad goes to repair the bike, he finds out the customer had specifically requested that the bike be repaired, but no aesthetic changes should be made to the bike. Brad’s design for the bike will change the look of the bike, but it will also make the bike more durable. When Brad goes to his manager and asks him what to do, his manager tells him that “the customer is always right” and he should repair the bike as the customer requested. Brad knows he could repair the bike according to the customer’s wishes, but if he does, the bike will break down again in a few months, perhaps dangerously. However, if he implements his design improvements, he risks going against his manager and the wishes of the customer.";

  export const FULL_SAMPLE_DATA: Partial<PblState> = {
    case: SAMPLE_CASE,
    words: [
      { t: "Durable", m: "Long-lasting", s: "Paham" },
      { t: "Snapped", m: "Broken", s: "Paham" },
      { t: "Inspect", m: "Checking", s: "Paham" },
    ],
    task: "Discussion Task",
    method: "Brainstorm",
    label: "Main Problem — Task 1: Bicycle",
    problem:
      "How should Brad balance customer safety and his technical engineering judgment against the customer's aesthetic request and the manager's 'the customer is always right' directive, given the lack of communication and clear SOPs?",
    ideas: [
      { t: "Customer Preference vs. Safety: Low-quality brake cable preserves aesthetics but poses a safety risk.", x: 6, y: 10 },
      { t: "Unclear Instruction: Manager follows 'the customer is always right' despite safety risks.", x: 38, y: 10 },
      { t: "Different Perspective: Durable cable makes bike safer but changes custom bike appearance.", x: 70, y: 10 },
      { t: "Clear boundary between SOP vs Customer request", x: 6, y: 48 },
      { t: "Tech skill communication & Manager avoidant style", x: 38, y: 48 },
      { t: "Training as mandatory orientation (3 month) evaluation & manager training", x: 70, y: 48 },
    ],
    subs: [
      {
        t: "Employee Competency Development & Continuous Performance Evaluation",
        lens: {
          Teknis: "Implementing structured orientation, technical training, and periodic evaluations to improve employees’ technical skills, safety awareness, and communication abilities.",
          Sosial: "Conducting monthly performance reviews to monitor employees’ technical competency, SOP compliance, communication, and safety performance.",
        },
        q: ["How do ADDIE and Competency Iceberg models address technical and behavioral gaps?"],
      },
      {
        t: "SOP Standardization & Safety Approval System",
        lens: {
          Regulasi: "Establishing clear and standardized operating procedures and work instructions to ensure employees consistently follow safety requirements.",
          Teknis: "Introducing a safety-check process for customer requests, ensuring every modification is reviewed for technical feasibility and safety compliance before execution.",
        },
        q: ["How should conflicts between customer preferences and safety standards be governed?"],
      },
      {
        t: "Preventive Management & Integrated Communication Flow",
        lens: {
          Sosial: "Shifting managers from an avoidant/reactive approach toward preventive management through regular safety checks, risk identification, and early corrective actions.",
          Ekonomi: "Creating a clear communication chain between customers, managers, and employees so customer requirements are translated into safe work instructions.",
        },
        q: ["Where does communication noise distort safety concerns between Brad and his manager?"],
      },
    ],
    step6Intro:
      "For each learning objective, this section summarises the relevant theory and then states the data the company should gather to confirm and size the problem.",
    los: [
      {
        t: "Training Theory: ADDIE Model",
        theory:
          "The ADDIE model is a systematic instructional design framework with five phases: Analysis, Design, Development, Implementation and Evaluation (Branch, 2009). In HR practice it ensures that training starts from a real performance gap and ends with measured results (Noe, 2020). Training effectiveness can be judged at four levels: reaction, learning, behaviour and results (Kirkpatrick & Kirkpatrick, 2006).",
        applied: "",
        synth: "",
        sum: "",
        diagram: {
          type: "addie",
          caption: "Figure 2. ADDIE model applied to the bicycle company",
          stages: [
            { title: "Analysis", desc: "Identify competency gaps in technical skill, safety knowledge, communication and procedure use" },
            { title: "Design", desc: "Set learning objectives; design safety, communication and decision-making modules" },
            { title: "Development", desc: "Prepare SOPs, case-based materials, checklists and the safety review form" },
            { title: "Implementation", desc: "Run the 3-month orientation and manager training; apply SOPs in daily repairs" },
            { title: "Evaluation", desc: "Monthly reviews; track rework, SOP compliance and escalation quality" },
          ],
          footerNote: "Evaluation results feed back into the next analysis cycle (continuous improvement)",
        },
        tables: [
          {
            title: "Table 14. ADDIE applied to the case",
            headers: ["ADDIE phase", "Observation in the case", "Data needed"],
            rows: [
              [
                "Analysis (training needs analysis)",
                "Brad can identify the technical problem and design a safer repair, but the organization gives no framework for safety-related decisions: a competency gap at organizational level",
                "Employees' current technical skills, safety knowledge and understanding of company procedures",
              ],
              [
                "Design / Development",
                "Training must cover technical repair, safety awareness, communication and handling conflicts between requests and requirements",
                "Learning objectives, case materials, SOPs and checklists to be built",
              ],
              [
                "Implementation",
                "Unclear whether employees receive enough preparation for situations where customer requests conflict with safety",
                "How orientation, technical training, safety training and work instructions are currently delivered",
              ],
              [
                "Evaluation",
                "No evidence that performance is checked after training",
                "How technical competency, procedure compliance, communication and safety decision-making are evaluated after training",
              ],
            ],
          },
        ],
      },
      {
        t: "Employee Competency: Competency Iceberg Model",
        theory:
          "The Competency Iceberg distinguishes visible competencies (knowledge and skills), which are easier to develop, from less visible ones (self-concept, traits and motives), which drive behaviour but are harder to see and change (Spencer & Spencer, 1993). The model reminds the company that technical ability alone is not enough for a safe decision.",
        applied: "",
        synth: "",
        sum: "",
        diagram: {
          type: "iceberg",
          caption: "Figure 3. Competency Iceberg applied to the case (adapted from Spencer & Spencer, 1993)",
          aboveWater: {
            label: "KNOWLEDGE & SKILLS",
            callout: "Visible and easiest to train: Brad identifies the low-quality cable material and drafts a more durable design",
          },
          belowWater: [
            {
              label: "SELF-CONCEPT (attitudes, values)",
              callout: "Values and professional responsibility: Brad treats safety as a duty, but is unsure whether he may challenge the instruction",
            },
            {
              label: "TRAITS (consistent ways of responding)",
              callout: "Judgment, communication and problem-solving under pressure: how Brad raises the concern",
            },
            {
              label: "MOTIVES (drives behind action)",
              callout: "Commitment to doing the job properly; manager's drive to keep the customer satisfied",
            },
          ],
        },
        tables: [
          {
            title: "Table 15. Competency data needed",
            headers: ["Competency area", "Iceberg level", "Observation in the case", "Data needed"],
            rows: [
              [
                "Technical knowledge and skills",
                "Visible",
                "Brad identifies the low-quality cable and proposes a durable alternative",
                "Whether employees can reliably spot product defects and design technically appropriate fixes",
              ],
              [
                "Values and professional responsibility",
                "Hidden (self-concept)",
                "Conflict between following the manager and protecting product safety",
                "Employees' understanding of safety standards and their authority to challenge an unsafe instruction",
              ],
              [
                "Behavioural competency",
                "Hidden (traits, motives)",
                "Brad must communicate a safety concern effectively and use judgment under pressure",
                "Communication, problem-solving, judgment and decision-making evidence from reviews and observation",
              ],
            ],
          },
        ],
      },
      {
        t: "Business Communication: Shannon-Weaver Model",
        theory:
          "The Shannon-Weaver model describes communication as a flow from an information source through a transmitter, channel and receiver to a destination, with noise able to distort the message at any point (Shannon & Weaver, 1949). Applied to the case, it helps locate where Brad's technical finding lost its force on the way to a decision.",
        applied: "",
        synth: "",
        sum: "",
        diagram: {
          type: "shannon",
          caption: "Figure 4. Shannon-Weaver model applied to the communication between Brad and his manager",
          topNote: "NOISE: 'the customer is always right', assumptions about the customer's wishes, unclear SOP",
          stages: [
            { title: "Information source", desc: "Brad's technical finding: cables failed because of low-quality material" },
            { title: "Transmitter", desc: "Brad encodes the finding into a repair design and a question to the manager" },
            { title: "Channel", desc: "Verbal exchange; no formal safety-report or escalation channel" },
            { title: "Receiver", desc: "Manager decodes it as a customer-service issue, not a safety issue" },
            { title: "Destination", desc: "Instruction to repair as the customer requested; Brad is left with the dilemma" },
          ],
          footerNote: "FEEDBACK: absent or informal; the customer is never part of the loop before the design is drafted",
        },
        tables: [
          {
            title: "Table 16. Communication data needed",
            headers: ["Element", "Observation in the case", "Data needed"],
            rows: [
              [
                "Communication flow",
                "Customer, Brad and manager are all involved, but the customer's requirement reached Brad after the design was drafted",
                "How customer requirements are passed to employees, and how technical concerns are passed back to management",
              ],
              [
                "Noise",
                "The phrase 'the customer is always right' makes the aesthetic request look more important than the safety concern",
                "Whether unclear instructions, assumptions or differing understanding contribute to the problem",
              ],
              [
                "Feedback mechanism",
                "No sign of a formal way for employees to report safety concerns and get a response",
                "Whether a formal reporting and feedback channel exists, so that Brad's information could reach decision-makers before the repair",
              ],
            ],
          },
        ],
      },
      {
        t: "Leadership Style: Situational Leadership Theory",
        theory:
          "Situational Leadership Theory holds that effective leaders adjust their style to the readiness of the follower, meaning the follower's competence and commitment for the task (Hersey & Blanchard, 1969; Blanchard et al., 1985). The four styles range from directing (S1) to coaching (S2), supporting (S3) and delegating (S4).",
        applied:
          "Brad shows high technical competence and visible concern for the outcome, which suggests D3 to D4 for this task. A flat instruction to follow the customer is closer to an S1 style, so the style does not match his readiness. Because a brake failure is a high-risk outcome, the manager should still keep accountability for the final decision. A supporting approach with shared decision-making fits best.",
        synth: "",
        sum: "",
        tables: [
          {
            title: "Table 17. Follower readiness and matching leadership style",
            headers: ["Readiness level", "Follower profile", "Matching style"],
            rows: [
              ["D1", "Low competence, high commitment", "S1 Directing"],
              ["D2", "Some competence, low commitment", "S2 Coaching"],
              ["D3", "High competence, variable commitment", "S3 Supporting"],
              ["D4", "High competence, high commitment", "S4 Delegating"],
            ],
          },
          {
            title: "Table 18. Leadership data needed",
            headers: ["Element", "Observation in the case", "Data needed"],
            rows: [
              [
                "Managerial response",
                "Manager tells Brad to follow the customer despite the technical concern",
                "How managers normally respond when employees raise technical or safety concerns",
              ],
              [
                "Employee readiness",
                "Brad shows strong technical knowledge and a safer alternative",
                "Whether management gives employees an appropriate level of autonomy and support",
              ],
              [
                "Decision-making and support",
                "The manager gives no reasoning and takes no visible responsibility",
                "Whether managers give guidance, invite employee input and own the decision when advice and customer wishes conflict",
              ],
            ],
          },
        ],
      },
      {
        t: "Safety and Organizational Decision-Making",
        theory:
          "The central decision in the case is an ethical and organizational one. Three reference points frame it. First, bicycle safety standards: ISO 4210-2 sets safety requirements for bicycles, including the brake system (International Organization for Standardization, 2015). Second, consumer protection: in Indonesia, Law No. 8 of 1999 on Consumer Protection recognises the consumer's right to security and safety in using goods and services and obliges business actors to guarantee the quality of what they provide (Republic of Indonesia, 1999). Third, psychological safety: employees speak up about risk when they believe they will not be punished for doing so (Edmondson, 1999). A company that answers every safety concern with 'the customer is always right' discourages exactly the reporting it needs.",
        applied: "",
        synth: "",
        sum: "",
        tables: [
          {
            title: "Table 19. Safety and decision-making data needed",
            headers: ["Element", "Observation in the case", "Data needed"],
            rows: [
              [
                "Safety standard",
                "Brake cables are a safety-critical part",
                "Material specifications, testing requirements and quality standards that must be met before a repaired bike is returned (including relevant parts of ISO 4210-2)",
              ],
              [
                "Customer preference vs. safety",
                "Direct conflict between the customer's appearance request and Brad's recommendation",
                "Company policy for resolving conflicts between customer preference and product safety",
              ],
              [
                "Accountability and risk",
                "No one is named as responsible if the repair fails",
                "Who has final authority for safety decisions, who is accountable for a failure, and what the escalation path is",
              ],
            ],
          },
        ],
      },
      {
        t: "Data collection plan",
        theory: "",
        applied: "",
        synth: "",
        sum: "",
        tables: [
          {
            title: "Table 20. Plan for collecting the data",
            headers: ["Data needed", "Source", "Method", "Related theory"],
            rows: [
              ["Employee skills and safety knowledge", "Technicians, training records", "Skills assessment, review of records", "ADDIE, Iceberg"],
              ["Existing orientation and training content", "HR, Operations", "Document review, interview with HR", "ADDIE"],
              ["Current SOPs and work instructions", "Quality department", "Document review", "Safety and decision-making"],
              ["Communication of customer requirements", "Customer service, supervisors, Brad", "Process mapping, interviews", "Shannon-Weaver"],
              ["Manager response to employee concerns", "Employees, past incidents", "Interviews, short survey", "Situational Leadership"],
              ["Material and brake specifications", "Supplier data, ISO 4210-2", "Specification review, test results", "Safety and decision-making"],
              ["Rework and repeat-failure history", "Repair and complaint logs", "Data analysis", "All"],
            ],
          },
        ],
      },
    ],
    synthSections: [
      {
        title: "7.1 Integrated analysis",
        body: "Based on the data and the theoretical analysis, the main problem in the bicycle company is not simply the failure of the brake cables. It is the lack of an integrated system for managing technical problems, customer requirements and safety-related decisions. Brad demonstrated adequate technical competency by identifying the low-quality material and developing a more durable alternative. However, his recommendation conflicts with the customer's request to keep the bike's appearance, and his supervisor tells him to put the customer's wishes first. Customer satisfaction, employee responsibility, managerial authority and product safety are not aligned.",
        tables: [
          {
            title: "Table 21. Synthesis: from theory to finding to recommendation",
            headers: ["Theory", "Key finding in the case", "Recommendation"],
            rows: [
              [
                "ADDIE",
                "A structured employee development system is missing; competency gaps are not identified, trained or evaluated",
                "Train technical repair, safety awareness, communication, problem-solving and conflict handling; evaluate continuously",
              ],
              [
                "Competency Iceberg",
                "Technical knowledge alone is not enough; employees also need professional responsibility, judgment and confidence to raise concerns",
                "Build a system that allows and encourages employees to voice safety concerns",
              ],
              [
                "Shannon-Weaver",
                "The customer requirement and the technical concern are not communicated clearly or in time; 'the customer is always right' acts as noise",
                "Define a clear communication flow and a formal Safety Review and Escalation Process",
              ],
              [
                "Situational Leadership",
                "A directing style was used with a highly competent employee",
                "Involve Brad in the decision, evaluate his recommendation, and let the supervisor take responsibility for the final decision",
              ],
              [
                "Safety and decision-making",
                "Safety standards, authority and accountability are undefined",
                "Make safety a non-negotiable criterion with clear decision rights and escalation",
              ],
            ],
          },
        ],
      },
      {
        title: "7.2 Proposed solution: Integrated Safety-Based Decision-Making System",
        body: "The company should implement an Integrated Safety-Based Decision-Making System involving three key stakeholders: Brad as the technical evaluator, the supervisor as the managerial decision-maker, and the customer as the provider of product preferences and requirements. The process starts with the customer's request, followed by Brad's technical and safety assessment. If the requested repair creates a safety concern, the issue is escalated to the supervisor, who balances customer preferences with technical and safety requirements before approving the repair. This allows the customer's preferences to remain part of the decision while ensuring safety is not overlooked. The system is supported by standardized SOPs, safety approval procedures, employee training, competency evaluations and clear communication channels.",
        diagram: {
          type: "flowchart",
          caption: "Figure 5. Proposed Safety Review and Escalation Process",
          flowSteps: {
            start: "Customer submits repair request (requirements recorded in writing)",
            inspect: "Technician inspects the bike and performs a safety assessment",
            decision1: "Safety concern identified?",
            noBranch: "Proceed with repair per standard SOP",
            yesStep1: "Document findings with evidence and propose safe alternatives",
            yesStep2: "Supervisor safety review (technical and safety approval)",
            yesStep3: "Customer consultation and informed consent",
            decision2: "Customer accepts safe solution?",
            rejectBox: "Manager decides: decline the unsafe work or apply the documented policy",
            rejectClose: "Case documented and closed",
            finalCheck: "Quality check and brake function test",
            end: "Delivery, record keeping and feedback to the team",
          },
        },
        tables: [
          {
            title: "Table 22. Decision rights (RACI) in the Safety Review and Escalation Process",
            headers: ["Activity", "Customer", "Brad (technician)", "Supervisor / manager", "HR / Quality"],
            rows: [
              ["Record customer requirements in writing", "C", "R", "A", "I"],
              ["Inspect and assess safety", "I", "R", "A", "C"],
              ["Document findings and propose safe alternatives", "I", "R", "A", "C"],
              ["Safety review and approval", "I", "C", "R / A", "C"],
              ["Informed-consent conversation with the customer", "R (decides within safe options)", "C", "A", "I"],
              ["Decline or apply policy if the customer refuses a safe option", "I", "C", "R / A", "C"],
              ["Quality check and brake function test", "I", "R", "A", "C"],
              ["Training, SOP upkeep and monthly review", "I", "C", "R", "A"],
            ],
          },
        ],
        note: "R = Responsible, A = Accountable, C = Consulted, I = Informed.",
      },
      {
        title: "7.3 Recommended immediate action for Brad's case",
        body: "1. Do not release the bike with the same low-quality cable. The brake is a safety-critical component, and the likely failure is foreseeable.\n2. Document the evidence: photos of the snapped cable, the material finding and the expected consequence.\n3. Escalate in writing to the supervisor, presenting the finding and at least one alternative that tries to protect both safety and appearance (for example, a higher-grade cable that looks the same, if one exists; this must be verified with the supplier).\n4. Ask the supervisor to hold an informed-consent conversation with the customer, explaining why the original material failed and what the options are.\n5. If the customer still refuses every safe option, the manager (not Brad alone) decides whether to decline the work or to proceed under a documented company policy.\n6. Record the outcome and feed it into the SOP review so that the next case follows a known path.\nBecause the exact materials and policies are not given in the case, steps 3 and 5 depend on facts the company must confirm.",
      },
      {
        title: "7.4 Implementation roadmap",
        body: "",
        tables: [
          {
            title: "Table 23. Implementation roadmap",
            headers: ["Phase", "Timing", "Actions", "Output"],
            rows: [
              [
                "1. Stabilize",
                "Month 0-1",
                "Introduce the safety review rule for brake and other safety-critical parts; appoint a decision owner; start recording customer requirements in writing",
                "Interim safety approval rule; named accountable person",
              ],
              [
                "2. Standardize",
                "Month 1-3",
                "Draft and approve SOPs; adopt the Safety Review Form (Appendix A); define the communication flow",
                "Approved SOPs, forms and flow",
              ],
              [
                "3. Develop people",
                "Month 1-6",
                "Run the 3-month orientation and manager training (Appendix B); coach managers toward a preventive, supporting style",
                "Trained employees and managers",
              ],
              [
                "4. Evaluate and improve",
                "From month 3",
                "Monthly performance review; review cases; update SOPs and training",
                "Review reports; improvement list",
              ],
            ],
          },
        ],
      },
      {
        title: "7.5 Evaluation and key performance indicators",
        body: "Evaluation follows the four Kirkpatrick levels (Kirkpatrick & Kirkpatrick, 2006). The targets below are proposals to be set by management once a baseline has been measured.",
        tables: [
          {
            title: "Table 24. Proposed KPIs",
            headers: ["Indicator", "Measure", "Kirkpatrick level", "Proposed target"],
            rows: [
              ["Safety review coverage", "% of safety-critical repairs with a completed Safety Review Form", "Results", "100%"],
              ["Repeat failures", "Number of safety-related repeat repairs per period", "Results", "Falling trend; goal of zero for brake components"],
              ["SOP compliance", "% of audited repairs that follow the SOP", "Behaviour", "Set after baseline"],
              ["Training completion and test results", "Completion of orientation; knowledge test scores", "Learning", "100% completion within 3 months"],
              ["Escalation quality", "Time to decision; % of escalations with a documented outcome", "Behaviour", "Set after baseline"],
              ["Participant reaction", "Feedback from employees and managers on training", "Reaction", "Positive trend"],
              ["Customer satisfaction", "Survey after repair, including satisfaction with explanation of safety choices", "Results", "Stable or rising"],
            ],
          },
        ],
      },
      {
        title: "7.6 Anticipated challenges and mitigation",
        body: "",
        tables: [
          {
            title: "Table 25. Implementation risks and mitigation",
            headers: ["Challenge", "Mitigation"],
            rows: [
              ["Managers resist losing discretion", "Include managers in SOP design; explain that the process protects them from sole accountability"],
              ["Customers dislike changes to appearance", "Offer alternatives, show the safety evidence, and use informed consent"],
              ["Extra steps slow down repairs", "Apply the full review only to safety-critical parts; use a short checklist for routine work"],
              ["Employees still stay silent", "Reinforce psychological safety: respond to every concern, and recognise good escalations"],
              ["Training does not change behaviour", "Use real cases, follow-up coaching and monthly reviews instead of one-off classes"],
            ],
          },
        ],
      },
      {
        title: "7.7 Overall synthesis",
        body: "The proposed restructuring moves the company from a reactive and customer-driven approach to a preventive, safety-oriented management system. The objective is not to ignore customer preferences, but to make sure customer satisfaction is achieved without compromising product safety or professional responsibility. With stronger employee competency, clearer communication and more appropriate leadership, the company can reduce repeated product failure, clarify accountability between Brad and his supervisor, and settle future conflicts constructively.",
      },
    ],
    concl: "",
    refs: [
      "Blanchard, K., Zigarmi, P., & Zigarmi, D. (1985). Leadership and the One Minute Manager. William Morrow.",
      "Branch, R. M. (2009). Instructional Design: The ADDIE Approach. Springer.",
      "Edmondson, A. (1999). Psychological safety and learning behavior in work teams. Administrative Science Quarterly, 44(2), 350–383.",
      "Hersey, P., & Blanchard, K. H. (1969). Management of Organizational Behavior: Utilizing Human Resources. Prentice-Hall.",
      "International Organization for Standardization. (2015). ISO 4210-2: Cycles — Safety requirements for bicycles — Part 2: Requirements for city and trekking, young adult, mountain and racing bicycles.",
      "Kirkpatrick, D. L., & Kirkpatrick, J. D. (2006). Evaluating Training Programs: The Four Levels (3rd ed.). Berrett-Koehler.",
      "Noe, R. A. (2020). Employee Training and Development (8th ed.). McGraw-Hill Education.",
      "Republic of Indonesia. (1999). Law No. 8 of 1999 on Consumer Protection.",
      "Shannon, C. E., & Weaver, W. (1949). The Mathematical Theory of Communication. University of Illinois Press.",
      "Spencer, L. M., & Spencer, S. M. (1993). Competence at Work: Models for Superior Performance. John Wiley & Sons.",
    ],
    cover: {
      title: "REPORT: PROBLEM BASED LEARNING (Task 1: Bicycle)",
      course: "Management — Faculty of Economics and Business, Trisakti University",
      lect: "Dr. Andreas Wahyu Gunawan Putra, M.B.A., CHRMP, MCE",
      year: "2026",
      members: [
        "Mutiara Bunga Armanda (022002501070)",
        "William Susanto (022002501039)",
        "Fidelis Armando Gedeby Youw (0220025011420)",
        "Dustin Fernando Timisela (022002501177)",
      ],
    },
  };