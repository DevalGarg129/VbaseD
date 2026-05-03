const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const notFound = require("./middleware/notFound");

const app = express();
const server = http.createServer(app);

/* =========================
   DATABASE CONNECTION
========================= */
connectDB();

/* =========================
   CORS CONFIG
========================= */
const allowedOrigins =
  (process.env.ALLOWED_ORIGINS &&
    process.env.ALLOWED_ORIGINS.split(",")) || [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://vbased.vercel.app",
  ];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // allow exact + all vercel preview deployments
    if (
      allowedOrigins.includes(origin) ||
      origin.includes(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   ROOT ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes")); // ✅ correct (plural)
app.use("/api/messages", require("./routes/messageRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

/* =========================
   ERROR HANDLING
========================= */
app.use(notFound);
app.use(errorHandler);

/* =========================
   SOCKET.IO
========================= */
const io = new Server(server, {
  cors: corsOptions,
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers.set(userId, socket.id);
  }

  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

  socket.on("joinProject", (projectId) => {
    socket.join(`project:${projectId}`);
  });

  socket.on("leaveProject", (projectId) => {
    socket.leave(`project:${projectId}`);
  });

  socket.on("sendMessage", (data) => {
    io.to(`project:${data.projectId}`).emit("newMessage", data);
  });

  socket.on("taskUpdated", (data) => {
    io.to(`project:${data.projectId}`).emit("taskUpdated", data);
  });

  socket.on("typing", (data) => {
    socket.to(`project:${data.projectId}`).emit("userTyping", data);
  });

  socket.on("stopTyping", (data) => {
    socket.to(`project:${data.projectId}`).emit("userStopTyping", data);
  });

  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId);
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});