import{useState,useEffect}from"react";
import{useParams,useNavigate,Link}from"react-router-dom";
import api from"../api";
import{useAuth}from"../context/AuthContext";
const ICONS={wifi:"📶",ac:"❄️",parking:"🅿️",gym:"💪",meals:"🍽️",laundry:"🧺",cctv:"📷",garden:"🌿",power_backup:"⚡",washing_machine:"🌀"};
export default function ListingDetail(){
  const{id}=useParams();const{user}=useAuth();const nav=useNavigate();
  const[data,setData]=useState(null);const[loading,setLoading]=useState(true);
  const[rev,setRev]=useState({rating:5,comment:""});const[submitting,setSubmitting]=useState(false);const[ok,setOk]=useState("");
  useEffect(()=>{api.get(`/api/listings/${id}`).then(r=>setData(r.data)).catch(()=>nav("/listings")).finally(()=>setLoading(false));},[id]);
  const contact=async()=>{if(!user){nav("/login");return;}try{await api.post(`/api/matches/connect/${data.owner?.id}`);}catch{}nav("/chat");};
  const submitRev=async e=>{e.preventDefault();setSubmitting(true);try{await api.post("/api/reviews",{targetId:id,targetType:"listing",rating:Number(rev.rating),comment:rev.comment});const r=await api.get(`/api/listings/${id}`);setData(r.data);setOk("Review submitted!");setRev({rating:5,comment:""});}catch{}finally{setSubmitting(false);}};
  if(loading)return<div className="loading"><div className="spin"/></div>;
  if(!data)return null;
  const{listing,owner,reviews}=data;
  const avg=reviews?.length?(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):null;
  return(
  <div className="page" style={{maxWidth:980}}>
    <Link to="/listings" style={{color:"var(--brand)",fontSize:"0.88rem",fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,marginBottom:"1.5rem"}}>← Back to listings</Link>
    {listing.photos?.length>0&&<div className="photo-grid">{listing.photos.slice(0,2).map((p,i)=><img key={i} src={p} alt=""/>)}</div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"2rem",alignItems:"start"}}>
      <div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
          <span className={`badge-type badge-${listing.propertyType}`}>{listing.propertyType}</span>
          {avg&&<span className="stars">{"★".repeat(Math.round(avg))}<span style={{color:"var(--text3)",fontSize:"0.82rem",fontWeight:500,marginLeft:4}}>({reviews.length} reviews)</span></span>}
        </div>
        <h1 style={{fontSize:"1.6rem",fontWeight:800,letterSpacing:"-0.5px",marginBottom:8}}>{listing.title}</h1>
        <p style={{color:"var(--text2)",marginBottom:"1.5rem"}}>📍 {listing.area}, {listing.city} – {listing.pincode}</p>
        <div className="detail-grid">
          <div className="detail-item"><div className="d-label">Monthly Rent</div><div className="d-value" style={{color:"var(--brand)",fontSize:"1.4rem"}}>₹{listing.rent?.toLocaleString()}</div></div>
          <div className="detail-item"><div className="d-label">Security Deposit</div><div className="d-value">₹{listing.deposit?.toLocaleString()}</div></div>
          <div className="detail-item"><div className="d-label">Bedrooms</div><div className="d-value">🛏 {listing.bedrooms}</div></div>
          <div className="detail-item"><div className="d-label">Bathrooms</div><div className="d-value">🛁 {listing.bathrooms}</div></div>
        </div>
        <hr className="divider"/>
        <h3 style={{fontWeight:700,marginBottom:10}}>About this property</h3>
        <p style={{color:"var(--text2)",lineHeight:1.8}}>{listing.description}</p>
        {listing.amenities?.length>0&&<div style={{marginTop:"1.5rem"}}><h3 style={{fontWeight:700,marginBottom:10}}>Amenities</h3><div className="amenity-chips">{listing.amenities.map(a=><span key={a} className="amenity-chip" style={{fontSize:"0.82rem",padding:"5px 12px"}}>{ICONS[a]||"✓"} {a.replace(/_/g," ")}</span>)}</div></div>}
        {user&&<div style={{marginTop:"2rem",background:"var(--surface2)",borderRadius:"var(--radius)",padding:"1.4rem"}}>
          <h3 style={{fontWeight:700,marginBottom:14}}>Leave a Review</h3>
          {ok&&<div className="alert alert-success">{ok}</div>}
          <form onSubmit={submitRev}>
            <div className="form-group"><label className="form-label">Rating</label><select className="form-select" value={rev.rating} onChange={e=>setRev({...rev,rating:e.target.value})}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{"★".repeat(n)} {n} star{n!==1?"s":""}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Comment</label><textarea className="form-textarea" value={rev.comment} onChange={e=>setRev({...rev,comment:e.target.value})} placeholder="Share your experience..."/></div>
            <button className="btn btn-primary btn-sm" disabled={submitting}>{submitting?"Submitting...":"Submit Review"}</button>
          </form>
        </div>}
        {reviews?.length>0&&<div style={{marginTop:"2rem"}}>
          <h3 style={{fontWeight:700,marginBottom:14}}>Reviews ({reviews.length})</h3>
          {reviews.map(r=><div key={r.id} className="review-item"><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontWeight:700,fontSize:"0.9rem"}}>{r.reviewer?.name||"User"}</div><div className="stars" style={{fontSize:"0.85rem"}}>{"★".repeat(r.rating)}</div></div><p style={{color:"var(--text2)",fontSize:"0.88rem"}}>{r.comment}</p></div>)}
        </div>}
      </div>
      <div className="sticky-contact">
        <div className="card"><div className="card-body">
          <div style={{fontSize:"1.7rem",fontWeight:800,color:"var(--brand)",marginBottom:4}}>₹{listing.rent?.toLocaleString()}<span style={{fontSize:"0.9rem",color:"var(--text3)",fontWeight:500}}>/month</span></div>
          <div style={{fontSize:"0.85rem",color:"var(--text3)",marginBottom:"1.2rem"}}>+₹{listing.deposit?.toLocaleString()} security deposit</div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",marginBottom:10}} onClick={contact}>💬 Contact Owner</button>
          {!user&&<p style={{fontSize:"0.8rem",color:"var(--text3)",textAlign:"center"}}><Link to="/login" style={{color:"var(--brand)"}}>Login</Link> to contact</p>}
          <hr className="divider"/>
          {owner&&<div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div className="nav-avatar" style={{width:44,height:44,fontSize:"1rem"}}>{owner.name?.[0]}</div>
            <div><div style={{fontWeight:700,fontSize:"0.9rem"}}>{owner.name}</div><div>{owner.isVerified?<span className="verified-badge">✅ Verified</span>:<span className="unverified-badge">⏳ Unverified</span>}</div></div>
          </div>}
        </div></div>
      </div>
    </div>
  </div>);
}
