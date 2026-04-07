import{useState,useEffect}from"react";
import{useNavigate}from"react-router-dom";
import api from"../api";
const SC=s=>s>=75?"score-high":s>=50?"score-med":"score-low";
const SL=s=>s>=75?"Great match 🌟":s>=50?"Good match 👍":"Low match";
export default function RoommateMatch(){
  const nav=useNavigate();
  const[profile,setProfile]=useState(null);const[sug,setSug]=useState([]);
  const[loading,setLoading]=useState(true);const[sugLoad,setSugLoad]=useState(false);
  const[tab,setTab]=useState("profile");
  const[form,setForm]=useState({budgetMin:"",budgetMax:"",preferredArea:"",genderPref:"any",gender:"male",smoking:false,sleepSchedule:"flexible",cleanliness:3,workSchedule:"9-5 office",bio:""});
  const[saving,setSaving]=useState(false);const[ok,setOk]=useState("");
  useEffect(()=>{api.get("/api/matches/profile").then(r=>{if(r.data){setProfile(r.data);setForm(p=>({...p,...r.data}));}}).catch(()=>{}).finally(()=>setLoading(false));},[]);
  const fetchSug=async()=>{setSugLoad(true);try{const{data}=await api.get("/api/matches/suggestions");setSug(data);}catch{}finally{setSugLoad(false);}};
  const save=async e=>{e.preventDefault();setSaving(true);setOk("");try{const{data}=await api.post("/api/matches/profile",form);setProfile(data);setOk("Profile saved! Switch to the Matches tab.");}catch{}finally{setSaving(false);}};
  const connect=async uid=>{try{await api.post(`/api/matches/connect/${uid}`);}catch{}nav("/chat");};
  const SLEEP=["early","flexible","night_owl"];const WORK=["9-5 office","remote","student","freelancer","night shift"];
  const cleanLabels=["","Messy","Average","Tidy","Very Clean","Spotless"];
  if(loading)return<div className="loading"><div className="spin"/></div>;
  return(
  <div className="page">
    <div className="page-header"><h1>🤝 Roommate Matching</h1><p>Find compatible roommates using our AI-powered compatibility engine</p></div>
    <div className="tabs">
      <button className={`tab-btn${tab==="profile"?" active":""}`} onClick={()=>setTab("profile")}>My Profile</button>
      <button className={`tab-btn${tab==="matches"?" active":""}`} onClick={()=>{setTab("matches");fetchSug();}}>Find Matches {sug.length>0&&`(${sug.length})`}</button>
    </div>
    {tab==="profile"&&<div style={{maxWidth:620}}>
      {ok&&<div className="alert alert-success">{ok}</div>}
      <form onSubmit={save}>
        <div className="card" style={{marginBottom:"1.25rem"}}><div className="card-body">
          <h3 style={{fontWeight:700,marginBottom:"1rem",fontSize:"1rem"}}>Budget & Location</h3>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Budget Min (₹/mo)</label><input className="form-input" type="number" value={form.budgetMin} onChange={e=>setForm({...form,budgetMin:e.target.value})} placeholder="6000"/></div>
            <div className="form-group"><label className="form-label">Budget Max (₹/mo)</label><input className="form-input" type="number" value={form.budgetMax} onChange={e=>setForm({...form,budgetMax:e.target.value})} placeholder="12000"/></div>
          </div>
          <div className="form-group"><label className="form-label">Preferred Area</label><input className="form-input" value={form.preferredArea} onChange={e=>setForm({...form,preferredArea:e.target.value})} placeholder="Hitech City, Gachibowli..."/></div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Your Gender</label><select className="form-select" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            <div className="form-group"><label className="form-label">Preferred Roommate Gender</label><select className="form-select" value={form.genderPref} onChange={e=>setForm({...form,genderPref:e.target.value})}><option value="any">Any</option><option value="male">Male</option><option value="female">Female</option></select></div>
          </div>
        </div></div>
        <div className="card" style={{marginBottom:"1.25rem"}}><div className="card-body">
          <h3 style={{fontWeight:700,marginBottom:"1rem",fontSize:"1rem"}}>Lifestyle Habits</h3>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Sleep Schedule</label><select className="form-select" value={form.sleepSchedule} onChange={e=>setForm({...form,sleepSchedule:e.target.value})}><option value="early">Early Bird</option><option value="flexible">Flexible</option><option value="night_owl">Night Owl</option></select></div>
            <div className="form-group"><label className="form-label">Work Schedule</label><select className="form-select" value={form.workSchedule} onChange={e=>setForm({...form,workSchedule:e.target.value})}>{WORK.map(w=><option key={w} value={w}>{w}</option>)}</select></div>
          </div>
          <div className="form-group">
            <label className="form-label">Cleanliness: <span style={{color:"var(--brand)"}}>{cleanLabels[form.cleanliness]}</span></label>
            <input type="range" min={1} max={5} value={form.cleanliness} onChange={e=>setForm({...form,cleanliness:Number(e.target.value)})} style={{width:"100%",accentColor:"var(--brand)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.75rem",color:"var(--text3)"}}><span>Messy</span><span>Spotless</span></div>
          </div>
          <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
            <input type="checkbox" checked={form.smoking} onChange={e=>setForm({...form,smoking:e.target.checked})} style={{width:18,height:18,accentColor:"var(--brand)"}}/>
            <span style={{fontWeight:600,fontSize:"0.9rem"}}>I smoke</span>
          </label>
          <div className="form-group" style={{marginTop:"1rem"}}><label className="form-label">About Me</label><textarea className="form-textarea" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Tell potential roommates about yourself..." rows={3}/></div>
        </div></div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving?"Saving...":"💾 Save Profile"}</button>
      </form>
    </div>}
    {tab==="matches"&&<div>
      {!profile&&<div className="alert alert-warn">Please fill in your roommate profile first to see matches.</div>}
      {sugLoad&&<div className="loading"><div className="spin"/><span>Finding your best matches...</span></div>}
      {!sugLoad&&sug.length===0&&profile&&<div className="empty"><div className="empty-icon">🔍</div><p>No matches yet. More users are joining daily!</p></div>}
      <div style={{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:720}}>
        {sug.map(({profile:p,user,score})=>(
          <div key={p.id} className="match-card">
            <div className="match-avatar">{user.name?.[0]}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontWeight:800,fontSize:"0.95rem"}}>{user.name} {user.isVerified&&"✅"}</div>
                <span className={`score-badge ${SC(score)}`}>🎯 {score}% – {SL(score)}</span>
              </div>
              <div style={{fontSize:"0.82rem",color:"var(--text3)",marginBottom:8}}>📍 {p.preferredArea} · ₹{p.budgetMin?.toLocaleString()}–{p.budgetMax?.toLocaleString()}/mo</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                <span className="tag">🌙 {p.sleepSchedule?.replace("_"," ")}</span>
                <span className="tag">💼 {p.workSchedule}</span>
                <span className="tag">✨ {cleanLabels[p.cleanliness]}</span>
                <span className="tag">{p.smoking?"🚬 Smoker":"🚭 Non-smoker"}</span>
              </div>
              {p.bio&&<p style={{fontSize:"0.85rem",color:"var(--text2)",marginBottom:12}}>{p.bio}</p>}
              <button className="btn btn-primary btn-sm" onClick={()=>connect(user.id)}>💬 Connect</button>
            </div>
          </div>
        ))}
      </div>
    </div>}
  </div>);
}
