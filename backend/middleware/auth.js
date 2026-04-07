const jwt=require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET||"roomiefind_vineela_secret_2024";
function verifyToken(req,res,next){
  const h=req.headers.authorization;
  if(!h||!h.startsWith("Bearer "))return res.status(401).json({error:"No token"});
  try{req.user=jwt.verify(h.split(" ")[1],JWT_SECRET);next();}
  catch{res.status(401).json({error:"Invalid or expired token"});}
}
module.exports={verifyToken,JWT_SECRET};
