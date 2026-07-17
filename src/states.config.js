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
  ["AR","Arkansas","South"],
  ["HI","Hawaii","West"],
  ["ID","Idaho","West"],
  ["IN","Indiana","Midwest"],
  ["IA","Iowa","Midwest"],
  ["KS","Kansas","Midwest"],
  ["KY","Kentucky","South"],
  ["ME","Maine","Northeast"],
  ["MI","Michigan","Midwest"],
  ["MO","Missouri","Midwest"],
  ["MT","Montana","West"],
  ["NE","Nebraska","Midwest"],
  ["NV","Nevada","West"],
  ["NH","New Hampshire","Northeast"],
  ["NM","New Mexico","West"],
  ["ND","North Dakota","Midwest"],
  ["OK","Oklahoma","South"],
  ["RI","Rhode Island","Northeast"],
  ["SD","South Dakota","Midwest"],
  ["TN","Tennessee","South"],
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
    applyVerified:"2026-07-17",
    dataSource:"oregon.wd5.myworkdayjobs.com/Boards",
    scraper:{ endpoint:"https://oregon.wd5.myworkdayjobs.com/wday/cxs/oregon/Boards/jobs", lastPulled:"2026-07-17T00:42:40.450Z", selectorProfile:"or" },
    totalBoardsNote:"Board openings posted via Workday · 11 verified of 40 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":7401,"name":"Oregon Health Policy Board","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"All Oregonians · health system policy","mandate":"Serves as the policy-making and oversight body for the Oregon Health Authority. Nine members appointed by the Governor, confirmed by the Senate (ORS 413.006).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Health-Policy-Board---Board-Member_REQ-192967","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Health-Policy-Board---Board-Member_REQ-192967","lastVerified":"2026-07-17","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_413.006","confirmation":false},
      {"id":7402,"name":"Home Care Commission","domain":"health","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Seniors & people with disabilities using home care","mandate":"Ensures the quality of home care services for elderly Oregonians and people with disabilities; created by constitutional amendment (Ballot Measure 99, 2000). Nine members, five of whom are current or former home care consumers (ORS 410.602).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Home-Care-Commission---Board-Member_REQ-192916","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Home-Care-Commission---Board-Member_REQ-192916","lastVerified":"2026-07-17","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_410.602","confirmation":false},
      {"id":7403,"name":"Medicaid Advisory Committee","domain":"health","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon Health Plan (Medicaid) members","mandate":"Advises the Oregon Health Authority and Department of Human Services on medical assistance programs. Up to 15 members appointed by the Governor (ORS 414.211).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Medicaid-Advisory-Committee---Board-Member_REQ-192932","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Medicaid-Advisory-Committee---Board-Member_REQ-192932","lastVerified":"2026-07-17","criticalNote":"Statute caps membership at 15","seatSource":"https://oregon.public.law/statutes/ors_414.211","confirmation":false},
      {"id":7404,"name":"Health Evidence Review Commission","domain":"health","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon Health Plan members · evidence-based coverage","mandate":"Prioritizes health services and reviews clinical evidence for the Oregon Health Plan. Thirteen governor-appointed, Senate-confirmed members (ORS 414.688).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Health-Evidence-Review-Commission---Board-Member_REQ-192911","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Health-Evidence-Review-Commission---Board-Member_REQ-192911","lastVerified":"2026-07-17","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_414.688","confirmation":false},
      {"id":7405,"name":"Oregon Public Defense Commission","domain":"justice","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregonians entitled to court-appointed counsel","mandate":"Governs Oregon's public defense system — nine voting and four nonvoting members appointed by the Governor (ORS 151.213).","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Public-Defense-Commission---Board-Member_REQ-192979","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Public-Defense-Commission---Board-Member_REQ-192979","lastVerified":"2026-07-17","criticalNote":"9 voting + 4 nonvoting members","seatSource":"https://oregon.public.law/statutes/ors_151.213","confirmation":false},
      {"id":7406,"name":"Governor's Commission on Senior Services","domain":"health","totalSeats":21,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Older Oregonians & aging services","mandate":"Advises the Governor and Department of Human Services on programs and policy for older Oregonians. At least 21 members appointed by the Governor for three-year terms (ORS 410.320).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Governor-s-Commission-on-Senior-Services---Board-Member_REQ-192908","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Governor-s-Commission-on-Senior-Services---Board-Member_REQ-192908","lastVerified":"2026-07-17","criticalNote":"Statute sets a minimum of 21 members","seatSource":"https://oregon.public.law/statutes/ors_410.320","confirmation":false},
      {"id":7407,"name":"Oregon Disabilities Commission","domain":"disability","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregonians with disabilities","mandate":"Advises state government on disability policy; a majority of its 15 governor-appointed members must be individuals with disabilities (ORS 185.110–185.130).","requires":["Disability Policy","Advocacy","Federal compliance"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Disabilities-Commission---Board-Member_REQ-192958","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Oregon-Disabilities-Commission---Board-Member_REQ-192958","lastVerified":"2026-07-17","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_185.130","confirmation":false},
      {"id":7408,"name":"Teacher Standards and Practices Commission","domain":"education","totalSeats":17,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon K-12 students, families & educators","mandate":"Licenses Oregon educators and sets professional standards and discipline for the teaching profession. Seventeen members appointed by the Governor, confirmed by the Senate (ORS 342.350).","requires":["Education Policy","Workforce Development","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Teacher-Standards-and-Practices-Commission---Board-Member_REQ-193093","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Teacher-Standards-and-Practices-Commission---Board-Member_REQ-193093","lastVerified":"2026-07-17","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_342.350","confirmation":false},
      {"id":7409,"name":"Alcohol and Drug Policy Commission","domain":"health","totalSeats":17,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregonians affected by substance use disorders","mandate":"Advises on Oregon's substance use disorder policy and system strategy. Up to 17 voting members appointed by the Governor, Senate-confirmed (ORS 430.221).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Alcohol-and-Drug-Policy-Commission---Board-Member_REQ-192849","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Alcohol-and-Drug-Policy-Commission---Board-Member_REQ-192849","lastVerified":"2026-07-17","criticalNote":"Statute caps voting membership at 17","seatSource":"https://oregon.public.law/statutes/ors_430.221","confirmation":false},
      {"id":7410,"name":"Board of Agriculture","domain":"environment","totalSeats":10,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Oregon agricultural producers & consumers","mandate":"Advises the Oregon Department of Agriculture on policy; 10 members — seven active producers, two consumer representatives, plus the Soil and Water Conservation Commission chair (ORS 561.372).","requires":["Environmental Policy","Research & Analysis","Policy"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Agriculture---Board-Member_REQ-192854","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Agriculture---Board-Member_REQ-192854","lastVerified":"2026-07-17","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_561.372","confirmation":false},
      {"id":7411,"name":"Board of Medical Imaging","domain":"health","totalSeats":12,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Executive Appointments Office","constituent":"Patients & licensed medical imaging professionals","mandate":"Licenses and regulates Oregon's medical imaging professionals. Twelve members: four physicians, three public members, five modality licensees (ORS 688.545).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Medical-Imaging---Board-Member_REQ-192864","sourceUrl":"https://oregon.wd5.myworkdayjobs.com/en-US/Boards/job/Employee-Exempt-From-Mass-Transit-Tax/Board-of-Medical-Imaging---Board-Member_REQ-192864","lastVerified":"2026-07-17","criticalNote":"Open posting on Workday","seatSource":"https://oregon.public.law/statutes/ors_688.545","confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"governor.wa.gov/boards-and-commissions",
    scraper:{ endpoint:"https://governor.wa.gov/boards-and-commissions/boards-commissions/current-and-upcoming-appointment-opportunities", lastPulled:"2026-07-17T00:42:07.151Z", selectorProfile:"wa" },
    totalBoardsNote:"230+ boards · monthly opportunities report · 9 verified of 129 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":7701,"name":"Student Achievement Council, Washington","domain":"education","totalSeats":10,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington college students & higher-ed learners","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in monthly opportunities report","mandate":"Sets statewide higher-education goals and strategy and administers student financial aid programs. Ten voting members — six citizen members appointed by the Governor and confirmed by the Senate (two of them students) plus four education-sector representatives (RCW 28B.77.005).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=28B.77.005","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":7702,"name":"Workforce Training and Education Coordinating Board","domain":"education","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington job seekers, workers & employers","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"6 of 9 voting seats are governor-appointed","mandate":"Coordinates Washington's workforce development system. Nine voting members — three business, three labor, three agency ex officio (RCW 28C.18.020).","seatSource":"https://app.leg.wa.gov/rcw/default.aspx?cite=28C.18.020","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false},
      {"id":7703,"name":"Human Rights Commission","domain":"equity","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"All Washingtonians · protection from discrimination","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in monthly opportunities report","mandate":"Enforces the Washington Law Against Discrimination and works to eliminate and prevent discrimination in employment, housing, public accommodation, credit, and insurance. Five members appointed by the Governor with the advice and consent of the Senate (RCW 49.60.050).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=49.60.050","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":7704,"name":"Women’s Commission, Washington State","domain":"equity","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Women & girls across Washington State","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in monthly opportunities report","mandate":"Advises the Governor, Legislature, and state agencies on issues affecting women and works to improve the well-being of women and girls in Washington. Nine members appointed by the Governor with the advice and consent of the Senate (chapter 43.119 RCW).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=43.119&full=true","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":7705,"name":"Health, State Board of","domain":"health","totalSeats":10,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"All Washington residents · public health policy","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in monthly opportunities report","mandate":"Sets statewide public health policy and adopts rules on communicable disease, drinking water, and environmental health. Composed of ten members — the Secretary of Health (or designee) and nine gubernatorial appointees including health professionals, local officials, and consumer representatives (RCW 43.20.030).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=43.20.030","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7706,"name":"Medical Commission, Washington","domain":"health","totalSeats":21,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington patients & licensed physicians","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and disciplines physicians and physician assistants. Twenty-one members — thirteen physicians, two physician assistants, six public members (RCW 18.71.015).","seatSource":"https://app.leg.wa.gov/rcw/default.aspx?cite=18.71.015","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7707,"name":"Nursing, Washington State Board of","domain":"health","totalSeats":17,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washington patients · nursing licensure & safety","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in monthly opportunities report","mandate":"Licenses and regulates registered nurses, advanced practice nurses, practical nurses, and nursing assistants, and sets standards to protect patient safety. Seventeen members appointed by the Governor to four-year terms (RCW 18.79.070).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=18.79.070","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7708,"name":"Universal Health Care Commission","domain":"health","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"All Washingtonians · path to universal coverage","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in monthly opportunities report","mandate":"Develops the framework and recommendations for a universal health care system in Washington, including financing and delivery design. Fifteen members — six appointed by the Governor plus legislative and state-agency members (RCW 41.05.840).","seatSource":"https://app.leg.wa.gov/RCW/default.aspx?cite=41.05.840","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7709,"name":"Affordable Housing Advisory Board","domain":"housing","totalSeats":25,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Washingtonians needing affordable housing","applyUrl":"https://governor.wa.gov/boards-and-commissions/boards-commissions/apply-serve","sourceUrl":"https://governor.wa.gov/sites/default/files/2025-01/MonthlyOutreachReport_1.pdf","lastVerified":"2026-07-17","criticalNote":"3 of 25 seats are ex officio nonvoting","mandate":"Advises the Department of Commerce on housing and housing finance policy. Twenty-five members including three ex officio nonvoting (RCW 43.185B.020).","seatSource":"https://app.leg.wa.gov/rcw/default.aspx?cite=43.185B.020","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"governorsoffice.colorado.gov/governor/appointments-and-openings",
    scraper:{ endpoint:"https://governorsoffice.colorado.gov/governor/appointments-and-openings", lastPulled:"2026-07-17T00:42:06.292Z", selectorProfile:"co" },
    totalBoardsNote:"2026 opportunities published in the Governor's Blue Book · 4 verified of 61 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":6801,"name":"Personnel Board, State","domain":"justice","totalSeats":5,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Colorado state personnel system employees","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-07-17","criticalNote":"Only 3 of 5 seats are governor-appointed","mandate":"Constitutional board hearing state employee appeals and adopting personnel rules. Five members — three governor-appointed with Senate consent, two elected by certified state employees (Colo. Const. art. XII, § 14).","seatSource":"https://law.justia.com/constitution/colorado/cnart12.html","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":6802,"name":"Veterans Affairs, Colorado Board of","domain":"justice","totalSeats":7,"vacantSeats":2,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Colorado veterans & their families","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-07-17","criticalNote":"Immediate opening — resignation","mandate":"Advises on veterans policy and oversees the Veterans Trust Fund grant program. Seven members appointed by the Governor (C.R.S. 28-5-702).","seatSource":"https://vets.colorado.gov/cbva","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":6803,"name":"Colorado Health Benefits Exchange Board","domain":"health","totalSeats":12,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Coloradans buying insurance through Connect for Health Colorado","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-07-17","criticalNote":"9 voting + 3 ex officio members","mandate":"Governs Connect for Health Colorado, the state health insurance marketplace. Twelve members — nine voting (five governor-appointed, four legislative) plus three ex officio (C.R.S. 10-22-104).","seatSource":"https://leg.colorado.gov/bills/sb17-003","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":6804,"name":"Medical Services Board","domain":"health","totalSeats":11,"vacantSeats":2,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Health First Colorado (Medicaid) members","applyUrl":"https://governorsoffice.colorado.gov/governor/boards-commissions-application","sourceUrl":"https://governorsoffice.colorado.gov/governor/appointments-and-openings","lastVerified":"2026-07-17","criticalNote":"Immediate opening — resignation","mandate":"Adopts rules governing Colorado's Medicaid and medical assistance programs. Eleven members appointed by the Governor with Senate consent, at least one per congressional district (C.R.S. 25.5-1-301).","seatSource":"https://law.justia.com/codes/colorado/2022/title-25-5/article-1/part-3/section-25-5-1-301/","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"governor.ohio.gov/administration/boards-and-commissions",
    scraper:{ endpoint:"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026", lastPulled:"2026-07-17T00:42:43.243Z", selectorProfile:"oh" },
    totalBoardsNote:"2026 term-expirations list, Governor's office · 5 verified of 102 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":7301,"name":"State Medical Board","domain":"health","totalSeats":12,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio patients & licensed physicians","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-07-17","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Licenses and disciplines Ohio's physicians. Twelve members appointed by the Governor with Senate consent — eight licensed physicians and surgeons (ORC 4731.01).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4731.01","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7302,"name":"Opportunities for Ohioans with Disabilities Council","domain":"disability","totalSeats":15,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohioans with disabilities seeking employment","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-07-17","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"State rehabilitation council advising OOD on vocational rehabilitation policy and services. Fifteen governor-appointed members, majority individuals with disabilities (ORC 3304.12).","seatSource":"https://codes.ohio.gov/orc/3304.12","requires":["Disability Policy","Advocacy","Federal compliance"],"confirmation":false},
      {"id":7303,"name":"Commission on Minority Health","domain":"equity","totalSeats":21,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio's minority communities · health equity","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-07-17","criticalNote":"9 of 21 seats are governor-appointed","mandate":"Addresses health disparities affecting minority Ohioans through grants, policy, and community programs. Twenty-one members; nine appointed by the Governor from health professions (ORC 3701.78).","seatSource":"https://codes.ohio.gov/orc/3701.78","requires":["Equity Policy","Community Outreach","Advocacy"],"confirmation":false},
      {"id":7304,"name":"Board of Nursing","domain":"health","totalSeats":13,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio patients & licensed nurses","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-07-17","criticalNote":"Term expiring per Governor's 2026 expirations list","mandate":"Regulates Ohio's nursing profession. Thirteen members — eight registered nurses, four licensed practical nurses, one consumer representative (ORC 4723.02).","seatSource":"https://codes.ohio.gov/ohio-revised-code/section-4723.02","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7305,"name":"State Board of Education","domain":"education","totalSeats":19,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Boards & Commissions Office","constituent":"Ohio K-12 students & families","applyUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-application2021","sourceUrl":"https://governor.ohio.gov/wps/portal/gov/governor/administration/boards-and-commissions/boards-and-commissions-term-expirations-term-expiration-for-2026","lastVerified":"2026-07-17","criticalNote":"Only 8 of 19 seats are governor-appointed","mandate":"Oversees educator licensure and school district territory; 19 members — 11 elected by district, 8 appointed by the Governor with Senate consent.","seatSource":"https://sboe.ohio.gov/about-the-state-board/board-members/02-board-members","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"bc.azgovernor.gov",
    scraper:{ endpoint:"https://bc.azgovernor.gov/", lastPulled:"2026-07-17T00:42:53.123Z", selectorProfile:"az" },
    totalBoardsNote:"220 active boards · Governor's vacancy report · 2 verified of 47 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":6601,"name":"ACUPUNCTURE BOARD OF EXAMINERS","domain":"health","totalSeats":7,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona patients & licensed acupuncturists","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and regulates acupuncture practice. Seven governor-appointed members — four licensed practitioners, one physician, two public members (A.R.S. § 32-3902).","seatSource":"https://www.azleg.gov/ars/32/03902.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":6602,"name":"ARIZONA MEDICAL BOARD","domain":"health","totalSeats":12,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Arizona patients & licensed physicians","applyUrl":"https://bc.azgovernor.gov/boards-and-commissions-application","sourceUrl":"https://bc.azgovernor.gov/sites/default/files/vacancy-report-7-6-2026.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in Governor's vacancy report","mandate":"Licenses and disciplines Arizona's allopathic physicians. Twelve governor-appointed members — eight practicing physicians and four public members (A.R.S. § 32-1402).","seatSource":"https://www.azleg.gov/ars/32/01402.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false}
    ]
  },





  // ─── Connecticut ─── status: live (scraper: manual) ───
  CT: {
    code:"CT", label:"Connecticut", region:"Northeast",
    status:"live",
    color:"#2F6B9A", bg:"#E8F1F8",
    applyUrl:"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM",
    applyAuthority:"Governor's Office via DAS Statewide HR",
    applyLabel:"Governor's Office via DAS Statewide HR",
    applyVerified:"2026-07-17",
    dataSource:"portal.ct.gov/government/departments-and-agencies/boards-councils-and-commissions",
    scraper:{ endpoint:null, lastPulled:"2026-07-16T00:00:00Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · CT publishes no central vacancy list · 3 verified of 3 openings tracked",
    contextNote:"Connecticut publishes no central board-vacancy list. Boards shown are hand-verified appointment opportunities — apply any time through the DAS Boards, Councils and Commissions recruitment (DAS.SHRM@ct.gov).",
    auditNote:null,
    boards:[
      {"id":6901,"name":"Connecticut Medical Examining Board","domain":"health","totalSeats":21,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut patients & licensed physicians","mandate":"Licenses and disciplines Connecticut physicians. Twenty-one governor-appointed members — thirteen physicians, one physician assistant, seven public members (CGS § 20-8a).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://law.justia.com/codes/connecticut/title-20/chapter-370/section-20-8a/","lastVerified":"2026-07-16","criticalNote":"DPH roster listed 2 vacancies at last review — apply via DAS","confirmation":false},
      {"id":6902,"name":"Connecticut State Board of Education","domain":"education","totalSeats":14,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut K-12 students & families","mandate":"Oversees Connecticut's public elementary and secondary education. Fourteen members — nine governor-appointed voting members, three ex officio, two student members (CGS § 10-1).","requires":["Education Policy","Workforce Development","Research & Analysis"],"applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://law.justia.com/codes/connecticut/title-10/chapter-163/section-10-1/","lastVerified":"2026-07-16","criticalNote":"9 of 14 seats are governor-appointed","confirmation":false},
      {"id":6903,"name":"Connecticut Council on Developmental Disabilities","domain":"disability","totalSeats":24,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office via DAS Statewide HR","constituent":"Connecticut residents with developmental disabilities","mandate":"Federally mandated DD Council advocating for Connecticut residents with developmental disabilities. Twenty-four governor-appointed members.","requires":["Disability Policy","Advocacy","Federal compliance"],"applyUrl":"https://www.jobapscloud.com/CT/sup/bulpreview.asp?R1=190219&R2=1234BC&R3=BCM","sourceUrl":"https://portal.ct.gov/CTCDD/About/About-Us/Who-We-Are-and-What-We-Do","lastVerified":"2026-07-16","criticalNote":"Inventory listing — CT publishes no central vacancy list","confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"gov.texas.gov/organization/appointments",
    scraper:{ endpoint:"https://gov.texas.gov/organization/appointments/positions", lastPulled:"2026-07-16T23:55:05.909Z", selectorProfile:"tx" },
    totalBoardsNote:"Appointed-positions directory · applications accepted year-round (no central vacancy list) · 4 verified of 263 openings tracked",
    contextNote:"Texas publishes no central vacancy list — boards shown are appointment opportunities; terms are staggered six-year and applications are accepted year-round through the Governor's Appointments Office.",
    auditNote:null,
    boards:[
      {"id":7601,"name":"Alzheimer's Disease and Related Disorders, Texas Council on","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texans affected by Alzheimer's & related disorders","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/HS/htm/HS.101.htm","lastVerified":"2026-07-16","criticalNote":"4 of 15 seats are governor-appointed","mandate":"Guides the state plan on Alzheimer's disease. Fifteen members — four each appointed by the Governor, Lt. Governor, and Speaker, plus three agency representatives (Health & Safety Code ch. 101).","seatSource":"https://statutes.capitol.texas.gov/Docs/HS/htm/HS.101.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7602,"name":"Behavioral Health Executive Council, Texas","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texans served by licensed behavioral health professionals","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"https://statutes.capitol.texas.gov/Docs/OC/htm/OC.507.htm#507.051","lastVerified":"2026-07-16","criticalNote":"1 of 9 seats is governor-appointed","mandate":"Oversees licensing and enforcement for psychologists, counselors, social workers, and marriage & family therapists. Nine members — eight appointed by member boards, one governor-appointed public member (Occ. Code 507.051).","seatSource":"https://texas.public.law/statutes/tex._occ._code_section_507.051","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7603,"name":"Diabetes Council, Texas","domain":"health","totalSeats":16,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texans living with or at risk of diabetes","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"http://www.statutes.legis.state.tx.us/Docs/HS/htm/HS.103.htm","lastVerified":"2026-07-16","criticalNote":"11 of 16 seats are governor-appointed","mandate":"Advises the legislature on diabetes policy and administers the state diabetes plan. Sixteen members — eleven governor-appointed citizens plus five agency representatives (Health & Safety Code 103.002).","seatSource":"https://statutes.capitol.texas.gov/Docs/HS/htm/HS.103.htm","requires":["Health Policy","Program & Project Management","Research & Analysis"],"confirmation":false},
      {"id":7604,"name":"Higher Education Coordinating Board, Texas","domain":"education","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Texas college students & institutions","applyUrl":"https://gov.texas.gov/organization/appointments/application","sourceUrl":"https://gov.texas.gov/organization/appointments/positions","statuteUrl":"https://statutes.capitol.texas.gov/Docs/ED/htm/ED.61.htm#61.022","lastVerified":"2026-07-16","criticalNote":"Texas accepts applications year-round; staggered 6-year terms","mandate":"Coordinates Texas public higher education strategy, funding formulas, and program approval. Nine members appointed by the Governor with Senate consent for six-year terms (Educ. Code 61.022).","seatSource":"https://statutes.capitol.texas.gov/Docs/ED/htm/ED.61.htm","requires":["Education Policy","Workforce Development","Research & Analysis"],"confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"governor.alabama.gov/administration/appointments",
    scraper:{ endpoint:null, lastPulled:"2026-07-16T00:00:00Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 1 verified of 1 openings tracked",
    contextNote:"Alabama boards shown are hand-verified appointment opportunities — apply through the Governor's appointment application.",
    auditNote:null,
    boards:[
      {"id":6501,"name":"Alabama Council on Developmental Disabilities","domain":"disability","totalSeats":36,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Alabamians with developmental disabilities","mandate":"Alabama's federally mandated DD council driving systems change and inclusion. Thirty-six governor-appointed volunteer members including self-advocates, family members, and agency representatives.","requires":["Disability Policy","Advocacy","Federal compliance"],"applyUrl":"https://governor.alabama.gov/administration/appointments/appointment-application/","sourceUrl":"https://www.acdd.org/council-members/","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time","confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"gov.ca.gov/join-the-administration/government-appointments",
    scraper:{ endpoint:"https://www.gov.ca.gov/join-the-administration/government-appointments/", lastPulled:"2026-07-17T00:42:40.770Z", selectorProfile:"ca" },
    totalBoardsNote:"Current Board Vacancies report (PDF), Governor's Appointments Unit · 2 verified of 6 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":6701,"name":"Gambling Control Commission","domain":"justice","totalSeats":5,"vacantSeats":10,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Californians affected by regulated gambling","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/07/Vacancy-Report-7.1.26.pdf","lastVerified":"2026-07-17","criticalNote":"Listed in Governor's current board vacancies report","mandate":"Regulates California's gambling industry and acts as trustee of Indian Gaming funds. Five members appointed by the Governor, Senate-confirmed (Bus. & Prof. Code § 19811).","seatSource":"https://www.cgcc.ca.gov/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false},
      {"id":6702,"name":"State Compensation Insurance Fund, Board of Directors","domain":"justice","totalSeats":11,"vacantSeats":5,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"California workers & employers in the workers'-comp system","applyUrl":"https://govca.avature.net/GOVCACareers/Home","sourceUrl":"https://www.gov.ca.gov/wp-content/uploads/2026/07/Vacancy-Report-7.1.26.pdf","lastVerified":"2026-07-17","criticalNote":"9 of 11 seats are governor-appointed","mandate":"Governs State Fund, California's provider of last-resort workers' compensation insurance. Eleven members — nine governor-appointed plus two legislative appointees (Ins. Code § 11770).","seatSource":"https://codes.findlaw.com/ca/insurance-code/ins-sect-11770/","requires":["Justice Reform","Public Sector Leadership","Research & Analysis"],"confirmation":false}
    ]
  },




  // ─── Florida ─── status: live (scraper: fl) ───
  FL: {
    code:"FL", label:"Florida", region:"South",
    status:"live",
    color:"#8A5A0B", bg:"#FAF1DE",
    applyUrl:"https://eogforms.eog.myflorida.com/pages/seatapplication.aspx",
    applyAuthority:"Governor's Appointments Office",
    applyLabel:"Governor's Appointments Office",
    applyVerified:"2026-07-17",
    dataSource:"flgov.com/eog/leadership/appointments",
    scraper:{ endpoint:"https://www.flgov.com/eog/leadership/appointments", lastPulled:"2026-07-16T00:00:00Z", selectorProfile:"fl" },
    totalBoardsNote:"Remaining-vacancies report, Governor's Appointments Office · 2 verified of 2 openings tracked",
    contextNote:"Florida board appointments are made by the Governor's Appointments Office; boards shown are hand-verified opportunities — apply any time through the online seat application.",
    auditNote:null,
    boards:[
      {"id":7001,"name":"Florida Board of Medicine","domain":"health","totalSeats":15,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida patients & licensed physicians","mandate":"Licenses and disciplines Florida physicians. Fifteen members appointed by the Governor with Senate confirmation — twelve physicians, three consumer members (Fla. Stat. § 458.307).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://eogforms.eog.myflorida.com/pages/seatapplication.aspx","sourceUrl":"https://florida.public.law/statutes/fla._stat._458.307","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time","confirmation":false},
      {"id":7002,"name":"Florida State Board of Education","domain":"education","totalSeats":7,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Florida K-12 students & families","mandate":"Chief policy body for Florida public education. Seven members appointed by the Governor to staggered four-year terms, Senate-confirmed (Fla. Const. art. IX).","requires":["Education Policy","Workforce Development","Research & Analysis"],"applyUrl":"https://eogforms.eog.myflorida.com/pages/seatapplication.aspx","sourceUrl":"https://www.fldoe.org/policy/state-board-of-edu/members/","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time","confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"gov.louisiana.gov/page/boards-commissions",
    scraper:{ endpoint:null, lastPulled:"2026-07-16T00:00:00Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 2 verified of 2 openings tracked",
    contextNote:"Louisiana boards shown are hand-verified appointment opportunities — apply through the Governor's online application.",
    auditNote:null,
    boards:[
      {"id":7101,"name":"Louisiana State Board of Medical Examiners","domain":"health","totalSeats":10,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisiana patients & licensed physicians","mandate":"Licenses and disciplines Louisiana physicians. Ten voting members appointed by the Governor with Senate confirmation from nominated slates plus one consumer member (La. R.S. 37:1263).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://law.justia.com/codes/louisiana/revised-statutes/title-37/rs-37-1263/","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time","confirmation":false},
      {"id":7102,"name":"Louisiana Developmental Disabilities Council","domain":"disability","totalSeats":28,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Office of Boards & Commissions","constituent":"Louisianans with developmental disabilities","mandate":"Louisiana's federally mandated DD council. Twenty-eight governor-appointed members including people with disabilities, family members, and agency representatives.","requires":["Disability Policy","Advocacy","Federal compliance"],"applyUrl":"https://gov.louisiana.gov/index.cfm/form/home/14","sourceUrl":"https://laddc.org/about-us/council-members/","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time","confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"governorreeves.ms.gov",
    scraper:{ endpoint:null, lastPulled:"2026-07-16T00:00:00Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 2 verified of 2 openings tracked",
    contextNote:"Mississippi boards shown are hand-verified appointment opportunities — contact the Governor's Appointments Office to apply. (TODO verify direct application form.)",
    auditNote:null,
    boards:[
      {"id":7201,"name":"Mississippi State Board of Medical Licensure","domain":"health","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Mississippi patients & licensed physicians","mandate":"Licenses and disciplines Mississippi physicians. Nine physician members appointed by the Governor with Senate consent (Miss. Code § 73-43-3).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://governorreeves.ms.gov/","sourceUrl":"https://law.justia.com/codes/mississippi/title-73/chapter-43/section-73-43-3/","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time","confirmation":false},
      {"id":7202,"name":"Mississippi State Board of Education","domain":"education","totalSeats":9,"vacantSeats":0,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"Mississippi K-12 students & families","mandate":"Governs Mississippi public education policy. Nine members — five appointed by the Governor, two each by the Lt. Governor and House Speaker (Miss. Const. § 202A).","requires":["Education Policy","Workforce Development","Research & Analysis"],"applyUrl":"https://governorreeves.ms.gov/","sourceUrl":"https://mdek12.org/mbe/","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time · 5 of 9 seats are governor-appointed","confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"evers.wi.gov/Pages/BoardsCommissions.aspx",
    scraper:{ endpoint:null, lastPulled:"2026-07-16T00:00:00Z", selectorProfile:"manual" },
    totalBoardsNote:"Hand-verified seed · no central vacancy list found · 2 verified of 2 openings tracked",
    contextNote:"Wisconsin boards shown are hand-verified appointment opportunities — apply any time through the Governor's online application.",
    auditNote:null,
    boards:[
      {"id":7801,"name":"Medical Examining Board","domain":"health","totalSeats":13,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsin patients & licensed physicians","mandate":"Licenses and disciplines Wisconsin physicians. Thirteen members — ten licensed doctors and three public members — appointed by the Governor, Senate-confirmed (Wis. Stat. § 15.405(7)).","requires":["Health Policy","Program & Project Management","Research & Analysis"],"applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://codes.findlaw.com/wi/organization-of-state-government-ch-13-to-22/wi-st-15-405/","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time","confirmation":false},
      {"id":7802,"name":"Board for People with Developmental Disabilities","domain":"disability","totalSeats":28,"vacantSeats":0,"vacantSince":null,"authority":"Office of the Governor — Boards & Commissions","constituent":"Wisconsinites with developmental disabilities","mandate":"Wisconsin's federally mandated DD council. Twenty-eight members — twenty-one governor-appointed, at least 60% people with developmental disabilities or family members.","requires":["Disability Policy","Advocacy","Federal compliance"],"applyUrl":"https://wi.accessgov.com/public/Forms/Page/governor/gov-boardsandcommissions","sourceUrl":"https://wi-bpdd.org/index.php/board/","lastVerified":"2026-07-16","criticalNote":"Inventory listing — apply any time · 21 of 28 seats are governor-appointed","confirmation":false}
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
    applyVerified:"2026-07-17",
    dataSource:"search.scsos.com/boardsandcommissions",
    scraper:{ endpoint:"https://search.scsos.com/files/Web_PositionVacancy_List.pdf", lastPulled:"2026-07-17T00:42:54.498Z", selectorProfile:"sc" },
    totalBoardsNote:"SOS statewide vacancy list · 250+ boards · 1 verified of 123 openings tracked",
    contextNote:null,
    auditNote:null,
    boards:[
      {"id":7501,"name":"South Carolina State Housing, Finance and Development Authority","domain":"housing","totalSeats":9,"vacantSeats":1,"vacantSince":null,"authority":"Governor's Appointments Office","constituent":"South Carolinians needing affordable housing","applyUrl":"https://governor.sc.gov/executive-branch/appointments","sourceUrl":"https://search.scsos.com/files/Web_PositionVacancy_List.pdf","lastVerified":"2026-07-17","criticalNote":"7 of 9 seats are governor-appointed","mandate":"Oversees SC Housing's affordable-housing finance programs. Nine commissioners — seven governor-appointed with Senate consent plus two ex officio (S.C. Code Title 31, Ch. 13).","seatSource":"https://www.scstatehouse.gov/code/t31c013.php","requires":["Housing Policy","Program & Project Management","Policy"],"confirmation":false}
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
export const REQUEST_STATE_CONTACT = "mailto:pamela.dirman.epperson@gmail.com?subject=OpenQuorum%20—%20bring%20my%20state%20online";

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
