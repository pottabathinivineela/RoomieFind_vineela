const router=require("express").Router(),{verifyToken}=require("../middleware/auth"),db=require("../utils/db");
router.get("/:id",(req,res)=>{
  const u=db.findOne("users",u=>u.id===req.params.id);
  if(!u)return res.status(404).json({error:"Not found"});
  const{passwordHash:_,...s}=u;res.json(s);
});
router.put("/profile",verifyToken,(req,res)=>{
  const u=db.update("users",u=>u.id===req.user.id,req.body);
  if(!u)return res.status(404).json({error:"Not found"});
  const{passwordHash:_,...s}=u;res.json(s);
});
module.exports=router;
