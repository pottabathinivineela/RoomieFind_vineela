import{useState}from"react";
import{Link,useNavigate}from"react-router-dom";
import{useAuth}from"../context/AuthContext";
export default function Register(){
  const{register}=useAuth();const nav=useNavigate();
  const[form,setForm]=useState({name:"",email:"",password:"",phone:"",role:"tenant"});
  const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const h=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();setErr("");setLoading(true);
    try{await register(form);nav("/listings");}
    catch(er){setErr(er.response?.data?.error||"Registration failed");}finally{setLoading(false);}};
  return(
  <div className="auth-page">
    <div className="auth-art">
      <div className="auth-art-bg"/>
      <div className="auth-art-content">
        <div className="auth-art-icon">✨</div>
        <h2 style={{fontSize:"1.8rem",fontWeight:800,color:"#fff",marginBottom:12,letterSpacing:"-0.5px"}}>Join RoomieFind<br/>by Vineela</h2>
        <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.95rem",lineHeight:1.7}}>Find your perfect home and<br/>ideal roommates today.</p>
      </div>
    </div>
    <div className="auth-form-side">
      <div className="auth-box">
        <h2>Create Account 🚀</h2>
        <p className="sub">Already a member? <Link to="/login" style={{color:"var(--brand)",fontWeight:700}}>Sign in</Link></p>
        {err&&<div className="alert alert-error">{err}</div>}
        <form onSubmit={submit}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" name="name" value={form.name} onChange={h} placeholder="Priya Sharma" required/></div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" name="email" value={form.email} onChange={h} placeholder="you@example.com" required/></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" name="phone" value={form.phone} onChange={h} placeholder="9876543210"/></div>
          </div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" name="password" value={form.password} onChange={h} placeholder="Min 6 characters" required minLength={6}/></div>
          <div className="form-group"><label className="form-label">I am a...</label>
            <div style={{display:"flex",gap:10}}>
              {[["tenant","🔍","Looking for a home"],["owner","🏠","Listing property"]].map(([r,ico,desc])=>(
                <label key={r} style={{flex:1,border:`2px solid ${form.role===r?"var(--brand)":"var(--border2)"}`,borderRadius:"var(--radius-sm)",padding:"14px 12px",cursor:"pointer",background:form.role===r?"var(--brand-light)":"var(--surface)",transition:"var(--transition)",textAlign:"center"}}>
                  <input type="radio" name="role" value={r} checked={form.role===r} onChange={h} style={{display:"none"}}/>
                  <div style={{fontSize:"1.5rem",marginBottom:4}}>{ico}</div>
                  <div style={{fontWeight:700,fontSize:"0.85rem",color:form.role===r?"var(--brand)":"var(--text)",textTransform:"capitalize"}}>{r}</div>
                  <div style={{fontSize:"0.75rem",color:"var(--text3)",marginTop:2}}>{desc}</div>
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center"}} disabled={loading}>{loading?"Creating account...":"Create Account 🚀"}</button>
        </form>
      </div>
    </div>
  </div>);
}
