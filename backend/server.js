// ─────────────────────────────────────────────────────────────────────────────
// server.js  —  RoomieFind_Vineela  |  PRODUCTION-READY
// Deploy target: Render (https://roomiefind-vineela.onrender.com)
// ─────────────────────────────────────────────────────────────────────────────

const express  = require("express");
const http     = require("http");
const cors     = require("cors");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

// ── Import your route files (adjust paths if yours differ) ───────────────────
const authRoutes     = require("./routes/auth");
const listingRoutes  = require("./routes/listings");
const matchRoutes    = require("./routes/matches");
const chatRoutes     = require("./routes/chat");
const reviewRoutes   = require("./routes/reviews");
const userRoutes     = require("./routes/users");

// ── Optionally load .env in local dev (Render injects vars automatically) ────
if (process.env.NODE_ENV !== "production") {
  try { require("dotenv").config(); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CREATE APP + HTTP SERVER  (only one of each — no duplicates)
// ─────────────────────────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORS  —  configured EXACTLY ONCE
//    • credentials: true  →  sends cookies / Authorization header cross-origin
//    • Only the two origins below are whitelisted
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://roomie-find-vineela.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (incomingOrigin, callback) => {
    // Allow server-to-server requests (no Origin header) and whitelisted origins
    if (!incomingOrigin || ALLOWED_ORIGINS.includes(incomingOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin "${incomingOrigin}" is not allowed`));
    }
  },
  credentials: true,                                      // required for withCredentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));          // ← applied once, handles preflight too
app.options("*", cors(corsOptions)); // ← explicit OPTIONS pre-flight for all routes

// ─────────────────────────────────────────────────────────────────────────────
// 3. BODY PARSING
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────────────────────
// 4. SOCKET.IO  —  same CORS config, no second copy
// ─────────────────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);   // make io available inside routes via req.app.get("io")

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROUTES
//    POST /api/auth/register  ←── frontend calls this to create account
//    POST /api/auth/login     ←── frontend calls this to sign in
//    GET  /api/auth/me        ←── frontend calls this on every page load
// ─────────────────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);      // → /api/auth/login, /api/auth/register, /api/auth/me
app.use("/api/listings", listingRoutes);
app.use("/api/matches",  matchRoutes);
app.use("/api/chat",     chatRoutes);
app.use("/api/reviews",  reviewRoutes);
app.use("/api/users",    userRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// 6. HEALTH CHECK  —  visit /api/health to verify Render deployment is alive
// ─────────────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    app: "RoomieFind_Vineela",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. 404 FALLBACK
// ─────────────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. SOCKET.IO REAL-TIME CHAT
// ─────────────────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("send_message", ({ roomId, senderId, receiverId, content }) => {
    if (!content?.trim()) return;
    const message = {
      id: uuidv4(),
      roomId,
      senderId,
      receiverId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    // Persist message via your db utility
    try {
      const db = require("./utils/db");
      const msgs = db.findAll("messages");
      msgs.push(message);
      db.writeAll("messages", msgs);
    } catch {}
    io.to(roomId).emit("new_message", message);
  });

  socket.on("typing",      ({ roomId, userId }) => socket.to(roomId).emit("user_typing", { userId }));
  socket.on("stop_typing", ({ roomId })         => socket.to(roomId).emit("user_stop_typing"));
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. START SERVER
//     Render sets process.env.PORT automatically — never hard-code 5000 only
// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n  RoomieFind_Vineela API is running`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health\n`);
});
