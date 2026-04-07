import{useState}from"react";
import{useNavigate}from"react-router-dom";
import api from"../api";
import{useAuth}from"../context/AuthContext";
export default function Profile(){
  const{user,logout}=useAuth();const nav=useNavigate();
  const[form,setForm]=useState({name:user?.name||"",phone:user?.phone||"",bio:user?.bio||""});
  const[saving,setSaving]=useState(false);const[ok,setOk]=useState("");const[err,setErr]=useState("");
  const save=async e=>{e.preventDefault();setSaving(true);setOk("");setErr("");
    try{await api.put("/api/users/profile",form);setOk("Profile updated!");}
    catch(er){setErr(er.response?.data?.error||"Update failed");}finally{setSaving(false);}};
  return(
  <div className="page" style={{maxWidth:740}}>
    <div className="profile-banner">
      <div className="profile-banner-bg"/>
      <div className="profile-banner-content">
        <div className="profile-big-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div style={{position:"relative",zIndex:1}}>
          <h2 style={{color:"#fff",fontSize:"1.4rem",fontWeight:800}}>{user?.name}</h2>
          <p style={{color:"rgba(255,255,255,0.65)",fontSize:"0.9rem",marginTop:4}}>{user?.email}</p>
          <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{background:"rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.85)",padding:"3px 12px",borderRadius:99,fontSize:"0.78rem",fontWeight:600}}>{user?.role==="owner"?"🏠 Property Owner":"🔍 Tenant"}</span>
            {user?.isVerified?<span className="verified-badge">✅ Verified</span>:<span className="unverified-badge">⏳ Unverified</span>}
          </div>
        </div>
      </div>
    </div>
    <div className="card" style={{marginBottom:"1.25rem"}}><div className="card-body">
      <h3 style={{fontWeight:700,marginBottom:"1.2rem"}}>Edit Profile</h3>
      {ok&&<div className="alert alert-success">{ok}</div>}
      {err&&<div className="alert alert-error">{err}</div>}
      <form onSubmit={save}>
        <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="9876543210"/></div>
        <div className="form-group"><label className="form-label">Email (read only)</label><input className="form-input" value={user?.email} readOnly style={{background:"var(--surface2)",opacity:0.7}}/></div>
        <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Tell others about yourself..."/></div>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving?"Saving...":"💾 Save Changes"}</button>
      </form>
    </div></div>
    <div className="card" style={{marginBottom:"1.25rem"}}><div className="card-body">
      <h3 style={{fontWeight:700,marginBottom:"1rem"}}>Account Details</h3>
      <div className="detail-grid">
        <div className="detail-item"><div className="d-label">Member since</div><div className="d-value">{new Date(user?.createdAt).toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</div></div>
        <div className="detail-item"><div className="d-label">Account type</div><div className="d-value" style={{textTransform:"capitalize"}}>{user?.role}</div></div>
        <div className="detail-item"><div className="d-label">Verification</div><div className="d-value">{user?.isVerified?"✅ Verified":"⏳ Pending"}</div></div>
      </div>
    </div></div>
    <div className="card" style={{borderColor:"#FECDD3"}}><div className="card-body">
      <h3 style={{fontWeight:700,color:"var(--brand2)",marginBottom:8}}>Danger Zone</h3>
      <p style={{color:"var(--text2)",fontSize:"0.88rem",marginBottom:"1rem"}}>Sign out of your RoomieFind_Vineela account.</p>
      <button className="btn btn-danger" onClick={()=>{logout();nav("/");}}>🚪 Sign Out</button>
    </div></div>
  </div>);
}
