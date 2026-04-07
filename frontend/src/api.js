import axios from "axios";
export const API_BASE="https://roomiefind-vineela.onrender.com";
const api=axios.create({baseURL:API_BASE,timeout:20000});
api.interceptors.request.use(cfg=>{
  const t=localStorage.getItem("rf_token");
  if(t)cfg.headers.Authorization=`Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(r=>r,err=>{
  if(err.response?.status===401){localStorage.removeItem("rf_token");window.location.href="/login";}
  return Promise.reject(err);
});
export default api;
