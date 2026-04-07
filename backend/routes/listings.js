const router=require("express").Router(),{v4:uuidv4}=require("uuid"),db=require("../utils/db"),{verifyToken}=require("../middleware/auth");
router.get("/",(req,res)=>{
  let ls=db.findAll("listings").filter(l=>l.isAvailable);
  const{location,minRent,maxRent,type,amenity,q}=req.query;
  if(location)ls=ls.filter(l=>l.city?.toLowerCase().includes(location.toLowerCase())||l.area?.toLowerCase().includes(location.toLowerCase()));
  if(minRent)ls=ls.filter(l=>l.rent>=Number(minRent));
  if(maxRent)ls=ls.filter(l=>l.rent<=Number(maxRent));
  if(type)ls=ls.filter(l=>l.propertyType===type);
  if(amenity)ls=ls.filter(l=>l.amenities?.includes(amenity));
  if(q){const ql=q.toLowerCase();ls=ls.filter(l=>l.title?.toLowerCase().includes(ql)||l.area?.toLowerCase().includes(ql));}
  ls=ls.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const owners={};
  ls.forEach(l=>{if(!owners[l.ownerId]){const u=db.findOne("users",u=>u.id===l.ownerId);if(u){const{passwordHash:_,...s}=u;owners[l.ownerId]=s;}}});
  res.json({listings:ls,owners});
});
router.get("/owner/my",verifyToken,(req,res)=>res.json(db.findMany("listings",l=>l.ownerId===req.user.id)));
router.get("/:id",(req,res)=>{
  const l=db.findOne("listings",l=>l.id===req.params.id);
  if(!l)return res.status(404).json({error:"Not found"});
  const owner=db.findOne("users",u=>u.id===l.ownerId);
  const reviews=db.findMany("reviews",r=>r.targetId===l.id);
  const{passwordHash:_,...safeOwner}=owner||{};
  res.json({listing:l,owner:safeOwner,reviews});
});
router.post("/",verifyToken,(req,res)=>{
  const{title,description,propertyType,rent,deposit,bedrooms,bathrooms,area,city,pincode,amenities,photos,availableFrom}=req.body;
  if(!title||!rent||!city)return res.status(400).json({error:"title,rent,city required"});
  res.status(201).json(db.insert("listings",{id:uuidv4(),ownerId:req.user.id,title,description:description||"",propertyType:propertyType||"flat",rent:Number(rent),deposit:Number(deposit)||0,bedrooms:Number(bedrooms)||1,bathrooms:Number(bathrooms)||1,area:area||"",city,pincode:pincode||"",amenities:amenities||[],photos:photos||[],availableFrom:availableFrom||new Date().toISOString(),isAvailable:true,createdAt:new Date().toISOString()}));
});
router.put("/:id",verifyToken,(req,res)=>{
  const l=db.findOne("listings",l=>l.id===req.params.id);
  if(!l)return res.status(404).json({error:"Not found"});
  if(l.ownerId!==req.user.id)return res.status(403).json({error:"Forbidden"});
  res.json(db.update("listings",l=>l.id===req.params.id,req.body));
});
router.delete("/:id",verifyToken,(req,res)=>{
  const l=db.findOne("listings",l=>l.id===req.params.id);
  if(!l)return res.status(404).json({error:"Not found"});
  if(l.ownerId!==req.user.id&&req.user.role!=="admin")return res.status(403).json({error:"Forbidden"});
  db.remove("listings",l=>l.id===req.params.id);
  res.json({message:"Deleted"});
});
module.exports=router;
