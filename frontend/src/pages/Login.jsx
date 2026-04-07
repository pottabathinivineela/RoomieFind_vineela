import{useState}from"react";
import{Link,useNavigate}from"react-router-dom";
import{useAuth}from"../context/AuthContext";
export default function Login(){
  const{login}=useAuth();const nav=useNavigate();
  const[form,setForm]=useState({email:"",password:""});
  const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const h=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();setErr("");setLoading(true);
    try{await login(form.email,form.password);nav("/listings");}
    catch(er){setErr(er.response?.data?.error||"Login failed");}finally{setLoading(false);}};
  const demo=async email=>{setLoading(true);try{await login(email,"password123");nav("/listings");}catch{setErr("Demo failed");}finally{setLoading(false);}};
  return(
  <div className="auth-page">
    <div className="auth-art">
      <div className="auth-art-bg"/>
      <div className="auth-art-content">
        <div className="auth-art-icon">🏠</div>
        <h2 style={{fontSize:"1.8rem",fontWeight:800,color:"#fff",marginBottom:12,letterSpacing:"-0.5px"}}>Welcome back to<br/>RoomieFind</h2>
        <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.95rem",lineHeight:1.7}}>Your perfect home and<br/>ideal roommate await you.</p>
        <div style={{marginTop:"2rem",display:"flex",flexDirection:"column",gap:10}}>
          {[["🏠","500+ verified listings"],["🤝","AI roommate matching"],["💬","Real-time chat"]].map(([i,t])=>(
            <div key={t} style={{display:"flex",alignItems:"center",gap:10,color:"rgba(255,255,255,0.75)",fontSize:"0.9rem"}}>
              <span style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>{i}</span>{t}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="auth-form-side">
      <div className="auth-box">
        <h2>Sign In 👋</h2>
        <p className="sub">New here? <Link to="/register" style={{color:"var(--brand)",fontWeight:700}}>Create a free account</Link></p>
        <div className="demo-pills">
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--brand)",width:"100%",marginBottom:4}}>⚡ Quick demo login:</div>
          <button className="demo-pill" onClick={()=>demo("arjun@example.com")}>Tenant – Arjun</button>
          <button className="demo-pill" onClick={()=>demo("sana@example.com")}>Tenant – Sana</button>
          <button className="demo-pill" onClick={()=>demo("vineela@example.com")}>Owner – Vineela</button>
        </div>
        {err&&<div className="alert alert-error">{err}</div>}
        <form onSubmit={submit}>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" name="email" value={form.email} onChange={h} placeholder="you@example.com" required/></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" name="password" value={form.password} onChange={h} placeholder="••••••••" required/></div>
          <button className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center",marginTop:4}} disabled={loading}>{loading?"Signing in...":"Sign In →"}</button>
        </form>
      </div>
    </div>
  </div>);
}
