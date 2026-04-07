import{useState}from"react";
import{useNavigate,Link}from"react-router-dom";
import{useAuth}from"../context/AuthContext";
export default function Home(){
  const[q,setQ]=useState("");
  const nav=useNavigate();
  const{user}=useAuth();
  const go=e=>{e.preventDefault();nav(`/listings?q=${q}`);};
  const areas=["Banjara Hills","Jubilee Hills","Hitech City","Gachibowli","Madhapur","Kondapur","Miyapur","Kukatpally"];
  return(<div>
    <section className="hero">
      <div className="hero-bg"/><div className="hero-orb a"/><div className="hero-orb b"/>
      <div className="hero-content">
        <div className="hero-badge"><span>✨</span> India's smartest roommate platform</div>
        <h1>Find Your Perfect<br/><span className="accent">Home & Roommate</span><br/>in Hyderabad</h1>
        <p>Browse thousands of verified listings, match with compatible roommates using AI, and connect instantly via real-time chat.</p>
        <form className="hero-search" onSubmit={go}>
          <span style={{fontSize:"1.1rem"}}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by area, property type, or keyword..."/>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="hero-cta-row">
          <Link to="/listings"><button className="btn btn-white btn-lg">Browse Listings →</button></Link>
          {!user&&<Link to="/register"><button className="btn btn-lg" style={{border:"1.5px solid rgba(255,255,255,0.3)",color:"#fff",background:"rgba(255,255,255,0.08)"}}>Create Account</button></Link>}
          {user&&<Link to="/roommate-match"><button className="btn btn-lg" style={{border:"1.5px solid rgba(255,255,255,0.3)",color:"#fff",background:"rgba(255,255,255,0.08)"}}>Find Roommates 🤝</button></Link>}
        </div>
      </div>
    </section>

    <div className="stats-strip">
      {[["500+","Verified Listings"],["2,000+","Happy Tenants"],["98%","Match Accuracy"],["50+","Neighbourhoods"]].map(([n,l])=>(
        <div className="stat-item" key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
      ))}
    </div>

    <section className="section" style={{background:"var(--surface)"}}>
      <div className="section-inner">
        <div className="section-header"><div className="chip">How it works</div><h2>Three steps to your perfect home</h2></div>
        <div className="how-grid">
          {[["🔍","Search & Filter","Browse thousands of listings filtered by budget, area, amenities and type."],
            ["🤝","Match Roommates","Our compatibility algorithm finds your ideal roommate based on lifestyle scores."],
            ["💬","Chat Instantly","Message owners and roommates in real-time — no middlemen."],
            ["🏠","Move In","Pay your deposit and move into your verified new home."]
          ].map(([icon,title,desc])=>(
            <div className="how-card" key={title}><div className="how-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <div className="section-header"><div className="chip">Popular areas</div><h2>Top neighbourhoods in Hyderabad</h2></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
          {areas.map(a=><button key={a} className="area-chip" onClick={()=>nav(`/listings?location=${a}`)}>📍 {a}</button>)}
        </div>
      </div>
    </section>

    {!user&&<section className="section" style={{paddingTop:0}}>
      <div className="section-inner">
        <div className="cta-banner">
          <div className="cta-banner-bg"/>
          <div className="cta-banner-content">
            <h2 style={{fontSize:"2rem",fontWeight:800,color:"#fff",marginBottom:12,letterSpacing:"-0.5px"}}>Ready to find your perfect home?</h2>
            <p style={{color:"rgba(255,255,255,0.65)",marginBottom:"2rem"}}>Join thousands of happy tenants and property owners on RoomieFind.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <Link to="/register"><button className="btn btn-xl btn-primary">Get Started Free 🚀</button></Link>
              <Link to="/listings"><button className="btn btn-xl" style={{border:"1.5px solid rgba(255,255,255,0.3)",color:"#fff",background:"transparent"}}>Browse Listings</button></Link>
            </div>
          </div>
        </div>
      </div>
    </section>}
  </div>);
}
