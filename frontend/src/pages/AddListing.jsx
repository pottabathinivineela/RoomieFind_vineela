import{useState}from"react";
import{useNavigate}from"react-router-dom";
import api from"../api";
import{useAuth}from"../context/AuthContext";
const AMS=["wifi","ac","parking","gym","meals","laundry","cctv","garden","power_backup","washing_machine"];
const PHOTOS=["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80","https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80","https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80"];
export default function AddListing(){
  const{user}=useAuth();const nav=useNavigate();
  const[form,setForm]=useState({title:"",description:"",propertyType:"flat",rent:"",deposit:"",bedrooms:1,bathrooms:1,area:"",city:"Hyderabad",pincode:"",amenities:[],photos:[],availableFrom:""});
  const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  if(user?.role!=="owner")return<div className="page"><div className="empty"><div className="empty-icon">🚫</div><p>Only property owners can list properties.</p></div></div>;
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleAm=a=>sf("amenities",form.amenities.includes(a)?form.amenities.filter(x=>x!==a):[...form.amenities,a]);
  const addPhoto=()=>{const unused=PHOTOS.filter(p=>!form.photos.includes(p));if(unused.length)sf("photos",[...form.photos,unused[0]]);};
  const submit=async e=>{e.preventDefault();setErr("");setLoading(true);
    try{const{data}=await api.post("/api/listings",form);nav(`/listings/${data.id}`);}
    catch(er){setErr(er.response?.data?.error||"Failed to create listing");}finally{setLoading(false);}};
  const Section=({title,children})=><div className="card" style={{marginBottom:"1.25rem"}}><div className="card-body"><h3 style={{fontWeight:700,marginBottom:"1rem",fontSize:"1rem"}}>{title}</h3>{children}</div></div>;
  return(
  <div className="page" style={{maxWidth:780}}>
    <div className="page-header"><h1>List Your Property 🏠</h1><p>Fill in the details and start receiving enquiries</p></div>
    {err&&<div className="alert alert-error">{err}</div>}
    <form onSubmit={submit}>
      <Section title="Basic Information">
        <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e=>sf("title",e.target.value)} placeholder="Spacious 2BHK near Metro..." required/></div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e=>sf("description",e.target.value)} placeholder="Describe your property in detail..." rows={4}/></div>
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Property Type</label><select className="form-select" value={form.propertyType} onChange={e=>sf("propertyType",e.target.value)}>{["flat","room","pg","house"].map(t=><option key={t} value={t}>{t[0].toUpperCase()+t.slice(1)}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Available From</label><input className="form-input" type="date" value={form.availableFrom} onChange={e=>sf("availableFrom",e.target.value)}/></div>
        </div>
      </Section>
      <Section title="Pricing & Details">
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Monthly Rent (₹) *</label><input className="form-input" type="number" value={form.rent} onChange={e=>sf("rent",e.target.value)} placeholder="15000" required/></div>
          <div className="form-group"><label className="form-label">Security Deposit (₹)</label><input className="form-input" type="number" value={form.deposit} onChange={e=>sf("deposit",e.target.value)} placeholder="45000"/></div>
          <div className="form-group"><label className="form-label">Bedrooms</label><input className="form-input" type="number" min={1} max={10} value={form.bedrooms} onChange={e=>sf("bedrooms",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Bathrooms</label><input className="form-input" type="number" min={1} max={10} value={form.bathrooms} onChange={e=>sf("bathrooms",e.target.value)}/></div>
        </div>
      </Section>
      <Section title="Location">
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Area / Locality *</label><input className="form-input" value={form.area} onChange={e=>sf("area",e.target.value)} placeholder="Banjara Hills" required/></div>
          <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={e=>sf("city",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Pincode</label><input className="form-input" value={form.pincode} onChange={e=>sf("pincode",e.target.value)} placeholder="500034"/></div>
        </div>
      </Section>
      <Section title="Amenities">
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {AMS.map(a=>(
            <label key={a} style={{padding:"8px 16px",border:`2px solid ${form.amenities.includes(a)?"var(--brand)":"var(--border2)"}`,borderRadius:"99px",cursor:"pointer",background:form.amenities.includes(a)?"var(--brand-light)":"var(--surface)",fontSize:"0.84rem",fontWeight:600,color:form.amenities.includes(a)?"var(--brand)":"var(--text2)",transition:"var(--transition)"}}>
              <input type="checkbox" style={{display:"none"}} checked={form.amenities.includes(a)} onChange={()=>toggleAm(a)}/>{a.replace(/_/g," ")}
            </label>
          ))}
        </div>
      </Section>
      <Section title="Photos">
        <button type="button" className="btn btn-secondary btn-sm" onClick={addPhoto} style={{marginBottom:"1rem"}}>+ Add sample photo</button>
        {form.photos.map((p,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
            <input className="form-input" value={p} onChange={e=>{const ph=[...form.photos];ph[i]=e.target.value;sf("photos",ph);}} placeholder="https://..."/>
            <button type="button" className="btn btn-danger btn-sm" onClick={()=>sf("photos",form.photos.filter((_,j)=>j!==i))}>✕</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={()=>sf("photos",[...form.photos,""])}>+ Add URL</button>
      </Section>
      <div style={{display:"flex",gap:12}}>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading?"Publishing...":"🏠 Publish Listing"}</button>
        <button type="button" className="btn btn-secondary" onClick={()=>nav("/listings")}>Cancel</button>
      </div>
    </form>
  </div>);
}
