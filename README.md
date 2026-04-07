# 🏠 RoomieFind_Vineela

A production-ready Smart Rental & Roommate Matching Platform built by Vineela Pottabathini.

**Live Frontend:** https://github.com/pottabathinivineela/RoomieFind (Vercel)  
**Live Backend:** https://roomiefind.onrender.com

---

## 🚀 Run Locally (3 commands)

```bash
# Terminal 1 – Backend
cd backend
npm install && npm run seed && npm start

# Terminal 2 – Frontend  
cd frontend
npm install && npm run dev
```

Open: http://localhost:3000

## 🔑 Demo Accounts  (password: `password123`)

| Email | Role |
|-------|------|
| vineela@example.com | Owner |
| raj@example.com | Owner |
| arjun@example.com | Tenant |
| sana@example.com | Tenant |
| vikram@example.com | Tenant |

## ✅ Production URLs (already baked in)

All API calls point directly to:
`https://roomiefind.onrender.com/api/...`

No proxy. No localhost. Works on Vercel out of the box.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Custom CSS (Plus Jakarta Sans) |
| Backend | Node.js, Express, Socket.io |
| Auth | JWT + bcrypt |
| Database | JSON flat-files (no MongoDB needed locally) |
| Realtime | Socket.io WebSockets |
| Deploy | Frontend → Vercel · Backend → Render |
