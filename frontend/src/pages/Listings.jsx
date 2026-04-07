import{useState,useEffect}from"react";
import{useSearchParams}from"react-router-dom";
import api from"../api";
import ListingCard from"../components/ListingCard";
const TYPES=["flat","room","pg","house"];
const AMS=["wifi","ac","parking","gym","meals","power_backup","cctv"];
export default function Listings(){
  const[sp]=useSearchParams();
  const[listings,setListings]=useState([]);
  const[loading,setLoading]=useState(true);
  const[f,setF]=useState({q:sp.get("q")||"",location:sp.get("location")||"",type:"",minRent:"",maxRent:"",amenity:""});
  const sf=(k,v)=>setF(p=>({...p,[k]:v}));
  const fetch_=async(filters=f)=>{
    setLoading(true);
    try{const params=Object.fromEntries(Object.entries(filters).filter(([,v])=>v));const{data}=await api.get("/api/listings",{params});setListings(data.listings||[]);}
    catch{setListings([]);}finally{setLoading(false);}
  };
  useEffect(()=>{fetch_();},[]);
  return(
  <div className="page">
    <div className="page-header"><h1>Browse Listings</h1><p style={{color:"var(--text2)"}}>Discover your perfect home in Hyderabad</p></div>
    <form className="filter-bar" onSubmit={e=>{e.preventDefault();fetch_();}}>
      <div className="form-group"><label className="form-label">Search</label><input className="form-input" value={f.q} onChange={e=>sf("q",e.target.value)} placeholder="Keyword..."/></div>
      <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={f.location} onChange={e=>sf("location",e.target.value)} placeholder="Banjara Hills..."/></div>
      <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={f.type} onChange={e=>sf("type",e.target.value)}><option value="">All</option>{TYPES.map(t=><option key={t} value={t}>{t[0].toUpperCase()+t.slice(1)}</option>)}</select></div>
      <div className="form-group"><label className="form-label">Min Rent</label><input className="form-input" type="number" value={f.minRent} onChange={e=>sf("minRent",e.target.value)} placeholder="₹5,000"/></div>
      <div className="form-group"><label className="form-label">Max Rent</label><input className="form-input" type="number" value={f.maxRent} onChange={e=>sf("maxRent",e.target.value)} placeholder="₹50,000"/></div>
      <div className="form-group"><label className="form-label">Amenity</label><select className="form-select" value={f.amenity} onChange={e=>sf("amenity",e.target.value)}><option value="">Any</option>{AMS.map(a=><option key={a} value={a}>{a.replace(/_/g," ")}</option>)}</select></div>
      <button type="submit" className="btn btn-primary">Search</button>
      <button type="button" className="btn btn-secondary" onClick={()=>{const nf={q:"",location:"",type:"",minRent:"",maxRent:"",amenity:""};setF(nf);fetch_(nf);}}>Clear</button>
    </form>
    <div style={{marginBottom:"1rem",color:"var(--text3)",fontSize:"0.88rem"}}>{!loading&&`${listings.length} properties found`}</div>
    {loading?<div className="loading"><div className="spin"/><span>Finding listings...</span></div>
    :listings.length===0?<div className="empty"><div className="empty-icon">🏘️</div><p>No listings match your filters. Try adjusting your search.</p></div>
    :<div className="listings-grid">{listings.map(l=><ListingCard key={l.id} listing={l}/>)}</div>}
  </div>);
}
