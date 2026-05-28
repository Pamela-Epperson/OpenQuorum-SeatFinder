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
  name: "Pamela Epperson, Ph.D., PMP",
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

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
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
                background: done ? "#1D9E75" : active ? "#fff" : "var(--color-background-secondary)",
                color: done ? "#fff" : active ? "#1D9E75" : "var(--color-text-secondary)",
                border: active ? "2px solid #1D9E75" : done ? "2px solid #1D9E75" : "2px solid var(--color-border-tertiary)",
                transition:"all 0.3s" }}>
                {done ? "✓" : i+1}
              </div>
              <span style={{ fontSize:10, fontWeight: active ? 600 : 400, color: active ? "#1D9E75" : "var(--color-text-secondary)", whiteSpace:"nowrap" }}>{s}</span>
            </div>
            {i < steps.length-1 && (
              <div style={{ flex:1, height:2, margin:"0 6px", marginBottom:14, background: done ? "#1D9E75" : "var(--color-border-tertiary)", transition:"background 0.3s" }}/>
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
      <div style={{ width:56, height:56, borderRadius:"50%", background:`conic-gradient(${ts.bar} ${score*3.6}deg, var(--color-background-secondary) 0deg)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
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
  const toggle = (skill) => {
    setProfile(p => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter(s=>s!==skill) : [...p.skills, skill]
    }));
  };
  const toggleState = (s) => {
    setProfile(p => ({
      ...p,
      states: p.states.includes(s) ? p.states.filter(x=>x!==s) : [...p.states, s]
    }));
  };

  // Derive available states from the shared config — automatically grows as states are added
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
                    border:`1.5px solid ${selected ? meta.color : "var(--color-border-secondary)"}`,
                    background: selected ? meta.bg : "transparent",
                    color: selected ? meta.color : "var(--color-text-secondary)",
                    fontWeight: selected ? 600 : 400, cursor:"pointer", fontSize:12,
                    transition:"all 0.12s" }}>
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ fontSize:11, color:"var(--color-text-secondary)", display:"block", marginBottom:6 }}>Skills & expertise <span style={{ color:"var(--color-text-secondary)", fontWeight:400 }}>({profile.skills.length} selected)</span></label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {SKILL_OPTIONS.map(sk => (
              <button key={sk} onClick={()=>toggle(sk)}
                style={{ padding:"4px 11px", borderRadius:20, border:`1.5px solid ${profile.skills.includes(sk)?"#1D9E75":"var(--color-border-tertiary)"}`,
                  background:profile.skills.includes(sk)?"#1D9E75":"transparent",
                  color:profile.skills.includes(sk)?"#fff":"var(--color-text-secondary)",
                  cursor:"pointer", fontSize:11, fontWeight:profile.skills.includes(sk)?600:400, transition:"all 0.12s" }}>
                {sk}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={onMatch} disabled={loading || profile.states.length===0 || profile.skills.length===0}
        style={{ width:"100%", padding:"13px 0", borderRadius:10, border:"none",
          background:loading?"var(--color-background-secondary)":"#1D9E75",
          color:loading?"var(--color-text-secondary)":"#fff", fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}>
        {loading ? (
          <>
            <span style={{ width:14, height:14, border:"2px solid #aaa", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>
            Finding your matches…
          </>
        ) : "Find My Board Matches →"}
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function LoadingStep({ stateCount, boardCount }) {
  const msgs = [
    "Analyzing your professional background…",
    "Scanning board mandates and requirements…",
    `Evaluating fit across ${boardCount} boards in ${stateCount} state${stateCount !== 1 ? "s" : ""}…`,
    "Ranking matches by alignment…",
    "Drafting your fit report…",
  ];
  const [idx, setIdx] = useState(0);
  useState(()=>{
    const t = setInterval(()=>setIdx(i=>(i+1)%msgs.length), 1400);
    return ()=>clearInterval(t);
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"3rem 1rem", gap:20 }}>
      <div style={{ position:"relative", width:64, height:64 }}>
        <div style={{ position:"absolute", inset:0, border:"3px solid var(--color-border-tertiary)", borderTopColor:"#1D9E75", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
        <div style={{ position:"absolute", inset:8, border:"2px solid var(--color-border-tertiary)", borderBottomColor:"#EF9F27", borderRadius:"50%", animation:"spin 1.3s linear infinite reverse" }}/>
      </div>
      <div style={{ textAlign:"center" }}>
        <p style={{ margin:"0 0 6px", fontSize:15, fontWeight:600, color:"var(--color-text-primary)" }}>Claude is analyzing your profile</p>
        <p style={{ margin:0, fontSize:13, color:"var(--color-text-secondary)", minHeight:20, transition:"opacity 0.3s" }}>{msgs[idx]}</p>
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
        {matches.map((m) => {
          const board = boards.find(b=>b.id===m.boardId);
          if (!board) return null;
          const ds = DOMAIN_STYLE[board.domain] || { bg:"#f0f0f0", color:"#555" };
          const ts = TIER_STYLE[m.fitTier] || TIER_STYLE["Good"];
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
                    {(m.reasons||[]).map((r,j)=>(
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
                    <button onClick={()=>onLetter(board, m)}
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

function LetterStep({ letter, board, match, profile, onBack, loading }) {
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  const stateName = STATE_META[board?.state]?.label || board?.state || "";

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
        <div>
          <p style={{ margin:"0 0 2px", fontSize:15, fontWeight:700, color:"var(--color-text-primary)" }}>Letter of Interest</p>
          <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)" }}>{board?.name}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onBack} style={{ padding:"5px 12px", borderRadius:8, border:"1px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-secondary)", cursor:"pointer", fontSize:12 }}>← All matches</button>
          <button onClick={()=>{navigator.clipboard?.writeText(`${today}\n\n${letter}`);setCopied(true);setTimeout(()=>setCopied(false),2000)}}
            style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${copied?"#1D9E75":"var(--color-border-secondary)"}`, background:copied?"#E1F5EE":"transparent", color:copied?"#085041":"var(--color-text-primary)", cursor:"pointer", fontSize:12, fontWeight:500 }}>
            {copied?"Copied!":"Copy letter"}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"3rem", gap:16 }}>
          <div style={{ width:40, height:40, border:"3px solid var(--color-border-tertiary)", borderTopColor:"#1D9E75", borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
          <p style={{ margin:0, fontSize:13, color:"var(--color-text-secondary)" }}>Drafting your letter of interest…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
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
            <button onClick={()=>{navigator.clipboard?.writeText(`${today}\n\n${letter}`);setCopied(true);setTimeout(()=>setCopied(false),2000)}}
              style={{ padding:"8px 18px", borderRadius:8, border:"1px solid var(--color-border-secondary)", background:"transparent", color:"var(--color-text-primary)", cursor:"pointer", fontSize:12, fontWeight:500 }}>
              {copied?"Copied!":"Copy to clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SeatFinder() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(DEMO_PROFILE);
  const [matches, setMatches] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter boards to only the states the user has selected
  const filteredBoards = BOARDS.filter(b => profile.states.includes(b.state));

  const handleMatch = useCallback(async () => {
    setLoading(true);
    setError("");
    setStep(1);

    const boardSummary = filteredBoards.map(b =>
      `ID:${b.id} | ${b.state} | ${b.name} | domain:${b.domain} | requires:${b.requires.join(", ")} | mandate:${b.mandate}`
    ).join("\n");

    const prompt = `You are a civic board placement expert. Match this professional to public board seats and return ONLY raw JSON (no markdown, no backticks, no commentary).

PROFILE:
Name: ${profile.name}
Title: ${profile.title}
Background: ${profile.summary}
Skills: ${profile.skills.join(", ")}
States: ${profile.states.map(s => STATE_META[s]?.label || s).join(", ")}

AVAILABLE BOARDS:
${boardSummary}

Return the top 5-7 best matches sorted by fitScore descending. JSON format:
{"matches":[{"boardId":<number>,"fitScore":<60-99>,"fitTier":"Exceptional"|"Strong"|"Good","headline":"<one compelling sentence about why this is a match>","reasons":["<specific reason 1>","<specific reason 2>","<specific reason 3>"],"consideration":"<one honest watch-out or practical note>","urgency":"<brief note on why to act>"}]}`;

    try {
      const raw = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setMatches(parsed.matches || []);
      setStep(2);
    } catch(e) {
      setError("Matching engine hit a snag. Please try again.");
      setStep(0);
    } finally {
      setLoading(false);
    }
  }, [profile, filteredBoards]);

  const handleLetter = useCallback(async (board, match) => {
    setSelectedBoard(board);
    setSelectedMatch(match);
    setLetter("");
    setStep(3);
    setLoading(true);

    const stateName = STATE_META[board.state]?.label || board.state;

    const prompt = `Write a professional letter of interest for ${profile.name} (${profile.title}) applying to the ${board.name} in ${stateName}.

APPLICANT BACKGROUND:
${profile.summary}

Key skills: ${profile.skills.join(", ")}

BOARD MANDATE:
${board.mandate}

REQUIREMENTS:
${board.requires.join(", ")}

WHY THEY MATCH:
${(match.reasons||[]).join("; ")}

Write a compelling 3-paragraph letter of interest. Format:
- Opening paragraph: Express genuine interest and establish immediate credibility with the most relevant experience
- Middle paragraph: Connect specific professional background to the board's specific mandate with concrete examples
- Closing paragraph: Articulate the value they bring, express commitment to the board's work, and request consideration

Address to: "Dear Members of the ${board.name} Appointments Committee,"
Close with: "Respectfully submitted,\n${profile.name}\n${profile.title}"

Write only the letter text. No subject line. No date. No address block. Professional, specific, and warm — not generic.`;

    try {
      const text = await callClaude(prompt);
      setLetter(text);
    } catch(e) {
      setLetter("Letter generation encountered an issue. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {error && (
        <div style={{ padding:"10px 14px", borderRadius:8, background:"#FCEBEB", color:"#791F1F", fontSize:13, marginBottom:"1rem" }}>
          {error}
        </div>
      )}

      {step === 0 && <ProfileStep profile={profile} setProfile={setProfile} onMatch={handleMatch} loading={loading}/>}
      {step === 1 && <LoadingStep stateCount={profile.states.length} boardCount={filteredBoards.length}/>}
      {step === 2 && <ResultsStep matches={matches} boards={BOARDS} onLetter={handleLetter} onBack={()=>setStep(0)}/>}
      {step === 3 && <LetterStep letter={letter} board={selectedBoard} match={selectedMatch} profile={profile} onBack={()=>setStep(2)} loading={loading}/>}
    </div>
  );
}
