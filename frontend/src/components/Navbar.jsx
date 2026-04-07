import{Link,useLocation,useNavigate}from"react-router-dom";
import{useAuth}from"../context/AuthContext";
export default function Navbar(){
  const{user,logout}=useAuth();
  const{pathname}=useLocation();
  const nav=useNavigate();
  const active=p=>pathname===p?"nav-link active":"nav-link";
  return(
  <nav className="navbar">
    <div className="navbar-inner">
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">🏠</div>
        <div className="logo-text"><span className="brand">Roomie</span>Find<span className="sub">by Vineela</span></div>
      </Link>
      <div className="navbar-links">
        <Link to="/listings" className={active("/listings")}>Browse</Link>
        {user&&<Link to="/roommate-match" className={active("/roommate-match")}>Match</Link>}
        {user&&<Link to="/chat" className={active("/chat")}>Chat</Link>}
        {user?.role==="owner"&&<Link to="/add-listing" className={active("/add-listing")}>+ List Property</Link>}
        {user?(
          <>
            <Link to="/profile" style={{display:"flex",alignItems:"center",gap:8,marginLeft:4}}>
              <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <span style={{fontSize:"0.88rem",fontWeight:600,color:"var(--text)"}}>{user.name?.split(" ")[0]}</span>
            </Link>
            <button className="nav-pill outline" onClick={()=>{logout();nav("/");}}>Sign Out</button>
          </>
        ):(
          <>
            <Link to="/login"><button className="nav-pill outline">Log In</button></Link>
            <Link to="/register"><button className="nav-pill fill">Get Started</button></Link>
          </>
        )}
      </div>
    </div>
  </nav>);
}
