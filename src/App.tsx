// @ts-nocheck
import { useState, useCallback, useEffect } from "react";

// ── OpenQuorum: prefill from a CivicQuest Pathways deep-link (?state&board&skills). Inert without params. ──
const OQ_PARAMS = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
const oqStates = () => { const s = OQ_PARAMS.get("state"); return s ? [s] : null; };
const oqSkills = () => { const s = OQ_PARAMS.get("skills"); return s ? s.split(",").map(x => x.trim()).filter(Boolean).filter(x => SKILL_OPTIONS.includes(x)) : null; };
const oqSummary = () => { const b = OQ_PARAMS.get("board"); return b ? ("Interested in the " + b + " (via CivicQuest Pathways).") : null; };

// ─── Board data (embedded — self-contained) ────────────────────────────────────
const BOARDS = [
  // MARYLAND
  {id:1, state:"MD",name:"Maryland Health Care Commission",domain:"health",mandate:"Regulates health care facilities, produces statewide health data analytics, oversees Maryland's all-payer model, and guides health information exchange policy and interoperability.",requires:["Health IT","Data analytics","Health policy","Interoperability","Federal health programs"],seats:4,totalSeats:19,applyUrl:"https://govappointments.maryland.gov",confirmation:true},
  {id:2, state:"MD",name:"Commission on Public Health — Data & IT Workgroup",domain:"health",mandate:"Modernizes Maryland's public health data infrastructure. Oversees statewide health data reporting systems, IT governance, and digital transformation of public health programs.",requires:["Health IT","Data governance","Public health informatics","Federal health systems","AI/technology strategy"],seats:6,totalSeats:22,applyUrl:"https://mdhappointments.health.maryland.gov/BoardAppointments",confirmation:false},
  {id:3, state:"MD",name:"Governor's AI Subcabinet Advisory Pathway",domain:"health",mandate:"Advises Maryland's AI Governance initiative. Shapes state AI policy, enterprise AI adoption standards, and responsible AI frameworks across all state agencies.",requires:["AI policy & governance","Federal technology leadership","Health IT","Organizational transformation","Strategic advisory"],seats:3,totalSeats:12,applyUrl:"https://ai.maryland.gov",confirmation:false},
  {id:4, state:"MD",name:"Opioid Response Advisory Council",domain:"health",mandate:"Advises the Governor on Maryland's opioid and substance use disorder response strategy. Oversees grant-funded programs and data-informed intervention models.",requires:["Public health","Grant management","Data analysis","Federal health programs","Program strategy"],seats:4,totalSeats:16,applyUrl:"https://govappointments.maryland.gov",confirmation:false},
  {id:5, state:"MD",name:"State Interagency Council on Homelessness",domain:"housing",mandate:"Coordinates state strategy on homelessness. Oversees federal McKinney-Vento funding, data systems (HMIS), and cross-agency program alignment.",requires:["Federal grants","Data systems","Interagency coordination","Program management","Policy"],seats:5,totalSeats:18,applyUrl:"https://govappointments.maryland.gov",confirmation:false},
  {id:6, state:"MD",name:"Criminal Justice Information Advisory Board",domain:"justice",mandate:"Oversees Maryland's criminal justice data infrastructure, interoperability standards, and privacy policy for statewide information sharing systems.",requires:["Data governance","Interoperability","Information systems","Federal programs","Policy"],seats:3,totalSeats:16,applyUrl:"https://govappointments.maryland.gov",confirmation:false},
  {id:7, state:"MD",name:"Governor's Commission on Education Excellence",domain:"education",mandate:"Advises on K-12 education strategy, workforce pipeline, and technology-enabled learning initiatives for Maryland students.",requires:["Education policy","Program strategy","Technology","Leadership","Research"],seats:4,totalSeats:15,applyUrl:"https://govappointments.maryland.gov",confirmation:false},
  {id:8, state:"MD",name:"Affordable Housing Trust Fund Committee",domain:"housing",mandate:"Oversees Maryland's affordable housing grant programs. Reviews applications, sets funding priorities, and ensures federal compliance.",requires:["Grant management","Federal compliance","Program evaluation","Policy","Finance"],seats:3,totalSeats:13,applyUrl:"https://govappointments.maryland.gov",confirmation:false},
  // VIRGINIA
  {id:301,state:"VA",name:"Virginia Health Information Technology Advisory Commission",domain:"health",mandate:"Advises the Governor on health information technology policy, interoperability standards, and digital health infrastructure across Virginia's healthcare ecosystem.",requires:["Health IT","Data interoperability","Health policy","Federal health programs","Technology strategy"],seats:5,totalSeats:16,applyUrl:"https://www.commonwealth.virginia.gov/va-government/boards-and-commissions/",confirmation:false},
  {id:302,state:"VA",name:"Virginia Board for People with Disabilities",domain:"disability",mandate:"Advises state government on policies, programs, and services for Virginians with disabilities. Oversees federal Developmental Disabilities Act requirements.",requires:["Disability policy","Advocacy","Federal programs","Program evaluation","ADA compliance"],seats:6,totalSeats:21,applyUrl:"https://www.commonwealth.virginia.gov/va-government/boards-and-commissions/",confirmation:false},
  {id:303,state:"VA",name:"Virginia Opioid Abatement Authority",domain:"health",mandate:"Administers Virginia's opioid settlement funds. Sets funding priorities and oversees evidence-based programs for substance use disorder.",requires:["Public health","Grant management","Program strategy","Data analysis","Federal health programs"],seats:4,totalSeats:15,applyUrl:"https://www.commonwealth.virginia.gov/va-government/boards-and-commissions/",confirmation:false},
  {id:304,state:"VA",name:"Virginia Board of Education",domain:"education",mandate:"Sets K-12 education policy for 1.2 million Virginia public school students. Establishes academic standards and guides education technology modernization.",requires:["Education policy","Research & analysis","Strategic advisory","Technology","Program strategy"],seats:3,totalSeats:9,applyUrl:"https://www.commonwealth.virginia.gov/va-government/boards-and-commissions/",confirmation:true},
  {id:305,state:"VA",name:"Virginia Criminal Justice Services Advisory Committee",domain:"justice",mandate:"Advises on grant programs, data governance, and evidence-based policy for law enforcement, courts, and corrections across Virginia.",requires:["Data governance","Grant management","Policy","Research & analysis","Federal programs"],seats:5,totalSeats:18,applyUrl:"https://www.commonwealth.virginia.gov/va-government/boards-and-commissions/",confirmation:false},
  // DC
  {id:401,state:"DC",name:"DC Health Information Exchange Policy Board",domain:"health",mandate:"Governs the District's health information exchange infrastructure. Sets data policy, privacy standards, and interoperability requirements for DC's health IT ecosystem.",requires:["Health IT","Data interoperability","Health policy","Privacy policy","Federal health programs"],seats:5,totalSeats:15,applyUrl:"https://mota.dc.gov",confirmation:false},
  {id:402,state:"DC",name:"DC Workforce Investment Council",domain:"education",mandate:"Oversees DC's federal WIOA implementation. Governs workforce development programs, employer engagement, and data systems for job training services.",requires:["Workforce development","Federal compliance","Data systems","Program management","Strategic advisory"],seats:7,totalSeats:22,applyUrl:"https://mota.dc.gov",confirmation:false},
  {id:403,state:"DC",name:"Commission on Persons with Disabilities",domain:"disability",mandate:"Advises DC government on accessibility, disability rights, and inclusion policy. Reviews legislation for disability impact and advocates for ADA enforcement.",requires:["Disability policy","Advocacy","ADA compliance","Policy","Program evaluation"],seats:4,totalSeats:12,applyUrl:"https://mota.dc.gov",confirmation:false},
  // DELAWARE
  {id:501,state:"DE",name:"Delaware Health Information Network Advisory Board",domain:"health",mandate:"Governs Delaware's statewide health information exchange. Sets data policy, interoperability standards, and digital health strategy.",requires:["Health IT","Data interoperability","Health policy","Federal health programs","Technology strategy"],seats:4,totalSeats:14,applyUrl:"https://governor.delaware.gov/boards-and-commissions/",confirmation:false},
  {id:502,state:"DE",name:"Delaware Health Care Commission",domain:"health",mandate:"Oversees Delaware's healthcare system, regulates health care spending, and guides health policy reform and cost containment strategies.",requires:["Health policy","Data analytics","Health IT","Federal health programs","Strategic advisory"],seats:4,totalSeats:16,applyUrl:"https://governor.delaware.gov/boards-and-commissions/",confirmation:false},
  {id:503,state:"DE",name:"Criminal Justice Council",domain:"justice",mandate:"Coordinates Delaware's criminal justice system reform and data governance. Administers federal justice grants and manages statewide criminal justice data systems.",requires:["Data governance","Grant management","Federal programs","Research & analysis","Policy"],seats:5,totalSeats:18,applyUrl:"https://governor.delaware.gov/boards-and-commissions/",confirmation:false},
  // MASSACHUSETTS
  {id:201,state:"MA",name:"Health Information Technology Council",domain:"health",mandate:"Advises the Governor on health IT policy, EHR adoption, and interoperability standards across Massachusetts' healthcare system.",requires:["Health IT","Data interoperability","EHR / Health Informatics","Federal health programs","Technology strategy"],seats:6,totalSeats:18,applyUrl:"https://boards.mass.gov/search",confirmation:false},
  {id:202,state:"MA",name:"Massachusetts Health Policy Commission",domain:"health",mandate:"Independent agency that monitors healthcare cost growth, sets spending benchmarks, and advises on health system transformation.",requires:["Health policy","Data analytics","Research & analysis","Strategic advisory","Federal health programs"],seats:2,totalSeats:11,applyUrl:"https://boards.mass.gov/search",confirmation:true},
  {id:203,state:"MA",name:"Digital Accessibility & Equity Governance Board",domain:"health",mandate:"Implements Governor Healey's EO #614 on digital equity. Governs accessibility standards for state digital services and technology inclusion policy.",requires:["Digital equity","Accessibility","Technology modernization","Policy","Disability policy"],seats:5,totalSeats:15,applyUrl:"https://boards.mass.gov/search",confirmation:false},
  {id:204,state:"MA",name:"MassHealth Care Delivery Advisory Council",domain:"health",mandate:"Advises on MassHealth (Medicaid) program delivery, care coordination models, and health IT systems serving 2.2M enrollees.",requires:["Medicaid policy","Health IT","Program strategy","Data governance","Federal health programs"],seats:5,totalSeats:20,applyUrl:"https://boards.mass.gov/search",confirmation:false},
  // MINNESOTA
  {id:101,state:"MN",name:"Governor's Workforce Development Board",domain:"education",mandate:"Oversees Minnesota's federal WIOA implementation. Manages statewide workforce data systems and federally-required program accountability.",requires:["Federal programs","Workforce development","Data systems","Program management","Federal compliance"],seats:12,totalSeats:40,applyUrl:"https://commissionsandappointments.sos.mn.gov",confirmation:false},
  {id:102,state:"MN",name:"Mental Health Legislative Advisory Council",domain:"health",mandate:"Advises the Minnesota legislature on mental health policy, program funding, and data-informed behavioral health system improvements.",requires:["Health policy","Data analytics","Federal health programs","Program strategy","Advocacy"],seats:11,totalSeats:20,applyUrl:"https://commissionsandappointments.sos.mn.gov",confirmation:false},
  {id:103,state:"MN",name:"Criminal & Juvenile Justice Information Policy Group",domain:"justice",mandate:"Governs Minnesota's criminal and juvenile justice data infrastructure, interoperability standards, and privacy policy.",requires:["Data governance","Information systems","Interoperability","Privacy policy","Federal programs"],seats:7,totalSeats:19,applyUrl:"https://commissionsandappointments.sos.mn.gov",confirmation:false},
  {id:104,state:"MN",name:"State Demographic Center Advisory Committee",domain:"equity",mandate:"Guides Minnesota's official population data collection, equity data strategy, and data product development for state planning.",requires:["Data governance","Research","Equity","Analytics","Policy"],seats:5,totalSeats:11,applyUrl:"https://commissionsandappointments.sos.mn.gov",confirmation:false},
];

const STATES_META = {
  MD:{label:"Maryland",color:"#0F6E56",bg:"#E1F5EE"},
  VA:{label:"Virginia",color:"#185FA5",bg:"#E6F1FB"},
  DC:{label:"Washington DC",color:"#854F0B",bg:"#FAEEDA"},
  DE:{label:"Delaware",color:"#534AB7",bg:"#EEEDFE"},
  MA:{label:"Massachusetts",color:"#993C1D",bg:"#FAECE7"},
  MN:{label:"Minnesota",color:"#3B6D11",bg:"#EAF3DE"},
  PA:{label:"Pennsylvania",color:"#1B3A6B",bg:"#E6EEF8"},
  NY:{label:"New York",color:"#7B1E2E",bg:"#FAEDF0"},
  NC:{label:"North Carolina",color:"#13294B",bg:"#E6EDF5"},
  NJ:{label:"New Jersey",color:"#1C3F6E",bg:"#E6EDF8"},
  GA:{label:"Georgia",color:"#BA0C2F",bg:"#FAEBEE"},
  IL:{label:"Illinois",color:"#003366",bg:"#E5EBF5"},
};

const SKILL_OPTIONS = [
  "Federal Health IT","AI Enablement & Policy","Data Governance","EHR / Health Informatics",
  "NIH / Federal Agencies","Program & Project Management","Knowledge Management",
  "Grant Writing & Business Development","Health Data Interoperability","Organizational Transformation",
  "Public Sector Leadership","Research & Analysis","Health Policy","Strategic Advisory",
  "Technology Modernization","Workforce Development","Education Policy","Disability Policy",
  "Housing Policy","Environmental Policy","Criminal Justice Reform","Equity & Inclusion",
  "Intergovernmental Relations","Community Outreach","Advocacy","Legislative Affairs",
];

const DOMAIN_STYLE = {
  health:    {bg:"#E1F5EE",color:"#085041"},
  education: {bg:"#E6F1FB",color:"#0C447C"},
  equity:    {bg:"#EEEDFE",color:"#3C3489"},
  housing:   {bg:"#FAEEDA",color:"#633806"},
  disability:{bg:"#FBEAF0",color:"#72243E"},
  justice:   {bg:"#FAECE7",color:"#712B13"},
};

const TIER_STYLE = {
  Exceptional:{bar:"#1D9E75",label:"#085041",bg:"#E1F5EE"},
  Strong:     {bar:"#EF9F27",label:"#633806",bg:"#FAEEDA"},
  Good:       {bar:"#7F77DD",label:"#3C3489",bg:"#EEEDFE"},
};

const NAME_TO_CODE = {
  "Maryland":"MD","Virginia":"VA","District of Columbia":"DC","Delaware":"DE",
  "Massachusetts":"MA","Minnesota":"MN","Pennsylvania":"PA","New York":"NY",
  "North Carolina":"NC","New Jersey":"NJ","Georgia":"GA","Illinois":"IL",
};

// Sample profile for demo — no real personal data
const SAMPLE_PROFILE = {
  name:"Jordan Taylor, M.P.H., PMP",
  title:"Federal Health IT Program Manager",
  summary:"12+ years managing federal health IT initiatives, NIH data systems, and public health informatics programs across HHS agencies. Deep expertise in EHR interoperability, data governance, and AI-enabled health transformation. Specializes in bridging policy and technical implementation.",
  states:["MD","VA"],
  skills:["Federal Health IT","Data Governance","EHR / Health Informatics","NIH / Federal Agencies","Program & Project Management","Health Data Interoperability","AI Enablement & Policy","Research & Analysis"],
  experience:"12+",
};

const SAMPLE_MATCHES = [
  {boardId:1,  fitScore:95,fitTier:"Exceptional",headline:"Health data governance and federal IT expertise maps directly onto the Commission's all-payer model oversight and interoperability mandate.",reasons:["Federal HHS experience aligns with the Commission's health data infrastructure oversight role","NIH data systems work directly relevant to statewide health information exchange policy","AI enablement background supports the Commission's digital transformation agenda"],consideration:"Senate confirmation required — January–April window applies",urgency:"4 seats open; one of the highest-leverage health data bodies in the state"},
  {boardId:2,  fitScore:91,fitTier:"Exceptional",headline:"Public health informatics and data modernization experience is exactly what this workgroup was designed to engage.",reasons:["Health IT expertise directly addresses the workgroup's data infrastructure modernization mission","Program management credentials suit the complex multi-agency coordination this body requires","Federal health systems experience provides context for translating federal mandates to state implementation"],consideration:"Involves Secretary-level coordination — beneficial to have federal agency relationships",urgency:"6 seats open — actively recruiting data and IT experts now"},
  {boardId:301,fitScore:86,fitTier:"Strong",headline:"Virginia's health IT advisory role parallels federal interoperability work — strong state-to-state transfer of expertise.",reasons:["Virginia's HIE policy work directly parallels federal ONC and CMS programs you've navigated","Technology strategy experience relevant to statewide digital health infrastructure planning","Program management background suited to multi-stakeholder advisory coordination"],consideration:"New Governor Spanberger administration — fresh appointments being made now",urgency:"Governor is actively filling boards; favorable timing for new applicants"},
  {boardId:201,fitScore:84,fitTier:"Strong",headline:"Massachusetts Health IT Council aligns precisely with EHR interoperability background and federal program expertise.",reasons:["MA's HIE policy work engages same federal standards (FHIR, HL7) as your NIH data systems work","Research analysis skills valuable for health IT policy development","Federal agency experience brings credibility to state-level technology advisory role"],consideration:"Active recruitment underway following recent board restructuring",urgency:"6 seats open — one of the most active health IT bodies in the Northeast"},
];

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})
  });
  return (await res.json()).content?.[0]?.text||"";
}

// ─── Validate LinkedIn URL ─────────────────────────────────────────────────────
function validateLinkedIn(url) {
  if(!url) return true; // optional
  return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_%-]+\/?$/.test(url.trim());
}

// ─── Profile Form Step ─────────────────────────────────────────────────────────
function ProfileStep({onMatch,loading}) {
  const [tab,setTab]=useState("sample"); // "sample" | "yours"
  const [profile,setProfile]=useState({
    name:"", title:"", summary:(oqSummary() || ""), states:(oqStates() || ["MD"]), skills:(oqSkills() || []), otherSkill:"",
    linkedin:"", linkedinValid:true, useLocation:false, experience:""
  });
  const [resumeName,setResumeName]=useState("");
  const [geoState,setGeoState]=useState(null);
  const [geoLoading,setGeoLoading]=useState(false);

  const toggleSkill=sk=>setProfile(p=>({...p,skills:p.skills.includes(sk)?p.skills.filter(s=>s!==sk):[...p.skills,sk]}));
  const toggleState=s=>setProfile(p=>({...p,states:p.states.includes(s)?p.states.filter(x=>x!==s):[...p.states,s]}));

  const handleLinkedIn=e=>{
    const v=e.target.value;
    setProfile(p=>({...p,linkedin:v,linkedinValid:validateLinkedIn(v)}));
  };

  const handleResumeUpload=async e=>{
    const file=e.target.files?.[0];
    if(!file) return;
    setResumeName(file.name);
    // If PDF, could extract text via Claude API — for now just note it's uploaded
  };

  const handleUseLocation=async()=>{
    if(profile.useLocation){
      setProfile(p=>({...p,useLocation:false}));
      return;
    }
    setGeoLoading(true);
    if(!navigator.geolocation){ setGeoLoading(false); return; }
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{
        const res=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,{headers:{"Accept-Language":"en"}});
        const data=await res.json();
        const code=NAME_TO_CODE[data.address?.state];
        if(code&&STATES_META[code]){
          setGeoState(code);
          setProfile(p=>({...p,useLocation:true,states:p.states.includes(code)?p.states:[...p.states,code]}));
        }
      }catch(e){}
      setGeoLoading(false);
    },()=>setGeoLoading(false),{timeout:5000});
  };

  const canSubmit=profile.name.trim()&&profile.skills.length>0&&profile.states.length>0&&profile.linkedinValid;

  const handleSubmit=()=>{
    if(!canSubmit||loading) return;
    const finalSkills=[...profile.skills,...(profile.otherSkill.trim()?[profile.otherSkill.trim()]:[])] ;
    onMatch({...profile,skills:finalSkills});
  };

  return(
    <div>
      {/* Tabs */}
      <div style={{display:"flex",gap:0,marginBottom:"1.25rem",borderBottom:"1px solid var(--color-border-tertiary,#eee)"}}>
        {[["sample","👤 See a sample"],["yours","+ Load your profile"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)}
            style={{padding:"8px 18px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:tab===key?600:400,
              color:tab===key?"#1D9E75":"#888",borderBottom:tab===key?"2px solid #1D9E75":"2px solid transparent",marginBottom:-1}}>
            {label}
          </button>
        ))}
      </div>

      {tab==="sample"&&(
        <div>
          <div style={{background:"var(--color-background-secondary,#f8f8f7)",borderRadius:10,padding:"1rem 1.25rem",marginBottom:"1rem",border:"1px solid var(--color-border-tertiary,#eee)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:11,fontWeight:500,color:"#888",textTransform:"uppercase",letterSpacing:"0.07em"}}>Sample profile</span>
              <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:"#E1F5EE",color:"#085041"}}>demo only · not real data</span>
            </div>
            <p style={{margin:"0 0 3px",fontSize:15,fontWeight:600,color:"#1a1a1a"}}>{SAMPLE_PROFILE.name}</p>
            <p style={{margin:"0 0 10px",fontSize:12,color:"#888"}}>{SAMPLE_PROFILE.title}</p>
            <p style={{margin:"0 0 10px",fontSize:13,color:"#555",lineHeight:1.7}}>{SAMPLE_PROFILE.summary}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {SAMPLE_PROFILE.skills.map(sk=>(
                <span key={sk} style={{fontSize:11,padding:"3px 9px",borderRadius:20,background:"#1D9E75",color:"#fff",fontWeight:500}}>{sk}</span>
              ))}
            </div>
          </div>
          <div style={{marginBottom:"1rem"}}>
            <p style={{margin:"0 0 8px",fontSize:12,color:"#888",fontWeight:500}}>Sample matches for this profile:</p>
            {SAMPLE_MATCHES.map(m=>{
              const board=BOARDS.find(b=>b.id===m.boardId);
              if(!board) return null;
              const ts=TIER_STYLE[m.fitTier]||TIER_STYLE.Good;
              const sm=STATES_META[board.state];
              return(
                <div key={m.boardId} style={{border:"1px solid var(--color-border-tertiary,#eee)",borderLeft:`3px solid ${ts.bar}`,borderRadius:"0 10px 10px 0",padding:"0.85rem 1rem",marginBottom:8,background:"#fff"}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{textAlign:"center",flexShrink:0}}>
                      <div style={{width:44,height:44,borderRadius:"50%",background:`conic-gradient(${ts.bar} ${m.fitScore*3.6}deg, #eee 0deg)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <div style={{width:33,height:33,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <span style={{fontSize:12,fontWeight:700,color:ts.bar}}>{m.fitScore}</span>
                        </div>
                      </div>
                      <span style={{fontSize:9,padding:"1px 5px",borderRadius:20,background:ts.bg,color:ts.label,fontWeight:500,display:"inline-block",marginTop:3}}>{m.fitTier}</span>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:3}}>
                        <span style={{fontSize:12,fontWeight:600,color:"#1a1a1a"}}>{board.name}</span>
                        <span style={{fontSize:10,padding:"1px 6px",borderRadius:20,background:sm?.bg,color:sm?.color,fontWeight:500}}>{sm?.label}</span>
                      </div>
                      <p style={{margin:0,fontSize:12,color:"#666",fontStyle:"italic",lineHeight:1.5}}>"{m.headline}"</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={()=>setTab("yours")}
            style={{width:"100%",padding:"12px 0",borderRadius:10,border:"none",background:"#1D9E75",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            Load my profile and find my matches →
          </button>
        </div>
      )}

      {tab==="yours"&&(
        <div>
          {/* Name + Title */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div>
              <label style={{fontSize:11,color:"#888",display:"block",marginBottom:4}}>Full name + credentials *</label>
              <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}
                placeholder="e.g. Jane Smith, Ph.D., PMP"
                style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #ddd",fontSize:13,boxSizing:"border-box",outline:"none"}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:"#888",display:"block",marginBottom:4}}>Professional title *</label>
              <input value={profile.title} onChange={e=>setProfile(p=>({...p,title:e.target.value}))}
                placeholder="e.g. Health IT Program Manager"
                style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #ddd",fontSize:13,boxSizing:"border-box",outline:"none"}}/>
            </div>
          </div>

          {/* Resume Upload */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:"#888",display:"block",marginBottom:4}}>Résumé (PDF — helps us match your experience)</label>
            <label style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:8,border:"1px dashed #1D9E75",cursor:"pointer",background:"#F0FBF7"}}>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{display:"none"}}/>
              <span style={{fontSize:13,color:"#1D9E75",fontWeight:500}}>{resumeName||"📎 Upload résumé"}</span>
              {resumeName&&<span style={{fontSize:11,color:"#888",marginLeft:"auto"}}>✓ Uploaded</span>}
            </label>
          </div>

          {/* LinkedIn */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:"#888",display:"block",marginBottom:4}}>LinkedIn profile URL (optional)</label>
            <input value={profile.linkedin} onChange={handleLinkedIn}
              placeholder="https://www.linkedin.com/in/yourname"
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${profile.linkedinValid?"#ddd":"#E24B4A"}`,fontSize:13,boxSizing:"border-box",outline:"none"}}/>
            {!profile.linkedinValid&&<p style={{margin:"3px 0 0",fontSize:11,color:"#E24B4A"}}>Please use format: https://www.linkedin.com/in/yourname</p>}
            {profile.linkedinValid&&profile.linkedin&&<p style={{margin:"3px 0 0",fontSize:11,color:"#1D9E75"}}>✓ Valid LinkedIn URL</p>}
          </div>

          {/* Background summary */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:"#888",display:"block",marginBottom:4}}>Professional background (brief summary)</label>
            <textarea value={profile.summary} onChange={e=>setProfile(p=>({...p,summary:e.target.value}))} rows={3}
              placeholder="Describe your experience, focus areas, and the kind of work you do..."
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #ddd",fontSize:13,boxSizing:"border-box",resize:"vertical",lineHeight:1.6,outline:"none"}}/>
          </div>

          {/* Expertise multi-select */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,color:"#888",display:"block",marginBottom:6}}>
              Areas of expertise * <span style={{fontWeight:400}}>({profile.skills.length} selected — select all that apply)</span>
            </label>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
              {SKILL_OPTIONS.map(sk=>(
                <button key={sk} onClick={()=>toggleSkill(sk)}
                  style={{padding:"4px 11px",borderRadius:20,border:`1.5px solid ${profile.skills.includes(sk)?"#1D9E75":"#e0e0e0"}`,
                    background:profile.skills.includes(sk)?"#1D9E75":"transparent",
                    color:profile.skills.includes(sk)?"#fff":"#555",cursor:"pointer",fontSize:11,fontWeight:profile.skills.includes(sk)?500:400,transition:"all 0.12s"}}>
                  {sk}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input value={profile.otherSkill} onChange={e=>setProfile(p=>({...p,otherSkill:e.target.value}))}
                placeholder="Other expertise (type and it will be included)..."
                style={{flex:1,padding:"7px 12px",borderRadius:8,border:"1px solid #ddd",fontSize:12,outline:"none"}}/>
            </div>
          </div>

          {/* States + location */}
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <label style={{fontSize:11,color:"#888"}}>States to search * <span style={{fontWeight:400}}>({profile.states.length} selected)</span></label>
              <button onClick={handleUseLocation} disabled={geoLoading}
                style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,border:`1px solid ${profile.useLocation?"#1D9E75":"#ddd"}`,
                  background:profile.useLocation?"#E1F5EE":"transparent",color:profile.useLocation?"#0F6E56":"#888",cursor:"pointer",fontSize:11,fontWeight:500}}>
                {geoLoading?<><span style={{width:10,height:10,border:"1.5px solid #aaa",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>Detecting…</>
                  :<>📍 {profile.useLocation?`Using: ${STATES_META[geoState]?.label||"location"}`:geoLoading?"Detecting...":"Use my location"}</>}
              </button>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {Object.entries(STATES_META).map(([code,s])=>(
                <button key={code} onClick={()=>toggleState(code)}
                  style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${profile.states.includes(code)?s.color:"#e0e0e0"}`,
                    background:profile.states.includes(code)?s.bg:"transparent",color:profile.states.includes(code)?s.color:"#555",
                    cursor:"pointer",fontSize:11,fontWeight:profile.states.includes(code)?500:400}}>
                  {code}
                  {geoState===code&&profile.useLocation&&<span style={{fontSize:9,marginLeft:3}}>📍</span>}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit||loading}
            style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",
              background:canSubmit&&!loading?"#1D9E75":"#ddd",color:canSubmit&&!loading?"#fff":"#aaa",
              fontSize:14,fontWeight:700,cursor:canSubmit&&!loading?"pointer":"not-allowed",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {loading?<><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.5)",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>Finding your matches…</>:"Find My Board Matches →"}
          </button>

          {!canSubmit&&<p style={{margin:"6px 0 0",fontSize:11,color:"#aaa",textAlign:"center"}}>
            {!profile.name.trim()?"Enter your name · ":""}{profile.skills.length===0?"Select at least one expertise area · ":""}{profile.states.length===0?"Select at least one state":""}
          </p>}
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
    </div>
  );
}

// ─── Loading Step ──────────────────────────────────────────────────────────────
function LoadingStep() {
  const msgs=["Analyzing your professional background…","Scanning board mandates across all states…","Evaluating fit against open seats…","Ranking matches by alignment strength…","Preparing your personalized results…"];
  const [idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%msgs.length),1500);return()=>clearInterval(t);},[]);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3rem 1rem",gap:20}}>
      <div style={{position:"relative",width:60,height:60}}>
        <div style={{position:"absolute",inset:0,border:"3px solid #eee",borderTopColor:"#1D9E75",borderRadius:"50%",animation:"spin 0.9s linear infinite"}}/>
        <div style={{position:"absolute",inset:8,border:"2px solid #eee",borderBottomColor:"#EF9F27",borderRadius:"50%",animation:"spin 1.3s linear infinite reverse"}}/>
      </div>
      <div style={{textAlign:"center"}}>
        <p style={{margin:"0 0 6px",fontSize:15,fontWeight:600,color:"#1a1a1a"}}>Claude is analyzing your profile</p>
        <p style={{margin:0,fontSize:13,color:"#888",minHeight:20}}>{msgs[idx]}</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── Results Step ──────────────────────────────────────────────────────────────
function ResultsStep({matches,onLetter,onBack}) {
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",gap:8,flexWrap:"wrap"}}>
        <div>
          <p style={{margin:"0 0 2px",fontSize:16,fontWeight:700,color:"#1a1a1a"}}>{matches.length} boards matched</p>
          <p style={{margin:0,fontSize:12,color:"#888"}}>Ranked by fit strength · click any to generate a letter of interest</p>
        </div>
        {/* Back button — always active */}
        <button onClick={onBack} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #ddd",background:"transparent",color:"#555",cursor:"pointer",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:5}}>
          ← Edit profile
        </button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {matches.map((m,i)=>{
          const board=BOARDS.find(b=>b.id===m.boardId);
          if(!board) return null;
          const ts=TIER_STYLE[m.fitTier]||TIER_STYLE.Good;
          const ds=DOMAIN_STYLE[board.domain]||{bg:"#f0f0f0",color:"#555"};
          const sm=STATES_META[board.state];
          return(
            <div key={m.boardId} style={{border:"1px solid #eee",borderLeft:`3px solid ${ts.bar}`,borderRadius:"0 12px 12px 0",padding:"1rem 1.1rem",background:"#fff"}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                {/* Score */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:`conic-gradient(${ts.bar} ${m.fitScore*3.6}deg, #eee 0deg)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:13,fontWeight:700,color:ts.bar}}>{m.fitScore}</span>
                    </div>
                  </div>
                  <span style={{fontSize:9,padding:"2px 6px",borderRadius:20,background:ts.bg,color:ts.label,fontWeight:500}}>{m.fitTier}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#1a1a1a"}}>{board.name}</span>
                    <span style={{fontSize:10,padding:"2px 6px",borderRadius:20,background:sm?.bg,color:sm?.color,fontWeight:600}}>{sm?.label}</span>
                    <span style={{fontSize:10,padding:"2px 6px",borderRadius:20,...ds,fontWeight:500}}>{board.domain}</span>
                    {board.confirmation&&<span style={{fontSize:10,padding:"2px 6px",borderRadius:20,background:"#FAEEDA",color:"#633806"}}>Senate confirm.</span>}
                  </div>
                  <p style={{margin:"0 0 8px",fontSize:12,color:"#666",fontStyle:"italic",lineHeight:1.5}}>"{m.headline}"</p>
                  <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:8}}>
                    {(m.reasons||[]).map((r,j)=>(
                      <div key={j} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                        <span style={{color:ts.bar,fontSize:11,marginTop:2,flexShrink:0}}>✦</span>
                        <span style={{fontSize:12,color:"#1a1a1a",lineHeight:1.5}}>{r}</span>
                      </div>
                    ))}
                  </div>
                  {m.consideration&&<p style={{margin:"0 0 8px",fontSize:12,color:"#888",lineHeight:1.5}}>
                    <span style={{color:"#EF9F27",marginRight:5}}>◈</span><strong>Note:</strong> {m.consideration}
                  </p>}
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <button onClick={()=>onLetter(board,m)}
                      style={{padding:"7px 16px",borderRadius:8,border:"none",background:"#1D9E75",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                      Generate Letter of Interest →
                    </button>
                    <a href={board.applyUrl} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#888",textDecoration:"none"}}>Apply directly ↗</a>
                    <span style={{marginLeft:"auto",fontSize:11,color:ts.bar}}>{board.seats} seat{board.seats!==1?"s":""} open</span>
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

// ─── Letter Step ───────────────────────────────────────────────────────────────
function LetterStep({letter,board,loading,onBack}) {
  const [copied,setCopied]=useState(false);
  const today=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:8}}>
        <div>
          <p style={{margin:"0 0 2px",fontSize:15,fontWeight:700,color:"#1a1a1a"}}>Letter of Interest</p>
          <p style={{margin:0,fontSize:12,color:"#888"}}>{board.name}</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          {/* Back button — always active */}
          <button onClick={onBack} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #ddd",background:"transparent",color:"#555",cursor:"pointer",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:5}}>
            ← All matches
          </button>
          {letter&&!loading&&(
            <button onClick={()=>{navigator.clipboard?.writeText(`${today}\n\n${letter}`);setCopied(true);setTimeout(()=>setCopied(false),2000)}}
              style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${copied?"#1D9E75":"#ddd"}`,background:copied?"#E1F5EE":"transparent",color:copied?"#085041":"#555",cursor:"pointer",fontSize:12,fontWeight:500}}>
              {copied?"Copied!":"Copy letter"}
            </button>
          )}
        </div>
      </div>
      {loading?(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3rem",gap:16}}>
          <div style={{width:40,height:40,border:"3px solid #eee",borderTopColor:"#1D9E75",borderRadius:"50%",animation:"spin 0.9s linear infinite"}}/>
          <p style={{margin:0,fontSize:13,color:"#888"}}>Drafting your letter of interest…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ):(
        <div style={{background:"#fff",border:"1px solid #eee",borderRadius:12,padding:"2rem 2.5rem",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",maxWidth:680,margin:"0 auto"}}>
          <p style={{margin:"0 0 1.5rem",fontSize:13,color:"#888"}}>{today}</p>
          <div style={{whiteSpace:"pre-wrap",fontSize:13,color:"#1a1a1a",lineHeight:1.85,fontFamily:"Georgia,serif"}}>{letter}</div>
          <div style={{marginTop:"2rem",paddingTop:"1rem",borderTop:"1px solid #eee",display:"flex",gap:8,flexWrap:"wrap"}}>
            <a href={board.applyUrl} target="_blank" rel="noreferrer"
              style={{padding:"8px 18px",borderRadius:8,background:"#1D9E75",color:"#fff",fontSize:12,fontWeight:700,textDecoration:"none"}}>Submit application ↗</a>
            <button onClick={()=>{navigator.clipboard?.writeText(`${today}\n\n${letter}`);setCopied(true);setTimeout(()=>setCopied(false),2000)}}
              style={{padding:"8px 18px",borderRadius:8,border:"1px solid #ddd",background:"transparent",color:"#555",cursor:"pointer",fontSize:12,fontWeight:500}}>
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
  const [step,setStep]=useState(0); // 0=profile 1=loading 2=results 3=letter
  const [profile,setProfile]=useState(null);
  const [matches,setMatches]=useState([]);
  const [selectedBoard,setSelectedBoard]=useState(null);
  const [selectedMatch,setSelectedMatch]=useState(null);
  const [letter,setLetter]=useState("");
  const [loading,setLoading]=useState(false);

  // Browser history — enables native back button to navigate between steps
  useEffect(()=>{
    const handlePop=e=>{
      if(e.state?.step!==undefined) setStep(e.state.step);
    };
    window.addEventListener("popstate",handlePop);
    return()=>window.removeEventListener("popstate",handlePop);
  },[]);

  const goToStep=(n,state={})=>{
    window.history.pushState({step:n,...state},"","");
    setStep(n);
  };

  const handleMatch=useCallback(async(prof)=>{
    setProfile(prof);
    setLoading(true);
    goToStep(1);

    const filteredBoards=BOARDS.filter(b=>prof.states.includes(b.state));
    const boardSummary=filteredBoards.map(b=>`ID:${b.id}|${b.state}|${b.name}|domain:${b.domain}|requires:${b.requires.join(",")}|mandate:${b.mandate}`).join("\n");

    const prompt=`You are a civic board placement expert. Match this professional to public board seats and return ONLY raw JSON (no markdown, no backticks, no commentary).

PROFILE:
Name: ${prof.name}
Title: ${prof.title}
Background: ${prof.summary||"Not provided"}
Skills: ${prof.skills.join(", ")}
States: ${prof.states.join(", ")}
${prof.linkedin?`LinkedIn: ${prof.linkedin}`:""}

AVAILABLE BOARDS:
${boardSummary}

Return top 5-7 best matches sorted by fitScore descending:
{"matches":[{"boardId":<number>,"fitScore":<60-99>,"fitTier":"Exceptional"|"Strong"|"Good","headline":"<one compelling sentence>","reasons":["<reason 1>","<reason 2>","<reason 3>"],"consideration":"<one honest watch-out>","urgency":"<brief note on why to apply now>"}]}`;

    try{
      const raw=await callClaude(prompt);
      const clean=raw.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setMatches(parsed.matches||[]);
      setLoading(false);
      goToStep(2);
    }catch(e){
      setLoading(false);
      goToStep(0);
    }
  },[]);

  const handleLetter=useCallback(async(board,match)=>{
    setSelectedBoard(board); setSelectedMatch(match);
    setLetter(""); setLoading(true);
    goToStep(3);

    const prompt=`Write a professional letter of interest for ${profile?.name||"the applicant"} (${profile?.title||""}) applying to the ${board.name}.\n\nAPPLICANT BACKGROUND:\n${profile?.summary||""}\n\nKey skills: ${profile?.skills?.join(", ")||""}\n\nBOARD MANDATE:\n${board.mandate}\n\nREQUIREMENTS:\n${board.requires.join(", ")}\n\nWHY THEY MATCH:\n${(match.reasons||[]).join("; ")}\n\nWrite a compelling 3-paragraph letter of interest:\n- Opening: Express genuine interest and establish immediate credibility\n- Middle: Connect specific experience to the board's mandate with concrete examples\n- Closing: Articulate value, express commitment, request consideration\n\nAddress to: "Dear Members of the ${board.name} Appointments Committee,"\nClose with: "Respectfully submitted,\n${profile?.name||"[Your name]"}\n${profile?.title||"[Your title]"}"\n\nProfessional, specific, warm — not generic. Write only the letter text. No subject line or date.`;

    try{
      const text=await callClaude(prompt);
      setLetter(text);
    }catch(e){
      setLetter("Letter generation encountered an issue. Please try again.");
    }finally{
      setLoading(false);
    }
  },[profile]);

  return(
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",maxWidth:760,margin:"0 auto",padding:"0 0 3rem",color:"#1a1a1a"}}>
      {/* Header */}
      <div style={{borderBottom:"1px solid #eee",paddingBottom:"1rem",marginBottom:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3,flexWrap:"wrap"}}>
          <span style={{fontSize:20,fontWeight:600,letterSpacing:"-0.02em"}}>Open<span style={{color:"#1D9E75"}}>Quorum</span></span>
          <span style={{fontSize:13,color:"#ccc"}}>·</span>
          <span style={{fontSize:15,fontWeight:500}}>SeatFinder</span>
          <span style={{fontSize:11,padding:"3px 8px",borderRadius:20,background:"#E1F5EE",color:"#0F6E56",fontWeight:500}}>AI-powered</span>
        </div>
        <p style={{margin:0,fontSize:12,color:"#888"}}>Match your expertise to open board seats · Generate a letter of interest in seconds</p>
      </div>

      {/* Step indicator */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:"1.75rem"}}>
        {["Profile","Matching","Results","Letter"].map((s,i)=>{
          const active=i===step, done=i<step, isCurrent=i<=step;
          return(
            <div key={s} style={{display:"flex",alignItems:"center",flex:i<3?1:"none"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,
                  background:done?"#1D9E75":active?"#fff":"#f5f5f5",
                  color:done?"#fff":active?"#1D9E75":"#aaa",
                  border:active?"2px solid #1D9E75":done?"2px solid #1D9E75":"2px solid #ddd",transition:"all 0.3s"}}>
                  {done?"✓":i+1}
                </div>
                <span style={{fontSize:10,fontWeight:active?600:400,color:active?"#1D9E75":"#aaa",whiteSpace:"nowrap"}}>{s}</span>
              </div>
              {i<3&&<div style={{flex:1,height:2,margin:"0 6px",marginBottom:14,background:done?"#1D9E75":"#eee",transition:"background 0.3s"}}/>}
            </div>
          );
        })}
      </div>

      {step===0&&<ProfileStep onMatch={handleMatch} loading={loading}/>}
      {step===1&&<LoadingStep/>}
      {step===2&&<ResultsStep matches={matches} onLetter={handleLetter} onBack={()=>{goToStep(0);}}/>}
      {step===3&&<LetterStep letter={letter} board={selectedBoard} loading={loading} onBack={()=>{goToStep(2);}}/>}
    </div>
  );
}
