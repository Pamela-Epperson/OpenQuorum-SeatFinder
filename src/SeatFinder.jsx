// @ts-nocheck
import { useState, useCallback, useRef } from "react";
import { BOARDS, STATE_META, LIVE_STATES, REQUEST_STATE_CONTACT } from "./states.config";

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
        : `Apply via ${STATE_META[board.state]?.applyAuthority || `${stateName}'s appointments portal`} — timelines vary by state.`,
      urgency: `${board.vacantSeats} seat${board.vacantSeats !== 1 ? "s" : ""} currently open`,
    };
  });
  return results.filter(r => r.fitScore >= 63).sort((a, b) => b.fitScore - a.fitScore).slice(0, 7);
}

// ─── Letter generator ──────────────────────────────────────────────────────────
// Single template contract used for EVERY board and state:
//   date (added at render) · addressed to applyAuthority + board ·
//   ¶1 interest + credibility · ¶2 specific experience → mandate mapping ·
//   ¶3 value + commitment + request · professional close with name + title.
// Board mandate and applyAuthority are pulled dynamically from states.config.js.
// The letter must render with NO unfilled placeholder brackets — LetterStep
// collects name/title before enabling Copy/Download.
function buildLetter(board, match, profile) {
  const stateName = STATE_META[board.state]?.label || board.state;
  const authority = board.applyAuthority || STATE_META[board.state]?.applyAuthority || `${stateName} appointments office`;
  const allSkills = [...(profile.skills || []), ...(profile.customSkills || [])];
  const topSkills = allSkills.slice(0, 3).join(", ");
  const clean = s => (s || "").replace(/^Your /i, "").replace(/\.$/, "");
  const r1 = clean(match?.reasons?.[0]);
  const r2 = match?.reasons?.[1] ? clean(match.reasons[1]) : "";
  const summaryText  = (profile.summary || "").trim();
  const summaryFirst = summaryText ? summaryText.split(".")[0].trim() : "";
  const displayName  = (profile.name || "").trim();
  const displayTitle = (profile.title || "").trim();
  const yearsPhrase  = profile.experience ? `${profile.experience} years` : "many years";

  // ¶1 — interest + credibility (leads with who the person is)
  const p1 = summaryFirst
    ? `${summaryFirst}. That background is what brings me to the ${board.name} in ${stateName}: a body whose work on behalf of ${board.constituent || "the people it serves"} reflects the kind of public responsibility I have built my career around, and a seat I am formally seeking appointment to.`
    : `I am ${displayTitle ? `a ${displayTitle}` : "a public sector professional"} with ${yearsPhrase} of experience in ${topSkills || "public service"}, and I am formally seeking appointment to the ${board.name} in ${stateName} — a body whose work on behalf of ${board.constituent || "the people it serves"} reflects the kind of public responsibility I have built my career around.`;

  // ¶2 — specific experience mapped to the board's mandate
  const mandateClause = board.mandate ? board.mandate.replace(/\.$/, "") : `its ${board.domain} mandate`;
  const p2 = `This board's mandate — ${mandateClause.charAt(0).toLowerCase()}${mandateClause.slice(1)} — maps directly onto my experience. My ${r1 || `background in ${topSkills || "program leadership"}`}${r2 ? `, together with my ${r2.toLowerCase()},` : ""} positions me to contribute from the first meeting rather than after a long ramp-up. I understand the difference between credentialing and contributing, and I am prepared to do the latter.`;

  // ¶3 — value + commitment + request
  const p3 = `Board service is a working commitment: preparing for meetings, engaging substantively with the issues, and representing ${board.constituent || "constituents"} in every decision. I would bring that commitment to this seat, and I respectfully request consideration for appointment. I am glad to provide a resume, references, or any additional materials the ${authority} requires.`;

  return `Dear ${authority} and Members of the ${board.name},

${p1}

${p2}

${p3}

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

  // Live states only — scaffolded states have no verified board data yet
  const availableStates = LIVE_STATES;

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
          <label htmlFor="sf-name" style={lbl}>Full name</label>
          <input id="sf-name" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}
            placeholder="Your name" style={inp}/>
        </div>
        <div>
          <label htmlFor="sf-title" style={lbl}>Professional title</label>
          <input id="sf-title" value={profile.title} onChange={e=>setProfile(p=>({...p,title:e.target.value}))}
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
        <label htmlFor="sf-linkedin" style={lbl}>LinkedIn profile URL <span style={{ fontWeight:400, color:"var(--color-text-secondary)" }}>(optional)</span></label>
        <input id="sf-linkedin" value={profile.linkedIn||""} onChange={e=>handleLinkedIn(e.target.value)}
          placeholder="linkedin.com/in/your-username"
          aria-describedby={liError ? "sf-linkedin-error" : undefined}
          aria-invalid={liError ? "true" : undefined}
          style={{ ...inp, borderColor: liError ? "#E24B4A" : undefined }}/>
        {liError && <p id="sf-linkedin-error" role="alert" style={{ margin:"4px 0 0", fontSize:11, color:"#E24B4A" }}>{liError}</p>}
        {profile.linkedIn && !liError && (
          <p style={{ margin:"4px 0 0", fontSize:11, color:"#1D9E75" }}>✓ Valid LinkedIn URL</p>
        )}
      </div>

      {/* ── Summary ── */}
      <div style={{ marginBottom:12 }}>
        <label htmlFor="sf-summary" style={lbl}>Professional background <span style={{ fontWeight:400, color:"var(--color-text-secondary)" }}>(optional — helps personalize your letter)</span></label>
        <textarea id="sf-summary" value={profile.summary||""} onChange={e=>setProfile(p=>({...p,summary:e.target.value}))} rows={3}
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
        <p style={{ margin:"8px 0 0", fontSize:11, color:"var(--color-text-secondary)" }}>
          All 50 states + DC are being brought online with verified data.{" "}
          <a href={REQUEST_STATE_CONTACT} style={{ color:"#1D9E75", fontWeight:500 }}>Request priority for your state →</a>
        </p>
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
          <label htmlFor="sf-custom-skill" style={{ position:"absolute", width:1, height:1, padding:0, margin:-1, overflow:"hidden", clip:"rect(0,0,0,0)", whiteSpace:"nowrap" }}>Add a custom expertise</label>
          <input id="sf-custom-skill" value={customInput} onChange={e=>setCustomInput(e.target.value)}
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
                      Apply via {board.applyAuthority || stateMeta.applyAuthority || "state portal"} ↗
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
// Renders the standardized LoI. Nothing here is persisted — profile, letter,
// and any edits live in React state only and vanish on refresh (in-session only).
function LetterStep({ board, match, profile, setProfile, onBack }) {
  const [copied,          setCopied]          = useState(false);
  const [downloaded,      setDownloaded]      = useState(false);
  const [reviewed,        setReviewed]        = useState(false);
  const [showDisclosure,  setShowDisclosure]  = useState(false);
  const today = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});

  const nameMissing  = !(profile.name || "").trim();
  const titleMissing = !(profile.title || "").trim();
  const identityComplete = !nameMissing && !titleMissing;

  // Letter regenerates live as name/title are completed — no placeholder brackets ever ship
  const letter = buildLetter(board, match, profile);
  const copyText = `${today}\n\n${letter}`;

  const doCopy = () => {
    navigator.clipboard?.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const doDownload = () => {
    const stateName = STATE_META[board.state]?.label || board.state;
    const fname = `Letter-of-Interest_${(board.name||"board").replace(/[^\w]+/g,"-").slice(0,60)}_${stateName.replace(/\s+/g,"-")}.txt`;
    const blob = new Blob([copyText], { type:"text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fname;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
        <div>
          <p style={{ margin:"0 0 2px", fontSize:15, fontWeight:700, color:"var(--color-text-primary)" }}>Letter of Interest</p>
          <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)" }}>{board?.name}</p>
        </div>
        <BackBtn onClick={onBack} label="All matches" />
      </div>

      {/* ── DRAFT warning ── */}
      <div style={{ background:"#FEF3CD", border:"1.5px solid #EF9F27", borderRadius:10, padding:"12px 16px", marginBottom:"1rem" }}>
        <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:"#633806" }}>⚠ DRAFT — AI-Generated · Not ready to send</p>
        <p style={{ margin:0, fontSize:12, color:"#633806", lineHeight:1.6 }}>
          Read every sentence before using this letter. Correct inaccuracies. Replace any phrase that doesn't sound like you. You are responsible for what you submit — this is a starting point, not a finished product.
        </p>
      </div>

      {/* ── Complete your signature (required — no placeholder brackets ever ship) ── */}
      {!identityComplete && (
        <div style={{ maxWidth:680, margin:"0 auto 1rem", background:"#FEF3CD", border:"1.5px solid #EF9F27", borderRadius:10, padding:"12px 16px" }}>
          <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:600, color:"#633806" }}>Add your name and title to complete the letter's signature:</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <label htmlFor="ls-name" style={{ fontSize:11, color:"#633806", display:"block", marginBottom:3, fontWeight:500 }}>Full name</label>
              <input id="ls-name" value={profile.name||""} onChange={e=>setProfile(p=>({...p,name:e.target.value,isDemo:false}))}
                placeholder="Your name" style={{ width:"100%", padding:"7px 10px", borderRadius:8, border:"1px solid #EF9F27", fontSize:13, boxSizing:"border-box" }}/>
            </div>
            <div>
              <label htmlFor="ls-title" style={{ fontSize:11, color:"#633806", display:"block", marginBottom:3, fontWeight:500 }}>Professional title</label>
              <input id="ls-title" value={profile.title||""} onChange={e=>setProfile(p=>({...p,title:e.target.value}))}
                placeholder="e.g. Health IT Consultant" style={{ width:"100%", padding:"7px 10px", borderRadius:8, border:"1px solid #EF9F27", fontSize:13, boxSizing:"border-box" }}/>
            </div>
          </div>
        </div>
      )}

      {/* ── Letter body ── */}
      <div style={{ background:"var(--color-background-primary)", border:"1px solid var(--color-border-tertiary)", borderRadius:12, padding:"2rem 2.5rem", maxWidth:680, margin:"0 auto 1rem" }}>
        <p style={{ margin:"0 0 1.5rem", fontSize:13, color:"var(--color-text-secondary)" }}>{today}</p>
        <div style={{ whiteSpace:"pre-wrap", fontSize:13, color:"var(--color-text-primary)", lineHeight:1.85, fontFamily:"Georgia, serif" }}>
          {letter}
        </div>
      </div>

      {/* ── Personalize-this note — makes the letter reusable across seats ── */}
      <div style={{ maxWidth:680, margin:"0 auto 1rem", background:"#E1F5EE", border:"1px solid #9FE1CB", borderRadius:10, padding:"12px 16px" }}>
        <p style={{ margin:"0 0 5px", fontSize:12, fontWeight:600, color:"#085041" }}>✏️ Personalize this — and reuse it</p>
        <p style={{ margin:0, fontSize:12, color:"#085041", lineHeight:1.65 }}>
          Paragraph 1 is your story, paragraph 2 maps your experience to <em>this board's</em> mandate,
          paragraph 3 is your commitment. To reuse this letter for another seat, keep paragraphs 1 and 3
          and rewrite the mandate sentence in paragraph 2 for the new board — SeatFinder fills the correct
          board name, mandate, and appointing authority automatically for every seat you select.
        </p>
      </div>

      {/* ── Application packet note ── */}
      <div style={{ maxWidth:680, margin:"0 auto 1rem", background:"var(--color-background-secondary)", border:"1px solid var(--color-border-tertiary)", borderRadius:10, padding:"12px 16px" }}>
        <p style={{ margin:"0 0 5px", fontSize:12, fontWeight:600, color:"var(--color-text-primary)" }}>📋 This letter is one part of your application packet</p>
        <p style={{ margin:0, fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.65 }}>
          Most board appointments also require a <strong>resume or CV</strong>, a <strong>short bio</strong>, and the state's <strong>official application form</strong> from the appointing authority. Review the application portal before submitting.
        </p>
      </div>

      {/* ── Review gate (checkbox) ── */}
      <div style={{ maxWidth:680, margin:"0 auto 1rem", padding:"12px 16px", border:`1.5px solid ${reviewed?"#1D9E75":"var(--color-border-secondary)"}`, borderRadius:10, background:reviewed?"#E1F5EE":"var(--color-background-secondary)", transition:"all 0.2s" }}>
        <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
          <input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}
            style={{ marginTop:3, width:15, height:15, cursor:"pointer", accentColor:"#1D9E75", flexShrink:0 }}/>
          <span style={{ fontSize:13, color:"var(--color-text-primary)", lineHeight:1.5 }}>
            I've read this letter in full, corrected any inaccuracies, and it accurately represents me and my qualifications.
          </span>
        </label>
      </div>

      {/* ── Action buttons — gated on review + completed signature ── */}
      {(() => { const ready = reviewed && identityComplete; return (
      <div style={{ maxWidth:680, margin:"0 auto 1.25rem", display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <button onClick={doCopy} disabled={!ready}
          style={{ padding:"9px 20px", borderRadius:8, border:"none",
            background:ready?(copied?"#E1F5EE":"#1D9E75"):"var(--color-background-secondary)",
            color:ready?(copied?"#085041":"#fff"):"var(--color-text-secondary)",
            cursor:ready?"pointer":"not-allowed", fontSize:13, fontWeight:600, transition:"all 0.2s" }}>
          {copied ? "✓ Copied!" : "Copy letter"}
        </button>
        <button onClick={doDownload} disabled={!ready}
          style={{ padding:"9px 20px", borderRadius:8,
            border:`1.5px solid ${ready?"#1D9E75":"var(--color-border-tertiary)"}`,
            background:downloaded?"#E1F5EE":"transparent",
            color:ready?(downloaded?"#085041":"#1D9E75"):"var(--color-text-secondary)",
            cursor:ready?"pointer":"not-allowed", fontSize:13, fontWeight:600, transition:"all 0.2s" }}>
          {downloaded ? "✓ Downloaded" : "Download .txt"}
        </button>
        <a href={board?.applyUrl} target={ready?"_blank":undefined} rel="noreferrer"
          onClick={e=>{ if(!ready) e.preventDefault(); }}
          aria-label={`Apply via ${board?.applyAuthority || STATE_META[board?.state]?.applyAuthority || "the state appointments office"}`}
          style={{ padding:"9px 20px", borderRadius:8, background:ready?"transparent":"var(--color-background-secondary)",
            color:ready?"var(--color-text-primary)":"var(--color-text-secondary)", fontSize:13, fontWeight:500,
            textDecoration:"none", border:`1.5px solid ${ready?"var(--color-border-secondary)":"var(--color-border-tertiary)"}`,
            cursor:ready?"pointer":"not-allowed", opacity:ready?1:0.5, transition:"all 0.2s" }}>
          Apply via {board?.applyAuthority || STATE_META[board?.state]?.applyAuthority || "state portal"} ↗
        </a>
        {!ready && (
          <span style={{ fontSize:11, color:"var(--color-text-secondary)", fontStyle:"italic" }}>
            {identityComplete ? "Check the box above to enable" : "Add your name and title, then check the box above"}
          </span>
        )}
      </div>
      ); })()}

      {/* ── AI / methodology disclosure ── */}
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <button onClick={()=>setShowDisclosure(d=>!d)}
          style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:"var(--color-text-secondary)", padding:0, display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ fontSize:9 }}>{showDisclosure?"▾":"▸"}</span> How was this letter generated?
        </button>
        {showDisclosure && (
          <div style={{ marginTop:8, padding:"12px 14px", borderRadius:8, background:"var(--color-background-secondary)", border:"1px solid var(--color-border-tertiary)", fontSize:11, color:"var(--color-text-secondary)", lineHeight:1.75 }}>
            <p style={{ margin:"0 0 5px", fontWeight:600, color:"var(--color-text-primary)", fontSize:12 }}>Generated on your device · No data transmitted</p>
            <p style={{ margin:"0 0 4px" }}>This letter was built by a template engine running entirely in your browser. No external AI API was called and no data left your device.</p>
            <p style={{ margin:"0 0 4px" }}><strong>Inputs used:</strong> your professional title, summary text, selected skills, and this board's official mandate and requirements (sourced from {STATE_META[board?.state]?.dataSource || "the state appointments portal"}).</p>
            <p style={{ margin:0 }}><strong>Limitation:</strong> the engine cannot verify the accuracy of your self-reported information. Read carefully and correct anything that doesn't reflect your actual experience before submitting.</p>
          </div>
        )}
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
    // Letter itself is generated live inside LetterStep (in-session only)
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleGoTo = (targetStep) => {
    if (targetStep < step) setStep(targetStep);
  };

  return (
    <div style={{ fontFamily:"system-ui,-apple-system,sans-serif", maxWidth:760, margin:"0 auto", padding:"0 0 3rem", color:"var(--color-text-primary)" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*:focus-visible{outline:2px solid #1D9E75;outline-offset:2px;}@media(prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}}`}</style>

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
          : selectedBoard && (
              <LetterStep
                board={selectedBoard}
                match={selectedMatch}
                profile={profile}
                setProfile={setProfile}
                onBack={()=>setStep(2)}
              />
            )
      )}
    </div>
  );
}
