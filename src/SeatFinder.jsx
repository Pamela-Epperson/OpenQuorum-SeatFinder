// @ts-nocheck
import { useState, useCallback, useRef } from "react";
import { BOARDS, STATE_META } from "./states.config";

// ─── Skill options ─────────────────────────────────────────────────────────────
const SKILL_OPTIONS = [
  "Federal Health IT","AI Enablement & Policy","Data Governance","EHR / Health Informatics",
  "NIH / Federal Agencies","Program & Project Management","Knowledge Management",
  "Grant Writing & Business Development","Health Data Interoperability","Organizational Transformation",
  "Public Sector Leadership","Research & Analysis","Health Policy","Strategic Advisory",
  "Technology Modernization","Workforce Development","Legislative Affairs","Community Outreach",
  "Environmental Policy","Housing Policy","Disability Policy","Justice Reform","Early Childhood Education",
  "Behavioral Health","Substance Use Disorder","Veteran Services","Criminal Justice",
];

// ─── Generic sample profile — no real person, for demonstration only ───────────
const DEMO_PROFILE = {
  isDemo: true,
  name: "Sample Profile",
  title: "Public Health Technology & Policy Consultant",
  summary: "15+ years in federal health information technology, data governance, and public sector program management. Experience spanning electronic health records, interoperability standards, workforce development, and grants management across state and federal agencies.",
  states: ["MD", "VA"],
  skills: [
    "Federal Health IT","Data Governance","EHR / Health Informatics",
    "Program & Project Management","Health Policy","Public Sector Leadership",
    "Research & Analysis","Grant Writing & Business Development",
  ],
  experience: "15+",
  linkedIn: "",
};

const BLANK_PROFILE = {
  isDemo: false,
  name: "",
  title: "",
  summary: "",
  states: [],
  skills: [],
  experience: "",
  linkedIn: "",
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

// ─── LinkedIn URL validator ────────────────────────────────────────────────────
function validateLinkedIn(url) {
  if (!url) return true; // optional field
  return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(url.trim());
}

function normalizeLinkedIn(url) {
  if (!url) return url;
  const u = url.trim();
  if (u.startsWith("http")) return u;
  return "https://" + u;
}

// ─── Resume keyword extractor ─────────────────────────────────────────────────
function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  return SKILL_OPTIONS.filter(skill => lower.includes(skill.toLowerCase()));
}

// ─── Matching engine ───────────────────────────────────────────────────────────
function skillsMatch(boardReq, userSkill) {
  const a = boardReq.toLowerCase();
  const b = userSkill.toLowerCase();
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const synonyms = [
    ["health it","federal health it"], ["health it","health data interoperability"],
    ["health it","ehr"], ["health it","health informatics"],
    ["data governance","knowledge management"], ["data governance","data"],
    ["data interoperability","health data interoperability"],
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
    ["technology strategy","technology modernization"],
    ["ai","ai enablement & policy"], ["artificial intelligence","ai enablement & policy"],
    ["strategic advisory","public sector leadership"],
    ["public sector","public sector leadership"],
    ["knowledge management","knowledge management"],
    ["interoperability","health data interoperability"],
    ["ehr","ehr / health informatics"], ["health informatics","ehr / health informatics"],
    ["medicaid policy","health policy"], ["behavioral health","health policy"],
    ["disability policy","public sector leadership"],
    ["environment","environmental policy"],
    ["housing","housing policy"],
    ["disability","disability policy"],
    ["justice","justice reform"],
    ["veterans","veteran services"],
    ["criminal","criminal justice"],
    ["early childhood","early childhood education"],
    ["behavioral","behavioral health"],
    ["substance","substance use disorder"],
    ["community","community outreach"],
    ["legislative","legislative affairs"],
  ];
  return synonyms.some(([p1, p2]) =>
    (a.includes(p1) && b.includes(p2)) || (a.includes(p2) && b.includes(p1))
  );
}

function scoreBoards(boards, profile) {
  const allSkills = [...profile.skills, ...(profile.customSkills || [])];
  const results = boards.map(board => {
    const matchedReqs = board.requires.filter(req =>
      allSkills.some(skill => skillsMatch(req, skill))
    );
    const matchRatio = matchedReqs.length / Math.max(board.requires.length, 1);
    const fitScore   = Math.min(99, Math.round(58 + matchRatio * 40));
    const fitTier    = fitScore >= 85 ? "Exceptional" : fitScore >= 73 ? "Strong" : "Good";
    const reasons = matchedReqs.length > 0
      ? matchedReqs.slice(0, 3).map(req => {
          const matchingSkill = allSkills.find(s => skillsMatch(req, s)) || allSkills[0];
          return `Your expertise in ${matchingSkill} directly addresses this board's need for ${req}`;
        })
      : [`Your background as ${profile.title || "a public sector professional"} brings valuable cross-domain perspective to this ${board.domain} board`];
    const stateName = STATE_META[board.state]?.label || board.state;
    return {
      boardId: board.id,
      fitScore, fitTier,
      headline: `Your ${(matchedReqs.slice(0,2).join(" and ") || allSkills[0] || "professional")} expertise aligns with this board's ${board.domain} mandate in ${stateName}.`,
      reasons,
      consideration: board.confirmation
        ? "Requires Senate confirmation — plan for a longer review and approval timeline."
        : `Apply through ${stateName}'s appointments portal — typically a 2–6 week process.`,
      urgency: `${board.vacantSeats} seat${board.vacantSeats !== 1 ? "s" : ""} currently open`,
    };
  });
  return results.filter(r => r.fitScore >= 63).sort((a, b) => b.fitScore - a.fitScore).slice(0, 7);
}

// ─── Letter generator ──────────────────────────────────────────────────────────
function buildLetter(board, match, profile) {
  const stateName = STATE_META[board.state]?.label || board.state;
  const allSkills = [...(profile.skills || []), ...(profile.customSkills || [])];
  const topSkills = allSkills.slice(0, 3).join(", ");
  const clean = s => (s || "").replace(/^Your /i, "").toLowerCase().replace(/\.$/, "");
  const r1 = clean(match.reasons[0]);
  const r2 = clean(match.reasons[1] || match.reasons[0]);
  const summaryOpener = (profile.summary || "").split(".").slice(0, 2).join(".").trim();
  const displayName = profile.isDemo ? "[Your Name]" : (profile.name || "[Your Name]");
  const displayTitle = profile.title || "[Your Professional Title]";

  return `Dear Members of the ${board.name} Appointments Committee,

I am writing to express my strong interest in serving on the ${board.name} in ${stateName}. With more than ${profile.experience || "several"} years of professional experience encompassing ${topSkills || "public sector leadership"}, I am deeply committed to public service and confident in my ability to contribute meaningfully to this board's work on behalf of ${board.constituent}.

${summaryOpener}. This background has given me direct exposure to the systems, programs, and policy environments that inform this board's mission. Specifically, my ${r1} — and my ${r2} — both align directly with the board's mandate to ${board.mandate.toLowerCase().replace(/\.$/, "")}. I understand what it takes to move policy into practice, and I bring both the technical depth and the strategic perspective this board requires.

I welcome the opportunity to bring this experience to the ${board.name} and to serve the residents of ${stateName} in a meaningful civic capacity. I am a committed, collaborative contributor and take seriously the responsibility this appointment carries. Thank you for your consideration — I look forward to the possibility of serving alongside you.

Respectfully submitted,
${displayName}
${displayTitle}`;
}

// ─── Step bar (clickable to go back) ──────────────────────────────────────────
function StepBar({ step, onGoTo }) {
  const steps = ["Profile","Matching","Results","Letter"];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:"1.75rem" }}>
      {steps.map((s, i) => {
        const active = i === step, done = i < step;
        const clickable = done && i < step;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? 1 : "none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div
                onClick={() => clickable && onGoTo(i)}
                style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:700, cursor:clickable?"pointer":"default",
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

// ─── Back button (prominent) ───────────────────────────────────────────────────
function BackBtn({ onClick, label }) {
  return (
    <button onClick={onClick}
      style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8,
        border:"1.5px solid var(--color-border-secondary)", background:"var(--color-background-secondary)",
        color:"var(--color-text-primary)", cursor:"pointer", fontSize:13, fontWeight:500,
        transition:"all 0.15s" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor="#1D9E75"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="var(--color-border-secondary)"}>
      ← {label}
    </button>
  );
}

// ─── Profile Step ──────────────────────────────────────────────────────────────
function ProfileStep({ profile, setProfile, onMatch, loading }) {
  const [mode, setMode]               = useState(profile.isDemo ? "demo" : "own");
  const [resumeFile, setResumeFile]   = useState("");
  const [suggested, setSuggested]     = useState([]);
  const [liError, setLiError]         = useState("");
  const [customInput, setCustomInput] = useState("");
  const [locStatus, setLocStatus]     = useState(""); // "found" | "denied" | ""
  const fileRef = useRef();

  const availableStates = Object.keys(STATE_META);

  const toggle      = skill => setProfile(p => ({ ...p, skills: p.skills.includes(skill) ? p.skills.filter(s=>s!==skill) : [...p.skills, skill] }));
  const toggleState = s     => setProfile(p => ({ ...p, states: p.states.includes(s) ? p.states.filter(x=>x!==s) : [...p.states, s] }));

  const addCustomSkill = () => {
    const v = customInput.trim();
    if (!v) return;
    setProfile(p => ({ ...p, customSkills: [...(p.customSkills||[]).filter(x=>x!==v), v] }));
    setCustomInput("");
  };

  const removeCustom = skill => setProfile(p => ({ ...p, customSkills: (p.customSkills||[]).filter(x=>x!==skill) }));

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result || "";
      const found = extractSkillsFromText(text);
      setSuggested(found);
      // Auto-populate summary from resume if empty
      if (!profile.summary && text.length > 50) {
        const cleaned = text.replace(/\s+/g, " ").trim().slice(0, 400);
        setProfile(p => ({ ...p, summary: cleaned }));
      }
    };
    reader.onerror = () => setSuggested([]);
    reader.readAsText(file);
  };

  const handleLinkedIn = (val) => {
    setProfile(p => ({ ...p, linkedIn: val }));
    if (val && !validateLinkedIn(val)) {
      setLiError("Use format: linkedin.com/in/your-username");
    } else {
      setLiError("");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { setLocStatus("denied"); return; }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      () => setLocStatus("found"),
      () => setLocStatus("denied"),
      { timeout: 6000 }
    );
  };

  const switchToOwn = () => {
    setMode("own");
    setProfile({ ...BLANK_PROFILE });
    setSuggested([]);
    setResumeFile("");
  };

  const canMatch = profile.states.length > 0 && (profile.skills.length > 0 || (profile.customSkills||[]).length > 0);

  // ── Demo snapshot panel ──
  if (mode === "demo") {
    return (
      <div>
        <div style={{ background:"var(--color-background-secondary)", borderRadius:12, border:"1px solid var(--color-border-tertiary)", padding:"1.25rem", marginBottom:"1.25rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:11, fontWeight:600, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:"0.07em" }}>Sample profile</span>
              <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"#FAEEDA", color:"#633806", fontWeight:500 }}>demonstration only — not a real person</span>
            </div>
          </div>

          <div style={{ marginBottom:8 }}>
            <p style={{ margin:"0 0 1px", fontSize:14, fontWeight:600, color:"var(--color-text-primary)" }}>{profile.title}</p>
            <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)" }}>{profile.experience} years · {profile.states.map(s=>STATE_META[s]?.label||s).join(", ")}</p>
          </div>
          <p style={{ margin:"0 0 10px", fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.65, fontStyle:"italic" }}>{profile.summary}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {profile.skills.map(sk => (
              <span key={sk} style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:"#E1F5EE", color:"#085041", fontWeight:500 }}>{sk}</span>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"1.25rem" }}>
          <button onClick={onMatch} disabled={loading}
            style={{ padding:"13px 0", borderRadius:10, border:"none",
              background:"#1D9E75", color:"#fff", fontSize:14, fontWeight:700,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            See sample results →
          </button>
          <button onClick={switchToOwn}
            style={{ padding:"13px 0", borderRadius:10, border:"2px solid #1D9E75",
              background:"transparent", color:"#1D9E75", fontSize:14, fontWeight:700, cursor:"pointer" }}>
            Load my profile →
          </button>
        </div>
        <p style={{ margin:0, fontSize:11, color:"var(--color-text-secondary)", textAlign:"center" }}>
          The sample shows how the matching engine works. Your own profile stays in your browser only — nothing is stored or transmitted.
        </p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Own profile form ──
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
        <div>
          <p style={{ margin:"0 0 2px", fontSize:14, fontWeight:600, color:"var(--color-text-primary)" }}>Build your profile</p>
          <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)" }}>Your data stays in your browser. Nothing is stored or transmitted.</p>
        </div>
        <button onClick={() => { setMode("demo"); setProfile(DEMO_PROFILE); }}
          style={{ fontSize:12, color:"var(--color-text-secondary)", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>
          View sample instead
        </button>
      </div>

      {/* ── Name + Title ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <div>
          <label style={lbl}>Full name</label>
          <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}
            placeholder="Your name" style={inp}/>
        </div>
        <div>
          <label style={lbl}>Professional title</label>
          <input value={profile.title} onChange={e=>setProfile(p=>({...p,title:e.target.value}))}
            placeholder="e.g. Health IT Consultant" style={inp}/>
        </div>
      </div>

      {/* ── Resume upload ── */}
      <div style={{ marginBottom:10 }}>
        <label style={lbl}>Resume <span style={{ fontWeight:400, color:"var(--color-text-secondary)" }}>(optional — .txt or .pdf for skill suggestions)</span></label>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={()=>fileRef.current?.click()}
            style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid var(--color-border-secondary)", background:"var(--color-background-secondary)", color:"var(--color-text-primary)", cursor:"pointer", fontSize:12, fontWeight:500 }}>
            {resumeFile ? "Change file" : "Upload resume"}
          </button>
          {resumeFile && <span style={{ fontSize:12, color:"#1D9E75", fontWeight:500 }}>✓ {resumeFile}</span>}
          <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display:"none" }}/>
        </div>
        {suggested.length > 0 && (
          <div style={{ marginTop:8, background:"#E1F5EE", borderRadius:8, padding:"8px 12px" }}>
            <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:600, color:"#085041" }}>Skills detected in your resume — tap to add:</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {suggested.filter(s=>!profile.skills.includes(s)).map(sk=>(
                <button key={sk} onClick={()=>toggle(sk)}
                  style={{ fontSize:11, padding:"2px 9px", borderRadius:20, border:"1px solid #1D9E75", background:"transparent", color:"#085041", cursor:"pointer" }}>
                  + {sk}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── LinkedIn ── */}
      <div style={{ marginBottom:10 }}>
        <label style={lbl}>LinkedIn profile URL <span style={{ fontWeight:400, color:"var(--color-text-secondary)" }}>(optional)</span></label>
        <input value={profile.linkedIn||""} onChange={e=>handleLinkedIn(e.target.value)}
          placeholder="linkedin.com/in/your-username" style={{ ...inp, borderColor: liError ? "#E24B4A" : undefined }}/>
        {liError && <p style={{ margin:"4px 0 0", fontSize:11, color:"#E24B4A" }}>{liError}</p>}
        {profile.linkedIn && !liError && (
          <p style={{ margin:"4px 0 0", fontSize:11, color:"#1D9E75" }}>✓ Valid LinkedIn URL</p>
        )}
      </div>

      {/* ── Summary ── */}
      <div style={{ marginBottom:12 }}>
        <label style={lbl}>Professional background <span style={{ fontWeight:400, color:"var(--color-text-secondary)" }}>(optional — helps personalize your letter)</span></label>
        <textarea value={profile.summary||""} onChange={e=>setProfile(p=>({...p,summary:e.target.value}))} rows={3}
          placeholder="Brief summary of your experience and areas of focus…"
          style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"1px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-primary)", color:"var(--color-text-primary)", resize:"vertical", boxSizing:"border-box", lineHeight:1.6 }}/>
      </div>

      {/* ── Location / States ── */}
      <div style={{ marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:6 }}>
          <label style={{ ...lbl, margin:0 }}>
            States to search <span style={{ fontWeight:400 }}>({profile.states.length} selected)</span>
          </label>
          <button onClick={handleUseMyLocation}
            style={{ fontSize:11, padding:"4px 10px", borderRadius:20, border:"1px solid var(--color-border-secondary)", background:"var(--color-background-secondary)", color:"var(--color-text-secondary)", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
            {locStatus === "loading" ? "Locating…" : locStatus === "found" ? "✓ Location used — select your state" : locStatus === "denied" ? "Location unavailable" : "📍 Use my location"}
          </button>
        </div>
        {locStatus === "found" && (
          <p style={{ margin:"0 0 6px", fontSize:11, color:"#1D9E75" }}>Location detected — select your home state below to prioritize nearby boards.</p>
        )}
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

      {/* ── Skills ── */}
      <div style={{ marginBottom:12 }}>
        <label style={{ ...lbl, marginBottom:6, display:"block" }}>
          Skills & expertise <span style={{ fontWeight:400 }}>({profile.skills.length + (profile.customSkills||[]).length} selected)</span>
        </label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
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

        {/* Custom skill input */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <input value={customInput} onChange={e=>setCustomInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addCustomSkill()}
            placeholder="Add your own expertise (press Enter)"
            style={{ flex:1, padding:"7px 10px", borderRadius:8, border:"1px solid var(--color-border-secondary)", fontSize:12, background:"var(--color-background-primary)", color:"var(--color-text-primary)" }}/>
          <button onClick={addCustomSkill}
            style={{ padding:"7px 12px", borderRadius:8, border:"1px solid #1D9E75", background:"transparent", color:"#1D9E75", cursor:"pointer", fontSize:12, fontWeight:600 }}>
            Add
          </button>
        </div>
        {(profile.customSkills||[]).length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:6 }}>
            {profile.customSkills.map(sk => (
              <span key={sk} style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:"#EEEDFE", color:"#3C3489", fontWeight:500, display:"flex", alignItems:"center", gap:4 }}>
                {sk}
                <button onClick={()=>removeCustom(sk)} style={{ border:"none", background:"none", cursor:"pointer", color:"#3C3489", fontSize:12, padding:0, lineHeight:1 }}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button onClick={onMatch} disabled={loading||!canMatch}
        style={{ width:"100%", padding:"13px 0", borderRadius:10, border:"none",
          background:canMatch?"#1D9E75":"var(--color-background-secondary)",
          color:canMatch?"#fff":"var(--color-text-secondary)", fontSize:14, fontWeight:700,
          cursor:canMatch?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}>
        {loading
          ? <><span style={{ width:14, height:14, border:"2px solid #aaa", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>Analyzing your profile…</>
          : !canMatch ? "Select at least one state and one skill to continue" : "Find My Board Matches →"}
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Shared input styles ───────────────────────────────────────────────────────
const lbl = { fontSize:11, color:"var(--color-text-secondary)", display:"block", marginBottom:4, fontWeight:500 };
const inp = { width:"100%", padding:"8px 10px", borderRadius:8, border:"1px solid var(--color-border-secondary)", fontSize:13, background:"var(--color-background-primary)", color:"var(--color-text-primary)", boxSizing:"border-box" };

// ─── Loading step ──────────────────────────────────────────────────────────────
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

// ─── Results step ──────────────────────────────────────────────────────────────
function ResultsStep({ matches, boards, onLetter, onBack }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
        <div>
          <p style={{ margin:"0 0 2px", fontSize:16, fontWeight:700, color:"var(--color-text-primary)" }}>{matches.length} boards matched to your profile</p>
          <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)" }}>Ranked by alignment · Select any to generate a letter of interest</p>
        </div>
        <BackBtn onClick={onBack} label="Edit profile" />
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

// ─── Letter step ───────────────────────────────────────────────────────────────
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
          <BackBtn onClick={onBack} label="All matches" />
          <button onClick={() => { navigator.clipboard?.writeText(`${today}\n\n${letter}`); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
            style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${copied?"#1D9E75":"var(--color-border-secondary)"}`, background:copied?"#E1F5EE":"transparent", color:copied?"#085041":"var(--color-text-primary)", cursor:"pointer", fontSize:13, fontWeight:500 }}>
            {copied?"Copied!":"Copy letter"}
          </button>
        </div>
      </div>

      <div style={{ background:"var(--color-background-primary)", border:"1px solid var(--color-border-tertiary)", borderRadius:12, padding:"2rem 2.5rem", maxWidth:680, margin:"0 auto" }}>
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
    setTimeout(() => {
      const text = buildLetter(board, match, profile);
      setLetter(text);
      setLoading(false);
    }, 800);
  }, [profile]);

  const handleGoTo = (targetStep) => {
    if (targetStep < step) setStep(targetStep);
  };

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

      <StepBar step={step} onGoTo={handleGoTo}/>

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
