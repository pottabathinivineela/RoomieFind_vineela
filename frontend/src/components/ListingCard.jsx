import{Link}from"react-router-dom";
const ICONS={wifi:"📶",ac:"❄️",parking:"🅿️",gym:"💪",meals:"🍽️",laundry:"🧺",cctv:"📷",garden:"🌿",power_backup:"⚡",washing_machine:"🌀"};
const TYPE={"flat":"badge-flat","room":"badge-room","pg":"badge-pg","house":"badge-house"};
export default function ListingCard({listing}){
  const img=listing.photos?.[0]||"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";
  const ams=(listing.amenities||[]).slice(0,3);
  return(
  <Link to={`/listings/${listing.id}`}>
    <div className="listing-card">
      <div className="img-wrap">
        <img src={img} alt={listing.title} loading="lazy"/>
        <div className="img-overlay"/>
        <span className={`badge-type ${TYPE[listing.propertyType]||"badge-flat"}`}>{listing.propertyType}</span>
        <span className="price-badge">₹{listing.rent?.toLocaleString()}/mo</span>
      </div>
      <div className="card-body">
        <div className="card-title">{listing.title}</div>
        <div className="card-loc">📍 {listing.area}, {listing.city}</div>
        <div className="card-meta">
          <span>🛏 {listing.bedrooms} bed</span>
          <span>🛁 {listing.bathrooms} bath</span>
          <span>💰 ₹{listing.deposit?.toLocaleString()} dep.</span>
        </div>
        {ams.length>0&&<div className="amenity-chips">{ams.map(a=><span key={a} className="amenity-chip">{ICONS[a]||"✓"} {a.replace(/_/g," ")}</span>)}{listing.amenities.length>3&&<span className="amenity-chip">+{listing.amenities.length-3}</span>}</div>}
      </div>
    </div>
  </Link>);
}
