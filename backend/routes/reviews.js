const router=require("express").Router(),{v4:uuidv4}=require("uuid"),db=require("../utils/db"),{verifyToken}=require("../middleware/auth");
router.post("/",verifyToken,(req,res)=>{
  const{targetId,targetType,rating,comment}=req.body;
  if(!targetId||!rating)return res.status(400).json({error:"targetId,rating required"});
  res.status(201).json(db.insert("reviews",{id:uuidv4(),reviewerId:req.user.id,targetId,targetType:targetType||"listing",rating:Number(rating),comment:comment||"",createdAt:new Date().toISOString()}));
});
router.get("/:targetId",(req,res)=>{
  const rs=db.findMany("reviews",r=>r.targetId===req.params.targetId);
  res.json(rs.map(r=>{const u=db.findOne("users",u=>u.id===r.reviewerId);const{passwordHash:_,...s}=u||{};return{...r,reviewer:s};}));
});
module.exports=router;
