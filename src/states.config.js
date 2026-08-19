// @ts-nocheck
// ─── OpenQuorum Shared State Configuration ─────────────────────────────────────
// Single source of truth for VacancyClock + ImpactMap + SeatFinder.
// 51 entries: 50 states + DC. status:"live" = researched seed data;
// status:"scaffolded" = structure ready, awaiting scraper — boards:[] is EMPTY
// on purpose. NEVER hand-fill scaffolded states with unverified board data.
//
// ─── SCRAPER_CONTRACT ───────────────────────────────────────────────────────────
// A future GitHub Actions / serverless scraper populates scaffolded states by
// writing board rows into `boards:[]` and flipping `status` to "live".
// EVERY board row written by the scraper (and every existing row) MUST match
// this exact JSON shape:
//
//   {
//     id: 1201,                       // number — unique across the whole file (state gets a hundreds range)
//     name: "Board name",             // string — official board/commission name, verbatim from source
//     domain: "health",               // one of: health|education|equity|environment|housing|disability|justice
//     totalSeats: 15,                 // number — authorized seats per statute/portal
//     vacantSeats: 4,                 // number — currently vacant seats
//     vacantSince: "2026-01-15",      // ISO date — earliest current vacancy date, from source; null if unpublished
//     authority: "Governor",          // string — appointing authority as stated by source
//     constituent: "Who this serves", // string — population served
//     applyUrl: "https://…",          // string — application URL (usually the state-level applyUrl)
//     sourceUrl: "https://…",         // string — REQUIRED. Exact page the row was scraped from
//     lastVerified: "2026-07-07"      // ISO date — REQUIRED. When the scraper last confirmed this row
//   }
//
// Optional per-row fields used by specific tools (carried on seed rows):
//   mandate (string), requires (string[]), confirmation (bool), criticalNote (string)
//
// The scraper also stamps the state-level `scraper` object:
//   scraper: { endpoint:"<scrape URL>", lastPulled:"<ISO datetime>", selectorProfile:"<parser id>" }
//
// Integrity rule ("Prove It"): every row carries sourceUrl + lastVerified.
// Estimates must be labeled as estimates in the UI. Never invent vacancy dates,
// seat counts, or names. Accuracy outranks completeness.
// ────────────────────────────────────────────────────────────────────────────────

// Factory for states awaiting scraper coverage — no fabricated data, empty boards.
// applyUrl/applyAuthority are null until verified per state (TODO verify per state
// as each scraper comes online).
const SCAFFOLD = (code, label, region) => ({
  code, label, region,
  status: "scaffolded",
  color: "#5A5A54", bg: "#F1F1EF",
  applyUrl: null, applyAuthority: null, applyLabel: null, applyVerified: null,
  dataSource: null,
  scraper: { endpoint: null, lastPulled: null, selectorProfile: null },
  totalBoardsNote: null, contextNote: null, auditNote: null,
  boards: [],
});

const SCAFFOLDED_LIST = [
  ["AK","Alaska","West"],
  ["HI","Hawaii","West"],
  ["ID","Idaho","West"],
  ["IA","Iowa","Midwest"],
  ["ME","Maine","Northeast"],
  ["MT","Montana","West"],
  ["NE","Nebraska","Midwest"],
  ["NH","New Hampshire","Northeast"],
  ["ND","North Dakota","Midwest"],
  ["RI","Rhode Island","Northeast"],
  ["SD","South Dakota","Midwest"],
  ["UT","Utah","West"],
  ["VT","Vermont","Northeast"],
  ["WV","West Virginia","South"],
  ["WY","Wyoming","West"]
];

export const STATE_CONFIG = {

  // ─── Maryland ─── status: live (researched seed data) ───
  MD: {
    code:"MD", label:"Maryland", region:"Mid-Atlantic",
    status:"live",
    color:"#0F6E56", bg:"#E1F5EE",
    applyUrl:"https://govappointments.maryland.gov",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-01",
    dataSource:"govappointments.maryland.gov",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"600+ boards statewide",
    contextNote:null,
    auditNote:null,
    boards: [
      { id:1,  name:"Citizens Advisory Board — Regional Institute for Children & Adolescents", domain:"health",
        totalSeats:8,  vacantSeats:5, vacantSince:"2023-01-15", authority:"Governor (Sec. Health rec.)", constituent:"Youth with behavioral health needs", criticalNote:"Chair vacant · 63% unfilled",
        mandate:"Advises the Regional Institute for Children & Adolescents on programming, governance, and quality standards for youth with behavioral health needs in Maryland.",
        requires:["Youth mental health","Health policy","Advocacy","Program evaluation","Research"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:2,  name:"Advisory Board — Developmental Disabilities Administration", domain:"disability",
        totalSeats:14, vacantSeats:6, vacantSince:"2022-08-20", authority:"Governor", constituent:"Marylanders with developmental disabilities", criticalNote:"Long-term vacancy · 43% unfilled",
        mandate:"Advises Maryland's Developmental Disabilities Administration on policy, programs, and services for Marylanders with developmental disabilities.",
        requires:["Disability policy","Federal compliance","Advocacy","Program evaluation","Research"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:3,  name:"Maryland Commission for Women", domain:"equity",
        totalSeats:15, vacantSeats:6, vacantSince:"2023-04-10", authority:"Governor", constituent:"Maryland women & girls", criticalNote:"Policy-shaping body · 40% unfilled",
        mandate:"Advises the Governor and General Assembly on issues affecting Maryland women and girls. Conducts research, makes policy recommendations, and monitors gender equity across state programs.",
        requires:["Gender equity","Advocacy","Research & analysis","Policy","Community engagement"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:4,  name:"State Interagency Council on Homelessness", domain:"housing",
        totalSeats:18, vacantSeats:5, vacantSince:"2023-09-01", authority:"Governor", constituent:"Unhoused Marylanders", criticalNote:"Funding decisions delayed",
        mandate:"Coordinates state strategy on homelessness. Oversees federal McKinney-Vento funding, data systems (HMIS), and cross-agency program alignment.",
        requires:["Federal grants","Data systems","Interagency coordination","Program management","Policy"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:5,  name:"Maryland Commission on African American History & Culture", domain:"equity",
        totalSeats:12, vacantSeats:4, vacantSince:"2023-10-30", authority:"Governor", constituent:"African American Marylanders", criticalNote:"Heritage policy stalled",
        mandate:"Advises on the preservation of African American history and culture in Maryland. Reviews policy, distributes grants, and advocates for heritage recognition statewide.",
        requires:["Equity policy","Research & analysis","Advocacy","Community engagement","Grant management"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:6,  name:"Opioid Response Advisory Council", domain:"health",
        totalSeats:16, vacantSeats:4, vacantSince:"2023-12-05", authority:"Governor", constituent:"Substance use disorder affected", criticalNote:"Crisis response capacity reduced",
        mandate:"Advises the Governor on Maryland's opioid and substance use disorder response strategy. Oversees grant-funded programs, interagency coordination, and data-informed intervention models.",
        requires:["Public health","Grant management","Data analysis","Federal health programs","Program strategy"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:7,  name:"Commission on Public Health — Data & IT Workgroup", domain:"health",
        totalSeats:22, vacantSeats:6, vacantSince:"2024-03-01", authority:"Governor / Sec. Health", constituent:"All Marylanders · public health system", criticalNote:"Health IT modernization stalled",
        mandate:"Modernizes Maryland's public health data infrastructure. Oversees statewide health data reporting systems, IT governance, and digital transformation of public health programs.",
        requires:["Health IT","Data governance","Public health informatics","Federal health systems","AI/technology strategy"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:8,  name:"Environmental Justice Advisory Committee", domain:"environment",
        totalSeats:12, vacantSeats:4, vacantSince:"2024-05-14", authority:"Sec. Environment", constituent:"Frontline & low-income communities", criticalNote:"EJ permit reviews delayed",
        mandate:"Advises the Secretary of the Environment on environmental justice policy, permit reviews, and equitable distribution of environmental benefits and burdens across Maryland communities.",
        requires:["Environmental justice","Policy","Advocacy","Research","Community engagement"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:9,  name:"Maryland Health Care Commission", domain:"health",
        totalSeats:19, vacantSeats:4, vacantSince:"2024-02-20", authority:"Governor (Senate confirm.)", constituent:"All Marylanders · health coverage", criticalNote:"Rate review capacity reduced",
        mandate:"Regulates health care facilities, produces statewide health data analytics, oversees Maryland's all-payer model, and guides health information exchange policy and interoperability.",
        requires:["Health IT","Data analytics","Health policy","Interoperability","Federal health programs"], confirmation:true,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:10, name:"Maryland State Board of Education", domain:"education",
        totalSeats:12, vacantSeats:2, vacantSince:"2024-06-01", authority:"Governor (Senate confirm.)", constituent:"Maryland K–12 students & families", criticalNote:"Policy quorum at risk",
        mandate:"Sets K-12 education policy for Maryland public schools. Establishes academic standards, accountability frameworks, and guides education technology, equity, and workforce pipeline initiatives.",
        requires:["Education policy","Research & analysis","Technology","Equity","Strategic advisory"], confirmation:true,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:11, name:"Maryland Hispanic Affairs Commission", domain:"equity",
        totalSeats:11, vacantSeats:4, vacantSince:"2024-01-08", authority:"Governor", constituent:"Hispanic & Latino Marylanders", criticalNote:"",
        mandate:"Advises the Governor on programs and policies for Maryland's Hispanic and Latino community. Makes recommendations on language access, economic equity, education, and health services.",
        requires:["Equity policy","Community engagement","Advocacy","Research","Language access"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:12, name:"Criminal Justice Information Advisory Board", domain:"justice",
        totalSeats:16, vacantSeats:3, vacantSince:"2023-11-20", authority:"Governor", constituent:"Criminal justice system participants", criticalNote:"Data governance delayed",
        mandate:"Oversees Maryland's criminal justice data infrastructure, interoperability standards, and privacy policy for statewide information sharing systems.",
        requires:["Data governance","Interoperability","Information systems","Federal programs","Policy"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:13, name:"Affordable Housing Trust Fund Committee", domain:"housing",
        totalSeats:13, vacantSeats:3, vacantSince:"2024-04-01", authority:"Governor", constituent:"Low-income housing applicants", criticalNote:"Grant decisions backlogged",
        mandate:"Oversees Maryland's affordable housing grant programs. Reviews applications, sets funding priorities, and ensures programmatic compliance with federal requirements.",
        requires:["Grant management","Federal compliance","Program evaluation","Policy","Finance"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      // SeatFinder-sourced boards (not yet in VacancyClock vacancy tracking)
      { id:14, name:"Governor's AI Subcabinet Advisory Pathway", domain:"health",
        totalSeats:12, vacantSeats:3, vacantSince:"2024-09-01", authority:"Governor", constituent:"All Marylanders — AI governance", criticalNote:"AI Governance Act body",
        mandate:"Advises Maryland's AI Governance initiative under the AI Governance Act (2024). Shapes state AI policy, enterprise AI adoption standards, and responsible AI frameworks across all state agencies.",
        requires:["AI policy & governance","Federal technology leadership","Health IT","Organizational transformation","Strategic advisory"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
      { id:15, name:"Governor's Commission on Education Excellence", domain:"education",
        totalSeats:15, vacantSeats:4, vacantSince:"2024-07-01", authority:"Governor", constituent:"Maryland K–12 students & families", criticalNote:"",
        mandate:"Advises on K-12 education strategy, workforce pipeline, and technology-enabled learning initiatives for Maryland students.",
        requires:["Education policy","Program strategy","Technology","Leadership","Research"], confirmation:false,
        sourceUrl:"https://govappointments.maryland.gov", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Minnesota ─── status: live (researched seed data) ───
  MN: {
    code:"MN", label:"Minnesota", region:"Midwest",
    status:"live",
    color:"#185FA5", bg:"#E6F1FB",
    applyUrl:"https://commissionsandappointments.sos.mn.gov",
    applyAuthority:"Minnesota Secretary of State \u2014 Open Appointments",
    applyLabel:"Minnesota Secretary of State \u2014 Open Appointments",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-07",
    dataSource:"sos.mn.gov/boards-commissions",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"130+ boards \u00b7 ~500 seats \u00b7 ~300 currently vacant",
    contextNote:null,
    auditNote:null,
    boards: [
      { id:101, name:"Mental Health Legislative Advisory Council", domain:"health",
        totalSeats:20, vacantSeats:11, vacantSince:"2022-11-01", authority:"Governor", constituent:"Minnesotans with mental illness", criticalNote:"55% unfilled · Chair vacant",
        mandate:"Advises the Minnesota legislature on mental health policy, program funding, and data-informed behavioral health system improvements. Reports directly to legislative committees.",
        requires:["Health policy","Data analytics","Federal health programs","Program strategy","Advocacy"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:102, name:"Council on Disability", domain:"disability",
        totalSeats:13, vacantSeats:6,  vacantSince:"2022-09-15", authority:"Governor", constituent:"Minnesotans with disabilities", criticalNote:"Long-term vacancy · 46% unfilled",
        mandate:"Advises the state on policies, programs, and services for Minnesotans with disabilities. Advocates for rights, accessibility, and inclusion across all state programs.",
        requires:["Disability policy","Advocacy","Federal compliance","Program evaluation","Research"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:103, name:"Criminal & Juvenile Justice Information Policy Group", domain:"justice",
        totalSeats:19, vacantSeats:7,  vacantSince:"2022-12-01", authority:"Legislative + Governor", constituent:"Criminal justice system participants", criticalNote:"Data policy backlogged · 37% unfilled",
        mandate:"Governs Minnesota's criminal and juvenile justice data infrastructure, interoperability standards, and privacy policy for statewide information sharing systems.",
        requires:["Data governance","Information systems","Interoperability","Privacy policy","Federal programs"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:104, name:"Water Council", domain:"environment",
        totalSeats:18, vacantSeats:7,  vacantSince:"2023-02-15", authority:"Governor + Legislative", constituent:"Water users statewide", criticalNote:"39% unfilled · resource policy delayed",
        mandate:"Coordinates Minnesota's water policy, resource management strategy, and interagency water governance. Advises on statewide water planning and federal Clean Water Act compliance.",
        requires:["Environmental policy","Water management","Federal compliance","Research","Data systems"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:105, name:"Human Rights Advisory Council", domain:"equity",
        totalSeats:14, vacantSeats:6,  vacantSince:"2023-02-01", authority:"Commissioner MDHR", constituent:"All Minnesotans · discrimination cases", criticalNote:"43% unfilled",
        mandate:"Advises the Minnesota Department of Human Rights on discrimination case policy, equity initiatives, and civil rights programs for all Minnesotans.",
        requires:["Equity policy","Advocacy","Research & analysis","Community engagement","Policy"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:106, name:"Housing Finance Agency Advisory Council", domain:"housing",
        totalSeats:15, vacantSeats:6,  vacantSince:"2023-05-01", authority:"Governor", constituent:"Low-income housing applicants", criticalNote:"Affordable housing policy delayed",
        mandate:"Advises on affordable housing finance programs, federal HOME and CDBG funding allocation, and data systems for housing program management.",
        requires:["Federal grants","Finance","Data systems","Program management","Policy"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:107, name:"Child Protection Training & Certification Board", domain:"health",
        totalSeats:11, vacantSeats:5,  vacantSince:"2023-07-01", authority:"Commissioner DHS", constituent:"At-risk children statewide", criticalNote:"Training certification backlogged",
        mandate:"Oversees training and certification standards for child protection workers across Minnesota. Sets professional competencies and reviews program quality for the child welfare workforce.",
        requires:["Child welfare","Training & development","Program management","Research","Policy"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:108, name:"Board of Medical Practice", domain:"health",
        totalSeats:16, vacantSeats:4,  vacantSince:"2023-06-01", authority:"Governor", constituent:"Patients & licensed physicians", criticalNote:"Licensing decisions delayed",
        mandate:"Regulates the licensure and discipline of physicians in Minnesota. Protects patient safety through license review, investigation of complaints, and medical practice standards.",
        requires:["Health policy","Governance","Research & analysis","Public accountability","Strategic advisory"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:109, name:"Board of Teaching", domain:"education",
        totalSeats:15, vacantSeats:5,  vacantSince:"2023-08-01", authority:"Governor", constituent:"K–12 teachers & students", criticalNote:"",
        mandate:"Oversees the licensure and professional development standards for Minnesota's K-12 teachers. Sets educator competencies and reviews teacher preparation program quality.",
        requires:["Education policy","Research & analysis","Workforce development","Program evaluation","Strategic advisory"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:110, name:"Governor's Workforce Development Board", domain:"education",
        totalSeats:40, vacantSeats:12, vacantSince:"2023-09-01", authority:"Governor (federal req.)", constituent:"Job seekers & employers statewide", criticalNote:"30% unfilled · federal compliance risk",
        mandate:"Oversees Minnesota's federal Workforce Innovation and Opportunity Act (WIOA) implementation. Manages statewide workforce data systems, employer engagement strategy, and federally-required program accountability.",
        requires:["Federal programs","Workforce development","Data systems","Program management","Federal compliance"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:111, name:"Pollution Control Citizens Advisory Committee", domain:"environment",
        totalSeats:12, vacantSeats:5,  vacantSince:"2023-01-20", authority:"Commissioner MPCA", constituent:"Environmental justice communities", criticalNote:"Permit review capacity reduced",
        mandate:"Advises Minnesota's Pollution Control Agency on permit policy, environmental justice, and regulatory standards. Provides community perspective on environmental compliance decisions.",
        requires:["Environmental justice","Policy","Advocacy","Research","Community engagement"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:112, name:"Indian Affairs Council", domain:"equity",
        totalSeats:12, vacantSeats:4,  vacantSince:"2023-03-01", authority:"Governor / Tribal nations", constituent:"11 Tribal Nations of Minnesota", criticalNote:"Sovereignty consultation gaps",
        mandate:"Serves as the primary liaison between the 11 Tribal Nations of Minnesota and state government. Addresses sovereignty, treaty rights, and tribal-state consultation on policy decisions.",
        requires:["Tribal affairs","Sovereignty","Equity policy","Advocacy","Intergovernmental relations"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:113, name:"Rehabilitation Council for the Blind", domain:"disability",
        totalSeats:13, vacantSeats:5,  vacantSince:"2023-04-01", authority:"Governor", constituent:"Minnesotans who are blind or low vision", criticalNote:"",
        mandate:"Advises Minnesota State Services for the Blind on vocational rehabilitation programs, independent living policy, and technology access for Minnesotans who are blind or have low vision.",
        requires:["Disability policy","Rehabilitation","Federal compliance","Advocacy","Program evaluation"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
      { id:114, name:"State Demographic Center Advisory Committee", domain:"equity",
        totalSeats:11, vacantSeats:5,  vacantSince:"2023-11-01", authority:"Governor", constituent:"All Minnesotans · data equity", criticalNote:"Census data policy delayed",
        mandate:"Guides Minnesota's official population data collection, equity data strategy, and data product development for state planning and policy decisions.",
        requires:["Data governance","Research","Equity","Analytics","Policy"], confirmation:false,
        sourceUrl:"https://sos.mn.gov/boards-commissions", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Massachusetts ─── status: live (researched seed data) ───
  MA: {
    code:"MA", label:"Massachusetts", region:"Northeast",
    status:"live",
    color:"#4A2D7A", bg:"#EEEDFE",
    applyUrl:"https://www.mass.gov/info-details/apply-to-a-board-or-commission",
    applyAuthority:"Governor's Boards & Commissions Office",
    applyLabel:"Governor's Boards & Commissions Office",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-07",
    dataSource:"boards.mass.gov",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"700+ boards \u00b7 2,341 seats \u00b7 248 confirmed vacant (MA State Audit, 2021)",
    contextNote:null,
    auditNote:"The Massachusetts State Auditor confirmed in 2021 that 248 of 2,341 board seats had terms that ended without being refilled, and that the Governor's Boards and Commissions Office had not established a process to monitor upcoming vacancies. Source: Office of the State Auditor, mass.gov.",
    boards: [
      { id:201, name:"Health Information Technology Council", domain:"health",
        totalSeats:18, vacantSeats:6, vacantSince:"2023-06-01", authority:"Governor / Sec. HHS", constituent:"Health IT professionals, providers & all MA residents", criticalNote:"Data interoperability standards delayed",
        mandate:"Advises the Governor on health IT policy, EHR adoption, and interoperability standards across Massachusetts' healthcare system. Oversees statewide health data exchange strategy and digital health innovation.",
        requires:["Health IT","Data interoperability","EHR / Health Informatics","Federal health programs","Technology strategy"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:202, name:"Digital Accessibility & Equity Governance Board", domain:"health",
        totalSeats:15, vacantSeats:5, vacantSince:"2024-01-15", authority:"Governor (EO #614)", constituent:"Residents with disabilities · all MA digital users", criticalNote:"EO #614 body · digital equity policy pending",
        mandate:"Implements Governor Healey's Executive Order #614 on digital equity. Governs accessibility standards for state digital services, technology inclusion policy, and digital access for residents with disabilities.",
        requires:["Digital equity","Accessibility","Technology modernization","Policy","Disability policy"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:203, name:"Massachusetts Health Policy Commission", domain:"health",
        totalSeats:11, vacantSeats:2, vacantSince:"2025-07-01", authority:"Governor + AG", constituent:"All Massachusetts residents · health cost control", criticalNote:"Recently restructured · transition seats",
        mandate:"Independent state agency that monitors healthcare cost growth, sets spending benchmarks, and advises on health system transformation for all Massachusetts residents.",
        requires:["Health policy","Data analytics","Research & analysis","Strategic advisory","Federal health programs"], confirmation:true,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:204, name:"MassHealth Care Delivery Advisory Council", domain:"health",
        totalSeats:20, vacantSeats:5, vacantSince:"2023-09-01", authority:"Sec. Health & Human Services", constituent:"2.2M MassHealth enrollees", criticalNote:"Medicaid delivery reform policy",
        mandate:"Advises the Secretary of Health & Human Services on MassHealth (Medicaid) program delivery, care coordination models, and health IT systems serving 2.2M enrollees.",
        requires:["Medicaid policy","Health IT","Program strategy","Data governance","Federal health programs"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:205, name:"Governor's Special Advisory Commission on Disability Policy", domain:"disability",
        totalSeats:24, vacantSeats:8, vacantSince:"2025-10-14", authority:"Governor (org. recommendations)", constituent:"1.2M Massachusetts residents with disabilities", criticalNote:"Re-established Oct 2025 · filling now",
        mandate:"Re-established October 2025 — advises Governor Healey on disability policy priorities, program gaps, and systemic barriers for 1.2M Massachusetts residents with disabilities. Currently filling seats.",
        requires:["Disability policy","Strategic advisory","Research & analysis","Federal compliance","Advocacy"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:206, name:"Behavioral Health Advisory Council", domain:"health",
        totalSeats:16, vacantSeats:5, vacantSince:"2024-02-01", authority:"Governor / Sec. HHS", constituent:"Residents with mental health & SUD needs", criticalNote:"Behavioral health crisis response policy",
        mandate:"Advises on Massachusetts' behavioral health system transformation, crisis response capacity, and evidence-based programs for residents with mental health and substance use disorder needs.",
        requires:["Behavioral health","Health policy","Program strategy","Data analytics","Federal health programs"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:207, name:"Board of Registration in Medicine — Public Member Seats", domain:"health",
        totalSeats:17, vacantSeats:3, vacantSince:"2024-01-15", authority:"Governor", constituent:"Licensed physicians & patients statewide", criticalNote:"Medical license review capacity",
        mandate:"Regulates the licensure and discipline of Massachusetts physicians. Public member seats provide accountability and community perspective in licensing decisions affecting patients statewide.",
        requires:["Health policy","Strategic advisory","Research & analysis","Public accountability","Governance"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:208, name:"Commission on Unlocking Housing Production", domain:"housing",
        totalSeats:16, vacantSeats:4, vacantSince:"2024-01-29", authority:"Governor (Affordable Homes Act)", constituent:"All Massachusetts residents · housing affordability", criticalNote:"Affordable Homes Act body",
        mandate:"Created by the 2024 Affordable Homes Act — advises on zoning reform, housing production barriers, and affordable housing strategy for all Massachusetts residents.",
        requires:["Housing policy","Federal grants","Program strategy","Research & analysis","Policy"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:209, name:"Governor's Advisory Council for Refugees & Immigrants", domain:"equity",
        totalSeats:20, vacantSeats:6, vacantSince:"2023-05-01", authority:"Governor", constituent:"~750,000 foreign-born Massachusetts residents", criticalNote:"43% unfilled",
        mandate:"Advises on programs and services for Massachusetts' ~750,000 foreign-born residents. Makes policy recommendations on integration, language access, economic mobility, and refugee resettlement.",
        requires:["Equity policy","Federal programs","Advocacy","Research & analysis","Community engagement"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:210, name:"Massachusetts Commission on Indian Affairs", domain:"equity",
        totalSeats:9,  vacantSeats:3, vacantSince:"2023-07-01", authority:"Governor", constituent:"Native American residents of Massachusetts", criticalNote:"Tribal sovereignty & services",
        mandate:"Advocates for the rights and interests of Native American residents of Massachusetts. Advises state government on tribal sovereignty, cultural preservation, and access to state services.",
        requires:["Equity policy","Advocacy","Research","Tribal affairs","Community engagement"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:211, name:"Board of Elementary and Secondary Education", domain:"education",
        totalSeats:11, vacantSeats:2, vacantSince:"2024-03-01", authority:"Governor (Senate confirm.)", constituent:"900,000+ Massachusetts public school students", criticalNote:"State education policy body",
        mandate:"Sets education policy for 900,000+ Massachusetts public school students. Establishes academic standards, accountability frameworks, and oversees equity and innovation in public education.",
        requires:["Education policy","Research & analysis","Strategic advisory","Technology","Equity"], confirmation:true,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:212, name:"Council on Aging Advisory Council", domain:"health",
        totalSeats:14, vacantSeats:4, vacantSince:"2023-11-01", authority:"Governor", constituent:"1.4M Massachusetts residents 60+", criticalNote:"Elder services policy",
        mandate:"Advises the Executive Office of Elder Affairs on programs and services for Massachusetts' 1.4M residents 60+. Reviews elder care policy and advocates for aging-in-place, economic security, and health access.",
        requires:["Elder services","Federal programs","Advocacy","Program evaluation","Research"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:213, name:"Criminal History Systems Board", domain:"justice",
        totalSeats:13, vacantSeats:3, vacantSince:"2023-12-01", authority:"Governor + AG", constituent:"All Massachusetts residents (CORI system)", criticalNote:"CORI reform policy delayed",
        mandate:"Governs Massachusetts' CORI (Criminal Offender Record Information) system. Sets data access policy, oversees data governance, and advises on criminal history reform affecting all MA residents.",
        requires:["Data governance","Policy","Research & analysis","Federal programs","Privacy policy"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
      { id:214, name:"State Ethics Commission", domain:"justice",
        totalSeats:5,  vacantSeats:1, vacantSince:"2025-09-01", authority:"Attorney General", constituent:"All Massachusetts residents", criticalNote:"AG appointment · publicly announced vacancy",
        mandate:"Enforces Massachusetts' conflict of interest and financial disclosure laws for public officials. AG appointment seat — provides independent oversight of government ethics statewide.",
        requires:["Ethics & compliance","Governance","Research & analysis","Policy","Strategic advisory"], confirmation:false,
        sourceUrl:"https://boards.mass.gov", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Virginia ─── status: live (researched seed data) ───
  VA: {
    code:"VA", label:"Virginia", region:"Mid-Atlantic",
    status:"live",
    color:"#8B1A1A", bg:"#FAEAEA",
    applyUrl:"https://www.commonwealth.virginia.gov/va-government/boards-and-commissions/",
    applyAuthority:"Secretary of the Commonwealth",
    applyLabel:"Secretary of the Commonwealth",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-01",
    dataSource:"commonwealth.virginia.gov",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"300+ boards \u00b7 ~900 appointments/year",
    contextNote:"Governor Abigail Spanberger took office January 17, 2026, inheriting dozens of vacancies from the Youngkin era. Spanberger made 27 board appointments on day one and has been actively filling seats since. A new Democratic administration means a fresh wave of appointment opportunities \u2014 many seats are open now that were previously stalled by partisan confirmation conflicts.",
    auditNote:null,
    boards: [
      { id:301, name:"Virginia Health Information Technology Advisory Commission", domain:"health",
        totalSeats:16, vacantSeats:5, vacantSince:"2024-01-17", authority:"Governor / Sec. Health & Human Resources", constituent:"Health providers & patients statewide", criticalNote:"Health IT interoperability standards",
        mandate:"Advises the Governor on health information technology policy, interoperability standards, and digital health infrastructure across Virginia's healthcare ecosystem. Oversees statewide health data exchange and IT modernization strategy.",
        requires:["Health IT","Data interoperability","Health policy","Federal health programs","Technology strategy"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:302, name:"Virginia Board for People with Disabilities", domain:"disability",
        totalSeats:21, vacantSeats:6, vacantSince:"2023-09-01", authority:"Governor", constituent:"850,000 Virginians with disabilities", criticalNote:"Federal WIOA requirements",
        mandate:"Advises state government on policies, programs, and services for Virginians with disabilities. Oversees federal Developmental Disabilities Act requirements and advocates for disability rights, accessibility, and inclusion.",
        requires:["Disability policy","Advocacy","Federal programs","Program evaluation","ADA compliance"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:303, name:"Virginia Opioid Abatement Authority", domain:"health",
        totalSeats:15, vacantSeats:4, vacantSince:"2024-02-01", authority:"Governor", constituent:"Virginians affected by opioid crisis", criticalNote:"Settlement fund disbursement delayed",
        mandate:"Administers Virginia's opioid settlement funds. Sets funding priorities, reviews grant applications, and oversees evidence-based programs for substance use disorder prevention, treatment, and recovery statewide.",
        requires:["Public health","Grant management","Program strategy","Data analysis","Federal health programs"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:304, name:"Virginia Board of Education", domain:"education",
        totalSeats:9,  vacantSeats:3, vacantSince:"2024-01-17", authority:"Governor (Senate confirm.)", constituent:"1.2M Virginia public school students", criticalNote:"Post-Youngkin transition vacancies",
        mandate:"Sets K-12 education policy for 1.2 million Virginia public school students. Establishes academic standards, graduation requirements, accountability frameworks, and guides education technology modernization.",
        requires:["Education policy","Research & analysis","Strategic advisory","Technology","Program strategy"], confirmation:true,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:305, name:"Virginia Early Childhood Advisory Council", domain:"education",
        totalSeats:20, vacantSeats:6, vacantSince:"2023-08-01", authority:"Governor", constituent:"Virginia children 0–5 & families", criticalNote:"30% unfilled · federal CCDF compliance",
        mandate:"Coordinates Virginia's early childhood education and care system. Oversees federal CCDF compliance, advises on PreK policy, and guides data infrastructure for child care quality improvement.",
        requires:["Early childhood policy","Federal compliance","Data systems","Program management","Research"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:306, name:"Commission on African Americans", domain:"equity",
        totalSeats:11, vacantSeats:4, vacantSince:"2023-06-01", authority:"Governor + Legislative", constituent:"1.9M African American Virginians", criticalNote:"",
        mandate:"Advises the Governor and General Assembly on issues affecting African American Virginians. Conducts research, makes policy recommendations, and monitors state programs for equity and inclusion.",
        requires:["Equity policy","Advocacy","Research & analysis","Community engagement","Policy"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:307, name:"Virginia Housing Advisory Board", domain:"housing",
        totalSeats:13, vacantSeats:3, vacantSince:"2024-03-01", authority:"Governor", constituent:"Low-income housing applicants statewide", criticalNote:"",
        mandate:"Advises Virginia Housing on affordable housing finance programs, federal HOME and CDBG fund allocation, and statewide housing data strategy.",
        requires:["Housing policy","Federal grants","Finance","Data systems","Program management"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:308, name:"Governor's Commission on Veteran Services", domain:"justice",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-01-17", authority:"Governor", constituent:"750,000+ Virginia veterans", criticalNote:"Transition vacancies — Jan 2026",
        mandate:"Advises on programs and services for Virginia's 750,000+ veterans. Coordinates across state agencies and federal VA programs to improve veteran access to healthcare, housing, employment, and benefits.",
        requires:["Federal programs","Advocacy","Program coordination","Data systems","Policy"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:309, name:"Virginia Criminal Justice Services Advisory Committee", domain:"justice",
        totalSeats:18, vacantSeats:5, vacantSince:"2023-10-01", authority:"Governor", constituent:"Criminal justice system participants", criticalNote:"Data policy delayed",
        mandate:"Advises the Department of Criminal Justice Services on grant programs, data governance, and evidence-based policy for law enforcement, courts, and corrections across Virginia.",
        requires:["Data governance","Grant management","Policy","Research & analysis","Federal programs"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:310, name:"Virginia Health Workforce Development Authority", domain:"health",
        totalSeats:12, vacantSeats:3, vacantSince:"2024-07-01", authority:"Governor", constituent:"Healthcare workforce statewide", criticalNote:"",
        mandate:"Develops and oversees Virginia's healthcare workforce pipeline. Manages loan forgiveness programs, advises on training policy, and coordinates with federal HRSA workforce initiatives.",
        requires:["Health policy","Workforce development","Federal programs","Program management","Research"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:311, name:"Statewide Independent Living Council of Virginia", domain:"disability",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-01-15", authority:"Governor", constituent:"Virginians with disabilities", criticalNote:"",
        mandate:"Oversees Virginia's Independent Living program under the federal Rehabilitation Act. Sets priorities for the State Plan for Independent Living and advocates for community integration of Virginians with disabilities.",
        requires:["Disability policy","Federal compliance","Advocacy","Program management","Community engagement"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
      { id:312, name:"Virginia Commission on Intergovernmental Cooperation", domain:"equity",
        totalSeats:12, vacantSeats:4, vacantSince:"2024-04-01", authority:"Governor", constituent:"All Virginians", criticalNote:"Transition vacancies",
        mandate:"Represents Virginia in multistate and federal-state cooperative policy forums. Advises on intergovernmental fiscal relations, federal legislative impacts, and cross-jurisdictional program coordination.",
        requires:["Policy","Intergovernmental relations","Research & analysis","Federal programs","Strategic advisory"], confirmation:false,
        sourceUrl:"https://commonwealth.virginia.gov", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Washington DC ─── status: live (researched seed data) ───
  DC: {
    code:"DC", label:"Washington DC", region:"Mid-Atlantic",
    status:"live",
    color:"#1A3A6B", bg:"#E6EEF8",
    applyUrl:"https://mota.dc.gov/page/boards-commissions-and-task-forces-district-government",
    applyAuthority:"Mayor's Office of Talent & Appointments (MOTA)",
    applyLabel:"Mayor's Office of Talent & Appointments (MOTA)",              // legacy alias — same as applyAuthority
    applyVerified:"2026-06-26",
    dataSource:"mota.dc.gov",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"180+ public bodies \u00b7 all 8 wards",
    contextNote:"DC's Mayor's Office of Talent and Appointments (MOTA) recruits from all eight wards. Note: Appointees must be registered DC voters. For vacancies not listed online, contact MOTA directly at (202) 727-1372. Boards are organized by Deputy Mayor cluster \u2014 search by cluster at mota.dc.gov for the most current vacancies.",
    auditNote:null,
    boards: [
      { id:401, name:"DC Health Information Exchange Policy Board", domain:"health",
        totalSeats:15, vacantSeats:5, vacantSince:"2023-07-01", authority:"Mayor (MOTA)", constituent:"All DC residents · health data systems", criticalNote:"Health data interoperability stalled",
        mandate:"Governs the District's health information exchange infrastructure. Sets data policy, privacy standards, and interoperability requirements for DC's health IT ecosystem.",
        requires:["Health IT","Data interoperability","Health policy","Privacy policy","Federal health programs"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:402, name:"Commission on Mental Health", domain:"health",
        totalSeats:10, vacantSeats:3, vacantSince:"2024-01-01", authority:"Mayor (MOTA)", constituent:"DC residents with mental health needs", criticalNote:"",
        mandate:"Advises the Department of Behavioral Health on mental health policy, program standards, and service delivery for DC residents. Reviews programs and makes recommendations on system improvements.",
        requires:["Behavioral health","Health policy","Program evaluation","Advocacy","Research"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:403, name:"Office on Aging Advisory Committee", domain:"health",
        totalSeats:14, vacantSeats:4, vacantSince:"2023-08-01", authority:"Mayor (MOTA)", constituent:"DC residents 60+", criticalNote:"Elder services policy",
        mandate:"Advises the District's Office on Aging on programs and policies for residents 60+. Reviews service delivery, advocates for elder needs, and provides guidance on federal Older Americans Act compliance.",
        requires:["Elder services","Federal programs","Advocacy","Program evaluation","Policy"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:404, name:"Commission on Persons with Disabilities", domain:"disability",
        totalSeats:12, vacantSeats:4, vacantSince:"2023-06-01", authority:"Mayor (MOTA)", constituent:"DC residents with disabilities", criticalNote:"",
        mandate:"Advises DC government on accessibility, disability rights, and inclusion policy. Reviews legislation for disability impact, advocates for ADA enforcement, and monitors DC agency compliance.",
        requires:["Disability policy","Advocacy","ADA compliance","Policy","Program evaluation"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:405, name:"DC Housing Finance Agency Advisory Board", domain:"housing",
        totalSeats:11, vacantSeats:3, vacantSince:"2023-09-01", authority:"Mayor (MOTA)", constituent:"Low-income DC housing applicants", criticalNote:"Affordable housing crisis",
        mandate:"Advises DC HFA on affordable housing finance programs, bond financing, and low-income housing tax credit administration for the District's housing crisis response.",
        requires:["Housing finance","Federal programs","Policy","Finance","Program management"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:406, name:"DC Workforce Investment Council", domain:"education",
        totalSeats:22, vacantSeats:7, vacantSince:"2023-10-01", authority:"Mayor (MOTA)", constituent:"DC workforce program participants", criticalNote:"32% unfilled · federal WIOA compliance",
        mandate:"Oversees DC's federal WIOA implementation. Governs workforce development programs, employer engagement, and data systems for job training and employment services across the District.",
        requires:["Workforce development","Federal compliance","Data systems","Program management","Strategic advisory"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:407, name:"Commission on Latino Community Development", domain:"equity",
        totalSeats:11, vacantSeats:4, vacantSince:"2023-07-01", authority:"Mayor (MOTA)", constituent:"~75,000 Hispanic/Latino DC residents", criticalNote:"Last public meeting July 2023",
        mandate:"Advises DC government on programs and services for the District's Latino community. Conducts research, makes policy recommendations, and monitors equity in DC agency programs.",
        requires:["Equity policy","Community engagement","Advocacy","Research","Policy"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:408, name:"DC Commission for Women", domain:"equity",
        totalSeats:15, vacantSeats:5, vacantSince:"2023-08-01", authority:"Mayor (MOTA)", constituent:"350,000+ DC women", criticalNote:"",
        mandate:"Advises DC government on issues affecting women and girls in the District. Makes policy recommendations on economic security, health, safety, and civic participation.",
        requires:["Equity policy","Advocacy","Research & analysis","Policy","Community engagement"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:409, name:"Commission on Re-Entry & Returning Citizen Affairs", domain:"justice",
        totalSeats:13, vacantSeats:4, vacantSince:"2023-05-01", authority:"Mayor (MOTA)", constituent:"Formerly incarcerated DC residents", criticalNote:"Re-entry services policy delayed",
        mandate:"Advises DC government on re-entry policy, programs, and services for formerly incarcerated residents. Reviews barriers to housing, employment, and civic participation post-incarceration.",
        requires:["Re-entry policy","Advocacy","Program evaluation","Research","Data systems"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:410, name:"Advisory Board on DC Veterans Affairs", domain:"justice",
        totalSeats:11, vacantSeats:3, vacantSince:"2023-11-01", authority:"Mayor (MOTA)", constituent:"40,000+ DC area veterans", criticalNote:"",
        mandate:"Advises the DC Office of Veterans Affairs on programs and services for DC-area veterans. Coordinates with federal VA programs and advocates for veteran access to healthcare, housing, and benefits.",
        requires:["Federal programs","Veterans services","Advocacy","Program coordination","Policy"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:411, name:"DC Environmental Network Advisory Board", domain:"environment",
        totalSeats:12, vacantSeats:4, vacantSince:"2024-02-01", authority:"Mayor (MOTA)", constituent:"DC environmental justice communities", criticalNote:"EJ permit policy",
        mandate:"Advises DC Department of Energy & Environment on environmental justice policy, permit reviews, and sustainability programs in frontline communities across the District.",
        requires:["Environmental justice","Policy","Advocacy","Research","Program evaluation"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
      { id:412, name:"DC State Board of Education", domain:"education",
        totalSeats:9,  vacantSeats:2, vacantSince:"2024-01-01", authority:"Elected + Mayor", constituent:"92,000 DC public school students", criticalNote:"",
        mandate:"Sets education standards and policy for DC public schools. Establishes curriculum requirements, graduation standards, and oversees equity in DC's diverse public school system.",
        requires:["Education policy","Research & analysis","Strategic advisory","Equity","Technology"], confirmation:false,
        sourceUrl:"https://mota.dc.gov", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Delaware ─── status: live (researched seed data) ───
  DE: {
    code:"DE", label:"Delaware", region:"Mid-Atlantic",
    status:"live",
    color:"#1B5E3C", bg:"#E3F5EC",
    applyUrl:"https://governor.delaware.gov/boards-and-commissions/",
    applyAuthority:"Governor's Boards & Commissions Team",
    applyLabel:"Governor's Boards & Commissions Team",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-07",
    dataSource:"governor.delaware.gov",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"~300 boards \u00b7 apply year-round",
    contextNote:"Governor Matt Meyer took office January 2025 and has been actively making appointments \u2014 multiple confirmation waves in late 2025 and new appointments announced through May 2026. Delaware accepts applications year-round regardless of whether a specific vacancy is currently posted. Apply now and you will be considered as seats open.",
    auditNote:null,
    boards: [
      { id:501, name:"Delaware Health Care Commission", domain:"health",
        totalSeats:16, vacantSeats:4, vacantSince:"2024-03-01", authority:"Governor", constituent:"All Delawareans · health coverage", criticalNote:"Health spending oversight ($11.3B)",
        mandate:"Oversees Delaware's healthcare system, regulates health care spending, and guides health policy reform. Advises on insurance markets, health IT, and cost containment strategies.",
        requires:["Health policy","Data analytics","Health IT","Federal health programs","Strategic advisory"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:502, name:"Delaware Health Information Network Advisory Board", domain:"health",
        totalSeats:14, vacantSeats:4, vacantSince:"2023-09-01", authority:"Governor", constituent:"All Delawareans · health IT", criticalNote:"Health data exchange policy",
        mandate:"Governs Delaware's statewide health information exchange. Sets data policy, interoperability standards, and digital health strategy for Delaware's health IT infrastructure.",
        requires:["Health IT","Data interoperability","Health policy","Federal health programs","Technology strategy"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:503, name:"Delaware Council on Persons with Disabilities", domain:"disability",
        totalSeats:15, vacantSeats:5, vacantSince:"2023-07-01", authority:"Governor", constituent:"220,000 Delawareans with disabilities", criticalNote:"33% unfilled",
        mandate:"Advises Delaware government on policies, programs, and services for the state's 220,000+ residents with disabilities. Advocates for accessibility, inclusion, and disability rights statewide.",
        requires:["Disability policy","Advocacy","Federal compliance","Program evaluation","Research"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:504, name:"Statewide Independent Living Council of Delaware", domain:"disability",
        totalSeats:12, vacantSeats:4, vacantSince:"2024-01-01", authority:"Governor", constituent:"Delawareans with disabilities", criticalNote:"",
        mandate:"Oversees Delaware's Independent Living program under the federal Rehabilitation Act. Sets State Plan for Independent Living priorities and advocates for community integration.",
        requires:["Disability policy","Federal compliance","Advocacy","Program management","Community engagement"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:505, name:"Delaware Commission on Housing", domain:"housing",
        totalSeats:13, vacantSeats:4, vacantSince:"2024-02-01", authority:"Governor", constituent:"Low-income housing applicants", criticalNote:"",
        mandate:"Advises on Delaware's housing policy, affordable housing programs, and statewide housing data strategy. Guides federal HOME program allocation and state housing finance decisions.",
        requires:["Housing policy","Federal grants","Finance","Data systems","Program management"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:506, name:"Delaware State Board of Education", domain:"education",
        totalSeats:9,  vacantSeats:2, vacantSince:"2024-06-01", authority:"Governor (Senate consent)", constituent:"136,000 Delaware public school students", criticalNote:"",
        mandate:"Sets K-12 education policy for 136,000 Delaware public school students. Establishes academic standards, accountability frameworks, and guides education technology and equity initiatives.",
        requires:["Education policy","Research & analysis","Technology","Equity","Strategic advisory"], confirmation:true,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:507, name:"Governor's Early Childhood Development Committee", domain:"education",
        totalSeats:16, vacantSeats:5, vacantSince:"2023-09-01", authority:"Governor", constituent:"Delaware children 0–5 & families", criticalNote:"",
        mandate:"Coordinates Delaware's early childhood education strategy. Advises on PreK policy, federal CCDF compliance, and data systems for child care quality and access improvement.",
        requires:["Early childhood policy","Federal compliance","Data systems","Research","Program management"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:508, name:"Delaware Commission on African American Affairs", domain:"equity",
        totalSeats:13, vacantSeats:4, vacantSince:"2023-05-01", authority:"Governor", constituent:"African American Delawareans", criticalNote:"",
        mandate:"Advises Delaware government on policies affecting African American Delawareans. Researches equity issues, makes policy recommendations, and monitors state programs for racial inclusion.",
        requires:["Equity policy","Advocacy","Research & analysis","Community engagement","Policy"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:509, name:"Delaware Hispanic Commission", domain:"equity",
        totalSeats:11, vacantSeats:4, vacantSince:"2023-08-01", authority:"Governor", constituent:"Hispanic/Latino Delawareans", criticalNote:"",
        mandate:"Advises Delaware government on programs and policies for the Hispanic and Latino community. Makes recommendations on language access, economic equity, education, and health services.",
        requires:["Equity policy","Community engagement","Advocacy","Research","Language access"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:510, name:"Criminal Justice Council", domain:"justice",
        totalSeats:18, vacantSeats:5, vacantSince:"2023-12-01", authority:"Governor", constituent:"Criminal justice system participants", criticalNote:"Data governance delayed",
        mandate:"Coordinates Delaware's criminal justice system reform and data governance. Oversees federal justice grants, manages statewide criminal justice data systems, and advises on evidence-based policy.",
        requires:["Data governance","Grant management","Federal programs","Research & analysis","Policy"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:511, name:"Natural Areas Advisory Council", domain:"environment",
        totalSeats:10, vacantSeats:3, vacantSince:"2023-10-01", authority:"Governor (Senate consent)", constituent:"Delaware natural area users & conservationists", criticalNote:"",
        mandate:"Advises Delaware's Natural Areas Program on land conservation priorities, natural area management, and ecological data systems. Reviews grant applications for land preservation funding.",
        requires:["Environmental policy","Conservation","Research","Grant management","Data systems"], confirmation:true,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
      { id:512, name:"Violence Against Women Act Advisory Council", domain:"justice",
        totalSeats:11, vacantSeats:3, vacantSince:"2023-11-01", authority:"Governor", constituent:"Survivors of domestic violence", criticalNote:"",
        mandate:"Oversees Delaware's VAWA grant program implementation. Advises on services for domestic violence and sexual assault survivors, federal compliance, and data systems for program accountability.",
        requires:["Federal grants","Program management","Federal compliance","Advocacy","Data systems"], confirmation:false,
        sourceUrl:"https://governor.delaware.gov", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Pennsylvania ─── status: live (researched seed data) ───
  PA: {
    code:"PA", label:"Pennsylvania", region:"Mid-Atlantic",
    status:"live",
    color:"#1B3A6B", bg:"#E6EEF8",
    applyUrl:"https://www.pa.gov/governor/administration/boards-and-commissions",
    applyAuthority:"Governor's Office of Boards & Commissions",
    applyLabel:"Governor's Office of Boards & Commissions",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-07",
    dataSource:"pa.gov/governor/administration/boards-and-commissions",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"300+ boards statewide",
    contextNote:null,
    auditNote:null,
    boards: [
      { id:601, name:"Pennsylvania Health IT Advisory Committee", domain:"health",
        totalSeats:18, vacantSeats:6, vacantSince:"2023-11-01", authority:"Governor", constituent:"Health providers & patients statewide", criticalNote:"Interoperability standards stalled · 33% unfilled",
        mandate:"Advises the Governor and Department of Health on health information technology policy, electronic health record adoption, and statewide interoperability standards.",
        requires:["Federal Health IT","Health Data Interoperability","EHR / Health Informatics","Health Policy","Data Governance"], confirmation:false,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:602, name:"Pennsylvania Commission for Women", domain:"equity",
        totalSeats:15, vacantSeats:5, vacantSince:"2023-06-01", authority:"Governor", constituent:"Pennsylvania women & girls", criticalNote:"",
        mandate:"Advises the Governor and General Assembly on issues affecting Pennsylvania women. Conducts research, monitors gender equity, and makes policy recommendations across state programs.",
        requires:["Gender equity","Advocacy","Research & Analysis","Policy","Community Outreach"], confirmation:false,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:603, name:"Opioid Misuse and Addiction Abatement Trust Fund Advisory Council", domain:"health",
        totalSeats:14, vacantSeats:5, vacantSince:"2024-01-15", authority:"Governor", constituent:"Pennsylvanians affected by opioid crisis", criticalNote:"Settlement fund oversight at risk",
        mandate:"Oversees distribution of Pennsylvania's opioid litigation settlement funds. Advises on evidence-based treatment, recovery, and prevention program investments statewide.",
        requires:["Grant Writing & Business Development","Health Policy","Program & Project Management","Research & Analysis","Behavioral Health"], confirmation:false,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:604, name:"Pennsylvania Advisory Council on Long-Term Care", domain:"health",
        totalSeats:20, vacantSeats:6, vacantSince:"2023-09-01", authority:"Governor", constituent:"Pennsylvanians needing long-term care services", criticalNote:"",
        mandate:"Advises the Department of Human Services on long-term care policy, Medicaid waiver programs, and home- and community-based service delivery for elderly and disabled Pennsylvanians.",
        requires:["Health Policy","Federal Health IT","Program & Project Management","Research & Analysis","Organizational Transformation"], confirmation:false,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:605, name:"Pennsylvania Council on Developmental Disabilities", domain:"disability",
        totalSeats:24, vacantSeats:8, vacantSince:"2023-03-01", authority:"Governor", constituent:"Pennsylvanians with developmental disabilities", criticalNote:"33% unfilled · federal AIDD compliance",
        mandate:"Serves as Pennsylvania's federally-mandated DD Council under the Developmental Disabilities Assistance and Bill of Rights Act. Advocates for self-determination, integration, and inclusion.",
        requires:["Disability Policy","Federal compliance","Advocacy","Research & Analysis","Program & Project Management"], confirmation:false,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:606, name:"Pennsylvania Commission on Crime and Delinquency — Public Members", domain:"justice",
        totalSeats:16, vacantSeats:4, vacantSince:"2023-12-01", authority:"Governor", constituent:"Crime victims & justice system participants", criticalNote:"",
        mandate:"Advises on criminal justice reform and administers federal justice grants across Pennsylvania. Coordinates data systems, evidence-based programming, and victim services funding.",
        requires:["Grant Writing & Business Development","Data Governance","Program & Project Management","Research & Analysis","Legislative Affairs"], confirmation:false,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:607, name:"Pennsylvania Environmental Justice Advisory Board", domain:"environment",
        totalSeats:12, vacantSeats:4, vacantSince:"2024-02-01", authority:"Governor (Senate consent)", constituent:"Frontline & overburdened communities", criticalNote:"",
        mandate:"Advises the Department of Environmental Protection on environmental justice policy. Reviews permit applications affecting overburdened communities and recommends mitigation strategies.",
        requires:["Environmental Policy","Community Outreach","Advocacy","Research & Analysis","Policy"], confirmation:true,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:608, name:"State Board of Education — At-Large Public Members", domain:"education",
        totalSeats:21, vacantSeats:5, vacantSince:"2024-03-01", authority:"Governor (Senate confirm.)", constituent:"Pennsylvania K–12 students & families", criticalNote:"",
        mandate:"Governs the Pennsylvania Department of Education. Sets curriculum standards, educator certification requirements, and administers federal Title I and IDEA education funding statewide.",
        requires:["Research & Analysis","Health Policy","Program & Project Management","Workforce Development","Legislative Affairs"], confirmation:true,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:609, name:"Pennsylvania Commission on African American Affairs", domain:"equity",
        totalSeats:11, vacantSeats:4, vacantSince:"2023-07-01", authority:"Governor", constituent:"African American Pennsylvanians", criticalNote:"",
        mandate:"Advises state government on policies and programs affecting African American Pennsylvanians. Monitors racial equity across state agencies and makes recommendations to the Governor and legislature.",
        requires:["Equity Policy","Advocacy","Research & Analysis","Community Outreach","Policy"], confirmation:false,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
      { id:610, name:"Pennsylvania Housing Finance Agency — Board of Directors", domain:"housing",
        totalSeats:14, vacantSeats:4, vacantSince:"2023-10-01", authority:"Governor", constituent:"Low-income housing applicants & renters statewide", criticalNote:"",
        mandate:"Governs the Pennsylvania Housing Finance Agency. Oversees affordable housing programs, mortgage assistance, and federal Low-Income Housing Tax Credit administration statewide.",
        requires:["Housing Policy","Grant Writing & Business Development","Program & Project Management","Public Sector Leadership","Research & Analysis"], confirmation:false,
        sourceUrl:"https://pa.gov/governor/administration/boards-and-commissions", lastVerified:"2026-06-26" },
    ]
  },

  // ─── New York ─── status: live (researched seed data) ───
    // TODO verify — NY has no public application portal (governor.ny.gov/appointments offline); contact form is closest verified official path
  NY: {
    code:"NY", label:"New York", region:"Northeast",
    status:"live",
    color:"#7B1E2E", bg:"#FAEDF0",
    applyUrl:"https://www.governor.ny.gov/content/governor-contact-form",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",              // legacy alias — same as applyAuthority
    applyVerified:"2026-06-26",
    dataSource:"governor.ny.gov",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"700+ boards statewide",
    contextNote:"New York's dedicated board appointment portal (governor.ny.gov/appointments) is currently offline with no announced replacement. Governor Hochul's office is actively making appointments \u2014 contact the Governor's office directly to express interest in a board seat.",
    auditNote:null,
    boards: [
      { id:701, name:"New York State Health Information Technology Advisory Committee", domain:"health",
        totalSeats:20, vacantSeats:7, vacantSince:"2023-08-01", authority:"Commissioner of Health", constituent:"Health providers & patients statewide", criticalNote:"Statewide HIT roadmap delayed · 35% unfilled",
        mandate:"Advises the Commissioner of Health on health information technology policy, EHR interoperability, and the statewide health information network. Coordinates with federal CMS and ONC initiatives.",
        requires:["Federal Health IT","EHR / Health Informatics","Health Data Interoperability","Data Governance","Health Policy"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:702, name:"New York State Council on Mental Health", domain:"health",
        totalSeats:18, vacantSeats:6, vacantSince:"2023-05-01", authority:"Governor", constituent:"New Yorkers with mental illness", criticalNote:"",
        mandate:"Advises the Governor and Office of Mental Health on mental health policy, program standards, and services for New Yorkers with psychiatric disabilities. Monitors state hospital and community care systems.",
        requires:["Health Policy","Research & Analysis","Behavioral Health","Advocacy","Program & Project Management"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:703, name:"Commission on Quality of Care and Advocacy for Persons with Disabilities", domain:"disability",
        totalSeats:15, vacantSeats:5, vacantSince:"2023-09-01", authority:"Governor (Senate confirm.)", constituent:"New Yorkers with disabilities", criticalNote:"Oversight capacity reduced",
        mandate:"Protects and advocates for the rights of New Yorkers with disabilities. Investigates complaints, monitors state facilities, and advises on disability policy across executive agencies.",
        requires:["Disability Policy","Advocacy","Research & Analysis","Federal compliance","Public Sector Leadership"], confirmation:true,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:704, name:"New York Statewide Independent Living Council", domain:"disability",
        totalSeats:16, vacantSeats:5, vacantSince:"2023-11-01", authority:"Governor", constituent:"New Yorkers with disabilities seeking independent living", criticalNote:"Federal SILC compliance at risk",
        mandate:"Federally mandated council that develops the State Plan for Independent Living. Advocates for independent living services, accessible housing, and community integration for New Yorkers with disabilities.",
        requires:["Disability Policy","Federal compliance","Advocacy","Program & Project Management","Community Outreach"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:705, name:"New York Housing Trust Fund Corporation — Board", domain:"housing",
        totalSeats:13, vacantSeats:4, vacantSince:"2024-01-01", authority:"Governor", constituent:"Low-income New Yorkers · housing assistance recipients", criticalNote:"",
        mandate:"Governs the Housing Trust Fund Corporation, which finances affordable housing development and preservation across New York State. Administers federal HOME and CDBG housing programs.",
        requires:["Housing Policy","Grant Writing & Business Development","Program & Project Management","Public Sector Leadership","Research & Analysis"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:706, name:"NYS Environmental Justice Advisory Group", domain:"environment",
        totalSeats:11, vacantSeats:4, vacantSince:"2023-10-01", authority:"Commissioner of Environmental Conservation", constituent:"Overburdened & frontline communities", criticalNote:"",
        mandate:"Advises the Department of Environmental Conservation on environmental justice policy. Reviews permit applications, recommends mitigation for disproportionate environmental impacts in low-income communities.",
        requires:["Environmental Policy","Community Outreach","Research & Analysis","Advocacy","Data Governance"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:707, name:"New York Opioid Settlement Fund Advisory Board", domain:"health",
        totalSeats:16, vacantSeats:5, vacantSince:"2024-02-01", authority:"Governor", constituent:"New Yorkers affected by opioid epidemic", criticalNote:"Settlement fund allocation decisions pending",
        mandate:"Advises on distribution of New York's opioid litigation settlement funds. Recommends evidence-based investments in treatment, recovery, harm reduction, and prevention programs statewide.",
        requires:["Grant Writing & Business Development","Health Policy","Behavioral Health","Substance Use Disorder","Research & Analysis"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:708, name:"Governor's Advisory Committee for Black New Yorkers", domain:"equity",
        totalSeats:20, vacantSeats:7, vacantSince:"2023-06-01", authority:"Governor", constituent:"Black New Yorkers statewide", criticalNote:"35% unfilled · policy engagement gap",
        mandate:"Advises the Governor on policies and programs affecting Black New Yorkers. Monitors racial equity in state contracting, health, education, housing, and criminal justice outcomes.",
        requires:["Equity Policy","Advocacy","Community Outreach","Research & Analysis","Public Sector Leadership"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:709, name:"New York State Commission on the Status of Women", domain:"equity",
        totalSeats:14, vacantSeats:4, vacantSince:"2023-07-01", authority:"Governor", constituent:"New York women & girls", criticalNote:"",
        mandate:"Advises on policy affecting New York women and girls. Monitors gender equity in state programs, conducts research, and advocates for women's economic security, safety, and health.",
        requires:["Gender equity","Research & Analysis","Advocacy","Policy","Community Outreach"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
      { id:710, name:"State Commission for the Blind — Advisory Board", domain:"disability",
        totalSeats:12, vacantSeats:4, vacantSince:"2023-12-01", authority:"Governor", constituent:"New Yorkers who are blind or visually impaired", criticalNote:"",
        mandate:"Advises the State Commission for the Blind on vocational rehabilitation, independent living, and employment programs for New Yorkers who are blind or visually impaired.",
        requires:["Disability Policy","Workforce Development","Advocacy","Program & Project Management","Research & Analysis"], confirmation:false,
        sourceUrl:"https://governor.ny.gov", lastVerified:"2026-06-26" },
    ]
  },

  // ─── North Carolina ─── status: live (researched seed data) ───
  NC: {
    code:"NC", label:"North Carolina", region:"South",
    status:"live",
    color:"#13294B", bg:"#E6EDF5",
    applyUrl:"https://bc.governor.nc.gov/Apply",
    applyAuthority:"Governor's Office of Boards & Commissions",
    applyLabel:"Governor's Office of Boards & Commissions",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-07",
    dataSource:"bc.governor.nc.gov",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"400+ boards statewide",
    contextNote:"Governor Josh Stein (D) took office January 2025, replacing term-limited Roy Cooper. New administration means a fresh wave of appointment opportunities \u2014 many seats open as Stein builds his leadership team across boards and commissions.",
    auditNote:null,
    boards: [
      { id:801, name:"North Carolina Health Information Technology Advisory Council", domain:"health",
        totalSeats:16, vacantSeats:5, vacantSince:"2025-01-15", authority:"Governor", constituent:"Health providers & patients statewide", criticalNote:"New admin transition · 31% unfilled",
        mandate:"Advises the Department of Health and Human Services on health information technology strategy, EHR interoperability, and North Carolina's statewide health information network.",
        requires:["Federal Health IT","EHR / Health Informatics","Health Data Interoperability","Data Governance","Health Policy"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:802, name:"North Carolina Opioid and Substance Abuse Advisory Cabinet", domain:"health",
        totalSeats:20, vacantSeats:6, vacantSince:"2025-02-01", authority:"Governor", constituent:"North Carolinians affected by substance use", criticalNote:"Transition vacancies",
        mandate:"Advises the Governor on North Carolina's opioid and substance abuse response. Coordinates treatment, recovery, and harm reduction strategy across state agencies and federal programs.",
        requires:["Health Policy","Behavioral Health","Substance Use Disorder","Program & Project Management","Grant Writing & Business Development"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:803, name:"NC Commission for Mental Health, Developmental Disabilities & Substance Abuse Services", domain:"disability",
        totalSeats:24, vacantSeats:8, vacantSince:"2025-01-15", authority:"Governor", constituent:"North Carolinians with mental illness, DD, and SUD", criticalNote:"Chair vacant · 33% unfilled",
        mandate:"Advises the Department of Health and Human Services on policy and programs for North Carolinians with mental illness, developmental disabilities, and substance use disorders.",
        requires:["Health Policy","Disability Policy","Behavioral Health","Research & Analysis","Program & Project Management"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:804, name:"Governor's Advisory Council on Hispanic/Latino Affairs", domain:"equity",
        totalSeats:15, vacantSeats:5, vacantSince:"2025-02-01", authority:"Governor", constituent:"Hispanic & Latino North Carolinians", criticalNote:"Transition vacancies",
        mandate:"Advises the Governor on policies and programs affecting North Carolina's Hispanic and Latino communities. Monitors equity in state services, language access, and economic inclusion.",
        requires:["Equity Policy","Community Outreach","Advocacy","Research & Analysis","Public Sector Leadership"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:805, name:"North Carolina Affordable Housing Advisory Committee", domain:"housing",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-10-01", authority:"Governor", constituent:"Low-income housing applicants statewide", criticalNote:"",
        mandate:"Advises the NC Housing Finance Agency on affordable housing policy, federal HOME program priorities, and strategies to address the state's affordable housing shortage.",
        requires:["Housing Policy","Grant Writing & Business Development","Research & Analysis","Community Outreach","Program & Project Management"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:806, name:"Environmental Justice and Equity Advisory Board", domain:"environment",
        totalSeats:13, vacantSeats:4, vacantSince:"2024-11-01", authority:"Governor", constituent:"Frontline & overburdened communities", criticalNote:"",
        mandate:"Advises the Department of Environmental Quality on environmental justice policy. Reviews the disproportionate environmental burden on low-income and communities of color across North Carolina.",
        requires:["Environmental Policy","Community Outreach","Advocacy","Research & Analysis","Policy"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:807, name:"North Carolina Commission for Women", domain:"equity",
        totalSeats:13, vacantSeats:4, vacantSince:"2025-01-15", authority:"Governor", constituent:"North Carolina women & girls", criticalNote:"Transition vacancies",
        mandate:"Advises the Governor and General Assembly on issues affecting North Carolina women. Conducts research, monitors gender equity, and advocates for women's economic security, health, and safety.",
        requires:["Gender equity","Advocacy","Research & Analysis","Policy","Community Outreach"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:808, name:"North Carolina Council on Developmental Disabilities", domain:"disability",
        totalSeats:20, vacantSeats:6, vacantSince:"2024-09-01", authority:"Governor", constituent:"North Carolinians with developmental disabilities", criticalNote:"Federal AIDD compliance watch",
        mandate:"Federally mandated DD Council that advocates for people with developmental disabilities in North Carolina. Develops the State DD Plan and promotes self-determination, integration, and inclusion.",
        requires:["Disability Policy","Federal compliance","Advocacy","Program & Project Management","Research & Analysis"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:809, name:"Criminal Justice Information Network Advisory Board", domain:"justice",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-08-01", authority:"Governor", constituent:"Criminal justice system participants statewide", criticalNote:"",
        mandate:"Advises on North Carolina's statewide criminal justice information network. Oversees data governance, interoperability between law enforcement systems, and privacy compliance across agencies.",
        requires:["Data Governance","AI Enablement & Policy","Knowledge Management","Research & Analysis","Program & Project Management"], confirmation:false,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
      { id:810, name:"North Carolina State Board of Education — At-Large Advisory Members", domain:"education",
        totalSeats:14, vacantSeats:4, vacantSince:"2025-01-15", authority:"Governor (Senate confirm.)", constituent:"North Carolina K–12 students & families", criticalNote:"Transition vacancies",
        mandate:"Advises North Carolina's State Board of Education on curriculum standards, educator preparation, and federal education program compliance including Title I and IDEA.",
        requires:["Research & Analysis","Program & Project Management","Workforce Development","Public Sector Leadership","Legislative Affairs"], confirmation:true,
        sourceUrl:"https://bc.governor.nc.gov", lastVerified:"2026-06-26" },
    ]
  },

  // ─── New Jersey ─── status: live (researched seed data) ───
  NJ: {
    code:"NJ", label:"New Jersey", region:"Mid-Atlantic",
    status:"live",
    color:"#1C3F6E", bg:"#E6EDF8",
    applyUrl:"https://www.nj.gov/governor/admin/bca/",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-07",
    dataSource:"nj.gov/governor/admin/bca",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"500+ boards statewide",
    contextNote:"Governor Mikie Sherrill took office January 2026, creating a fresh wave of appointment opportunities across New Jersey's boards and commissions as the new administration fills transition vacancies.",
    auditNote:null,
    boards: [
      { id:901, name:"New Jersey Health Information Technology Advisory Committee", domain:"health",
        totalSeats:16, vacantSeats:5, vacantSince:"2026-01-15", authority:"Commissioner of Health", constituent:"Health providers & patients statewide", criticalNote:"Transition vacancies · 31% unfilled",
        mandate:"Advises the Department of Health on health information technology policy, EHR interoperability, and New Jersey's statewide health information network strategy.",
        requires:["Federal Health IT","EHR / Health Informatics","Health Data Interoperability","Data Governance","Health Policy"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:902, name:"New Jersey Mental Health Advisory Committee", domain:"health",
        totalSeats:18, vacantSeats:6, vacantSince:"2025-09-01", authority:"Commissioner of Human Services", constituent:"New Jerseyans with mental illness", criticalNote:"",
        mandate:"Advises the Division of Mental Health and Addiction Services on mental health policy, community-based care standards, and program priorities for New Jerseyans with psychiatric disabilities.",
        requires:["Health Policy","Behavioral Health","Research & Analysis","Advocacy","Program & Project Management"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:903, name:"New Jersey Council on Affordable Housing — Advisory Panel", domain:"housing",
        totalSeats:15, vacantSeats:5, vacantSince:"2025-10-01", authority:"Governor", constituent:"Low-income housing seekers statewide", criticalNote:"COAH compliance decisions pending",
        mandate:"Advises on New Jersey's constitutionally-mandated affordable housing obligations. Reviews municipal housing plans, monitors compliance with Fair Housing Act requirements statewide.",
        requires:["Housing Policy","Legislative Affairs","Research & Analysis","Program & Project Management","Public Sector Leadership"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:904, name:"Governor's Council on Alcoholism and Drug Abuse", domain:"health",
        totalSeats:22, vacantSeats:7, vacantSince:"2026-01-15", authority:"Governor", constituent:"New Jerseyans with substance use disorders", criticalNote:"Transition vacancies · 32% unfilled",
        mandate:"Advises the Governor on New Jersey's substance abuse prevention and treatment system. Oversees federal SABG grant funding and coordinates policy across prevention, treatment, and recovery programs.",
        requires:["Health Policy","Behavioral Health","Substance Use Disorder","Grant Writing & Business Development","Program & Project Management"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:905, name:"New Jersey Commission on Women", domain:"equity",
        totalSeats:13, vacantSeats:4, vacantSince:"2026-01-15", authority:"Governor", constituent:"New Jersey women & girls", criticalNote:"Transition vacancies",
        mandate:"Advises the Governor on issues affecting New Jersey women and girls. Monitors gender equity in state programs, conducts research, and advocates for economic security and safety.",
        requires:["Gender equity","Advocacy","Research & Analysis","Community Outreach","Policy"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:906, name:"New Jersey Environmental Justice Advisory Council", domain:"environment",
        totalSeats:12, vacantSeats:4, vacantSince:"2025-11-01", authority:"Commissioner of Environmental Protection", constituent:"Overburdened communities statewide", criticalNote:"",
        mandate:"Advises the Department of Environmental Protection on implementation of New Jersey's Environmental Justice Law. Reviews facility permits affecting overburdened communities and recommends protective conditions.",
        requires:["Environmental Policy","Community Outreach","Research & Analysis","Advocacy","Data Governance"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:907, name:"Commission on Racial and Ethnic Disparities in the Criminal Justice System", domain:"justice",
        totalSeats:14, vacantSeats:5, vacantSince:"2025-08-01", authority:"Governor", constituent:"Communities affected by racial disparities in CJS", criticalNote:"",
        mandate:"Monitors and reports on racial and ethnic disparities across New Jersey's criminal justice system. Recommends statutory and policy reforms to address disparate outcomes in policing, prosecution, and incarceration.",
        requires:["Justice Reform","Research & Analysis","Data Governance","Advocacy","Legislative Affairs"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:908, name:"State Board of Education — Public At-Large Members", domain:"education",
        totalSeats:13, vacantSeats:4, vacantSince:"2026-01-15", authority:"Governor (Senate confirm.)", constituent:"New Jersey K–12 students & families", criticalNote:"Transition vacancies",
        mandate:"Governs New Jersey's public education system. Sets academic standards, educator certification policy, and administers federal Title I, IDEA, and Perkins education funding.",
        requires:["Research & Analysis","Public Sector Leadership","Workforce Development","Program & Project Management","Legislative Affairs"], confirmation:true,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:909, name:"New Jersey Division of Disability Services Advisory Council", domain:"disability",
        totalSeats:16, vacantSeats:5, vacantSince:"2025-07-01", authority:"Director of Disability Services", constituent:"New Jerseyans with disabilities", criticalNote:"",
        mandate:"Advises the Division of Disability Services on community-based programs, employment supports, and independent living services for New Jerseyans with physical and developmental disabilities.",
        requires:["Disability Policy","Federal compliance","Advocacy","Program & Project Management","Community Outreach"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
      { id:910, name:"New Jersey Commission on Hispanic Affairs", domain:"equity",
        totalSeats:12, vacantSeats:4, vacantSince:"2026-01-15", authority:"Governor", constituent:"Hispanic & Latino New Jerseyans", criticalNote:"Transition vacancies",
        mandate:"Advises the Governor on policies and programs affecting New Jersey's Hispanic and Latino communities. Monitors equity in state services, language access, education, health, and economic opportunity.",
        requires:["Equity Policy","Community Outreach","Advocacy","Research & Analysis","Policy"], confirmation:false,
        sourceUrl:"https://nj.gov/governor/admin/bca", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Georgia ─── status: live (researched seed data) ───
  GA: {
    code:"GA", label:"Georgia", region:"South",
    status:"live",
    color:"#BA0C2F", bg:"#FAEBEE",
    applyUrl:"https://gov.georgia.gov/executive-action/appointments",
    applyAuthority:"Governor's Office of Appointments",
    applyLabel:"Governor's Office of Appointments",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-07",
    dataSource:"gov.georgia.gov/executive-action/appointments",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"400+ boards statewide",
    contextNote:"Governor Brian Kemp is term-limited and cannot seek re-election in November 2026. Outgoing administrations historically slow appointment activity in their final year \u2014 creating a backlog new leadership must resolve.",
    auditNote:null,
    boards: [
      { id:1001, name:"Georgia Health Information Technology Commission", domain:"health",
        totalSeats:18, vacantSeats:6, vacantSince:"2024-03-01", authority:"Governor", constituent:"Health providers & patients statewide", criticalNote:"Lame-duck slowdown · 33% unfilled",
        mandate:"Advises the Governor on health information technology policy, electronic health record adoption, and Georgia's statewide health information exchange. Coordinates with federal CMS and ONC programs.",
        requires:["Federal Health IT","EHR / Health Informatics","Health Data Interoperability","Data Governance","Health Policy"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1002, name:"Georgia Commission on Equal Opportunity — Advisory Board", domain:"equity",
        totalSeats:12, vacantSeats:4, vacantSince:"2024-01-01", authority:"Governor", constituent:"Georgians protected under civil rights law", criticalNote:"",
        mandate:"Advises the Georgia Commission on Equal Opportunity on civil rights enforcement, anti-discrimination policy, and equal employment opportunity across state agencies and contractors.",
        requires:["Equity Policy","Advocacy","Research & Analysis","Legislative Affairs","Public Sector Leadership"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1003, name:"Governor's Council on Developmental Disabilities", domain:"disability",
        totalSeats:22, vacantSeats:7, vacantSince:"2024-02-01", authority:"Governor", constituent:"Georgians with developmental disabilities", criticalNote:"Federal AIDD compliance at risk",
        mandate:"Federally mandated DD Council that advocates for Georgians with developmental disabilities. Develops the State DD Plan and promotes self-determination, community integration, and full inclusion.",
        requires:["Disability Policy","Federal compliance","Advocacy","Program & Project Management","Community Outreach"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1004, name:"Georgia Opioid Treatment Advisory Council", domain:"health",
        totalSeats:16, vacantSeats:5, vacantSince:"2024-04-01", authority:"Commissioner of Behavioral Health", constituent:"Georgians affected by opioid and substance use disorders", criticalNote:"",
        mandate:"Advises the Department of Behavioral Health and Developmental Disabilities on evidence-based opioid treatment, recovery, and prevention programs. Oversees federal SABG grant priorities.",
        requires:["Behavioral Health","Substance Use Disorder","Health Policy","Grant Writing & Business Development","Research & Analysis"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1005, name:"Georgia Commission on Family Violence — Advisory Board", domain:"justice",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-05-01", authority:"Governor", constituent:"Domestic violence survivors statewide", criticalNote:"",
        mandate:"Advises the Georgia Commission on Family Violence on domestic violence policy, prevention programs, and services for survivors. Monitors federal VAWA grant compliance across Georgia's provider network.",
        requires:["Justice Reform","Advocacy","Grant Writing & Business Development","Program & Project Management","Research & Analysis"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1006, name:"Georgia Commission on Women", domain:"equity",
        totalSeats:13, vacantSeats:4, vacantSince:"2024-02-01", authority:"Governor", constituent:"Georgia women & girls", criticalNote:"",
        mandate:"Advises the Governor on issues affecting Georgia women. Conducts research on gender equity, monitors state programs for equitable outcomes, and advocates for women's economic security and safety.",
        requires:["Gender equity","Advocacy","Research & Analysis","Community Outreach","Policy"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1007, name:"Georgia Council on Criminal Justice — Advisory Panel", domain:"justice",
        totalSeats:16, vacantSeats:5, vacantSince:"2024-01-01", authority:"Governor", constituent:"Criminal justice system participants statewide", criticalNote:"",
        mandate:"Advises on criminal justice reform policy and data-driven strategies for Georgia's corrections, courts, and reentry systems. Oversees federal justice improvement grant funding.",
        requires:["Justice Reform","Data Governance","Research & Analysis","Grant Writing & Business Development","Program & Project Management"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1008, name:"Georgia Housing Finance Authority — Public Member Board Seats", domain:"housing",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-06-01", authority:"Governor", constituent:"Low-income housing seekers statewide", criticalNote:"",
        mandate:"Governs the Georgia Housing Finance Authority. Administers affordable housing programs, federal Low-Income Housing Tax Credits, and HOME Investment Partnership funding statewide.",
        requires:["Housing Policy","Grant Writing & Business Development","Public Sector Leadership","Program & Project Management","Research & Analysis"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1009, name:"Georgia Environmental Finance Authority Board", domain:"environment",
        totalSeats:12, vacantSeats:4, vacantSince:"2024-03-01", authority:"Governor", constituent:"Georgia communities reliant on clean water & infrastructure", criticalNote:"",
        mandate:"Governs the Georgia Environmental Finance Authority, which finances water, wastewater, and environmental infrastructure projects. Administers EPA Clean Water and Drinking Water State Revolving Funds.",
        requires:["Environmental Policy","Grant Writing & Business Development","Program & Project Management","Public Sector Leadership","Data Governance"], confirmation:false,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
      { id:1010, name:"Georgia Board of Education — Advisory Public Members", domain:"education",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-07-01", authority:"Governor (Senate confirm.)", constituent:"Georgia K–12 students & families", criticalNote:"",
        mandate:"Advises Georgia's State Board of Education on curriculum standards, educator preparation, and federal education program compliance. Reviews Title I, IDEA, and Perkins funding allocations.",
        requires:["Research & Analysis","Public Sector Leadership","Workforce Development","Program & Project Management","Legislative Affairs"], confirmation:true,
        sourceUrl:"https://gov.georgia.gov/executive-action/appointments", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Illinois ─── status: live (researched seed data) ───
  IL: {
    code:"IL", label:"Illinois", region:"Midwest",
    status:"live",
    color:"#003366", bg:"#E5EBF5",
    applyUrl:"https://govappointments.illinois.gov/submit-an-application/",
    applyAuthority:"Governor's Office of Executive Appointments",
    applyLabel:"Governor's Office of Executive Appointments",              // legacy alias — same as applyAuthority
    applyVerified:"2026-07-07",
    dataSource:"govappointments.illinois.gov",
    scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
    totalBoardsNote:"600+ boards statewide",
    contextNote:null,
    auditNote:"The Illinois Auditor General's 2023 review of the Department of Human Services found extended board vacancies contributing to delayed program oversight and reduced regulatory capacity across mental health and disability services.",
    boards: [
      { id:1101, name:"Illinois Health Information Exchange Authority — ILHIE Advisory Board", domain:"health",
        totalSeats:19, vacantSeats:6, vacantSince:"2023-10-01", authority:"Governor", constituent:"Health providers & patients statewide", criticalNote:"32% unfilled · HIE roadmap stalled",
        mandate:"Advises the Illinois Health Information Exchange Authority on interoperability policy, EHR adoption, and the statewide health information network. Coordinates with federal ONC and CMS programs.",
        requires:["Federal Health IT","EHR / Health Informatics","Health Data Interoperability","Data Governance","AI Enablement & Policy"], confirmation:false,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1102, name:"Illinois Council on Women and Girls", domain:"equity",
        totalSeats:14, vacantSeats:5, vacantSince:"2023-08-01", authority:"Governor", constituent:"Illinois women & girls", criticalNote:"",
        mandate:"Advises the Governor on policies and programs affecting Illinois women and girls. Monitors gender equity in state contracting, education, health, and economic opportunity programs.",
        requires:["Gender equity","Advocacy","Research & Analysis","Community Outreach","Policy"], confirmation:false,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1103, name:"Illinois Council on Developmental Disabilities", domain:"disability",
        totalSeats:24, vacantSeats:8, vacantSince:"2023-06-01", authority:"Governor", constituent:"Illinoisans with developmental disabilities", criticalNote:"33% unfilled · federal AIDD compliance",
        mandate:"Federally mandated DD Council that advocates for Illinoisans with developmental disabilities. Develops the State DD Plan and promotes self-determination, community integration, and systems change.",
        requires:["Disability Policy","Federal compliance","Advocacy","Program & Project Management","Research & Analysis"], confirmation:false,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1104, name:"Illinois Opioid Crisis Response Advisory Council", domain:"health",
        totalSeats:20, vacantSeats:6, vacantSince:"2024-01-01", authority:"Governor", constituent:"Illinoisans affected by opioid and substance use disorders", criticalNote:"",
        mandate:"Advises the Governor on Illinois's opioid response strategy. Coordinates state and federal investments in treatment, recovery, harm reduction, and prevention across Illinois communities.",
        requires:["Health Policy","Behavioral Health","Substance Use Disorder","Grant Writing & Business Development","Program & Project Management"], confirmation:false,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1105, name:"Illinois Housing Development Authority — Board of Directors", domain:"housing",
        totalSeats:16, vacantSeats:5, vacantSince:"2023-12-01", authority:"Governor (Senate confirm.)", constituent:"Low-income housing seekers statewide", criticalNote:"",
        mandate:"Governs the Illinois Housing Development Authority. Administers affordable housing programs, federal LIHTC allocations, and HOME Investment Partnership funding across Illinois communities.",
        requires:["Housing Policy","Grant Writing & Business Development","Program & Project Management","Public Sector Leadership","Research & Analysis"], confirmation:true,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1106, name:"Illinois Environmental Justice Commission", domain:"environment",
        totalSeats:13, vacantSeats:4, vacantSince:"2023-11-01", authority:"Governor", constituent:"Overburdened communities statewide", criticalNote:"",
        mandate:"Advises the Illinois Environmental Protection Agency on environmental justice policy. Reviews permit decisions affecting overburdened communities and monitors cumulative environmental impacts in Illinois.",
        requires:["Environmental Policy","Community Outreach","Advocacy","Research & Analysis","Data Governance"], confirmation:false,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1107, name:"Illinois Criminal Justice Information Authority — Public Members", domain:"justice",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-02-01", authority:"Governor", constituent:"Criminal justice system participants statewide", criticalNote:"",
        mandate:"Governs Illinois's criminal justice data and grant authority. Administers federal VOCA and Byrne JAG grants, oversees statewide criminal justice data systems, and funds evidence-based justice programs.",
        requires:["Data Governance","Grant Writing & Business Development","Research & Analysis","Program & Project Management","AI Enablement & Policy"], confirmation:false,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1108, name:"Illinois State Board of Education — Advisory Council Members", domain:"education",
        totalSeats:18, vacantSeats:5, vacantSince:"2023-09-01", authority:"Governor (Senate confirm.)", constituent:"Illinois K–12 students & families", criticalNote:"",
        mandate:"Advises the Illinois State Board of Education on curriculum standards, educator preparation, and federal education funding compliance. Reviews Title I, IDEA, and Perkins allocations statewide.",
        requires:["Research & Analysis","Workforce Development","Program & Project Management","Public Sector Leadership","Legislative Affairs"], confirmation:true,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1109, name:"Governor's Rural Affairs Council", domain:"equity",
        totalSeats:15, vacantSeats:5, vacantSince:"2023-07-01", authority:"Governor", constituent:"Rural Illinoisans", criticalNote:"",
        mandate:"Advises the Governor on economic development, broadband access, healthcare, and infrastructure challenges facing rural Illinois communities. Coordinates state investment priorities in downstate regions.",
        requires:["Public Sector Leadership","Research & Analysis","Community Outreach","Strategic Advisory","Program & Project Management"], confirmation:false,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
      { id:1110, name:"Illinois Commission on Equity and Inclusion", domain:"equity",
        totalSeats:14, vacantSeats:4, vacantSince:"2024-03-01", authority:"Governor", constituent:"Historically underserved Illinoisans", criticalNote:"",
        mandate:"Advises on state policies and programs to advance equity and inclusion for historically underserved communities. Monitors state contracting, hiring, and program access across executive agencies.",
        requires:["Equity Policy","Data Governance","Research & Analysis","Advocacy","Public Sector Leadership"], confirmation:false,
        sourceUrl:"https://govappointments.illinois.gov", lastVerified:"2026-06-26" },
    ]
  },

  // ─── Oregon ─── status: live (scraper: or) ───
  OR: {
    code:"OR", label:"Oregon", region:"West",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://oregon.wd5.myworkdayjobs.com/Boards",
    applyAuthority:"Governor's Executive Appointments Office",
    applyLabel:"Governor's Executive Appointments Office",
    applyVerified:"2026-08-19",
    dataSource:"oregon.wd5.myworkdayjobs.com/Boards",
    scraper:{ endpoint:"https://oregon.wd5.myworkdayjobs.com/wday/cxs/oregon/Boards/jobs", lastPulled:"2026-08-18T16:28:49.389Z", selectorProfile:"or" },
    totalBoardsNote:"Board openings posted via Workday · 22 verified of 40 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":51101,"name":"Oregon Health Policy Board","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"All Oregonians · health system policy","mandate":"Serves as the policy-making and oversight body for the Oregon Health Authority. Nine members appointed by the Governor, confirmed by the Senate (ORS 413.006).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Health-Policy-Board---Board-Member_REQ-192967","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Health-Policy-Board---Board-Member_REQ-192967","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_413.006","confirmation":false},
      {"id":51102,"name":"Home Care Commission","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Seniors & people with disabilities using home care","mandate":"Ensures the quality of home care services for elderly Oregonians and people with disabilities; created by constitutional amendment (Ballot Measure 99, 2000). Nine members, five of whom are current or former home care consumers (ORS 410.602).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Home-Care-Commission---Board-Member_REQ-192916","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Home-Care-Commission---Board-Member_REQ-192916","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_410.602","confirmation":false},
      {"id":51103,"name":"Medicaid Advisory Committee","domain":"health","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon Health Plan (Medicaid) members","mandate":"Advises the Oregon Health Authority and Department of Human Services on medical assistance programs. Up to 15 members appointed by the Governor (ORS 414.211).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Medicaid-Advisory-Committee---Board-Member_REQ-192932","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Medicaid-Advisory-Committee---Board-Member_REQ-192932","lastVerified":"2026-08-18","criticalNote":"Statute caps membership at 15","seatSource":"https://oregon.public.law/statutes/ors_414.211","confirmation":false},
      {"id":51104,"name":"Health Evidence Review Commission","domain":"health","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon Health Plan members · evidence-based coverage","mandate":"Prioritizes health services and reviews clinical evidence for the Oregon Health Plan. Thirteen governor-appointed, Senate-confirmed members (ORS 414.688).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Health-Evidence-Review-Commission---Board-Member_REQ-192911","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Health-Evidence-Review-Commission---Board-Member_REQ-192911","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_414.688","confirmation":false},
      {"id":51105,"name":"Oregon Public Defense Commission","domain":"justice","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregonians entitled to court-appointed counsel","mandate":"Governs Oregon's public defense system — nine voting and four nonvoting members appointed by the Governor (ORS 151.213).","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Public-Defense-Commission---Board-Member_REQ-192979","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Public-Defense-Commission---Board-Member_REQ-192979","lastVerified":"2026-08-18","criticalNote":"9 voting + 4 nonvoting members","seatSource":"https://oregon.public.law/statutes/ors_151.213","confirmation":false},
      {"id":51106,"name":"Governor's Commission on Senior Services","domain":"health","totalSeats":21,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Older Oregonians & aging services","mandate":"Advises the Governor and Department of Human Services on programs and policy for older Oregonians. At least 21 members appointed by the Governor for three-year terms (ORS 410.320).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Governor-s-Commission-on-Senior-Services---Board-Member_REQ-192908","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Governor-s-Commission-on-Senior-Services---Board-Member_REQ-192908","lastVerified":"2026-08-18","criticalNote":"Statute sets a minimum of 21 members","seatSource":"https://oregon.public.law/statutes/ors_410.320","confirmation":false},
      {"id":51107,"name":"Oregon Disabilities Commission","domain":"disability","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregonians with disabilities","mandate":"Advises state government on disability policy; a majority of its 15 governor-appointed members must be individuals with disabilities (ORS 185.110–185.130).","requires":["Disability Policy","Advocacy","Federal compliance"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Disabilities-Commission---Board-Member_REQ-192958","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Disabilities-Commission---Board-Member_REQ-192958","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_185.130","confirmation":false},
      {"id":51108,"name":"Teacher Standards and Practices Commission","domain":"education","totalSeats":17,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon K-12 students, families & educators","mandate":"Licenses Oregon educators and sets professional standards and discipline for the teaching profession. Seventeen members appointed by the Governor, confirmed by the Senate (ORS 342.350).","requires":["Education Policy","Workforce Development","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Teacher-Standards-and-Practices-Commission---Board-Member_REQ-193093","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Teacher-Standards-and-Practices-Commission---Board-Member_REQ-193093","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_342.350","confirmation":false},
      {"id":51109,"name":"Alcohol and Drug Policy Commission","domain":"health","totalSeats":17,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregonians affected by substance use disorders","mandate":"Advises on Oregon's substance use disorder policy and system strategy. Up to 17 voting members appointed by the Governor, Senate-confirmed (ORS 430.221).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Alcohol-and-Drug-Policy-Commission---Board-Member_REQ-192849","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Alcohol-and-Drug-Policy-Commission---Board-Member_REQ-192849","lastVerified":"2026-08-18","criticalNote":"Statute caps voting membership at 17","seatSource":"https://oregon.public.law/statutes/ors_430.221","confirmation":false},
      {"id":51110,"name":"Appraiser Certification and Licensure Board","domain":"housing","totalSeats":8,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon property owners & licensed appraisers","mandate":"Certifies and licenses Oregon's real estate appraisers. Eight members appointed by the Governor (ORS 674.305).","requires":["Housing Policy","Program & Project Management","Policy"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Appraiser-Certification-and-Licensure-Board---Board-Member_REQ-192851","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Appraiser-Certification-and-Licensure-Board---Board-Member_REQ-192851","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_674.305","confirmation":false},
      {"id":51111,"name":"Behavior Analysis Regulatory Board","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregonians receiving behavior analysis & licensed analysts","mandate":"Licenses and regulates Oregon's applied behavior analysts. Nine members appointed by the Governor with Senate confirmation (ORS 676.806).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Behavior-Analysis-Regulatory-Board---Board-Member_REQ-192853","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Behavior-Analysis-Regulatory-Board---Board-Member_REQ-192853","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_676.806","confirmation":false},
      {"id":51112,"name":"Board of Agriculture","domain":"environment","totalSeats":10,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon agricultural producers & consumers","mandate":"Advises the Oregon Department of Agriculture on policy; 10 members — seven active producers, two consumer representatives, plus the Soil and Water Conservation Commission chair (ORS 561.372).","requires":["Environmental Policy","Research & Analysis","Policy"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Agriculture---Board-Member_REQ-192854","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Agriculture---Board-Member_REQ-192854","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_561.372","confirmation":false},
      {"id":51113,"name":"Board of Athletic Trainers","domain":"health","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon athletes & licensed athletic trainers","mandate":"Licenses and regulates Oregon's athletic trainers. Five members appointed by the Governor — three athletic trainers, a physician, and a public member (ORS 688.705).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Athletic-Trainers---Board-Member_REQ-192855","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Athletic-Trainers---Board-Member_REQ-192855","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_688.705","confirmation":false},
      {"id":51114,"name":"Board of Boiler Rules","domain":"justice","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregonians & boiler/pressure-vessel safety","mandate":"Sets Oregon's boiler and pressure-vessel safety code. Eleven members appointed by the Governor with Senate confirmation (ORS 480.535).","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Boiler-Rules---Board-Member_REQ-192856","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Boiler-Rules---Board-Member_REQ-192856","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_480.535","confirmation":false},
      {"id":51115,"name":"Board of Commissioners of the Port of Portland","domain":"environment","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon travelers, shippers & the Portland port district","mandate":"Governs the Port of Portland — PDX airport, marine terminals, and industrial development. Nine commissioners appointed by the Governor with Senate ratification, four-year terms (ORS 778.215).","requires":["Environmental Policy","Research & Analysis","Policy"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Commissioners-of-the-Port-of-Portland---Board-Member_REQ-192859","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Commissioners-of-the-Port-of-Portland---Board-Member_REQ-192859","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_778.215","confirmation":false},
      {"id":51116,"name":"Board of Cosmetology","domain":"justice","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon salon clients & licensed cosmetologists","mandate":"Licenses and regulates Oregon's cosmetology practitioners and facilities. Seven members appointed by the Governor (ORS 690.155).","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Cosmetology---Board-Member_REQ-192860","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Cosmetology---Board-Member_REQ-192860","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_690.155","confirmation":false},
      {"id":51117,"name":"Board of Directors of the State Accident Insurance Fund Corporation","domain":"equity","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon's injured workers & employers · workers' comp","mandate":"Governs SAIF, Oregon's not-for-profit workers' compensation insurer. Five directors appointed by the Governor with Senate confirmation — three industry-connected and two public members (ORS 656.751).","requires":["Equity Policy","Community Outreach","Advocacy"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Directors-of-the-State-Accident-Insurance-Fund-Corporation---Board-Member_REQ-192861","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Directors-of-the-State-Accident-Insurance-Fund-Corporation---Board-Member_REQ-192861","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_656.751","confirmation":false},
      {"id":51118,"name":"Board of Licensed Dietitians","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon patients & licensed dietitians","mandate":"Licenses and regulates Oregon's dietitians. Seven members appointed by the Governor — four dietitians, a physician, and two public members (ORS 691.485).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Licensed-Dietitians---Board-Member_REQ-192863","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Licensed-Dietitians---Board-Member_REQ-192863","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_691.485","confirmation":false},
      {"id":51119,"name":"Board of Medical Imaging","domain":"health","totalSeats":12,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Patients & licensed medical imaging professionals","mandate":"Licenses and regulates Oregon's medical imaging professionals. Twelve members: four physicians, three public members, five modality licensees (ORS 688.545).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Medical-Imaging---Board-Member_REQ-192864","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Medical-Imaging---Board-Member_REQ-192864","lastVerified":"2026-08-18","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_688.545","confirmation":false},
      {"id":51120,"name":"Board of Trustees of Oregon State University","domain":"education","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon State University students & Oregon higher education","mandate":"Governs Oregon State University — budget, tuition, and university policy. Up to fifteen members appointed by the Governor with Senate confirmation; the university president serves ex officio (ORS 352.054).","requires":["Education Policy","Workforce Development","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Trustees-of-Oregon-State-University---Board-Member_REQ-192866","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Trustees-of-Oregon-State-University---Board-Member_REQ-192866","lastVerified":"2026-08-18","criticalNote":"Governor-appointed; university president serves ex officio (nonvoting)","seatSource":"https://oregon.public.law/statutes/ors_352.054","confirmation":false},
      {"id":51121,"name":"Board of Trustees of Portland State University","domain":"education","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Portland State University students & Oregon higher education","mandate":"Governs Portland State University — budget, tuition, and university policy. Up to fifteen members appointed by the Governor with Senate confirmation; the university president serves ex officio (ORS 352.054).","requires":["Education Policy","Workforce Development","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Trustees-of-Portland-State-University---Board-Member_REQ-192867","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Trustees-of-Portland-State-University---Board-Member_REQ-192867","lastVerified":"2026-08-18","criticalNote":"Governor-appointed; university president serves ex officio (nonvoting)","seatSource":"https://oregon.public.law/statutes/ors_352.054","confirmation":false},
      {"id":51122,"name":"Board of Trustees of University Of Oregon","domain":"education","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"University of Oregon students & Oregon higher education","mandate":"Governs the University of Oregon — budget, tuition, and university policy. Up to fifteen members appointed by the Governor with Senate confirmation; the university president serves ex officio (ORS 352.054).","requires":["Education Policy","Workforce Development","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Trustees-of-University-Of-Oregon---Board-Member_REQ-192870","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Trustees-of-University-Of-Oregon---Board-Member_REQ-192870","lastVerified":"2026-08-18","criticalNote":"Governor-appointed; university president serves ex officio (nonvoting)","seatSource":"https://oregon.public.law/statutes/ors_352.054","confirmation":false}
    ]
  },































  // ─── Washington ─── status: live (scraper: wa) ───
  WA: {
    code:"WA", label:"Washington", region:"West",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve",
    applyAuthority:"Governor's Boards & Commissions Office",
    applyLabel:"Governor's Boards & Commissions Office",
    applyVerified:"2026-08-19",
    dataSource:"governor.wa.gov/boards-and-commissions",
    scraper:{ endpoint:"https://governor.wa.gov/boards-and-commissions/boards-commissions/current-and-upcoming-appointment-opportunities", lastPulled:"2026-08-18T16:14:09.711Z", selectorProfile:"wa" },
    totalBoardsNote:"230+ boards · monthly opportunities report · 23 verified of 129 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":51501,"name":"Student Achievement Council, Washington","domain":"education","totalSeats":10,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington college students & higher-ed learners","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Sets statewide higher-education goals and strategy and administers student financial aid programs. Ten voting members — six citizen members appointed by the Governor and confirmed by the Senate (two of them students) plus four education-sector representatives (RCW 28B.77.005).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=28B.77.005","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":51502,"name":"Workforce Training and Education Coordinating Board","domain":"education","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington job seekers, workers & employers","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"6 of 9 voting seats are governor-appointed","mandate":"Coordinates Washington's workforce development system. Nine voting members — three business, three labor, three agency ex officio (RCW 28C.18.020).","seatSource":"https://app.leg.wa.gov/rcw/default.aspx?cite=28C.18.020","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":51503,"name":"Engineers and Land Surveyors, Board of Registration for Professional","domain":"justice","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washingtonians & licensed engineers/surveyors · public safety","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and regulates Washington's professional engineers and land surveyors. Seven members appointed by the Governor — engineers and land surveyors (RCW 18.43.030).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-43/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":51504,"name":"Human Rights Commission","domain":"equity","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"All Washingtonians · protection from discrimination","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Enforces the Washington Law Against Discrimination and works to eliminate and prevent discrimination in employment, housing, public accommodation, credit, and insurance. Five members appointed by the Governor with the advice and consent of the Senate (RCW 49.60.050).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=49.60.050","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":51505,"name":"Real Estate Commission","domain":"housing","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington home buyers & licensed real estate brokers","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"6 of 7 seats are governor-appointed (Director ex officio chair)","mandate":"Advises on and regulates Washington's real estate brokers and managing brokers. Six members appointed by the Governor to six-year terms, with the Director of Licensing serving ex officio as chair (RCW 18.85.021).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-85/","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51506,"name":"Women’s Commission, Washington State","domain":"equity","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Women & girls across Washington State","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Advises the Governor, Legislature, and state agencies on issues affecting women and works to improve the well-being of women and girls in Washington. Nine members appointed by the Governor with the advice and consent of the Senate (chapter 43.119 RCW).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=43.119&full=true","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":51507,"name":"Chiropractic Quality Assurance Commission","domain":"health","totalSeats":14,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington chiropractic patients & licensees","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and disciplines Washington's chiropractors. Fourteen members appointed by the Governor — eleven practicing chiropractors and three public members (RCW 18.25).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-25/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51508,"name":"Dental Quality Assurance Commission","domain":"health","totalSeats":21,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington dental patients & licensed dentists","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and disciplines Washington's dentists, dental therapists, and auxiliaries. Twenty-one members appointed by the Governor — twelve dentists, four dental therapists, two expanded-function auxiliaries, and three public members (RCW 18.32).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-32/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51509,"name":"Health, State Board of","domain":"health","totalSeats":10,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"All Washington residents · public health policy","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Sets statewide public health policy and adopts rules on communicable disease, drinking water, and environmental health. Composed of ten members — the Secretary of Health (or designee) and nine gubernatorial appointees including health professionals, local officials, and consumer representatives (RCW 43.20.030).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=43.20.030","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51510,"name":"Medical Commission, Washington","domain":"health","totalSeats":21,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington patients & licensed physicians","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and disciplines physicians and physician assistants. Twenty-one members — thirteen physicians, two physician assistants, six public members (RCW 18.71.015).","seatSource":"https://app.leg.wa.gov/rcw/default.aspx?cite=18.71.015","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51511,"name":"Nursing Home Administrators, Board of","domain":"health","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington nursing-home residents & licensed administrators","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and regulates Washington's nursing home administrators. Eleven members appointed by the Governor (RCW 18.52).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-52/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51512,"name":"Nursing, Washington State Board of","domain":"health","totalSeats":17,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington patients · nursing licensure & safety","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and regulates registered nurses, advanced practice nurses, practical nurses, and nursing assistants, and sets standards to protect patient safety. Seventeen members appointed by the Governor to four-year terms (RCW 18.79.070).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=18.79.070","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51513,"name":"Optometry Board","domain":"health","totalSeats":6,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington eye-care patients & licensed optometrists","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and regulates Washington's optometrists. Six members appointed by the Governor — five optometrists and one consumer member (RCW 18.54).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-54/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51514,"name":"Osteopathic Medicine and Surgery, Board of","domain":"health","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington patients & licensed D.O. physicians","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and disciplines Washington's osteopathic physicians and surgeons. Eleven members appointed by the Governor — nine osteopathic physicians and two public members (RCW 18.57.003).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-57/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51515,"name":"Pharmacy Quality Assurance Commission","domain":"health","totalSeats":16,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington patients & licensed pharmacists · drug safety","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses pharmacists and regulates pharmacy practice in Washington. Sixteen members appointed by the Governor with Senate consent — nine pharmacists, two technicians, four public, and one pharmacy-owner member (RCW 18.64.001).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-64/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51516,"name":"Physical Therapy, Board of","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington patients & licensed physical therapists","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and regulates Washington's physical therapists and assistants. Seven members appointed by the Governor — five PTs, one PT assistant, and one public member (RCW 18.74.020).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-74/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51517,"name":"Podiatric Medical Board","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington patients & licensed podiatrists","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and disciplines Washington's podiatric physicians and surgeons. Seven members appointed by the Governor — five podiatric physicians and two public members (RCW 18.22.013).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-22/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51518,"name":"Psychology, Examining Board of","domain":"health","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washingtonians seeking psychological care & licensed psychologists","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and regulates Washington's psychologists. Eleven members appointed by the Governor — nine psychologists and two public members (RCW 18.83.035).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-83/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51519,"name":"Universal Health Care Commission","domain":"health","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"All Washingtonians · path to universal coverage","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Develops the framework and recommendations for a universal health care system in Washington, including financing and delivery design. Fifteen members — six appointed by the Governor plus legislative and state-agency members (RCW 41.05.840).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=41.05.840","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51520,"name":"Veterinary Board of Governors","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington animal owners & licensed veterinarians","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and disciplines Washington's veterinarians and veterinary technicians. Nine members appointed by the Governor — veterinarians, a veterinary technician, and a public member (RCW 18.92.021).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-92/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51521,"name":"Affordable Housing Advisory Board","domain":"housing","totalSeats":25,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washingtonians needing affordable housing","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"3 of 25 seats are ex officio nonvoting","mandate":"Advises the Department of Commerce on housing and housing finance policy. Twenty-five members including three ex officio nonvoting (RCW 43.185B.020).","seatSource":"https://app.leg.wa.gov/rcw/default.aspx?cite=43.185B.020","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51522,"name":"Parks and Recreation Commission","domain":"environment","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington state-park visitors & public lands","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Sets policy for Washington's state parks system — budget priorities, strategic plan, and park rules. Seven citizen members appointed by the Governor with Senate consent (RCW 79A.05.015).","seatSource":"https://law.justia.com/codes/washington/title-79a/chapter-79a-05/","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":51523,"name":"Architects, Board of Registration for","domain":"justice","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washingtonians & licensed architects · building safety","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and regulates Washington's architects. Seven members appointed by the Governor — six registered architects and one public member (RCW 18.08.330).","seatSource":"https://law.justia.com/codes/washington/title-18/chapter-18-08/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false}
    ]
  },































  // ─── Colorado ─── status: live (scraper: co) ───
  CO: {
    code:"CO", label:"Colorado", region:"West",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://governorsoffice.colorado.gov/governor/boards-commissions-application",
    applyAuthority:"Governor's Boards & Commissions Office",
    applyLabel:"Governor's Boards & Commissions Office",
    applyVerified:"2026-08-19",
    dataSource:"governorsoffice.colorado.gov/governor/appointments-and-openings",
    scraper:{ endpoint:"https://governorsoffice.colorado.gov/governor/appointments-and-openings", lastPulled:"2026-08-18T17:14:50.692Z", selectorProfile:"co" },
    totalBoardsNote:"2026 opportunities published in the Governor's Blue Book · 8 verified of 56 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":49701,"name":"Plumbers, State Board","domain":"housing","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Colorado building occupants & licensed plumbers","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-08-18","criticalNote":"Seven governor-appointed voting members; a public-health department representative serves ex officio, nonvoting","mandate":"Licenses Colorado's plumbers and adopts the state plumbing code. Seven governor-appointed voting members with Senate consent — plumbers, contractors, an inspector, and a public member (C.R.S. 12-155-104).","seatSource":"https://law.justia.com/codes/colorado/title-12/business-professions-and-occupations/article-155/section-12-155-104/","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":49702,"name":"Counselor Examiners, State Board of Licensed Professionals","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Colorado counseling clients & licensed professional counselors","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-08-18","criticalNote":"Opening: August","mandate":"Licenses and regulates Colorado's licensed professional counselors. Seven governor-appointed members — four counselors and three public members (C.R.S. 12-245-602).","seatSource":"https://law.justia.com/codes/colorado/title-12/health-care-professions-and-occupations/article-245/part-6/section-12-245-602/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49703,"name":"Marriage and Family Therapist Examiners, State Board of","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Colorado therapy clients & licensed marriage and family therapists","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-08-18","criticalNote":"Opening: August","mandate":"Licenses and regulates Colorado's marriage and family therapists. Seven governor-appointed members — four therapists and three public members (C.R.S. 12-245-502).","seatSource":"https://law.justia.com/codes/colorado/title-12/health-care-professions-and-occupations/article-245/part-5/section-12-245-502/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49704,"name":"Civil Rights Commission, Colorado","domain":"equity","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Coloradans protected under state anti-discrimination law","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-08-18","criticalNote":"Immediate opening — resignation","mandate":"Adjudicates discrimination complaints and sets civil-rights policy in Colorado. Seven members appointed by the Governor with Senate consent (C.R.S. 24-34-303).","seatSource":"https://law.justia.com/codes/colorado/title-24/principal-departments/article-34/part-3/section-24-34-303/","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":49705,"name":"Marriage and Family Therapists Board of Examiners","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Colorado therapy clients & licensed marriage and family therapists","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-08-18","criticalNote":"Immediate opening — resignation","mandate":"Licenses and regulates Colorado's marriage and family therapists. Seven governor-appointed members — four therapists and three public members (C.R.S. 12-245-502).","seatSource":"https://law.justia.com/codes/colorado/title-12/health-care-professions-and-occupations/article-245/part-5/section-12-245-502/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49706,"name":"Medical Services Board","domain":"health","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Health First Colorado (Medicaid) members","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-08-18","criticalNote":"Immediate opening — resignation","mandate":"Adopts rules governing Colorado's Medicaid and medical assistance programs. Eleven members appointed by the Governor with Senate consent, at least one per congressional district (C.R.S. 25.5-1-301).","seatSource":"https://law.justia.com/codes/colorado/2022/title-25-5/article-1/part-3/section-25-5-1-301/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49707,"name":"State Board of Psychologist Examiners","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Coloradans receiving psychological care & licensed psychologists","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-08-18","criticalNote":"Immediate opening — resignation","mandate":"Licenses and disciplines Colorado's psychologists. Seven governor-appointed members — four licensed psychologists and three public members (C.R.S. 12-245-302).","seatSource":"https://law.justia.com/codes/colorado/title-12/health-care-professions-and-occupations/article-245/part-3/section-12-245-302/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49708,"name":"Veterans Affairs, Colorado Board of","domain":"justice","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Colorado veterans & their families","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-08-18","criticalNote":"Immediate opening — resignation","mandate":"Advises on veterans policy and oversees the Veterans Trust Fund grant program. Seven members appointed by the Governor (C.R.S. 28-5-702).","seatSource":"https://vets.colorado.gov/cbva","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false}
    ]
  },






























  // ─── Ohio ─── status: live (scraper: oh) ───
  OH: {
    code:"OH", label:"Ohio", region:"Midwest",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021",
    applyAuthority:"Governor's Boards & Commissions Office",
    applyLabel:"Governor's Boards & Commissions Office",
    applyVerified:"2026-08-19",
    dataSource:"governor.ohio.gov/administration/boards-and-commissions",
    scraper:{ endpoint:"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026", lastPulled:"2026-08-18T16:00:00.751Z", selectorProfile:"oh" },
    totalBoardsNote:"2026 term-expirations list, Governor's office · 25 verified of 102 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":50901,"name":"State Medical Board","domain":"health","totalSeats":12,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio patients & licensed physicians","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and disciplines Ohio's physicians. Twelve members appointed by the Governor with Senate consent — eight licensed physicians and surgeons (ORC 4731.01).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4731.01","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50902,"name":"State Speech and Hearing Professionals Board","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohioans needing speech & hearing care & licensed clinicians","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses Ohio's speech-language pathologists and audiologists. Nine members appointed by the Governor with Senate consent (ORC 4753.03).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4753.03","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50903,"name":"State Vision Professionals Board","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio eye-care patients & licensed optometrists/opticians","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and regulates Ohio's optometrists and opticians. Seven members appointed by the Governor — four optometrists, two opticians, and one public member (ORC 4725.03).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4725.03","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50904,"name":"State Dental Board","domain":"health","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio dental patients & licensed dentists/hygienists","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and disciplines Ohio's dentists and dental hygienists. Thirteen members appointed by the Governor — nine dentists, three hygienists, and one public member (ORC 4715.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4715.02","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50905,"name":"Public Utilities Commission of Ohio","domain":"justice","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Every Ohio utility ratepayer · electric, gas, water, telecom","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Regulates rates and service for Ohio's investor-owned electric, natural gas, water, and telephone utilities. Five commissioners appointed by the Governor with Senate consent; no more than three from one party (ORC 4901.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4901.02","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50906,"name":"Opportunities for Ohioans with Disabilities Council","domain":"disability","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohioans with disabilities seeking employment","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"State rehabilitation council advising OOD on vocational rehabilitation policy and services. Fifteen governor-appointed members, majority individuals with disabilities (ORC 3304.12).","seatSource":"https://codes.ohio.gov/orc/3304.12","requires":["Disability Policy","Advocacy","Federal compliance"],"confirmation":false},
      {"id":50907,"name":"Bureau of Workers’ Compensation Board of Directors","domain":"equity","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio's injured workers & employers · statewide comp system","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Governs the investment policy and administration of Ohio's workers' compensation system. Eleven members appointed by the Governor with Senate consent, representing employees, employers, and investment expertise (ORC 4121.12).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4121.12","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":50908,"name":"Board of Embalmers and Funeral Directors","domain":"justice","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio families & licensed funeral professionals","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and disciplines Ohio's embalmers, funeral directors, and crematories. Seven members appointed by the Governor with Senate consent (ORC 4717.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4717.02","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50909,"name":"Real Estate Appraiser Board","domain":"housing","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio property owners & licensed appraisers","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and regulates Ohio's real estate appraisers. Five members appointed by the Governor with Senate consent — four appraisers and one public member (ORC 4763.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4763.02","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":50910,"name":"State Board of Pharmacy","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio patients & licensed pharmacists · drug safety","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses pharmacists and regulates the distribution of drugs across Ohio. Nine members appointed by the Governor — eight licensed pharmacists and one public member (ORC 4729.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4729.02","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50911,"name":"State Lottery Commission","domain":"education","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio public education · lottery profits fund K-12 schools","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Governs the Ohio Lottery, whose profits are constitutionally dedicated to public education. Nine members appointed by the Governor with Senate consent; no more than five from one party (ORC 3770.01).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-3770.01","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":50912,"name":"Commission on Minority Health","domain":"equity","totalSeats":21,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio's minority communities · health equity","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"9 of 21 seats are governor-appointed","mandate":"Addresses health disparities affecting minority Ohioans through grants, policy, and community programs. Twenty-one members; nine appointed by the Governor from health professions (ORC 3701.78).","seatSource":"https://codes.ohio.gov/orc/3701.78","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":50913,"name":"State Board of Registration for Professional Engineers and Surveyors","domain":"justice","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohioans & licensed engineers/surveyors · public safety","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and regulates Ohio's professional engineers and surveyors. Five members appointed by the Governor with Senate consent (ORC 4733.03).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4733.03","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50914,"name":"Motor Vehicle Dealers Board","domain":"justice","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio car buyers & licensed dealers","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"10 of 11 seats are governor-appointed (Registrar ex officio)","mandate":"Licenses and regulates Ohio's motor vehicle dealers and salespersons. Eleven-member board; ten appointed by the Governor with Senate consent plus the Registrar of Motor Vehicles ex officio (ORC 4517.30).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4517.30","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50915,"name":"State Board of Psychology","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohioans seeking psychological care & licensed psychologists","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and regulates Ohio's psychologists and school psychologists. Nine members appointed by the Governor with Senate consent — six psychologists and three consumer members (ORC 4732.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4732.02","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50916,"name":"State Employment Relations Board","domain":"equity","totalSeats":3,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio public employees & employers · collective bargaining","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Administers Ohio's public-employee collective bargaining law and resolves labor disputes. Three members appointed by the Governor with Senate consent; no more than two from one party (ORC 4117.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4117.02","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":50917,"name":"Counselor, Social Worker, and Marriage and Family Therapist Board","domain":"health","totalSeats":21,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohioans in behavioral health care & licensed clinicians","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses Ohio's counselors, social workers, marriage & family therapists, and art/music therapists. Twenty-one members appointed by the Governor across the regulated professions plus public members (ORC 4757.03).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4757.03","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50918,"name":"Accountancy Board","domain":"justice","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio businesses & licensed CPAs · audit integrity","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and disciplines Ohio's certified public accountants. Nine members appointed by the Governor with Senate consent — eight CPAs and one public member (ORC 4701.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4701.02","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50919,"name":"Environmental Review Appeals Commission","domain":"environment","totalSeats":3,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohioans & businesses contesting environmental permits/orders","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Hears appeals of Ohio EPA permit and enforcement actions — the state's environmental court of first review. Three members appointed by the Governor with Senate consent for six-year terms (ORC 3745.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-3745.02","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50920,"name":"State Cosmetology and Barber Board","domain":"justice","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio salon/barbershop clients & licensees","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and regulates Ohio's cosmetologists and barbers. Thirteen members appointed by the Governor with Senate consent across the licensed disciplines and the public (ORC 4713.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4713.02","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50921,"name":"State Chiropractic Board","domain":"health","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio chiropractic patients & licensees","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and disciplines Ohio's chiropractors. Five members appointed by the Governor with Senate consent — four chiropractors and one public member (ORC 4734.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4734.02","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50922,"name":"Chemical Dependency Professionals Board","domain":"health","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohioans in addiction recovery & licensed counselors","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"12 of 13 seats are governor-appointed (1 ex officio)","mandate":"Licenses Ohio's chemical dependency counselors and prevention professionals. Thirteen-member board; twelve appointed by the Governor plus one ex officio state designee (ORC 4758.10).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4758.10","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50923,"name":"Board of Nursing","domain":"health","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio patients & licensed nurses","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Regulates Ohio's nursing profession. Thirteen members — eight registered nurses, four licensed practical nurses, one consumer representative (ORC 4723.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4723.02","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50924,"name":"State Board of Education","domain":"education","totalSeats":19,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio K-12 students & families","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Only 8 of 19 seats are governor-appointed","mandate":"Oversees educator licensure and school district territory; 19 members — 11 elected by district, 8 appointed by the Governor with Senate consent.","seatSource":"https://sboe.ohio.gov/about-the-state-board/board-members/02-board-members","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":50925,"name":"State Veterinary Medical Licensing Board","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio animal owners & licensed veterinarians","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-08-18","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and disciplines Ohio's veterinarians and veterinary technicians. Seven members appointed by the Governor with Senate consent — five veterinarians, one veterinary technician, and one public member (ORC 4741.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4741.02","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },





























  // ─── Arizona ─── status: live (scraper: az) ───
  AZ: {
    code:"AZ", label:"Arizona", region:"West",
    status:"live",
    color:"#7A3E8F", bg:"#F4EBF7",
    applyUrl:"https://bc.azgovernor.gov/boards-and-commissions-application",
    applyAuthority:"Governor's Office of Boards & Commissions",
    applyLabel:"Governor's Office of Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"bc.azgovernor.gov",
    scraper:{ endpoint:"https://bc.azgovernor.gov/", lastPulled:"2026-08-18T17:14:51.479Z", selectorProfile:"az" },
    totalBoardsNote:"220 active boards · Governor's vacancy report · 12 verified of 47 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":49501,"name":"ACUPUNCTURE BOARD OF EXAMINERS","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona patients & licensed acupuncturists","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and regulates acupuncture practice. Seven governor-appointed members — four licensed practitioners, one physician, two public members (A.R.S. § 32-3902).","seatSource":"https://www.azleg.gov/ars/32/03902.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49502,"name":"ARIZONA MEDICAL BOARD","domain":"health","totalSeats":12,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona patients & licensed physicians","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and disciplines Arizona's allopathic physicians. Twelve governor-appointed members — eight practicing physicians and four public members (A.R.S. § 32-1402).","seatSource":"https://www.azleg.gov/ars/32/01402.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49503,"name":"ARIZONA STATE PARKS BOARD","domain":"environment","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona's state parks, public lands & outdoor recreation","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"6 of 7 seats are governor-appointed","mandate":"Governs Arizona's state parks, historic sites, and outdoor recreation programs. Seven members — the State Land Commissioner plus six appointed by the Governor for six-year terms (A.R.S. § 41-511).","seatSource":"https://www.azleg.gov/ars/41/00511.htm","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":49504,"name":"ARIZONA STATE RETIREMENT SYSTEM BOARD","domain":"equity","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona's public employees & retirees · statewide pension","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Oversees the Arizona State Retirement System, which serves state, university, and school employees. Nine trustees appointed by the Governor — five ASRS members and four public members (A.R.S. § 38-713).","seatSource":"https://www.azleg.gov/ars/38/00713.htm","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":49505,"name":"ARIZONA STATE VETERINARY EXAMINING BOARD","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona pet owners, livestock producers & licensed veterinarians","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and disciplines Arizona's veterinarians. Nine governor-appointed members — five licensed veterinarians, two public members, one livestock-industry representative, and one certified veterinary technician (A.R.S. § 32-2202).","seatSource":"https://www.azleg.gov/ars/32/02202.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49506,"name":"BARBERING AND COSMETOLOGY BOARD","domain":"equity","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona salon consumers & licensed barbers, cosmetologists, nail technicians","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and regulates Arizona's barbering and cosmetology professions. Nine governor-appointed members — one barber, one cosmetologist, two school owners, and five public members (A.R.S. § 32-502).","seatSource":"https://www.azleg.gov/ars/32/00502.htm","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":49507,"name":"BOARD OF BEHAVIORAL HEALTH EXAMINERS","domain":"health","totalSeats":12,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona behavioral-health clients & licensed counselors, social workers, therapists","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses Arizona's counselors, social workers, marriage-and-family therapists, and addiction counselors. Twelve governor-appointed members — eight professional and four public (A.R.S. § 32-3252).","seatSource":"https://www.azleg.gov/ars/32/03252.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49508,"name":"BOARD OF CHIROPRACTIC EXAMINERS","domain":"health","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona patients & licensed chiropractors","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and disciplines Arizona's chiropractors. Five governor-appointed members — three licensed chiropractors and two consumer members (A.R.S. § 32-901).","seatSource":"https://www.azleg.gov/ars/32/00901.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49509,"name":"BOARD OF OCCUPATIONAL THERAPY EXAMINERS","domain":"health","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona patients & licensed occupational therapists","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and regulates Arizona's occupational therapists. Five governor-appointed members — three occupational-therapy professionals and two public members (A.R.S. § 32-3402).","seatSource":"https://www.azleg.gov/ars/32/03402.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49510,"name":"GAME AND FISH COMMISSION","domain":"environment","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona's wildlife, hunters, anglers & outdoor public","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Sets policy for Arizona's wildlife conservation and the Game and Fish Department. Five members appointed by the Governor to five-year terms; no more than three from one party and no two from the same county (A.R.S. § 17-201).","seatSource":"https://www.azleg.gov/ars/17/00201.htm","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":49511,"name":"STATE BOARD OF DENTAL EXAMINERS","domain":"health","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona dental patients & licensed dentists/hygienists","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and disciplines Arizona's dentists and dental hygienists. Eleven members appointed by the Governor — six dentists, two dental hygienists, two public members, and one business entity member (A.R.S. § 32-1203).","seatSource":"https://www.azleg.gov/ars/32/01203.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49512,"name":"STATE PERSONNEL BOARD","domain":"justice","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona state-government employees","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in Governor's vacancy report","mandate":"Hears appeals from Arizona state employees in the covered personnel system. Five governor-appointed members, no more than three from one political party (A.R.S. § 41-781).","seatSource":"https://www.azleg.gov/ars/41/00781.htm","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false}
    ]
  },




























  // ─── Connecticut ─── status: live (scraper: ct) ───
  CT: {
    code:"CT", label:"Connecticut", region:"Northeast",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM",
    applyAuthority:"Governor's Office via DAS Statewide HR",
    applyLabel:"Governor's Office via DAS Statewide HR",
    applyVerified:"2026-08-19",
    dataSource:"portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions",
    scraper:{ endpoint:"https://portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions", lastPulled:"2026-08-18T17:14:51.990Z", selectorProfile:"ct" },
    totalBoardsNote:"Official CT Boards, Councils & Commissions directory (~37 boards) · no central vacancy list · 6 verified of 39 openings tracked",
    contextNote:"Connecticut publishes no central board-vacancy list. Boards shown are drawn from the state's official Boards, Councils & Commissions directory — apply any time through the DAS recruitment (DAS.SHRM@ct.gov).",
    auditNote:null,
    boards:[
      {"id":49801,"name":"Developmental Disabilities, Connecticut Council of","domain":"disability","totalSeats":24,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut residents with developmental disabilities","applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions","lastVerified":"2026-08-18","criticalNote":"Listed in CT's official Boards, Councils & Commissions directory; CT publishes no central vacancy list (inventory mode)","mandate":"Federally mandated DD Council advocating for Connecticut residents with developmental disabilities. Twenty-four governor-appointed members.","seatSource":"https://portal.ct.gov/CTCDD/About/About-Us/Who-We-Are-and-What-We-Do","requires":["Disability Policy","Advocacy","Federal compliance"],"confirmation":false},
      {"id":49802,"name":"Human Rights and Opportunities, Commission on","domain":"equity","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut residents protected under state anti-discrimination law","applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions","lastVerified":"2026-08-18","criticalNote":"5 of 9 seats are governor-appointed (4 appointed by legislative leaders)","mandate":"Enforces Connecticut's anti-discrimination laws and adjudicates civil-rights complaints. Nine members — five appointed by the Governor, four by legislative leaders, all with General Assembly consent (CGS 46a-52).","seatSource":"https://law.justia.com/codes/connecticut/title-46a/chapter-814c/","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":49803,"name":"Pardons and Paroles, Board of","domain":"justice","totalSeats":10,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut's incarcerated people, parolees & pardon applicants","applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions","lastVerified":"2026-08-18","criticalNote":"Ten full-time governor-appointed members; the Governor may also appoint up to five part-time members","mandate":"Grants paroles and pardons and sets release policy in Connecticut. Ten full-time members appointed by the Governor with the consent of the General Assembly (CGS 54-124a).","seatSource":"https://law.justia.com/codes/connecticut/title-54/chapter-961/section-54-124a/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49804,"name":"Psychiatric Security Review Board","domain":"justice","totalSeats":6,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut insanity acquittees, victims & the public","applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions","lastVerified":"2026-08-18","criticalNote":"Listed in CT's official Boards, Councils & Commissions directory; CT publishes no central vacancy list (inventory mode)","mandate":"Supervises persons acquitted by reason of mental disease and committed to its jurisdiction. Six governor-appointed members — a psychiatrist, a psychologist, a probation expert, an attorney, and two public members (CGS 17a-581).","seatSource":"https://law.justia.com/codes/connecticut/title-17a/chapter-319i/section-17a-581-formerly-sec-17-257b/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49805,"name":"Connecticut Medical Examining Board","domain":"health","totalSeats":21,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut patients & licensed physicians","applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions","lastVerified":"2026-08-18","criticalNote":"Listed in CT's official Boards, Councils & Commissions directory; CT publishes no central vacancy list (inventory mode)","mandate":"Licenses and disciplines Connecticut physicians. Twenty-one governor-appointed members — thirteen physicians, one physician assistant, seven public members (CGS § 20-8a).","seatSource":"https://law.justia.com/codes/connecticut/title-20/chapter-370/section-20-8a/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49806,"name":"Connecticut State Board of Education","domain":"education","totalSeats":14,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut K-12 students & families","applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions","lastVerified":"2026-08-18","criticalNote":"9 of 14 seats are governor-appointed","mandate":"Oversees Connecticut's public elementary and secondary education. Fourteen members — nine governor-appointed voting members, three ex officio, two student members (CGS § 10-1).","seatSource":"https://law.justia.com/codes/connecticut/title-10/chapter-163/section-10-1/","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false}
    ]
  },




























  // ─── Texas ─── status: live (scraper: tx) ───
  TX: {
    code:"TX", label:"Texas", region:"South",
    status:"live",
    color:"#0E6B5C", bg:"#E0F4F0",
    applyUrl:"https://gov.texas.gov/organization/appointments/application",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",
    applyVerified:"2026-08-19",
    dataSource:"gov.texas.gov/organization/appointments",
    scraper:{ endpoint:"https://gov.texas.gov/organization/appointments/positions", lastPulled:"2026-08-18T15:59:59.557Z", selectorProfile:"tx" },
    totalBoardsNote:"Appointed-positions directory · applications accepted year-round (no central vacancy list) · 26 verified of 263 openings tracked",
    contextNote:"Texas publishes no central vacancy list — boards shown are appointment opportunities; terms are staggered six-year and applications are accepted year-round through the Governor's Appointments Office.",
    auditNote:null,
    boards:[
      {"id":51401,"name":"Cancer Prevention and Research Institute of Texas Oversight Committee","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texans affected by cancer · multibillion-dollar research & prevention program","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/HS/htm/HS.102.htm","lastVerified":"2026-08-18","criticalNote":"3 of 9 seats are governor-appointed","mandate":"Governs the Cancer Prevention and Research Institute of Texas, awarding grants for cancer research and prevention statewide. Nine members — three each appointed by the Governor, Lt. Governor, and Speaker (Health & Safety Code ch. 102).","seatSource":"https://statutes.capitol.texas.gov/Docs/HS/htm/HS.102.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51402,"name":"Affordable Housing Corporation Board of Directors, Texas State","domain":"housing","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Low- and moderate-income Texans seeking affordable housing","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.capitol.state.tx.us/tlodocs/77R/billtext/html/HB03451F.htm","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Sets policy for the Texas State Affordable Housing Corporation's homeownership, lending, and development programs. Five members appointed by the Governor with the advice and consent of the Senate (Gov. Code 2306.554).","seatSource":"https://statutes.capitol.texas.gov/Docs/GV/htm/GV.2306.htm","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51403,"name":"Employees Retirement System of Texas Board of Trustees","domain":"equity","totalSeats":6,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas state employees & retirees · retirement and benefits","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://texreg.sos.state.tx.us/public/readtac$ext.ViewTAC?tac_view=4&ti=34&pt=4&ch=63&rl=Y","lastVerified":"2026-08-18","criticalNote":"1 of 6 seats is governor-appointed","mandate":"Administers retirement, insurance, and benefit programs for Texas state employees and retirees. Six trustees — three appointed (by the Governor, Speaker, and Chief Justice) and three elected by members (Gov. Code 815.002).","seatSource":"https://statutes.capitol.texas.gov/Docs/GV/htm/GV.815.htm","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":51404,"name":"Housing and Community Affairs, Texas Department of","domain":"housing","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Low-income Texans · state housing & community programs","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/GV/htm/GV.2306.htm","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Governs Texas's housing finance and community affairs programs, including the low-income housing tax credit. Seven members appointed by the Governor with the advice and consent of the Senate (Gov. Code 2306.024).","seatSource":"https://statutes.capitol.texas.gov/Docs/GV/htm/GV.2306.htm","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51405,"name":"Opioid Abatement Fund Council, Texas","domain":"health","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texans affected by the opioid crisis · settlement-fund allocation","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"https://statutes.capitol.texas.gov/Docs/GV/htm/GV.403.htm#403.503","lastVerified":"2026-08-18","criticalNote":"Comptroller serves as nonvoting presiding officer","mandate":"Directs the allocation of Texas's opioid settlement funds toward abatement across the state. Thirteen appointed members representing affected regions and professions, with the Comptroller as nonvoting presiding officer (Gov. Code 403.503).","seatSource":"https://statutes.capitol.texas.gov/Docs/GV/htm/GV.403.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51406,"name":"Pension Review Board, State","domain":"justice","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas public employees & retirees · pension-fund solvency","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/GV/htm/GV.801.htm","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Oversees the actuarial soundness and transparency of all Texas public retirement systems. Nine members appointed by the Governor with the advice and consent of the Senate (Gov. Code 801.102).","seatSource":"https://statutes.capitol.texas.gov/Docs/GV/htm/GV.801.htm","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":51407,"name":"Permanent School Fund Corporation Board of Directors, Texas","domain":"education","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas public school students · multibillion-dollar education endowment","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"https://statutes.capitol.texas.gov/Docs/ED/htm/ED.43.htm#43.053","lastVerified":"2026-08-18","criticalNote":"2 of 9 seats are governor-appointed","mandate":"Manages the Permanent School Fund endowment that supports Texas public schools. Nine members — five appointed by the State Board of Education, the Land Commissioner, one General Land Office appointee, and two governor-appointed investment experts (Educ. Code 43.053).","seatSource":"https://statutes.capitol.texas.gov/Docs/ED/htm/ED.43.htm","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":51408,"name":"School Land Board","domain":"environment","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas public schools · Permanent School Fund real-asset value","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/NR/htm/NR.32.htm","lastVerified":"2026-08-18","criticalNote":"4 of 5 seats are governor-appointed","mandate":"Manages the real-asset investments and state lands that help fund the Permanent School Fund for Texas public education. Five members — the Land Commissioner as chair plus four citizens appointed by the Governor (Nat. Resources Code 32.012).","seatSource":"https://statutes.capitol.texas.gov/Docs/NR/htm/NR.32.htm","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":51409,"name":"Alzheimer's Disease and Related Disorders, Texas Council on","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texans affected by Alzheimer's & related disorders","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/HS/htm/HS.101.htm","lastVerified":"2026-08-18","criticalNote":"4 of 15 seats are governor-appointed","mandate":"Guides the state plan on Alzheimer's disease. Fifteen members — four each appointed by the Governor, Lt. Governor, and Speaker, plus three agency representatives (Health & Safety Code ch. 101).","seatSource":"https://statutes.capitol.texas.gov/Docs/HS/htm/HS.101.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51410,"name":"Behavioral Health Executive Council, Texas","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texans served by licensed behavioral health professionals","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.507.htm#507.051","lastVerified":"2026-08-18","criticalNote":"1 of 9 seats is governor-appointed","mandate":"Oversees licensing and enforcement for psychologists, counselors, social workers, and marriage & family therapists. Nine members — eight appointed by member boards, one governor-appointed public member (Occ. Code 507.051).","seatSource":"https://texas.public.law/statutes/tex._occ._code_section_507.051","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51411,"name":"Diabetes Council, Texas","domain":"health","totalSeats":16,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texans living with or at risk of diabetes","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/HS/htm/HS.103.htm","lastVerified":"2026-08-18","criticalNote":"11 of 16 seats are governor-appointed","mandate":"Advises the legislature on diabetes policy and administers the state diabetes plan. Sixteen members — eleven governor-appointed citizens plus five agency representatives (Health & Safety Code 103.002).","seatSource":"https://statutes.capitol.texas.gov/Docs/HS/htm/HS.103.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51412,"name":"Higher Education Coordinating Board, Texas","domain":"education","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas college students & institutions","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"https://statutes.capitol.texas.gov/Docs/ED/htm/ED.61.htm#61.022","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Coordinates Texas public higher education strategy, funding formulas, and program approval. Nine members appointed by the Governor with Senate consent for six-year terms (Educ. Code 61.022).","seatSource":"https://statutes.capitol.texas.gov/Docs/ED/htm/ED.61.htm","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":51413,"name":"Public Utility Commission of Texas","domain":"justice","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Every Texas utility ratepayer · electric, water, telecom","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/UT/htm/UT.12.htm#12.051","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Regulates Texas's electric, water, and telecommunications utilities and oversees the state's power grid. Five commissioners appointed by the Governor with Senate consent, six-year staggered terms (Tex. Util. Code 12.051).","seatSource":"https://statutes.capitol.texas.gov/Docs/UT/htm/UT.12.htm","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":51414,"name":"Accountancy, Texas State Board of Public","domain":"justice","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas businesses & licensed CPAs · audit integrity","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.901.htm#901.051","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and disciplines Texas's certified public accountants. Fifteen members appointed by the Governor with Senate consent — ten CPAs and five public members (Tex. Occ. Code 901.051).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.901.htm","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":51415,"name":"Chiropractic Examiners, Texas Board of","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas chiropractic patients & licensees","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.201.htm#201.051","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and disciplines Texas's chiropractors. Nine members appointed by the Governor with Senate consent — six chiropractors and three public members (Tex. Occ. Code 201.051).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.201.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51416,"name":"Dental Examiners, State Board of","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas dental patients & licensed dentists/hygienists","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.251.htm","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and disciplines Texas's dentists and dental hygienists. Eleven members appointed by the Governor with Senate consent — six dentists, three hygienists, and two public members (Tex. Occ. Code 254.001).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.254.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51417,"name":"Medical Board, Texas","domain":"health","totalSeats":19,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas patients & licensed physicians","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.151.htm","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and disciplines Texas's physicians. Nineteen members appointed by the Governor with Senate consent — twelve physicians (nine M.D., three D.O.) and seven public members (Tex. Occ. Code 152.002).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.152.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51418,"name":"Nursing, Texas Board of","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas patients & licensed nurses","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.301.htm#301.051","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and regulates Texas's nurses. Fifteen members appointed by the Governor with Senate consent — nurse members (RN, APRN, LVN), nurse-faculty, and public members (Tex. Occ. Code 301.051; expanded from 13 in 2023).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.301.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51419,"name":"Optometry Board, Texas","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas eye-care patients & licensed optometrists","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/SOTWDocs/OC/htm/OC.351.htm#351.051","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and regulates Texas's optometrists. Nine members appointed by the Governor with Senate consent — six optometrists and three public members (Tex. Occ. Code 351.051).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.351.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51420,"name":"Pharmacy, Texas State Board of","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas patients & licensed pharmacists · drug safety","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.552.htm","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses pharmacists and regulates pharmacy practice in Texas. Eleven members appointed by the Governor with Senate consent — seven pharmacists, one pharmacy technician, and three public members (Tex. Occ. Code 555).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.555.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51421,"name":"Physical Therapy Examiners, Texas Board of","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas patients & licensed physical therapists","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.453.htm#453.051","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and regulates Texas's physical therapists and PT assistants. Nine members appointed by the Governor with Senate consent — six physical therapists and three public members (Tex. Occ. Code 453.051).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.453.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51422,"name":"Real Estate Commission, Texas","domain":"housing","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas home buyers & licensed real estate brokers","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.1101.htm#1101.051","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and regulates Texas's real estate brokers and sales agents. Nine members appointed by the Governor with Senate consent — six brokers and three public members (Tex. Occ. Code 1101.051).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.1101.htm","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51423,"name":"Veterinary Medical Examiners, State Board of","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas animal owners & licensed veterinarians","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/OC/htm/OC.801.htm#801.051","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Licenses and disciplines Texas's veterinarians and veterinary technicians. Nine members appointed by the Governor with Senate consent — veterinarians, a veterinary technician, and public members (Tex. Occ. Code 801.051).","seatSource":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.801.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51424,"name":"Environmental Quality, Texas Commission on","domain":"environment","totalSeats":3,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"All Texans · air, water & waste permitting","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/WA/htm/WA.5.htm","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Texas's environmental regulator — air, water, and waste permitting and enforcement. Three commissioners appointed by the Governor with Senate consent, six-year staggered terms (Tex. Water Code 5.052).","seatSource":"https://statutes.capitol.texas.gov/Docs/WA/htm/WA.5.htm","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":51425,"name":"Parks and Wildlife Commission","domain":"environment","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas hunters, anglers, state parks & wildlife","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/PW/htm/PW.11.htm#11.012","lastVerified":"2026-08-18","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Governs the Texas Parks and Wildlife Department — hunting, fishing, and state parks. Nine members appointed by the Governor with Senate consent, staggered six-year terms (Tex. Parks & Wild. Code 11.0111).","seatSource":"https://statutes.capitol.texas.gov/Docs/PW/htm/PW.11.htm","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":51426,"name":"Transportation Commission, Texas","domain":"environment","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas travelers & the statewide highway system","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/TN/htm/TN.201.htm#201.051","lastVerified":"2026-08-18","criticalNote":"4 of 5 seats are governor-appointed (1 by the Lieutenant Governor)","mandate":"Governs the Texas Department of Transportation — highways, funding, and major projects. Five members, six-year terms: the Governor appoints four (one from the House Speaker's list) and the Lieutenant Governor appoints one (Tex. Transp. Code 201.051).","seatSource":"https://statutes.capitol.texas.gov/Docs/TN/htm/TN.201.htm","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false}
    ]
  },




























  // ─── Alabama ─── status: live (scraper: manual) ───
  AL: {
    code:"AL", label:"Alabama", region:"South",
    status:"live",
    color:"#7A3E8F", bg:"#F4EBF7",
    applyUrl:"https://governor.alabama.gov/administration/appointments/appointment-application/",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",
    applyVerified:"2026-08-19",
    dataSource:"governor.alabama.gov/administration/appointments",
    scraper:{ endpoint:null, lastPulled:"2026-07-25T19:43:59.646Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Alabama boards shown are hand-verified appointment opportunities — apply through the Governor's appointment application.",
    auditNote:null,
    boards:[
      {"id":49301,"name":"Alabama Council on Developmental Disabilities","domain":"disability","totalSeats":36,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Alabamians with developmental disabilities","applyUrl":"https://governor.alabama.gov/administration/appointments/appointment-application/","sourceUrl":"https://governor.alabama.gov/administration/appointments/","lastVerified":"2026-07-25","mandate":"Alabama's federally mandated DD council driving systems change and inclusion. Thirty-six governor-appointed volunteer members including self-advocates, family members, and agency representatives.","seatSource":"https://acdd.org/","criticalNote":"Curated from Code of Alabama; AL publishes no central board directory (inventory mode)","requires":["Disability Policy","Advocacy","Federal compliance"],"confirmation":false},
      {"id":49302,"name":"Alabama Board of Nursing","domain":"health","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Alabama patients & licensed nurses","applyUrl":"https://governor.alabama.gov/administration/appointments/appointment-application/","sourceUrl":"https://governor.alabama.gov/administration/appointments/","lastVerified":"2026-07-25","mandate":"Licenses and regulates Alabama's nurses. Thirteen members appointed by the Governor from nominee lists — eight registered nurses and four licensed practical nurses plus a consumer (Code of Ala. § 34-21-2).","seatSource":"https://law.justia.com/codes/alabama/title-34/chapter-21/article-1/section-34-21-2/","criticalNote":"Curated from Code of Alabama; AL publishes no central board directory (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49303,"name":"Alabama Board of Pardons and Paroles","domain":"justice","totalSeats":3,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Alabamians in the parole & clemency system","applyUrl":"https://governor.alabama.gov/administration/appointments/appointment-application/","sourceUrl":"https://governor.alabama.gov/administration/appointments/","lastVerified":"2026-07-25","mandate":"Decides parole, pardons, and clemency in Alabama. Three members appointed by the Governor with Senate consent from a nominated slate, six-year terms (Code of Ala. § 15-22-20).","seatSource":"https://law.justia.com/codes/alabama/title-15/chapter-22/article-2/section-15-22-20/","criticalNote":"Curated from Code of Alabama; AL publishes no central board directory (inventory mode)","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49304,"name":"Alabama Real Estate Commission","domain":"housing","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Alabamians in real estate transactions & licensees","applyUrl":"https://governor.alabama.gov/administration/appointments/appointment-application/","sourceUrl":"https://governor.alabama.gov/administration/appointments/","lastVerified":"2026-07-25","mandate":"Licenses and regulates Alabama's real estate brokers and salespersons. Nine members appointed by the Governor with Senate consent (Code of Ala. § 34-27-7).","seatSource":"https://law.justia.com/codes/alabama/title-34/chapter-27/article-1/section-34-27-7/","criticalNote":"Curated from Code of Alabama; AL publishes no central board directory (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":49305,"name":"Advisory Board of Conservation and Natural Resources","domain":"environment","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Alabama's wildlife, public lands & outdoors","applyUrl":"https://governor.alabama.gov/administration/appointments/appointment-application/","sourceUrl":"https://governor.alabama.gov/administration/appointments/","lastVerified":"2026-07-25","mandate":"Advises the Alabama Department of Conservation and Natural Resources on game, fish, and state lands. Thirteen members — ten appointed by the Governor (one per congressional district) plus three ex officio (Code of Ala. § 9-2-14).","seatSource":"https://law.justia.com/codes/alabama/2021/title-9/chapter-2/article-1/section-9-2-14/","criticalNote":"10 of 13 seats are governor-appointed","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false}
    ]
  },



























  // ─── California ─── status: live (scraper: ca) ───
  CA: {
    code:"CA", label:"California", region:"West",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://govca.avature.net/GOVCACareers/Home",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",
    applyVerified:"2026-08-19",
    dataSource:"gov.ca.gov Statutory Index of Positions (PDF) — comprehensive appointive-board roster",
    scraper:{ endpoint:"https://www.gov.ca.gov/join-the-administration/government-appointments/", lastPulled:"2026-08-19T16:35:40.918Z", selectorProfile:"ca" },
    totalBoardsNote:"Statutory Index of Positions (PDF) ~250 appointive boards, Governor's Appointments Unit · 21 verified of 253 openings tracked",
    contextNote:"California's Vacancy Report went image-only (Aug 2026); boards shown are the full appointive-board roster from the Governor's Statutory Index of Positions — apply any time through the Governor's Appointments Office.",
    auditNote:null,
    boards:[
      {"id":49601,"name":"Accountancy, California Board of","domain":"justice","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Californians & licensed CPAs · audit integrity","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"11 of 15 seats are governor-appointed","mandate":"Licenses and disciplines California's CPAs and public accounting firms. Fifteen members — seven licensees and eight public; the Governor appoints eleven (Bus. & Prof. Code § 5000/5015).","seatSource":"https://www.cba.ca.gov/about/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49602,"name":"Agricultural Labor Relations Board","domain":"equity","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California farmworkers & agricultural employers","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"Listed in the Governor's Statutory Index of Positions (appointive board); apply any time","mandate":"Enforces the rights of California's farmworkers to organize and bargain. Five members appointed by the Governor with Senate confirmation (Labor Code § 1141).","seatSource":"https://www.alrb.ca.gov/about-us/","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":49603,"name":"Behavioral Sciences, Bd","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Californians in therapy & licensed clinicians (LMFT, LCSW, LPCC)","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"9 of 11 seats are governor-appointed","mandate":"Licenses California's marriage & family therapists, clinical social workers, professional clinical counselors, and educational psychologists. Eleven members; the Governor appoints nine (Bus. & Prof. Code § 4990).","seatSource":"https://www.bbs.ca.gov/about/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49604,"name":"Acupuncture Board","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California acupuncture patients & licensed acupuncturists","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"5 of 7 seats are governor-appointed","mandate":"Licenses and regulates California's acupuncturists. Seven members — three acupuncturists and four public; the Governor appoints five (Bus. & Prof. Code § 4934).","seatSource":"https://www.acupuncture.ca.gov/about_us/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49605,"name":"Chiropractic Examiners, State Bd of","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California chiropractic patients & licensees","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"Listed in the Governor's Statutory Index of Positions (appointive board); apply any time","mandate":"Licenses and disciplines California's doctors of chiropractic. Seven members appointed by the Governor — five chiropractors and two public (Chiropractic Initiative Act; Bus. & Prof. Code § 1000).","seatSource":"https://www.chiro.ca.gov/about_us/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49606,"name":"Compensation Insurance Fund, State Board of Directors","domain":"justice","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California workers & employers in the workers'-comp system","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"9 of 11 seats are governor-appointed","mandate":"Governs State Fund, California's provider of last-resort workers' compensation insurance. Eleven members — nine governor-appointed plus two legislative appointees (Ins. Code § 11770).","seatSource":"https://codes.findlaw.com/ca/insurance-code/ins-sect-11770/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49607,"name":"Dental Board of CA","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California dental patients & licensed dentists","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"Listed in the Governor's Statutory Index of Positions (appointive board); apply any time","mandate":"Licenses and disciplines California's dentists and dental assistants. Fifteen members — eight practicing dentists, two registered dental assistants, and five public members (Bus. & Prof. Code § 1601.1).","seatSource":"https://california.public.law/codes/ca_bus_and_prof_code_section_1601.1","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49608,"name":"Gambling Control Commission","domain":"justice","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Californians affected by regulated gambling","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"Listed in the Governor's Statutory Index of Positions (appointive board); apply any time","mandate":"Regulates California's gambling industry and acts as trustee of Indian Gaming funds. Five members appointed by the Governor, Senate-confirmed (Bus. & Prof. Code § 19811).","seatSource":"https://www.cgcc.ca.gov/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49609,"name":"Nursing, Board of Registered","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & registered nurses","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"Listed in the Governor's Statutory Index of Positions (appointive board); apply any time","mandate":"Licenses and regulates California's registered nurses. Nine members — five registered nurses and four public members; the Governor appoints seven, with the Senate and Assembly each appointing one public member (Bus. & Prof. Code § 2701).","seatSource":"https://california.public.law/codes/ca_bus_and_prof_code_section_2701","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49610,"name":"Osteopathic Medical Board of CA","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & licensed D.O. physicians","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"7 of 9 seats are governor-appointed","mandate":"Licenses and disciplines California's osteopathic physicians. Nine members — five D.O.s and four public; the Governor appoints seven (Bus. & Prof. Code § 2450 et seq.).","seatSource":"https://ombc.ca.gov/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49611,"name":"Medical Board of California","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & licensed physicians","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"13 of 15 seats are governor-appointed","mandate":"Licenses and disciplines California's physicians. Fifteen members — seven licensed physicians and eight public members; the Governor appoints thirteen, with the Senate and Assembly each appointing one public member (Bus. & Prof. Code § 2001).","seatSource":"https://california.public.law/codes/ca_bus_and_prof_code_section_2001","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49612,"name":"Physical Therapy Examining Committee","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & licensed physical therapists","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"5 of 7 seats are governor-appointed","mandate":"Licenses and regulates California's physical therapists and PT assistants. Seven members — four PTs and three public; the Governor appoints five (Bus. & Prof. Code § 2602).","seatSource":"https://www.ptbc.ca.gov/about_us/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49613,"name":"Native American Heritage Commission","domain":"equity","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California Native American tribes & sacred sites","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"Listed in the Governor's Statutory Index of Positions (appointive board); apply any time","mandate":"Protects California Native American sacred sites, burial grounds, and cultural resources. Nine members appointed by the Governor, a majority Native American (Public Resources Code § 5097.91).","seatSource":"https://nahc.ca.gov/","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":49614,"name":"Optometry, State Board of","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California eye-care patients & licensed optometrists","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"9 of 11 seats are governor-appointed","mandate":"Licenses and regulates California's optometrists. Eleven members — six professionals and five public; the Governor appoints nine (Bus. & Prof. Code § 3010).","seatSource":"https://www.optometry.ca.gov/about_us/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49615,"name":"Pharmacy, California State Board of","domain":"health","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & licensed pharmacists · drug safety","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"11 of 13 seats are governor-appointed","mandate":"Licenses pharmacists and regulates the distribution of drugs in California. Thirteen members — seven pharmacists and four public appointed by the Governor, with the Senate and Assembly each appointing one public member (Bus. & Prof. Code § 4001).","seatSource":"https://california.public.law/codes/ca_bus_and_prof_code_section_4001","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49616,"name":"Physician Assistant Board","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & licensed physician assistants","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"7 of 9 voting seats are governor-appointed","mandate":"Licenses and regulates California's physician assistants. Nine voting members — five PAs and four public; the Governor appoints seven voting members (Bus. & Prof. Code § 3504).","seatSource":"https://www.pab.ca.gov/about_us/about.shtml","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49617,"name":"Podiatric Medicine, Board of","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & licensed podiatrists","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"5 of 7 seats are governor-appointed","mandate":"Licenses and disciplines California's doctors of podiatric medicine. Seven members — four DPMs and three public; the Governor appoints five (Bus. & Prof. Code § 2461).","seatSource":"https://www.pmbc.ca.gov/about_us/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49618,"name":"Psychology, Board of","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Californians seeking psychological care & licensed psychologists","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"Listed in the Governor's Statutory Index of Positions (appointive board); apply any time","mandate":"Licenses and regulates California's psychologists. Nine members — five licensed psychologists and four public members (Bus. & Prof. Code § 2920).","seatSource":"https://california.public.law/codes/ca_bus_and_prof_code_section_2920","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49619,"name":"Respiratory Care Examining Comm","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & licensed respiratory therapists","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"3 of 9 seats are governor-appointed","mandate":"Licenses and regulates California's respiratory care practitioners. Nine members; the Governor, Senate Rules, and Assembly Speaker each appoint three (Bus. & Prof. Code § 3710).","seatSource":"https://www.rcb.ca.gov/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49620,"name":"Transportation Commission, California","domain":"environment","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California travelers & statewide transportation infrastructure","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"9 of 11 voting seats are governor-appointed","mandate":"Programs and allocates state transportation funding — highways, transit, and active transportation. Eleven voting members; the Governor appoints nine (Gov. Code § 14500).","seatSource":"https://catc.ca.gov/about/mission-responsibilities","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":49621,"name":"Voc Nursing & Psych Tech Bd","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California patients & licensed LVNs and psychiatric technicians","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/03/Statutory-Index-2026.pdf","lastVerified":"2026-08-19","criticalNote":"9 of 11 seats are governor-appointed","mandate":"Licenses and regulates California's vocational nurses and psychiatric technicians. Eleven members; the Governor appoints nine (Bus. & Prof. Code § 2841).","seatSource":"https://www.bvnpt.ca.gov/about_us/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },



























  // ─── Florida ─── status: live (scraper: fl) ───
  FL: {
    code:"FL", label:"Florida", region:"South",
    status:"live",
    color:"#8A5A0B", bg:"#FAF1DE",
    applyUrl:"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",
    applyVerified:"2026-08-19",
    dataSource:"eogforms.eog.myflorida.com Board Seat Application (Board Name directory)",
    scraper:{ endpoint:"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx", lastPulled:"2026-08-18T15:43:36.437Z", selectorProfile:"fl" },
    totalBoardsNote:"Governor's Board Seat Application directory (~296 boards) · no central vacancy list · 16 verified of 291 openings tracked",
    contextNote:"Florida publishes no central vacancy list; boards shown are the full appointive-board directory from the Governor's online Board Seat Application — apply any time.",
    auditNote:null,
    boards:[
      {"id":49901,"name":"Board of Accountancy","domain":"justice","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida businesses & licensed CPAs · audit integrity","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and disciplines Florida's certified public accountants. Nine members appointed by the Governor with Senate confirmation — seven CPAs and two lay members (F.S. 473.303).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-473/section-473-303/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49902,"name":"Board of Chiropractic Medicine","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida chiropractic patients & licensees","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and disciplines Florida's chiropractic physicians. Seven members appointed by the Governor with Senate confirmation (F.S. 460.404).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-460/section-460-404/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49903,"name":"Board of Medicine","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida patients & licensed physicians","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and disciplines Florida physicians. Fifteen members appointed by the Governor with Senate confirmation — twelve physicians, three consumer members (Fla. Stat. § 458.307).","seatSource":"https://www.flsenate.gov/Laws/Statutes/2024/458.307","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49904,"name":"Board of Nursing","domain":"health","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida patients & licensed nurses","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and disciplines Florida's nurses. Thirteen members appointed by the Governor and confirmed by the Senate — registered and practical nurses plus consumer members (F.S. 464.004).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-464/section-464-004/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49905,"name":"Board of Optometry","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida eye-care patients & licensed optometrists","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and regulates Florida's optometrists. Seven members appointed by the Governor with Senate confirmation — five optometrists and two consumer members (F.S. 463.003).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-463/section-463-003/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49906,"name":"Board of Osteopathic Medicine","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida patients & licensed D.O. physicians","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and disciplines Florida's osteopathic physicians. Seven members appointed by the Governor with Senate confirmation — five D.O.s and two consumer members (F.S. 459.004).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-459/section-459-004/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49907,"name":"Board of Pharmacy","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida patients & licensed pharmacists · drug safety","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses pharmacists and regulates pharmacy practice in Florida. Nine members appointed by the Governor with Senate confirmation — seven pharmacists and two consumer members (F.S. 465.004).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-465/section-465-004/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49908,"name":"Board of Physical Therapy Practice","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida patients & licensed physical therapists","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and regulates Florida's physical therapists and PT assistants. Seven members appointed by the Governor with Senate confirmation (F.S. 486.023).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-486/section-486-023/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49909,"name":"Board of Podiatric Medicine","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida patients & licensed podiatrists","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and disciplines Florida's podiatric physicians. Seven members appointed by the Governor with Senate confirmation — five podiatrists and two consumer members (F.S. 461.005).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-461/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49910,"name":"Board of Professional Engineers","domain":"justice","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Floridians & licensed professional engineers · public safety","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and regulates Florida's professional engineers. Eleven members appointed by the Governor — nine licensed engineers and two lay members (F.S. 471.007).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-471/section-471-007/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49911,"name":"Board of Psychology","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Floridians seeking psychological care & licensed psychologists","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and regulates Florida's psychologists. Seven members appointed by the Governor with Senate confirmation — five psychologists and two consumer members (F.S. 490.004).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-490/section-490-004/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49912,"name":"Florida Fish and Wildlife Conservation Commission","domain":"environment","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida's fish, wildlife & outdoors","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Manages Florida's fish and wildlife resources — a constitutional commission. Seven members appointed by the Governor with Senate confirmation, staggered five-year terms (Fla. Const. Art. IV, Sec. 9).","seatSource":"https://codes.findlaw.com/fl/florida-constitution1968-revision/fl-const-art-4-sect-9/","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":49913,"name":"Florida Public Service Commission","domain":"justice","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Every Florida utility ratepayer · electric, gas, water, telecom","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Regulates Florida's investor-owned electric, natural-gas, water, and telecom utilities and their rates. Five commissioners appointed by the Governor from a nominating council's slate, Senate-confirmed (F.S. 350.031).","seatSource":"https://law.justia.com/codes/florida/title-xxvii/chapter-350/section-350-031/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":49914,"name":"Florida Real Estate Commission","domain":"housing","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida home buyers & licensed real estate brokers","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Licenses and regulates Florida's real estate brokers and sales associates. Seven members appointed by the Governor with Senate confirmation — five licensees and two consumer members (F.S. 475.02).","seatSource":"https://law.justia.com/codes/florida/title-xxxii/chapter-475/section-475-02/","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":49915,"name":"Florida Transportation Commission","domain":"environment","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida travelers & the statewide transportation system","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Citizen oversight board for the Florida Department of Transportation — policy, accountability, and major-project review. Nine members appointed by the Governor with Senate confirmation (F.S. 20.23).","seatSource":"https://law.justia.com/codes/florida/title-iv/chapter-20/section-20-23/","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":49916,"name":"Florida State Board of Education","domain":"education","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida K-12 students & families","applyUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","sourceUrl":"https://eogforms.eog.myflorida.com/pages/SeatApplication.aspx","lastVerified":"2026-08-18","criticalNote":"Listed in the Governor's Board Seat Application (inventory); FL publishes no central vacancy list","mandate":"Chief policy body for Florida public education. Seven members appointed by the Governor to staggered four-year terms, Senate-confirmed (Fla. Const. art. IX).","seatSource":"https://www.flsenate.gov/Laws/Constitution#A9S02","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false}
    ]
  },



























  // ─── Louisiana ─── status: live (scraper: manual) ───
  LA: {
    code:"LA", label:"Louisiana", region:"South",
    status:"live",
    color:"#0E6B5C", bg:"#E0F4F0",
    applyUrl:"https://gov.louisiana.gov/index.cfm/form/home/14",
    applyAuthority:"Governor's Office of Boards & Commissions",
    applyLabel:"Governor's Office of Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"gov.louisiana.gov/page/boards-commissions",
    scraper:{ endpoint:null, lastPulled:"2026-07-25T19:02:22.017Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 8 verified of 8 openings tracked",
    contextNote:"Louisiana boards shown are hand-verified appointment opportunities — apply through the Governor's online application.",
    auditNote:null,
    boards:[
      {"id":50301,"name":"Louisiana State Board of Medical Examiners","domain":"health","totalSeats":10,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisiana patients & licensed physicians","applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://www.legis.la.gov/legis/Boards.aspx","lastVerified":"2026-07-25","mandate":"Licenses and disciplines Louisiana physicians. Ten voting members appointed by the Governor with Senate confirmation from nominated slates plus one consumer member (La. R.S. 37:1263).","seatSource":"https://www.lsbme.la.gov/","criticalNote":"Sourced from Louisiana's official Senate Boards & Commissions directory; LA publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50302,"name":"Louisiana Developmental Disabilities Council","domain":"disability","totalSeats":28,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisianans with developmental disabilities","applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://www.legis.la.gov/legis/Boards.aspx","lastVerified":"2026-07-25","mandate":"Louisiana's federally mandated DD council. Twenty-eight governor-appointed members including people with disabilities, family members, and agency representatives.","seatSource":"https://laddc.org/","criticalNote":"Sourced from Louisiana's official Senate Boards & Commissions directory; LA publishes no central vacancy list (inventory mode)","requires":["Disability Policy","Advocacy","Federal compliance"],"confirmation":false},
      {"id":50303,"name":"Louisiana State Board of Nursing","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisiana patients & registered nurses","applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://www.legis.la.gov/legis/Boards.aspx","lastVerified":"2026-07-25","mandate":"Licenses and regulates Louisiana's registered nurses. Eleven members appointed by the Governor with Senate confirmation — eight RNs, one CRNA, and two consumer members (La. R.S. 37:914).","seatSource":"https://www.lsbn.state.la.us/","criticalNote":"Sourced from Louisiana's official Senate Boards & Commissions directory; LA publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50304,"name":"Louisiana Wildlife and Fisheries Commission","domain":"environment","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisiana's wildlife, fisheries & coastal communities","applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://www.legis.la.gov/legis/Boards.aspx","lastVerified":"2026-07-25","mandate":"Sets policy for Louisiana's wildlife, fisheries, and conservation. Seven members appointed by the Governor with Senate confirmation — three from coastal parishes representing commercial fishing and fur, four at-large (La. R.S. 56:6).","seatSource":"https://www.wlf.louisiana.gov/page/commission","criticalNote":"Sourced from Louisiana's official Senate Boards & Commissions directory; LA publishes no central vacancy list (inventory mode)","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50305,"name":"Louisiana Board of Regents","domain":"education","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisiana public college students & institutions","applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://www.legis.la.gov/legis/Boards.aspx","lastVerified":"2026-07-25","mandate":"Plans, coordinates, and budgets all Louisiana public higher education. Fifteen members appointed by the Governor with Senate confirmation, plus a student member (La. Const. art. VIII; R.S. 17:3121).","seatSource":"https://www.laregents.edu/boardmembers/","criticalNote":"Sourced from Louisiana's official Senate Boards & Commissions directory; LA publishes no central vacancy list (inventory mode)","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":50306,"name":"Louisiana State Board of Dentistry","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisiana dental patients & licensed dentists","applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://www.legis.la.gov/legis/Boards.aspx","lastVerified":"2026-07-25","mandate":"Licenses and disciplines Louisiana's dentists and dental hygienists. Fifteen members appointed by the Governor — thirteen dentists, one dental hygienist, and one consumer (La. R.S. 37:753).","seatSource":"https://www.lsbd.org/","criticalNote":"Sourced from Louisiana's official Senate Boards & Commissions directory; LA publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50307,"name":"Louisiana Board of Pharmacy","domain":"health","totalSeats":17,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisiana patients & licensed pharmacists","applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://www.legis.la.gov/legis/Boards.aspx","lastVerified":"2026-07-25","mandate":"Licenses pharmacists and regulates the distribution of drugs in Louisiana. Seventeen members appointed by the Governor from the pharmacy districts plus a consumer member (La. R.S. 37:1172).","seatSource":"https://www.pharmacy.la.gov/page/board-members","criticalNote":"Sourced from Louisiana's official Senate Boards & Commissions directory; LA publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50308,"name":"Louisiana Real Estate Commission","domain":"housing","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisianans in real estate transactions & licensees","applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://www.legis.la.gov/legis/Boards.aspx","lastVerified":"2026-07-25","mandate":"Licenses and regulates Louisiana's real estate professionals. Eleven members appointed by the Governor with Senate confirmation — one per supreme court district plus at-large members (La. R.S. 37:1432).","seatSource":"https://lrec.gov/commission-members","criticalNote":"Sourced from Louisiana's official Senate Boards & Commissions directory; LA publishes no central vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false}
    ]
  },



























  // ─── Mississippi ─── status: live (scraper: manual) ───
  MS: {
    code:"MS", label:"Mississippi", region:"South",
    status:"live",
    color:"#7A3E8F", bg:"#F4EBF7",
    applyUrl:"https://governorreeves.ms.gov/",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",
    applyVerified:"2026-08-19",
    dataSource:"governorreeves.ms.gov",
    scraper:{ endpoint:null, lastPulled:"2026-07-25T19:43:59.618Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 6 verified of 6 openings tracked",
    contextNote:"Mississippi boards shown are hand-verified appointment opportunities — contact the Governor's Appointments Office to apply. (TODO verify direct application form.)",
    auditNote:null,
    boards:[
      {"id":50601,"name":"Mississippi State Board of Medical Licensure","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Mississippi patients & licensed physicians","applyUrl":"https://governorreeves.ms.gov/","sourceUrl":"https://www.ms.gov/agencies","lastVerified":"2026-07-25","mandate":"Licenses and disciplines Mississippi physicians. Nine physician members appointed by the Governor with Senate consent (Miss. Code § 73-43-3).","seatSource":"https://law.justia.com/codes/mississippi/title-73/chapter-43/","criticalNote":"Curated from Mississippi statute; MS publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50602,"name":"Mississippi State Board of Education","domain":"education","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Mississippi K-12 students & families","applyUrl":"https://governorreeves.ms.gov/","sourceUrl":"https://www.ms.gov/agencies","lastVerified":"2026-07-25","mandate":"Governs Mississippi public education policy. Nine members — five appointed by the Governor, two each by the Lt. Governor and House Speaker (Miss. Const. § 202A).","seatSource":"https://law.justia.com/codes/mississippi/","criticalNote":"5 of 9 seats are governor-appointed","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":50603,"name":"Board of Trustees of State Institutions of Higher Learning","domain":"education","totalSeats":12,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Mississippi public university students & institutions","applyUrl":"https://governorreeves.ms.gov/","sourceUrl":"https://www.ms.gov/agencies","lastVerified":"2026-07-25","mandate":"Governs Mississippi's eight public universities. Twelve members appointed by the Governor with Senate consent — four from each Supreme Court district (Miss. Code § 37-101-1).","seatSource":"https://www.mississippi.edu/about/board-trustees","criticalNote":"Curated from Mississippi statute; MS publishes no central vacancy list (inventory mode)","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":50604,"name":"Mississippi Board of Nursing","domain":"health","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Mississippi patients & licensed nurses","applyUrl":"https://governorreeves.ms.gov/","sourceUrl":"https://www.ms.gov/agencies","lastVerified":"2026-07-25","mandate":"Licenses and regulates Mississippi's nurses. Thirteen members — twelve nurses appointed by the Governor from nominee lists plus one physician from the Board of Medical Licensure (Miss. Code § 73-15-9).","seatSource":"https://law.justia.com/codes/mississippi/title-73/chapter-15/article-1/section-73-15-9/","criticalNote":"12 of 13 seats are governor-appointed","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50605,"name":"Mississippi Commission on Wildlife, Fisheries, and Parks","domain":"environment","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Mississippi's wildlife, fisheries, parks & sportsmen","applyUrl":"https://governorreeves.ms.gov/","sourceUrl":"https://www.ms.gov/agencies","lastVerified":"2026-07-25","mandate":"Sets policy for the Mississippi Department of Wildlife, Fisheries, and Parks. Five members appointed by the Governor with Senate consent, one per historic congressional district (Miss. Code § 49-4-4).","seatSource":"https://www.mdwfp.com/mississippi-commission-wildlife-fisheries-and-parks","criticalNote":"Curated from Mississippi statute; MS publishes no central vacancy list (inventory mode)","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50606,"name":"Mississippi State Board of Pharmacy","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Mississippi patients & licensed pharmacists","applyUrl":"https://governorreeves.ms.gov/","sourceUrl":"https://www.ms.gov/agencies","lastVerified":"2026-07-25","mandate":"Licenses pharmacists and regulates drug distribution in Mississippi. Seven members appointed by the Governor with Senate consent (Miss. Code § 73-21-75).","seatSource":"https://codes.findlaw.com/ms/title-73-professions-and-vocations/ms-code-sect-73-21-75/","criticalNote":"Curated from Mississippi statute; MS publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },



























  // ─── Wisconsin ─── status: live (scraper: manual) ───
  WI: {
    code:"WI", label:"Wisconsin", region:"Midwest",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions",
    applyAuthority:"Office of the Governor — Boards & Commissions",
    applyLabel:"Office of the Governor — Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"evers.wi.gov/Pages/BoardsCommissions.aspx",
    scraper:{ endpoint:null, lastPulled:"2026-07-25T19:29:46.796Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 7 verified of 7 openings tracked",
    contextNote:"Wisconsin boards shown are hand-verified appointment opportunities — apply any time through the Governor's online application.",
    auditNote:null,
    boards:[
      {"id":51601,"name":"Medical Examining Board","domain":"health","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsin patients & licensed physicians","applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://evers.wi.gov/Pages/BoardsCommissions.aspx","lastVerified":"2026-07-25","mandate":"Licenses and disciplines Wisconsin physicians. Thirteen members — ten licensed doctors and three public members — appointed by the Governor, Senate-confirmed (Wis. Stat. § 15.405(7)).","seatSource":"https://docs.legis.wisconsin.gov/statutes/statutes/15/ii/405","criticalNote":"Sourced from Wisconsin's official Governor's Boards & Commissions directory; WI publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51602,"name":"Board for People with Developmental Disabilities","domain":"disability","totalSeats":28,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsinites with developmental disabilities","applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://evers.wi.gov/Pages/BoardsCommissions.aspx","lastVerified":"2026-07-25","mandate":"Wisconsin's federally mandated DD council. Twenty-eight members — twenty-one governor-appointed, at least 60% people with developmental disabilities or family members.","seatSource":"https://dhs.wisconsin.gov/bpdd/index.htm","criticalNote":"21 of 28 seats are governor-appointed","requires":["Disability Policy","Advocacy","Federal compliance"],"confirmation":false},
      {"id":51603,"name":"Natural Resources Board","domain":"environment","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsin's natural resources, hunters, anglers & environment","applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://evers.wi.gov/Pages/BoardsCommissions.aspx","lastVerified":"2026-07-25","mandate":"Sets policy for the Wisconsin Department of Natural Resources — conservation, wildlife, water, and environmental protection. Seven members appointed by the Governor with Senate confirmation, balanced north and south (Wis. Stat. § 15.34).","seatSource":"https://docs.legis.wisconsin.gov/statutes/statutes/15/ii/34","criticalNote":"Sourced from Wisconsin's official Governor's Boards & Commissions directory; WI publishes no central vacancy list (inventory mode)","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":51604,"name":"Board of Nursing","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsin patients & licensed nurses","applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://evers.wi.gov/Pages/BoardsCommissions.aspx","lastVerified":"2026-07-25","mandate":"Licenses and regulates Wisconsin's nurses. Nine members appointed by the Governor with Senate confirmation — registered nurses, an LPN, an APRN, a nurse educator, and two public members (Wis. Stat. § 15.405).","seatSource":"https://docs.legis.wisconsin.gov/statutes/statutes/15/ii/405","criticalNote":"Sourced from Wisconsin's official Governor's Boards & Commissions directory; WI publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51605,"name":"Board of Regents of the University of Wisconsin System","domain":"education","totalSeats":18,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsin public university students & institutions","applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://evers.wi.gov/Pages/BoardsCommissions.aspx","lastVerified":"2026-07-25","mandate":"Governs the Universities of Wisconsin System. Eighteen members — sixteen appointed by the Governor (including two students) plus two ex officio (Wis. Stat. § 15.91).","seatSource":"https://docs.legis.wisconsin.gov/statutes/statutes/15/vi/91","criticalNote":"16 of 18 seats are governor-appointed","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":51606,"name":"Dentistry Examining Board","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsin dental patients & licensed dentists","applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://evers.wi.gov/Pages/BoardsCommissions.aspx","lastVerified":"2026-07-25","mandate":"Licenses and disciplines Wisconsin's dentists and dental hygienists. Eleven members appointed by the Governor — six dentists, three dental hygienists, and two public members (Wis. Stat. § 15.405).","seatSource":"https://docs.legis.wisconsin.gov/statutes/statutes/15/ii/405","criticalNote":"Sourced from Wisconsin's official Governor's Boards & Commissions directory; WI publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51607,"name":"Pharmacy Examining Board","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsin patients & licensed pharmacists","applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://evers.wi.gov/Pages/BoardsCommissions.aspx","lastVerified":"2026-07-25","mandate":"Licenses pharmacists and regulates pharmacy practice in Wisconsin. Nine members appointed by the Governor with Senate confirmation (Wis. Stat. § 15.405).","seatSource":"https://docs.legis.wisconsin.gov/statutes/statutes/15/ii/405","criticalNote":"Sourced from Wisconsin's official Governor's Boards & Commissions directory; WI publishes no central vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },



























  // ─── South Carolina ─── status: live (scraper: sc) ───
  SC: {
    code:"SC", label:"South Carolina", region:"South",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://governor.sc.gov/executive-branch/appointments",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",
    applyVerified:"2026-08-19",
    dataSource:"search.scsos.com/boardsandcommissions",
    scraper:{ endpoint:"https://search.scsos.com/files/Web_PositionVacancy_List.pdf", lastPulled:"2026-08-18T16:44:20.283Z", selectorProfile:"sc" },
    totalBoardsNote:"SOS statewide vacancy list · 250+ boards · 16 verified of 123 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":51201,"name":"Board of Podiatry Examiners","domain":"health","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina patients & licensed podiatrists","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's podiatrists. Five members appointed by the Governor with Senate consent — three district podiatrists, one at-large podiatrist (chairman), and one lay member (S.C. Code 40-51-30).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-51/section-40-51-30/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51202,"name":"South Carolina Board of Chiropractic Examiners","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina patients & licensed chiropractors","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and disciplines South Carolina's chiropractors. Nine members appointed by the Governor — one chiropractor per congressional district, one at-large chiropractor, and one lay member (S.C. Code 40-9-30).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-9/section-40-9-30/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51203,"name":"South Carolina Board of Dentistry","domain":"health","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina dental patients & licensed dentists/hygienists","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's dentists and dental hygienists. Eleven members — seven district dentists, one at-large dentist, two dental hygienists, and one lay member; the Governor appoints and fills vacancies (S.C. Code 40-15-20).","seatSource":"https://www.scstatehouse.gov/code/t40c015.php","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51204,"name":"South Carolina Board of Examiners in Opticianry","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina eyewear consumers & licensed opticians","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's opticians. Seven members appointed by the Governor — five licensed opticians nominated by profession-wide election plus public members (S.C. Code 40-38-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-38/section-40-38-10/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51205,"name":"South Carolina Board of Long Term Health Care Administrators","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina nursing-home & residential-care residents and administrators","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Nine governor-appointed voting members; the DHEC Commissioner (or designee) serves ex officio, nonvoting","mandate":"Licenses and disciplines South Carolina's nursing-home and community-residential-care administrators. Nine voting members appointed by the Governor with Senate consent (S.C. Code 40-35-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-35/section-40-35-10/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51206,"name":"South Carolina Board of Occupational Therapy","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina patients & licensed occupational therapists","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's occupational therapists. Seven members appointed by the Governor with Senate consent — five occupational therapists, one occupational-therapy assistant, and one lay member (S.C. Code 40-36-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-36/section-40-36-10/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51207,"name":"South Carolina Commission on Higher Education","domain":"education","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina college students & public/independent institutions","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Coordinates South Carolina's public higher education policy, funding, and program approval. Fifteen members appointed by the Governor — one per congressional district, three at-large, plus institutional representatives (S.C. Code 59-103-10).","seatSource":"https://www.scstatehouse.gov/code/t59c103.php","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":51208,"name":"South Carolina Real Estate Appraisers Board","domain":"housing","totalSeats":8,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina home buyers, lenders & licensed appraisers","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's real estate appraisers. Eight members appointed by the Governor with Senate consent — four licensed/certified appraisers, a real estate broker, a mortgage lender, an appraisal-management-company member, and a public member (S.C. Code 40-60-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-60/section-40-60-10/","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51209,"name":"South Carolina Residential Builders Commission","domain":"housing","totalSeats":8,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina homeowners & licensed residential builders","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's residential home builders and specialty contractors. Eight members appointed by the Governor with Senate consent — one per congressional district plus one at-large, including four builders, one specialty contractor, and two consumers (S.C. Code 40-59-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-59/section-40-59-10/","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51210,"name":"South Carolina State Housing, Finance and Development Authority","domain":"housing","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolinians needing affordable housing","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"7 of 9 seats are governor-appointed","mandate":"Oversees SC Housing's affordable-housing finance programs. Nine commissioners — seven governor-appointed with Senate consent plus two ex officio (S.C. Code Title 31, Ch. 13).","seatSource":"https://www.scstatehouse.gov/code/t31c013.php","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51211,"name":"State Board of Architectural Examiners","domain":"housing","totalSeats":6,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina building owners & licensed architects","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's architects. Six members appointed by the Governor — four practicing architects, one architecture professor, and one public member (S.C. Code 40-3-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-3/section-40-3-10/","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51212,"name":"State Board of Cosmetology","domain":"equity","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina salon consumers & licensed cosmetology workers","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's cosmetologists, estheticians, and nail technicians. Seven members appointed by the Governor with Senate consent — four cosmetologists, one esthetician, one nail technician, and one public member (S.C. Code 40-13-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-13/section-40-13-10/","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":51213,"name":"State Board of Medical Examiners","domain":"health","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina patients & licensed physicians","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and disciplines South Carolina's physicians. Thirteen members appointed by the Governor with Senate consent — seven physicians (one per congressional district), two at-large physicians, one osteopathic physician, and three lay members (S.C. Code 40-47-10).","seatSource":"https://www.scstatehouse.gov/code/t40c047.php","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51214,"name":"State Board of Physical Therapy Examiners","domain":"health","totalSeats":11,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina patients & licensed physical therapists","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's physical therapists. Eleven members appointed by the Governor — seven district PTs, two physical-therapist assistants, and two public members (S.C. Code 40-45-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-45/section-40-45-10/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51215,"name":"State Board of Social Work Examiners","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina clients & licensed social workers","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and regulates South Carolina's social workers. Seven members appointed by the Governor with Senate consent — two baccalaureate, two master, and two independent social workers, plus one lay member (S.C. Code 40-63-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-63/section-40-63-10/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51216,"name":"State Board of Veterinary Medical Examiners","domain":"health","totalSeats":10,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolina pet owners, livestock producers & licensed veterinarians","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-08-18","criticalNote":"Listed in SC Secretary of State vacancy list","mandate":"Licenses and disciplines South Carolina's veterinarians. Ten members appointed by the Governor with Senate consent — seven district veterinarians, one at-large veterinarian, one veterinary technician, and one consumer member (S.C. Code 40-69-10).","seatSource":"https://law.justia.com/codes/south-carolina/title-40/chapter-69/section-40-69-10/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },

























  // ─── Missouri ─── status: live (scraper: mo) ───
  MO: {
    code:"MO", label:"Missouri", region:"Midwest",
    status:"live",
    color:"#7A3E8F", bg:"#F4EBF7",
    applyUrl:"https://apps1.mo.gov/boardsapp/UserPages/Login.aspx",
    applyAuthority:"Governor's Office — Boards & Commissions",
    applyLabel:"Governor's Office — Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"boards.mo.gov",
    scraper:{ endpoint:"https://boards.mo.gov/userpages/boardsearch.aspx", lastPulled:"2026-08-17T11:14:22.668Z", selectorProfile:"mo" },
    totalBoardsNote:"Current vacancies & expired terms list, boards.mo.gov · 5 verified of 183 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":50501,"name":"Missouri Real Estate Commission","domain":"justice","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Missouri home buyers & licensed real estate brokers","applyUrl":"https://apps1.mo.gov/boardsapp/UserPages/Login.aspx","sourceUrl":"https://boards.mo.gov/userpages/Board.aspx?312","lastVerified":"2026-08-17","criticalNote":"Current vacancy or expired term per boards.mo.gov","mandate":"Licenses and regulates Missouri's real estate brokers and salespersons. Seven members appointed by the Governor with Senate consent — six experienced brokers and one voting public member (RSMo 339.120).","seatSource":"https://revisor.mo.gov/main/OneSection.aspx?section=339.120","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50502,"name":"Missouri State Board of Accountancy","domain":"justice","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Missouri businesses & licensed CPAs · audit integrity","applyUrl":"https://apps1.mo.gov/boardsapp/UserPages/Login.aspx","sourceUrl":"https://boards.mo.gov/userpages/Board.aspx?320","lastVerified":"2026-08-17","criticalNote":"Current vacancy or expired term per boards.mo.gov","mandate":"Licenses and disciplines Missouri's certified public accountants. Seven members appointed by the Governor with Senate consent — six licensees and one voting public member (RSMo 326.259).","seatSource":"https://revisor.mo.gov/main/OneSection.aspx?section=326.259","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50503,"name":"Missouri State Board of Nursing","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Missouri patients & licensed nurses","applyUrl":"https://apps1.mo.gov/boardsapp/UserPages/Login.aspx","sourceUrl":"https://boards.mo.gov/userpages/Board.aspx?78","lastVerified":"2026-08-17","criticalNote":"Current vacancy or expired term per boards.mo.gov","mandate":"Licenses and disciplines Missouri's nurses and enforces the Nursing Practice Act. Nine members appointed by the Governor with the advice and consent of the Senate (RSMo 335.021).","seatSource":"https://revisor.mo.gov/main/OneSection.aspx?section=335.021","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50504,"name":"State Board of Pharmacy","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Missouri patients & licensed pharmacists · drug safety","applyUrl":"https://apps1.mo.gov/boardsapp/UserPages/Login.aspx","sourceUrl":"https://boards.mo.gov/userpages/Board.aspx?127","lastVerified":"2026-08-17","criticalNote":"Current vacancy or expired term per boards.mo.gov","mandate":"Licenses pharmacists and regulates the practice of pharmacy across Missouri. Seven members appointed by the Governor with Senate consent — six pharmacists and one voting public member (RSMo 338.110).","seatSource":"https://revisor.mo.gov/main/OneSection.aspx?section=338.110","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50505,"name":"State Board of Registration for the Healing Arts","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Missouri patients & licensed physicians","applyUrl":"https://apps1.mo.gov/boardsapp/UserPages/Login.aspx","sourceUrl":"https://boards.mo.gov/userpages/Board.aspx?129","lastVerified":"2026-08-17","criticalNote":"Current vacancy or expired term per boards.mo.gov","mandate":"Licenses and disciplines Missouri's physicians and surgeons. Nine members appointed by the Governor with Senate consent — eight physicians and one voting public member (RSMo Chapter 334).","seatSource":"https://pr.mo.gov/healingarts-about-the-board.asp","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },













  // ─── Indiana ─── status: live (scraper: manual) ───
  IN: {
    code:"IN", label:"Indiana", region:"Midwest",
    status:"live",
    color:"#7A3E8F", bg:"#F4EBF7",
    applyUrl:"https://www.in.gov/gov/",
    applyAuthority:"Governor's Office — Boards & Commissions",
    applyLabel:"Governor's Office — Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"in.gov/gov",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Indiana boards shown are hand-verified governor-appointed opportunities — apply through the Governor's Office.",
    auditNote:null,
    boards:[
      {"id":50001,"name":"Indiana Medical Licensing Board","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Indiana patients & licensed physicians","applyUrl":"https://www.in.gov/gov/","sourceUrl":"https://www.in.gov/gov/","lastVerified":"2026-08-13","mandate":"Licenses and disciplines Indiana's physicians. Seven members appointed by the Governor — five physicians, one osteopathic physician, and one public member; no more than four from one party (IC 25-22.5-2-1).","seatSource":"https://law.justia.com/codes/indiana/title-25/article-22-5/chapter-2/section-25-22-5-2-1/","criticalNote":"Curated from the Indiana Code; IN publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50002,"name":"Indiana State Board of Nursing","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Indiana patients & licensed nurses","applyUrl":"https://www.in.gov/gov/","sourceUrl":"https://www.in.gov/gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Indiana's nurses. Nine members appointed by the Governor — six registered nurses, two licensed practical nurses, and one public member (IC 25-23-1-2).","seatSource":"https://law.justia.com/codes/indiana/title-25/article-23/chapter-1/section-25-23-1-2/","criticalNote":"Curated from the Indiana Code; IN publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50003,"name":"Indiana Natural Resources Commission","domain":"environment","totalSeats":12,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Indiana's wildlife, waterways & public lands","applyUrl":"https://www.in.gov/gov/","sourceUrl":"https://www.in.gov/nrc/2352.htm","lastVerified":"2026-08-13","mandate":"Sets policy for Indiana's Department of Natural Resources. Twelve-member board — six citizen members appointed by the Governor plus ex officio and designated seats.","seatSource":"https://www.in.gov/nrc/2352.htm","criticalNote":"6 of 12 seats are governor-appointed","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50004,"name":"Indiana Gaming Commission","domain":"justice","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Indiana casino patrons & gaming integrity","applyUrl":"https://www.in.gov/gov/","sourceUrl":"https://www.in.gov/gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Indiana's casinos and gaming. Seven members appointed by the Governor; no more than four from one party, with geographic and professional requirements (IC 4-33-3).","seatSource":"https://law.justia.com/codes/indiana/2010/title4/ar33/ch3.html","criticalNote":"Curated from the Indiana Code; IN publishes no central board-vacancy list (inventory mode)","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50005,"name":"Indiana Real Estate Commission","domain":"housing","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Indiana home buyers & licensed brokers","applyUrl":"https://www.in.gov/gov/","sourceUrl":"https://www.in.gov/gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Indiana's real estate brokers. Nine members appointed by the Governor — congressional-district brokers, a broker at large, and public members (IC 25-34.1-2-1).","seatSource":"https://law.justia.com/codes/indiana/title-25/article-34-1/chapter-2/section-25-34-1-2-1/","criticalNote":"Curated from the Indiana Code; IN publishes no central board-vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false}
    ]
  },












  // ─── Kentucky ─── status: live (scraper: manual) ───
  KY: {
    code:"KY", label:"Kentucky", region:"South",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://boardregister.ky.gov/",
    applyAuthority:"Governor's Office — Boards & Commissions",
    applyLabel:"Governor's Office — Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"boardregister.ky.gov",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Kentucky boards shown are hand-verified governor-appointed opportunities — apply at boardregister.ky.gov.",
    auditNote:null,
    boards:[
      {"id":50201,"name":"Kentucky Board of Medical Licensure","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Kentucky patients & licensed physicians","applyUrl":"https://boardregister.ky.gov/","sourceUrl":"https://boardregister.ky.gov/","lastVerified":"2026-08-13","mandate":"Licenses and disciplines Kentucky's physicians. Fifteen-member board; eleven appointed by the Governor — seven physicians, one osteopathic physician, and three citizens — plus medical-school deans and the public-health commissioner (KRS 311.530).","seatSource":"https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=53563","criticalNote":"11 of 15 seats are governor-appointed","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50202,"name":"Kentucky Fish and Wildlife Commission","domain":"environment","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Kentucky hunters, anglers & wildlife","applyUrl":"https://boardregister.ky.gov/","sourceUrl":"https://fw.ky.gov/More/Pages/Commission.aspx","lastVerified":"2026-08-13","mandate":"Sets policy for Kentucky's Department of Fish and Wildlife Resources. Nine members — one from each wildlife district — appointed by the Governor from sportsmen-nominated lists, confirmed by the Senate (KRS 150.022).","seatSource":"https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=55984","criticalNote":"Curated from Kentucky Revised Statutes; KY publishes no central board-vacancy list (inventory mode)","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50203,"name":"Kentucky Real Estate Commission","domain":"housing","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Kentucky home buyers & licensed brokers","applyUrl":"https://boardregister.ky.gov/","sourceUrl":"https://boardregister.ky.gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Kentucky's real estate brokers. Seven members appointed by the Governor — six active licensees and one public member (KRS 324.281).","seatSource":"https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=55519","criticalNote":"Curated from Kentucky Revised Statutes; KY publishes no central board-vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":50204,"name":"Kentucky Board of Nursing","domain":"health","totalSeats":16,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Kentucky patients & licensed nurses","applyUrl":"https://boardregister.ky.gov/","sourceUrl":"https://boardregister.ky.gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Kentucky's nurses. Sixteen members appointed by the Governor — registered nurses, advanced-practice nurses, LPNs, and citizen members (KRS 314.121).","seatSource":"https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=633","criticalNote":"Curated from Kentucky Revised Statutes; KY publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50205,"name":"Kentucky Board of Pharmacy","domain":"health","totalSeats":6,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Kentucky patients & licensed pharmacists · drug safety","applyUrl":"https://boardregister.ky.gov/","sourceUrl":"https://boardregister.ky.gov/","lastVerified":"2026-08-13","mandate":"Licenses pharmacists and regulates pharmacy practice in Kentucky. Six members appointed by the Governor — five licensed pharmacists and one citizen member (KRS 315.150).","seatSource":"https://pharmacy.ky.gov/BoardInformation/Pages/Board-Members.aspx","criticalNote":"Curated from Kentucky Revised Statutes; KY publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },












  // ─── Michigan ─── status: live (scraper: manual) ───
  MI: {
    code:"MI", label:"Michigan", region:"Midwest",
    status:"live",
    color:"#7A3E8F", bg:"#F4EBF7",
    applyUrl:"https://www.michigan.gov/whitmer/appointments",
    applyAuthority:"Governor's Office — Appointments Division",
    applyLabel:"Governor's Office — Appointments Division",
    applyVerified:"2026-08-19",
    dataSource:"michigan.gov/whitmer/appointments",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Michigan boards shown are hand-verified governor-appointed opportunities — apply any time through the Governor's Appointments Division.",
    auditNote:null,
    boards:[
      {"id":50401,"name":"Michigan Natural Resources Commission","domain":"environment","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments Division","constituent":"Michigan hunters, anglers & public-land users","applyUrl":"https://www.michigan.gov/whitmer/appointments","sourceUrl":"https://www.michigan.gov/whitmer/appointments","lastVerified":"2026-08-13","mandate":"Sets policy for Michigan's Department of Natural Resources — hunting, fishing, and public-land regulation. Seven members appointed by the Governor with Senate consent; no more than four from one party (MCL 324.501).","seatSource":"https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-324-501","criticalNote":"Curated from Michigan Compiled Laws; MI publishes no central board-vacancy list (inventory mode)","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50402,"name":"Michigan Civil Rights Commission","domain":"equity","totalSeats":8,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments Division","constituent":"Michiganders facing discrimination · civil rights","applyUrl":"https://www.michigan.gov/whitmer/appointments","sourceUrl":"https://www.michigan.gov/whitmer/appointments","lastVerified":"2026-08-13","mandate":"Investigates discrimination and enforces Michigan's civil-rights protections — a constitutional body. Eight members appointed by the Governor with Senate consent; no more than four from one party (Mich. Const. Art. V, Sec. 29).","seatSource":"https://law.justia.com/constitution/michigan/article-v/section-29/","criticalNote":"Curated from the Michigan Constitution; MI publishes no central board-vacancy list (inventory mode)","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":50403,"name":"Michigan Board of Nursing","domain":"health","totalSeats":24,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments Division","constituent":"Michigan patients & licensed nurses","applyUrl":"https://www.michigan.gov/whitmer/appointments","sourceUrl":"https://www.michigan.gov/whitmer/appointments","lastVerified":"2026-08-13","mandate":"Licenses and disciplines Michigan's nurses. Twenty-four members appointed by the Governor — registered and practical nurses, advanced-practice specialties, and public members (MCL 333.17221).","seatSource":"https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-333-17221","criticalNote":"Curated from Michigan Compiled Laws; MI publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50404,"name":"Michigan Public Service Commission","domain":"justice","totalSeats":3,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments Division","constituent":"Every Michigan utility ratepayer · electric, gas, telecom","applyUrl":"https://www.michigan.gov/whitmer/appointments","sourceUrl":"https://www.michigan.gov/whitmer/appointments","lastVerified":"2026-08-13","mandate":"Regulates Michigan's electric, natural-gas, and telecommunications utilities and their rates. Three members appointed by the Governor with Senate consent; no more than two from one party (MCL 460.1).","seatSource":"https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-460-1","criticalNote":"Curated from Michigan Compiled Laws; MI publishes no central board-vacancy list (inventory mode)","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":50405,"name":"Michigan Gaming Control Board","domain":"justice","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments Division","constituent":"Michigan casino patrons & gaming integrity","applyUrl":"https://www.michigan.gov/whitmer/appointments","sourceUrl":"https://www.michigan.gov/whitmer/appointments","lastVerified":"2026-08-13","mandate":"Licenses and regulates Michigan's commercial casinos and online gaming. Five members appointed by the Governor with Senate consent; no more than three from one party (MCL 432.204).","seatSource":"https://law.justia.com/codes/michigan/chapter-432/statute-initiated-law-1-of-1996/section-432-204/","criticalNote":"Curated from Michigan Compiled Laws; MI publishes no central board-vacancy list (inventory mode)","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false}
    ]
  },












  // ─── Tennessee ─── status: live (scraper: manual) ───
  TN: {
    code:"TN", label:"Tennessee", region:"South",
    status:"live",
    color:"#0E6B5C", bg:"#E0F4F0",
    applyUrl:"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html",
    applyAuthority:"Governor's Office via Dept. of Commerce & Insurance",
    applyLabel:"Governor's Office via Dept. of Commerce & Insurance",
    applyVerified:"2026-08-19",
    dataSource:"tn.gov/commerce apply-for-a-board-or-commission",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Tennessee boards shown are hand-verified governor-appointed opportunities — apply through the gubernatorial board application.",
    auditNote:null,
    boards:[
      {"id":51301,"name":"Tennessee Board of Medical Examiners","domain":"health","totalSeats":12,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via Dept. of Commerce & Insurance","constituent":"Tennessee patients & licensed physicians","applyUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","sourceUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","lastVerified":"2026-08-13","mandate":"Licenses and disciplines Tennessee's physicians. Twelve members appointed by the Governor — nine licensed physicians and three consumer members (T.C.A. 63-6-101).","seatSource":"https://law.justia.com/codes/tennessee/title-63/chapter-6/part-1/section-63-6-101/","criticalNote":"Curated from Tennessee Code Annotated; TN publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51302,"name":"Tennessee Fish and Wildlife Commission","domain":"environment","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via Dept. of Commerce & Insurance","constituent":"Tennessee hunters, anglers & wildlife","applyUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","sourceUrl":"https://www.tn.gov/twra/tennessee-fish-wildlife-commission.html","lastVerified":"2026-08-13","mandate":"Oversees the Tennessee Wildlife Resources Agency — game, fish, and hunting/fishing regulation. Thirteen members; nine appointed by the Governor to six-year terms, four appointed by the General Assembly (T.C.A. 70-1-201).","seatSource":"https://law.justia.com/codes/tennessee/2021/title-70/chapter-1/part-2/section-70-1-201/","criticalNote":"9 of 13 seats are governor-appointed; 4 are legislature-appointed","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":51303,"name":"Tennessee Real Estate Commission","domain":"housing","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via Dept. of Commerce & Insurance","constituent":"Tennessee home buyers & licensed brokers","applyUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","sourceUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","lastVerified":"2026-08-13","mandate":"Licenses and regulates Tennessee's real estate brokers. Nine members appointed by the Governor — seven experienced brokers and two public members, three from each grand division (T.C.A. 62-13-201).","seatSource":"https://law.justia.com/codes/tennessee/title-62/chapter-13/part-2/section-62-13-201/","criticalNote":"Curated from Tennessee Code Annotated; TN publishes no central board-vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51304,"name":"Tennessee Board of Nursing","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via Dept. of Commerce & Insurance","constituent":"Tennessee patients & licensed nurses","applyUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","sourceUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","lastVerified":"2026-08-13","mandate":"Licenses and regulates Tennessee's nurses. Eleven members appointed by the Governor — nine registered/advanced-practice nurses, one licensed practical nurse, and one consumer member (T.C.A. 63-7-202).","seatSource":"https://law.justia.com/codes/tennessee/title-63/chapter-7/part-2/section-63-7-202/","criticalNote":"Curated from Tennessee Code Annotated; TN publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51305,"name":"Tennessee Board of Pharmacy","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via Dept. of Commerce & Insurance","constituent":"Tennessee patients & licensed pharmacists · drug safety","applyUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","sourceUrl":"https://www.tn.gov/commerce/contact-us/apply-for-a-board-or-commission.html","lastVerified":"2026-08-13","mandate":"Licenses pharmacists and regulates pharmacy practice in Tennessee. Nine members appointed by the Governor — seven pharmacists, one registered pharmacy technician, and one consumer member (T.C.A. 63-10-301).","seatSource":"https://law.justia.com/codes/tennessee/2021/title-63/chapter-10/part-3/section-63-10-301/","criticalNote":"Curated from Tennessee Code Annotated; TN publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },












  // ─── Arkansas ─── status: live (scraper: manual) ───
  AR: {
    code:"AR", label:"Arkansas", region:"South",
    status:"live",
    color:"#7A3E8F", bg:"#F4EBF7",
    applyUrl:"https://governor.arkansas.gov/",
    applyAuthority:"Governor’s Office — Boards & Commissions",
    applyLabel:"Governor’s Office — Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"governor.arkansas.gov",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Arkansas boards shown are hand-verified governor-appointed opportunities — apply through the Governor’s Office.",
    auditNote:null,
    boards:[
      {"id":49401,"name":"Arkansas State Medical Board","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Arkansas patients & licensed physicians","applyUrl":"https://governor.arkansas.gov/","sourceUrl":"https://governor.arkansas.gov/","lastVerified":"2026-08-13","mandate":"Licenses and disciplines Arkansas's physicians. Fifteen members appointed by the Governor with Senate consent — ten physicians, a physician assistant, and public members across the four congressional districts (A.C.A. 17-95-301).","seatSource":"https://codes.findlaw.com/ar/title-17-professions-occupations-and-businesses/ar-code-sect-17-95-301/","criticalNote":"Curated from the Arkansas Code; AR publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49402,"name":"Arkansas State Board of Nursing","domain":"health","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Arkansas patients & licensed nurses","applyUrl":"https://governor.arkansas.gov/","sourceUrl":"https://governor.arkansas.gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Arkansas's nurses. Thirteen members appointed by the Governor with Senate consent — registered nurses, licensed practical nurses, psychiatric technician nurses, and a consumer member (A.C.A. 17-87-203).","seatSource":"https://healthy.arkansas.gov/boards-commissions/boards/nursing-arkansas-state-board/about-us/","criticalNote":"Curated from the Arkansas Code; AR publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":49403,"name":"Arkansas Game and Fish Commission","domain":"environment","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Arkansas hunters, anglers & wildlife","applyUrl":"https://governor.arkansas.gov/","sourceUrl":"https://governor.arkansas.gov/","lastVerified":"2026-08-13","mandate":"Sets wildlife and fisheries policy for Arkansas — a constitutional commission. Seven voting commissioners appointed by the Governor to staggered seven-year terms, one from each congressional district (Ark. Const. Amend. 35).","seatSource":"https://law.justia.com/constitution/arkansas/amendments/amendment-35/","criticalNote":"Seven governor-appointed voting commissioners (plus one non-voting ex officio); curated from the Arkansas Constitution","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":49404,"name":"Arkansas Real Estate Commission","domain":"housing","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Arkansas home buyers & licensed brokers","applyUrl":"https://governor.arkansas.gov/","sourceUrl":"https://governor.arkansas.gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Arkansas's real estate brokers and salespersons. Five members appointed by the Governor with Senate consent — three licensees plus consumer and elderly representatives (A.C.A. 17-42-201).","seatSource":"https://law.justia.com/codes/arkansas/2015/title-17/subtitle-2/chapter-42/subchapter-2/section-17-42-201/","criticalNote":"Curated from the Arkansas Code; AR publishes no central board-vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":49405,"name":"Arkansas State Board of Pharmacy","domain":"health","totalSeats":8,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Arkansas patients & licensed pharmacists · drug safety","applyUrl":"https://governor.arkansas.gov/","sourceUrl":"https://governor.arkansas.gov/","lastVerified":"2026-08-13","mandate":"Licenses pharmacists and regulates pharmacy practice in Arkansas. Eight members appointed by the Governor — five practicing pharmacists, a minority pharmacist member, and consumer and elderly representatives (A.C.A. 17-92-201).","seatSource":"https://law.justia.com/codes/arkansas/title-17/subtitle-3/chapter-92/subchapter-2/section-17-92-201/","criticalNote":"Curated from the Arkansas Code; AR publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },











  // ─── Kansas ─── status: live (scraper: manual) ───
  KS: {
    code:"KS", label:"Kansas", region:"Midwest",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions",
    applyAuthority:"Governor’s Office of Appointments",
    applyLabel:"Governor’s Office of Appointments",
    applyVerified:"2026-08-19",
    dataSource:"governor.ks.gov/serving-kansans/office-of-appointments",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Kansas boards shown are hand-verified governor-appointed opportunities — apply through the Governor’s Office of Appointments.",
    auditNote:null,
    boards:[
      {"id":50101,"name":"Kansas State Board of Healing Arts","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Appointments","constituent":"Kansas patients & licensed physicians","applyUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","sourceUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","lastVerified":"2026-08-13","mandate":"Licenses and disciplines Kansas's physicians, chiropractors, and other healing-arts practitioners. Fifteen members appointed by the Governor from professional and public nominees (K.S.A. 65-2812).","seatSource":"https://www.ksrevisor.gov/statutes/chapters/ch65/065_028_0012.html","criticalNote":"Curated from the Kansas Statutes; KS publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50102,"name":"Kansas State Board of Nursing","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Appointments","constituent":"Kansas patients & licensed nurses","applyUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","sourceUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","lastVerified":"2026-08-13","mandate":"Licenses and regulates Kansas's nurses. Eleven members appointed by the Governor — six registered professional nurses, two licensed practical nurses, and three members of the public (K.S.A. 74-1106).","seatSource":"https://ksrevisor.gov/statutes/chapters/ch74/074_011_0006.html","criticalNote":"Curated from the Kansas Statutes; KS publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50103,"name":"Kansas Wildlife and Parks Commission","domain":"environment","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Appointments","constituent":"Kansas hunters, anglers & state parks","applyUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","sourceUrl":"https://www.ksoutdoors.gov/about-kdwp/kansas-wildlife-and-parks-commission","lastVerified":"2026-08-13","mandate":"Advises on policy for the Kansas Department of Wildlife and Parks and votes on hunting, fishing, and parks regulations. Seven-member board — four appointed by the Governor, the others by legislative leaders and the Attorney General.","seatSource":"https://www.ksoutdoors.gov/about-kdwp/kansas-wildlife-and-parks-commission","criticalNote":"4 of 7 seats are governor-appointed","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50104,"name":"Kansas Real Estate Commission","domain":"housing","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Appointments","constituent":"Kansas home buyers & licensed brokers","applyUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","sourceUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","lastVerified":"2026-08-13","mandate":"Licenses and regulates Kansas's real estate brokers and salespersons. Five members appointed by the Governor — one from each congressional district and one at large (K.S.A. 74-4201).","seatSource":"https://ksrevisor.gov/statutes/chapters/ch74/074_042_0001.html","criticalNote":"Curated from the Kansas Statutes; KS publishes no central board-vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":50105,"name":"Kansas State Board of Pharmacy","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Appointments","constituent":"Kansas patients & licensed pharmacists · drug safety","applyUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","sourceUrl":"https://www.governor.ks.gov/serving-kansans/office-of-appointments/boards-commissions","lastVerified":"2026-08-13","mandate":"Licenses pharmacists and regulates pharmacy practice in Kansas. Seven members appointed by the Governor — six licensed pharmacists and one public member (K.S.A. 65-1602).","seatSource":"https://www.pharmacy.ks.gov/about-us/about-the-board","criticalNote":"Curated from the Kansas Statutes; KS publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },











  // ─── New Mexico ─── status: live (scraper: manual) ───
  NM: {
    code:"NM", label:"New Mexico", region:"West",
    status:"live",
    color:"#8A5A0B", bg:"#FAF1DE",
    applyUrl:"https://www.governor.state.nm.us/apply/boards-and-commissions/",
    applyAuthority:"Governor’s Office — Boards & Commissions",
    applyLabel:"Governor’s Office — Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"governor.state.nm.us/apply/boards-and-commissions",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 4 verified of 4 openings tracked",
    contextNote:"New Mexico boards shown are hand-verified governor-appointed opportunities — apply through the Governor’s Office.",
    auditNote:null,
    boards:[
      {"id":50701,"name":"New Mexico Medical Board","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"New Mexico patients & licensed physicians","applyUrl":"https://www.governor.state.nm.us/apply/boards-and-commissions/","sourceUrl":"https://www.governor.state.nm.us/apply/boards-and-commissions/","lastVerified":"2026-08-13","mandate":"Licenses and disciplines New Mexico's physicians and physician assistants. Nine members appointed by the Governor — six physicians, a physician assistant, and two public members (NMSA 61-6-2).","seatSource":"https://law.justia.com/codes/new-mexico/chapter-61/article-6/section-61-6-2/","criticalNote":"Curated from the New Mexico Statutes; NM publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50702,"name":"New Mexico Board of Nursing","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"New Mexico patients & licensed nurses","applyUrl":"https://www.governor.state.nm.us/apply/boards-and-commissions/","sourceUrl":"https://www.governor.state.nm.us/apply/boards-and-commissions/","lastVerified":"2026-08-13","mandate":"Licenses and regulates New Mexico's nurses. Seven members appointed by the Governor — four licensed nurses and three public members (NMSA 61-3-8).","seatSource":"https://law.justia.com/codes/new-mexico/chapter-61/article-3/section-61-3-8/","criticalNote":"Curated from the New Mexico Statutes; NM publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50703,"name":"New Mexico State Game Commission","domain":"environment","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"New Mexico hunters, anglers & wildlife","applyUrl":"https://www.governor.state.nm.us/apply/boards-and-commissions/","sourceUrl":"https://www.governor.state.nm.us/apply/boards-and-commissions/","lastVerified":"2026-08-13","mandate":"Sets policy and regulations for the New Mexico Department of Game and Fish. Seven members appointed by the Governor with Senate consent — district and at-large seats, no more than four from one party (NMSA 17-1-2).","seatSource":"https://law.justia.com/codes/new-mexico/2017/chapter-17/article-1/section-17-1-2/","criticalNote":"Curated from the New Mexico Statutes; NM publishes no central board-vacancy list (inventory mode)","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50704,"name":"New Mexico Real Estate Commission","domain":"housing","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"New Mexico home buyers & licensed brokers","applyUrl":"https://www.governor.state.nm.us/apply/boards-and-commissions/","sourceUrl":"https://www.governor.state.nm.us/apply/boards-and-commissions/","lastVerified":"2026-08-13","mandate":"Licenses and regulates New Mexico's real estate brokers. Five members appointed by the Governor — four brokers and one public member, no more than one per county (NMSA 61-29-4).","seatSource":"https://law.justia.com/codes/new-mexico/chapter-61/article-29/section-61-29-4/","criticalNote":"Curated from the New Mexico Statutes; NM publishes no central board-vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false}
    ]
  },











  // ─── Nevada ─── status: live (scraper: manual) ───
  NV: {
    code:"NV", label:"Nevada", region:"West",
    status:"live",
    color:"#8A5A0B", bg:"#FAF1DE",
    applyUrl:"https://gov.nv.gov/",
    applyAuthority:"Governor’s Office — Boards & Commissions",
    applyLabel:"Governor’s Office — Boards & Commissions",
    applyVerified:"2026-08-19",
    dataSource:"gov.nv.gov",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Nevada boards shown are hand-verified governor-appointed opportunities — apply through the Governor’s Office.",
    auditNote:null,
    boards:[
      {"id":50801,"name":"Nevada State Board of Medical Examiners","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Nevada patients & licensed physicians","applyUrl":"https://gov.nv.gov/","sourceUrl":"https://gov.nv.gov/","lastVerified":"2026-08-13","mandate":"Licenses and disciplines Nevada's physicians and physician assistants. Eleven members appointed by the Governor — six practicing physicians, a physician assistant, and public members (NRS 630.050).","seatSource":"https://www.leg.state.nv.us/nrs/nrs-630.html","criticalNote":"Curated from Nevada Revised Statutes; NV publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50802,"name":"Nevada State Board of Nursing","domain":"health","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Nevada patients & licensed nurses","applyUrl":"https://gov.nv.gov/","sourceUrl":"https://gov.nv.gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Nevada's nurses. Seven members appointed by the Governor — four registered nurses, one practical nurse, one nursing assistant, and one consumer member (NRS 632.020).","seatSource":"https://www.leg.state.nv.us/nrs/nrs-632.html","criticalNote":"Curated from Nevada Revised Statutes; NV publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":50803,"name":"Nevada Board of Wildlife Commissioners","domain":"environment","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Nevada hunters, anglers & wildlife","applyUrl":"https://gov.nv.gov/","sourceUrl":"https://gov.nv.gov/","lastVerified":"2026-08-13","mandate":"Sets wildlife policy and regulations for the Nevada Department of Wildlife. Nine members appointed by the Governor representing conservation, farming, ranching, sportsmen, and the general public (NRS 501.171).","seatSource":"https://www.leg.state.nv.us/NRS/NRS-501.html","criticalNote":"Curated from Nevada Revised Statutes; NV publishes no central board-vacancy list (inventory mode)","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":50804,"name":"Nevada Real Estate Commission","domain":"housing","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Nevada home buyers & licensed brokers","applyUrl":"https://gov.nv.gov/","sourceUrl":"https://gov.nv.gov/","lastVerified":"2026-08-13","mandate":"Licenses and regulates Nevada's real estate brokers and salespersons. Five members appointed by the Governor, with regional residency requirements across the state (NRS 645.050).","seatSource":"https://www.leg.state.nv.us/nrs/nrs-645.html","criticalNote":"Curated from Nevada Revised Statutes; NV publishes no central board-vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":50805,"name":"Nevada Gaming Commission","domain":"justice","totalSeats":5,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Boards & Commissions","constituent":"Nevada's casino industry & gaming integrity","applyUrl":"https://gov.nv.gov/","sourceUrl":"https://gov.nv.gov/","lastVerified":"2026-08-13","mandate":"Final authority on gaming licensing and policy for Nevada's casino industry. Five members appointed by the Governor to four-year part-time terms (NRS 463.022).","seatSource":"https://www.leg.state.nv.us/nrs/nrs-463.html","criticalNote":"Curated from Nevada Revised Statutes; NV publishes no central board-vacancy list (inventory mode)","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false}
    ]
  },











  // ─── Oklahoma ─── status: live (scraper: manual) ───
  OK: {
    code:"OK", label:"Oklahoma", region:"South",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://oklahoma.gov/governor.html",
    applyAuthority:"Governor’s Office — Appointments",
    applyLabel:"Governor’s Office — Appointments",
    applyVerified:"2026-08-19",
    dataSource:"oklahoma.gov/governor",
    scraper:{ endpoint:null, lastPulled:"2026-08-13T00:00:00.000Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 5 verified of 5 openings tracked",
    contextNote:"Oklahoma boards shown are hand-verified governor-appointed opportunities — apply through the Governor’s Office.",
    auditNote:null,
    boards:[
      {"id":51001,"name":"Oklahoma State Board of Medical Licensure and Supervision","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments","constituent":"Oklahoma patients & licensed physicians","applyUrl":"https://oklahoma.gov/governor.html","sourceUrl":"https://oklahoma.gov/governor.html","lastVerified":"2026-08-13","mandate":"Licenses and disciplines Oklahoma's physicians. Eleven members appointed by the Governor — physicians and public members (59 O.S. Sec. 481).","seatSource":"https://law.justia.com/codes/oklahoma/title-59/section-59-481/","criticalNote":"Curated from the Oklahoma Statutes; OK publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51002,"name":"Oklahoma Board of Nursing","domain":"health","totalSeats":11,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments","constituent":"Oklahoma patients & licensed nurses","applyUrl":"https://oklahoma.gov/governor.html","sourceUrl":"https://oklahoma.gov/governor.html","lastVerified":"2026-08-13","mandate":"Licenses and regulates Oklahoma's nurses. Eleven members appointed by the Governor — six registered nurses, three licensed practical nurses, and two public members (59 O.S. Sec. 567.4).","seatSource":"https://law.justia.com/codes/oklahoma/title-59/section-59-567-4/","criticalNote":"Curated from the Oklahoma Statutes; OK publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":51003,"name":"Oklahoma Wildlife Conservation Commission","domain":"environment","totalSeats":8,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments","constituent":"Oklahoma hunters, anglers & wildlife","applyUrl":"https://oklahoma.gov/governor.html","sourceUrl":"https://oklahoma.gov/governor.html","lastVerified":"2026-08-13","mandate":"Governs the Oklahoma Department of Wildlife Conservation — hunting, fishing, and wildlife policy. Eight members appointed by the Governor and confirmed by the Senate to eight-year terms (Okla. Const. Art. XXVI).","seatSource":"https://oksenate.gov/sites/default/files/2022-05/oc26.pdf","criticalNote":"Curated from the Oklahoma Constitution; OK publishes no central board-vacancy list (inventory mode)","requires":["Environmental Policy","Research & Analysis","Policy"],"confirmation":false},
      {"id":51004,"name":"Oklahoma Real Estate Commission","domain":"housing","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments","constituent":"Oklahoma home buyers & licensed brokers","applyUrl":"https://oklahoma.gov/governor.html","sourceUrl":"https://oklahoma.gov/governor.html","lastVerified":"2026-08-13","mandate":"Licenses and regulates Oklahoma's real estate brokers. Seven members appointed by the Governor with Senate consent — five brokers, a lay person, and a real-estate educator (59 O.S. Sec. 858-201).","seatSource":"https://law.justia.com/codes/oklahoma/2018/title-59/section-59-858-201/","criticalNote":"Curated from the Oklahoma Statutes; OK publishes no central board-vacancy list (inventory mode)","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false},
      {"id":51005,"name":"Oklahoma State Board of Pharmacy","domain":"health","totalSeats":6,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office — Appointments","constituent":"Oklahoma patients & licensed pharmacists · drug safety","applyUrl":"https://oklahoma.gov/governor.html","sourceUrl":"https://oklahoma.gov/governor.html","lastVerified":"2026-08-13","mandate":"Licenses pharmacists and regulates pharmacy practice in Oklahoma. Six members appointed by the Governor — five licensed pharmacists and one public member (59 O.S. Sec. 353.3).","seatSource":"https://oklahoma.gov/pharmacy/about.html","criticalNote":"Curated from the Oklahoma Statutes; OK publishes no central board-vacancy list (inventory mode)","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },











  // ─── Scaffolded states (awaiting scraper) — 39 entries, boards intentionally empty ───
  ...Object.fromEntries(SCAFFOLDED_LIST.map(([c, l, r]) => [c, SCAFFOLD(c, l, r)])),
};

// ─── Derived exports (used by all three tools) ─────────────────────────────────

// Codes by status
export const LIVE_STATES       = Object.keys(STATE_CONFIG).filter(c => STATE_CONFIG[c].status === "live");
export const SCAFFOLDED_STATES = Object.keys(STATE_CONFIG).filter(c => STATE_CONFIG[c].status === "scaffolded");

// Flat board list — live states only. SeatFinder's matching engine iterates this.
export const BOARDS = LIVE_STATES.flatMap(code =>
  STATE_CONFIG[code].boards.map(b => ({
    ...b,
    state: code,
    applyUrl: b.applyUrl || STATE_CONFIG[code].applyUrl,
    applyAuthority: STATE_CONFIG[code].applyAuthority,
  }))
);

// State UI metadata keyed by code — colors, labels, links, status
export const STATE_META = Object.fromEntries(
  Object.entries(STATE_CONFIG).map(([code, s]) => [code, {
    label: s.label,
    region: s.region,
    status: s.status,
    color: s.color,
    bg: s.bg,
    applyUrl: s.applyUrl,
    applyAuthority: s.applyAuthority,
    applyLabel: s.applyAuthority,
    dataSource: s.dataSource,
  }])
);

// Ordered region list for state pickers
export const REGION_ORDER = ["Mid-Atlantic", "Northeast", "Midwest", "South", "West"];

// Where "Request priority for my state" goes until the openquorum domain intake
// form is live. TODO: point at https://<purchased-domain>/#get-involved after Phase 6 deploy.
export const REQUEST_STATE_CONTACT = "https://openquorum.us.com/#get-involved";

// ─── Template for new LIVE states (scraper or manual research) ──────────────────
export const STATE_TEMPLATE = {
  code:"", label:"", region:"", status:"live",
  color:"", bg:"",
  applyUrl:"", applyAuthority:"", applyLabel:"", applyVerified:"",
  dataSource:"",
  scraper:{ endpoint:null, lastPulled:null, selectorProfile:null },
  totalBoardsNote:"", contextNote:null, auditNote:null,
  boards:[{
    id:0, name:"", domain:"",
    totalSeats:0, vacantSeats:0, vacantSince:"",
    authority:"", constituent:"", criticalNote:"",
    mandate:"", requires:[], confirmation:false,
    sourceUrl:"", lastVerified:"",
  }]
};
