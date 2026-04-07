const router=require("express").Router(),{v4:uuidv4}=require("uuid"),db=require("../utils/db"),{verifyToken}=require("../middleware/auth"),{computeCompatibility}=require("../utils/matchEngine");
router.post("/profile",verifyToken,(req,res)=>{
  const{budgetMin,budgetMax,preferredArea,genderPref,gender,smoking,sleepSchedule,cleanliness,workSchedule,bio}=req.body;
  const data={budgetMin:Number(budgetMin),budgetMax:Number(budgetMax),preferredArea,genderPref,gender,smoking,sleepSchedule,cleanliness:Number(cleanliness),workSchedule,bio:bio||""};
  const ex=db.findOne("roommateProfiles",p=>p.userId===req.user.id);
  if(ex)return res.json(db.update("roommateProfiles",p=>p.userId===req.user.id,data));
  res.status(201).json(db.insert("roommateProfiles",{id:uuidv4(),userId:req.user.id,...data,createdAt:new Date().toISOString()}));
});
router.get("/profile",verifyToken,(req,res)=>res.json(db.findOne("roommateProfiles",p=>p.userId===req.user.id)||null));
router.get("/suggestions",verifyToken,(req,res)=>{
  const mine=db.findOne("roommateProfiles",p=>p.userId===req.user.id);
  if(!mine)return res.status(400).json({error:"Create your profile first"});
  const sug=db.findMany("roommateProfiles",p=>p.userId!==req.user.id).map(p=>{
    const u=db.findOne("users",u=>u.id===p.userId);if(!u)return null;
    const{passwordHash:_,...su}=u;
    return{profile:p,user:su,score:computeCompatibility(mine,p)};
  }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,20);
  res.json(sug);
});
router.post("/connect/:userId",verifyToken,(req,res)=>{
  const roomId=[req.user.id,req.params.userId].sort().join("_");
  const ex=db.findOne("connections",c=>c.roomId===roomId);
  if(ex)return res.json(ex);
  res.status(201).json(db.insert("connections",{id:uuidv4(),roomId,userA:req.user.id,userB:req.params.userId,status:"pending",createdAt:new Date().toISOString()}));
});
router.get("/connections",verifyToken,(req,res)=>{
  const cs=db.findMany("connections",c=>c.userA===req.user.id||c.userB===req.user.id);
  res.json(cs.map(c=>{const oid=c.userA===req.user.id?c.userB:c.userA;const u=db.findOne("users",u=>u.id===oid);const{passwordHash:_,...s}=u||{};return{...c,otherUser:s};}));
});
module.exports=router;
