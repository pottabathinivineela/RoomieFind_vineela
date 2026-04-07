import{createContext,useContext,useState,useEffect}from"react";
import api from"../api";
const Ctx=createContext(null);
export function AuthProvider({children}){
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{
    const t=localStorage.getItem("rf_token");
    if(!t){setLoading(false);return;}
    api.get("/auth/me").then(r=>setUser(r.data)).catch(()=>{localStorage.removeItem("rf_token");}).finally(()=>setLoading(false));
  },[]);
  const login=async(email,password)=>{
    const{data}=await api.post("/auth/login",{email,password});
    localStorage.setItem("rf_token",data.token);setUser(data.user);return data.user;
  };
  const register=async(form)=>{
    const{data}=await api.post("/auth/register",form);
    localStorage.setItem("rf_token",data.token);setUser(data.user);return data.user;
  };
  const logout=()=>{localStorage.removeItem("rf_token");setUser(null);};
  return<Ctx.Provider value={{user,loading,login,register,logout}}>{children}</Ctx.Provider>;
}
export const useAuth=()=>useContext(Ctx);
