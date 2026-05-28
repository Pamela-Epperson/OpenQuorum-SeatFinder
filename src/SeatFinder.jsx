import { useState, useCallback } from "react";
import { BOARDS, STATE_META } from "./states.config";

// ─── Skill options for profile builder ────────────────────────────────────────
const SKILL_OPTIONS = [
  "Federal Health IT","AI Enablement & Policy","Data Governance","EHR / Health Informatics",
  "NIH / Federal Agencies","Program & Project Management","Knowledge Management",
  "Grant Writing & Business Development","Health Data Interoperability","Organizational Transformation",
  "Public Sector Leadership","Research & Analysis","Health Policy","Strategic Advisory",
  "Technology Modernization","Workforce Development",
];

const DEMO_PROFILE = {
  name: "Pametha Epperson, Ph.D., PMP",
  title: "Federal Health IT & AI Enablement Consultant",
  summary: "20+ years spanning VA electronic health record modernization, NIH institutes (NICHD, NIDA, NIMHD), Federal data operations transformation, knowledge and document management, grants intelligence, and AI strategy implementation. Translates complex technical and policy environments into actionable, sustainable operational systems. DC metro area (Ashburn, VA).",
  states: ["MD","MN"],
  skills: ["Federal Health IT","AI Enablement & Policy","Data Governance","EHR / Health Informatics","NIH / Federal Agencies","Program & Project Management","Knowledge Management","Grant Writing & Business Development","Health Data Interoperability","Public Sector Leadership","Research & Analysis","Strategic Advisory"],
  experience: "20+",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const DOMAIN_STYLE = {
  health:      { bg:"#E1F5EE", color:"#085041" },
  education:   { bg:"#E6F1FB", color:"#0C447C" },
  equity:      { bg:"#EEEDFE", color:"#3C3489" },
  housing:     { bg:"#FAEEDA", color:"#633806" },
  justice:     { bg:"#FAECE7", color:"#712B13" },
  disability:  { bg:"#FBEAF0", color:"#72243E" },
  environment: { bg:"#EAF3DE", color:"#27500A" },
};

const TIER_STYLE = {
  "Exceptional": { bar:"#1D9E75", label:"#085041", bg:"#E1F5EE" },
  "Strong":      { bar:"#EF9F27", label:"#633806", bg:"#FAEEDA" },
  "Good":        { bar:"#7F77DD", label:"#3C3489", bg:"#EEEDFE" },
};

// ─── Matching engine ───────────────────────────────────────────────────────────
// Returns true if a board requirement and a user skill are meaningfully related
function skillsMatch(boardReq, userSkill) {
  const a = boardReq.toLowerCase();
  const b = userSkill.toLowerCase();
  if (a === b || a.includes(b) || b.includes(a)) return true;
  // Domain synonym pairs — both directions checked
  const synonyms = [
    ["health it","federal health it"], ["health it","health data interoperability"],
    ["health it","ehr"], ["health it","health informatics"],
    ["data governance","data governance"], ["data governance","knowledge management"],
    ["data governance","data"], ["data interoperability","health data interoperability"],
    ["federal","federal health it"], ["federal","nih / federal agencies"],
    ["federal programs","program & project management"],
    ["policy","health policy"], ["policy","strategic advisory"],
    ["research","research & analysis"], ["analytics","research & analysis"],
    ["grant","grant writing & business development"],
    ["grant management","grant writing & business development"],
    ["program management","program & project management"],
    ["project management","program & project management"],
    ["workforce development","workforce development"],
    ["technology","technology modernization"], ["technology","federal health it"],
    ["technology strategy","technology modernization"], ["technology strategy","federal health it"],
    ["ai","ai enablement & policy"], ["artificial intelligence","ai enablement & policy"],
    ["strategic advisory","strategic advisory"], ["strategic advisory","public sector leadership"],
    ["public sector","public sector leadership"], ["organizational transformation","organizational transformation"],
    ["knowledge management","knowledge management"], ["interoperability","health data interoperability"],
    ["ehr","ehr / health informatics"], ["health informatics","ehr / health informatics"],
    ["medicaid policy","health policy"], ["behavioral health","health policy"],
    ["disability policy","public sector leadership"],
  ];
  return synonyms.some(([p1, p2]) =>
    (a.includes(p1) && b.includes(p2)) || (a.includes(p2) && b.includes(p1))
  );
}

function scoreBoards(boards, profile) {
  const results = boards.map(board => {
    const matchedReqs = board.requires.filter(req =>
      profile.skills.some(skill => skillsMatch(req, skill))
    );

    const matchRatio = matchedReqs.length / Math.max(board.requires.length, 1);
    const fitScore   = Math.min(99, Math.round(58 + matchRatio * 40));
    const fitTier    = fitScore >= 85 ? "Exceptional" : fitScore >= 73 ? "Strong" : "Good";

    // Build reasons from matched requirements
    const reasons = matchedReqs.length > 0
      ? matchedReqs.slice(0, 3).map(req => {
          const matchingSkill = profile.skills.find(s => skillsMatch(req, s)) || profile.skills[0];
          return `Your expertise in ${matchingSkill} directly addresses this board's need for ${req}`;
        })
      : [`Your background as ${profile.title} brings valuable cross-domain perspective to this ${board.domain} board`];

    const stateName = STATE_META[board.state]?.label || board.state;

    return {
      boardId: board.id,
      fitScore,
      fitTier,
      headline: `Your ${(matchedReqs.slice(0,2).join(" and ") || profile.skills[0])} expertise aligns with this board's ${board.domain} mandate in ${stateName}.`,
      reasons,
      consideration: board.confirmation
        ? "Requires Senate confirmation — plan for a longer review and approval timeline."
        : `Apply through ${stateName}'s appointments portal — typically a 2–6 week process.`,
      urgency: `${board.vacantSeats} seat${board.vacantSeats !== 1 ? "s" : ""} currently open`,
    };
  });

  return results
    .filter(r => r.fitScore >= 63)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 7);
}

// ─── Letter generator ──────────────────────────────────────────────────────────
function buildLetter(board, match, profile) {
  const stateName  = STATE_META[board.state]?.label || board.state;
  const topSkills  = profile.skills.slice(0, 3).join(", ");
  const clean = s => (s || "").replace(/^Your /i, "").toLowerCase().replace(/\.$/, "");
  const r1 = clean(match.reasons[0]);
  const r2 = clean(match.reasons[1] || match.reasons[0]);
  const summaryOpener = profile.summary.split(".").slice(0, 2).join(".").trim();

  return `Dear Members of the ${board.name} Appointments Committee,

I am writing to express my strong interest in serving on the ${board.name} in ${stateName}. With more than ${profile.experience} years of professional experience encompassing ${topSkills}, I am deeply committed to public service and confident in my ability to contribute meaningfully to this board's work on behalf of ${board.constituent}.

${summaryOpener}. This background has given me direct exposure to the systems, programs, and policy environments that inform this board's mission. Specifically, my ${r1} — and my ${r2} — both align directly with the board's mandate to ${board.mandate.toLowerCase().replace(/\.$/, "")}. I understand what it takes to move policy into practice, and I bring both the technical depth and the strategic perspective this board requires.

I welcome the opportunity to bring this experience to the ${board.name} and to serve the residents of ${stateName} in a meaningful civic capacity. I am a committed, collaborative contributor and take seriously the responsibility this appointment carries. Thank you for your consideration — I look forward to the possibility of serving alongside you.

Respectfully submitted,
${profile.name}
${profile.title}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Profile","Matching","Results","Letter"];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:"1.75rem" }}>
      {steps.map((s, i) => {
        const active = i === step, done = i < step;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? 1 : "none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700,
                background: done?"#1D9E75":active?"#fff":"var(--color-background-secondary)",
                color: done?"#fff":active?"#1D9E75":"var(--color-text-secondary)",
                border: active?"2px solid #1D9E75":done?"2px solid #1D9E75":"2px solid var(--color-border-tertiary)",
                transition:"all 0.3s" }}>
                {done ? "✓" : i+1}
              </div>
              <span style={{ fontSize:10, fontWeight:active?600:400, color:active?"#1D9E75":"var(--color-text-secondary)", whiteSpace:"nowrap" }}>{s}</span>
            </div>
            {i < steps.length-1 && (
              <div style={{ flex:1, height:2, margin:"0 6px", marginBottom:14, background:done?"#1D9E75":"var(--color-border-tertiary)", transition:"background 0.3s" }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FitMeter({ score, tier }) {
  const ts = TIER_STYLE[tier] || TIER_STYLE["Good"];
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, minWidth:64 }}>
      <div style={{ width:56, height:56, borderRadius:"50%", background:`conic-gradient(${ts.bar} ${score*3.6}deg, var(--color-background-secondary) 0deg)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:42, height:42, borderRadius:"50%", background:"var(--color-background-primary)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:13, fontWeight:700, color:ts.bar }}>{score}</span>
        </div>
      </div>
      <span style={{ fontSize:10, fontWeight:600, color:ts.label, background:ts.bg, padding:"2px 8px", borderRadius:20 }}>{tier}</span>
    </div>
  );
}

// ─── Steps ─────────────────────────────────────────────────────────────────────
function ProfileStep({ profile, setProfile, onMatch, loading }) {
  const toggle      = skill => setProfile(p => ({ ...p, skills: p.skills.includes(skill) ? p.skills.filter(s=>s!==skill) : [...p.skills, skill] }));
  const toggleState = s     => setProfile(p => ({ ...p, states: p.states.includes(s)     ? p.states.filter(x=>x!==s)    : [...p.states, s] }));
  const availableStates = Object.keys(STATE_META);

  return (
    <div>
      <div style={{ marginBottom:"1.25rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <span style={{ fontSize:11, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:"0.07em" }}>Demo profile loaded</span>
          <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#E1F5EE", color:"#085041", fontWeight:500 }}>edit any field</span>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
          <div>
            <label style={{ fontSize:11, color:"var(--color-text-secondary)", display:"block", marginBottom:4 }}>Full name + credentials</label>
            <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}
              style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"1px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-primary)", color:"var(--color-text-primary)", boxSizing:"border-box" }}/>
          </div>
          <div>
            <label style={{ fontSize:11, color:"var(--color-text-secondary)", display:"block", marginBottom:4 }}>Professional title</label>
            <input value={profile.title} onChange={e=>setProfile(p=>({...p,title:e.target.value}))}
              style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"1px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-primary)", color:"var(--color-text-primary)", boxSizing:"border-box" }}/>
          </div>
        </div>

        <div style={{ marginBottom:10 }}>
          <label style={{ fontSize:11, color:"var(--color-text-secondary)", display:"block", marginBottom:4 }}>Professional background summary</label>
          <textarea value={profile.summary} onChange={e=>setProfile(p=>({...p,summary:e.target.value}))} rows={3}
            style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"1px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-primary)", color:"var(--color-text-primary)", resize:"vertical", boxSizing:"border-box", lineHeight:1.6 }}/>
        </div>

        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:11, color:"var(--color-text-secondary)", display:"block", marginBottom:6 }}>
            States to search <span style={{ fontWeight:400 }}>({profile.states.length} selected)</span>
          </label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {availableStates.map(s => {
              const meta = STATE_META[s];
              const selected = profile.states.includes(s);
              return (
                <button key={s} onClick={()=>toggleState(s)}
                  style={{ padding:"6px 14px", borderRadius:20,
                    border:`1.5px solid ${selected?meta.color:"var(--color-border-secondary)"}`,
                    background:selected?meta.bg:"transparent",
                    color:selected?meta.color:"var(--color-text-secondary)",
                    fontWeight:selected?600:400, cursor:"pointer", fontSize:12, transition:"all 0.12s" }}>
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ fontSize:11, color:"var(--color-text-secondary)", display:"block", marginBottom:6 }}>
            Skills & expertise <span style={{ fontWeight:400 }}>({profile.skills.length} selected)</span>
          </label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {SKILL_OPTIONS.map(sk => (
              <button key={sk} onClick={()=>toggle(sk)}
                style={{ padding:"4px 11px", borderRadius:20,
                  border:`1.5px solid ${profile.skills.includes(sk)?"#1D9E75":"var(--color-border-tertiary)"}`,
                  background:profile.skills.includes(sk)?"#1D9E75":"transparent",
                  color:profile.skills.includes(sk)?"#fff":"var(--color-text-secondary)",
                  cursor:"pointer", fontSize:11, fontWeight:profile.skills.includes(sk)?600:400, transition:"all 0.12s" }}>
                {sk}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={onMatch} disabled={loading||profile.states.length===0||profile.skills.length===0}
        style={{ width:"100%", padding:"13px 0", borderRadius:10, border:"none",
          background:loading?"var(--color-background-secondary)":"#1D9E75",
          color:loading?"var(--color-text-secondary)":"#fff", fontSize:14, fontWeight:700,
          cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}>
        {loading ? (
          <><span style={{ width:14, height:14, border:"2px solid #aaa", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>Analyzing your profile…</>
        ) : "Find My Board Matches →"}
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function LoadingStep({ boardCount }) {
  const msgs = [
    "Scanning board mandates and requirements…",
    `Evaluating fit across ${boardCount} boards…`,
    "Scoring skill alignment…",
    "Ranking your top matches…",
    "Preparing your results…",
  ];
  const [idx, setIdx] = useState(0);
  useState(() => {
    const t = setInterval(() => setIdx(i => (i+1) % msgs.length), 900);
    return () => clearInterval(t);
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"3rem 1rem", gap:20 }}>
      <div style={{ position:"relative", width:64, height:64 }}>
        <div style={{ position:"absolute", inset:0, border:"3px solid var(--color-border-tertiary)", borderTopColor:"#1D9E75", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
        <div style={{ position:"absolute", inset:8, border:"2px solid var(--color-border-tertiary)", borderBottomColor:"#EF9F27", borderRadius:"50%", animation:"spin 1.3s linear infinite reverse" }}/>
      </div>
      <div style={{ textAlign:"center" }}>
        <p style={{ margin:"0 0 6px", fontSize:15, fontWeight:600, color:"var(--color-text-primary)" }}>Matching your profile to open seats</p>
        <p style={{ margin:0, fontSize:13, color:"var(--color-text-secondary)", minHeight:20 }}>{msgs[idx]}</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ResultsStep({ matches, boards, onLetter, onBack }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
        <div>
          <p style={{ margin:"0 0 2px", fontSize:16, fontWeight:700, color:"var(--color-text-primary)" }}>{matches.length} boards matched to your profile</p>
          <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)" }}>Ranked by alignment · Select any to generate a letter of interest</p>
        </div>
        <button onClick={onBack} style={{ padding:"5px 12px", borderRadius:8, border:"1px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)", cursor:"pointer", fontSize:12 }}>← Edit profile</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {matches.map(m => {
          const board = boards.find(b => b.id === m.boardId);
          if (!board) return null;
          const ds       = DOMAIN_STYLE[board.domain] || { bg:"#f0f0f0", color:"#555" };
          const ts       = TIER_STYLE[m.fitTier] || TIER_STYLE["Good"];
          const stateMeta = STATE_META[board.state] || { color:"#555", bg:"#f0f0f0", label:board.state };
          return (
            <div key={m.boardId} style={{ border:"1px solid var(--color-border-tertiary)", borderLeft:`3px solid ${ts.bar}`, borderRadius:"0 12px 12px 0", padding:"1rem 1.1rem", background:"var(--color-background-primary)" }}>
              <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <FitMeter score={m.fitScore} tier={m.fitTier}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"var(--color-text-primary)" }}>{board.name}</span>
                    <span style={{ fontSize:10, padding:"2px 7px", borderRadius:20, background:stateMeta.bg, color:stateMeta.color, fontWeight:600 }}>{stateMeta.label}</span>
                    <span style={{ fontSize:10, padding:"2px 7px", borderRadius:20, ...ds, fontWeight:500 }}>{board.domain}</span>
                    {board.confirmation && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:20, background:"#FAEEDA", color:"#633806" }}>Senate confirm.</span>}
                  </div>

                  <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:500, color:"var(--color-text-secondary)", fontStyle:"italic", lineHeight:1.5 }}>"{m.headline}"</p>

                  <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:8 }}>
                    {(m.reasons||[]).map((r,j) => (
                      <div key={j} style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
                        <span style={{ color:ts.bar, fontSize:11, marginTop:2, flexShrink:0 }}>✦</span>
                        <span style={{ fontSize:12, color:"var(--color-text-primary)", lineHeight:1.5 }}>{r}</span>
                      </div>
                    ))}
                  </div>

                  {m.consideration && (
                    <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                      <span style={{ fontSize:11, color:"#EF9F27", flexShrink:0, marginTop:1 }}>◈</span>
                      <span style={{ fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.5 }}><strong>Note:</strong> {m.consideration}</span>
                    </div>
                  )}

                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <button onClick={() => onLetter(board, m)}
                      style={{ padding:"7px 16px", borderRadius:8, border:"none", background:"#1D9E75", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      Generate Letter of Interest →
                    </button>
                    <a href={board.applyUrl} target="_blank" rel="noreferrer"
                      style={{ fontSize:12, color:"var(--color-text-secondary)", textDecoration:"none" }}>
                      Apply directly ↗
                    </a>
                    <span style={{ fontSize:11, color:ts.bar, marginLeft:"auto" }}>{board.vacantSeats} seat{board.vacantSeats>1?"s":""} open</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LetterStep({ letter, board, match, profile, onBack }) {
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
        <div>
          <p style={{ margin:"0 0 2px", fontSize:15, fontWeight:700, color:"var(--color-text-primary)" }}>Letter of Interest</p>
          <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)" }}>{board?.name}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onBack} style={{ padding:"5px 12px", borderRadius:8, border:"1px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)", cursor:"pointer", fontSize:12 }}>← All matches</button>
          <button onClick={() => { navigator.clipboard?.writeText(`${today}\n\n${letter}`); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
            style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${copied?"#1D9E75":"var(--color-border-secondary)"}`, background:copied?"#E1F5EE":"transparent", color:copied?"#085041":"var(--color-text-primary)", cursor:"pointer", fontSize:12, fontWeight:500 }}>
            {copied?"Copied!":"Copy letter"}
          </button>
        </div>
      </div>

      <div style={{ background:"var(--color-background-primary)", border:"1px solid var(--color-border-tertiary)", borderRadius:12, padding:"2rem 2.5rem", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", maxWidth:680, margin:"0 auto" }}>
        <p style={{ margin:"0 0 1.5rem", fontSize:13, color:"var(--color-text-secondary)" }}>{today}</p>
        <div style={{ whiteSpace:"pre-wrap", fontSize:13, color:"var(--color-text-primary)", lineHeight:1.85, fontFamily:"Georgia, serif" }}>
          {letter}
        </div>
        <div style={{ marginTop:"2rem", paddingTop:"1rem", borderTop:"1px solid var(--color-border-tertiary)", display:"flex", gap:10, flexWrap:"wrap" }}>
          <a href={board?.applyUrl} target="_blank" rel="noreferrer"
            style={{ padding:"8px 18px", borderRadius:8, background:"#1D9E75", color:"#fff", fontSize:12, fontWeight:700, textDecoration:"none" }}>
            Submit application ↗
          </a>
          <button onClick={() => { navigator.clipboard?.writeText(`${today}\n\n${letter}`); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
            style={{ padding:"8px 18px", borderRadius:8, border:"1px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-primary)", cursor:"pointer", fontSize:12, fontWeight:500 }}>
            {copied?"Copied!":"Copy to clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function SeatFinder() {
  const [step,          setStep]          = useState(0);
  const [profile,       setProfile]       = useState(DEMO_PROFILE);
  const [matches,       setMatches]       = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [letter,        setLetter]        = useState("");
  const [loading,       setLoading]       = useState(false);

  const filteredBoards = BOARDS.filter(b => profile.states.includes(b.state));

  const handleMatch = useCallback(() => {
    setLoading(true);
    setStep(1);
    // Brief async pause for UX — scoring is instant but the animation feels intentional
    setTimeout(() => {
      const results = scoreBoards(filteredBoards, profile);
      setMatches(results);
      setLoading(false);
      setStep(2);
    }, 1800);
  }, [profile, filteredBoards]);

  const handleLetter = useCallback((board, match) => {
    setSelectedBoard(board);
    setSelectedMatch(match);
    setStep(3);
    setLoading(true);
    // Brief pause so the transition feels deliberate
    setTimeout(() => {
      const text = buildLetter(board, match, profile);
      setLetter(text);
      setLoading(false);
    }, 800);
  }, [profile]);

  return (
    <div style={{ fontFamily:"system-ui,-apple-system,sans-serif", maxWidth:760, margin:"0 auto", padding:"0 0 3rem", color:"var(--color-text-primary)" }}>

      {/* Header */}
      <div style={{ borderBottom:"1px solid var(--color-border-tertiary)", paddingBottom:"1rem", marginBottom:"1.5rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:3 }}>
          <span style={{ fontSize:20, fontWeight:600, letterSpacing:"-0.02em" }}>Open<span style={{ color:"#1D9E75" }}>Quorum</span></span>
          <span style={{ fontSize:12, color:"var(--color-text-secondary)" }}>·</span>
          <span style={{ fontSize:15, fontWeight:600, color:"var(--color-text-primary)" }}>SeatFinder</span>
          <span style={{ fontSize:11, padding:"3px 8px", borderRadius:20, background:"#E1F5EE", color:"#0F6E56", fontWeight:500, marginLeft:4 }}>AI-powered</span>
        </div>
        <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)" }}>Match your expertise to open board seats · Generate a letter of interest in seconds</p>
      </div>

      <StepBar step={step}/>

      {step === 0 && <ProfileStep profile={profile} setProfile={setProfile} onMatch={handleMatch} loading={loading}/>}
      {step === 1 && <LoadingStep boardCount={filteredBoards.length}/>}
      {step === 2 && <ResultsStep matches={matches} boards={BOARDS} onLetter={handleLetter} onBack={()=>setStep(0)}/>}
      {step === 3 && (
        loading
          ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"3rem", gap:16 }}>
              <div style={{ width:40, height:40, border:"3px solid var(--color-border-tertiary)", borderTopColor:"#1D9E75", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
              <p style={{ margin:0, fontSize:13, color:"var(--color-text-secondary)" }}>Drafting your letter of interest…</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          : <LetterStep letter={letter} board={selectedBoard} match={selectedMatch} profile={profile} onBack={()=>setStep(2)}/>
      )}
    </div>
  );
}
