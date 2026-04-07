import{useState,useEffect,useRef}from"react";
import{useParams,useNavigate}from"react-router-dom";
import api from"../api";
import{io}from"socket.io-client";
import{useAuth}from"../context/AuthContext";
import{API_BASE}from"../api";
let socket;
export default function Chat(){
  const{user}=useAuth();const{roomId:pRoom}=useParams();const nav=useNavigate();
  const[rooms,setRooms]=useState([]);const[active,setActive]=useState(pRoom||null);
  const[msgs,setMsgs]=useState([]);const[input,setInput]=useState("");const[other,setOther]=useState(null);
  const[typing,setTyping]=useState(false);const[loading,setLoading]=useState(true);
  const endRef=useRef(null);const tyTimer=useRef(null);
  useEffect(()=>{
    socket=io(API_BASE,{auth:{userId:user?.id}});
    socket.on("new_message",msg=>{setMsgs(p=>[...p,msg]);loadRooms();});
    socket.on("user_typing",()=>{setTyping(true);setTimeout(()=>setTyping(false),2000);});
    loadRooms();return()=>socket.disconnect();
  },[]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  useEffect(()=>{if(active){socket.emit("join_room",{roomId:active});loadMsgs(active);}},[active]);
  const loadRooms=async()=>{try{const{data}=await api.get("/api/chat/rooms");setRooms(data);}catch{}finally{setLoading(false);}};
  const loadMsgs=async id=>{try{const{data}=await api.get(`/api/chat/rooms/${id}/messages`);setMsgs(data);}catch{setMsgs([]);}};
  const pick=room=>{setActive(room.roomId);setOther(room.otherUser);nav(`/chat/${room.roomId}`,{replace:true});};
  const send=e=>{e.preventDefault();if(!input.trim()||!active)return;const rid=active.split("_").find(id=>id!==user?.id);socket.emit("send_message",{roomId:active,senderId:user?.id,receiverId:rid,content:input.trim()});setInput("");};
  const ht=e=>{setInput(e.target.value);if(active)socket.emit("typing",{roomId:active,userId:user?.id});clearTimeout(tyTimer.current);tyTimer.current=setTimeout(()=>{if(active)socket.emit("stop_typing",{roomId:active});},1500);};
  const ts=t=>new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  return(
  <div className="chat-layout">
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">💬 Messages</div>
      {loading?<div className="loading" style={{minHeight:120}}><div className="spin"/></div>
      :rooms.length===0?<div style={{padding:"1.5rem",color:"var(--text3)",fontSize:"0.88rem",textAlign:"center",lineHeight:1.7}}>No conversations yet.<br/><br/>Connect with someone from the Roommate Match page!</div>
      :rooms.map(r=>(
        <div key={r.roomId} className={`room-item${active===r.roomId?" active":""}`} onClick={()=>pick(r)}>
          <div className="nav-avatar" style={{width:38,height:38,fontSize:"0.88rem"}}>{r.otherUser?.name?.[0]}</div>
          <div className="room-info">
            <div className="room-name">{r.otherUser?.name}</div>
            <div className="room-last">{r.lastMessage?.content||"Say hello! 👋"}</div>
          </div>
          {r.unread>0&&<span style={{background:"var(--brand)",color:"#fff",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.72rem",fontWeight:700,flexShrink:0}}>{r.unread}</span>}
        </div>
      ))}
    </div>
    {active?(
      <div className="chat-main">
        <div className="chat-header">
          <div className="nav-avatar" style={{width:38,height:38,fontSize:"0.88rem"}}>{other?.name?.[0]||"?"}</div>
          <div><div style={{fontWeight:700,fontSize:"0.95rem"}}>{other?.name||"Chat"}</div><div style={{fontSize:"0.75rem",color:"var(--text3)"}}>{typing?"✍️ typing...":other?.isVerified?"✅ Verified":""}</div></div>
        </div>
        <div className="chat-messages">
          {msgs.length===0&&<div style={{textAlign:"center",color:"var(--text3)",fontSize:"0.85rem",padding:"2rem"}}>No messages yet. Say hello! 👋</div>}
          {msgs.map(m=>{const sent=m.senderId===user?.id;return(
            <div key={m.id} className={`msg-wrap ${sent?"sent":"received"}`}>
              <div className={`msg-bubble ${sent?"sent":"received"}`}>{m.content}</div>
              <div className="msg-time">{ts(m.timestamp)}</div>
            </div>
          );})}
          <div ref={endRef}/>
        </div>
        <form className="chat-input-bar" onSubmit={send}>
          <input value={input} onChange={ht} placeholder="Type a message..." autoFocus/>
          <button type="submit" className="chat-send-btn">➤</button>
        </form>
      </div>
    ):(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:"1rem",color:"var(--text3)"}}>
        <div style={{fontSize:"3.5rem"}}>💬</div>
        <p style={{fontWeight:600}}>Select a conversation</p>
        <p style={{fontSize:"0.88rem"}}>or match with roommates first</p>
      </div>
    )}
  </div>);
}
