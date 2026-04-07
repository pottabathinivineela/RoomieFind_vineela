const router=require("express").Router(),db=require("../utils/db"),{verifyToken}=require("../middleware/auth");
router.get("/rooms",verifyToken,(req,res)=>{
  const cs=db.findMany("connections",c=>c.userA===req.user.id||c.userB===req.user.id);
  const rooms=cs.map(c=>{
    const oid=c.userA===req.user.id?c.userB:c.userA;
    const u=db.findOne("users",u=>u.id===oid);
    const msgs=db.findMany("messages",m=>m.roomId===c.roomId);
    const last=msgs.sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0]||null;
    const{passwordHash:_,...s}=u||{};
    return{roomId:c.roomId,otherUser:s,lastMessage:last,unread:msgs.filter(m=>!m.isRead&&m.receiverId===req.user.id).length};
  });
  res.json(rooms.sort((a,b)=>(b.lastMessage?.timestamp||"")<(a.lastMessage?.timestamp||"")?-1:1));
});
router.get("/rooms/:roomId/messages",verifyToken,(req,res)=>{
  const msgs=db.findMany("messages",m=>m.roomId===req.params.roomId).sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));
  db.writeAll("messages",db.findAll("messages").map(m=>m.roomId===req.params.roomId&&m.receiverId===req.user.id?{...m,isRead:true}:m));
  res.json(msgs);
});
module.exports=router;
