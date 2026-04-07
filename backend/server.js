const express=require("express"),http=require("http"),{Server}=require("socket.io"),cors=require("cors"),{v4:uuidv4}=require("uuid"),db=require("./utils/db");
const app=express(),server=http.createServer(app);

const ALLOWED=[
  "https://roomiefind.vercel.app",
  "https://roomie-find.vercel.app",
  /https:\/\/roomiefind.*\.vercel\.app/,
  "http://localhost:3000","http://localhost:5173"
];
app.use(cors({
  origin:(origin,cb)=>{
    if(!origin)return cb(null,true);
    const ok=ALLOWED.some(o=>typeof o==="string"?o===origin:o.test(origin));
    ok?cb(null,true):cb(new Error("CORS: "+origin+" not allowed"));
  },
  credentials:true,
  methods:["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders:["Content-Type","Authorization"]
}));
app.use(express.json({limit:"10mb"}));

const io=new Server(server,{cors:{origin:ALLOWED,methods:["GET","POST"]}});
app.set("io",io);

app.use("/api/auth", require("./routes/auth"));
app.use("/api",      require("./routes/auth"));
app.use("/api/listings",require("./routes/listings"));
app.use("/api/matches", require("./routes/matches"));
app.use("/api/chat",    require("./routes/chat"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/users",   require("./routes/users"));
app.get("/api/health",(_,res)=>res.json({status:"ok",app:"RoomieFind_Vineela",timestamp:new Date()}));
app.use((_,res)=>res.status(404).json({error:"Route not found"}));
app.use((err,_,res,__)=>{console.error(err);res.status(500).json({error:err.message});});

io.on("connection",socket=>{
  socket.on("join_room",({roomId})=>socket.join(roomId));
  socket.on("send_message",({roomId,senderId,receiverId,content})=>{
    if(!content?.trim())return;
    const msg={id:uuidv4(),roomId,senderId,receiverId,content:content.trim(),timestamp:new Date().toISOString(),isRead:false};
    const msgs=db.findAll("messages");msgs.push(msg);db.writeAll("messages",msgs);
    io.to(roomId).emit("new_message",msg);
  });
  socket.on("typing",({roomId,userId})=>socket.to(roomId).emit("user_typing",{userId}));
  socket.on("stop_typing",({roomId})=>socket.to(roomId).emit("user_stop_typing"));
});

const PORT=process.env.PORT||5000;
server.listen(PORT,()=>console.log(`\n  RoomieFind_Vineela API → http://localhost:${PORT}\n`));
