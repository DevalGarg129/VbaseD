# VbaseD v2 — Full-Stack Project Management

A complete Basecamp-inspired project management platform built with the **MERN stack** + **Socket.IO**, featuring real-time collaboration, kanban boards, team chat, analytics, calendar, and more.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | JWT register/login, protected routes, persistent sessions |
| 📋 **Kanban Board** | Drag-style status updates (To Do / In Progress / Done) |
| 💬 **Team Chat** | Real-time messaging via Socket.IO per project |
| 📊 **Analytics** | Task completion, priority breakdown, member workload charts |
| 📅 **Calendar** | All-project deadline view with task details per day |
| 🗓 **Timeline** | Visual Gantt-style task deadline overview |
| 👥 **Team Management** | Add/remove members, online status, search users |
| 🔔 **Notifications** | In-app notifications for task assignments, comments, project invites |
| 💬 **Task Comments** | Per-task threaded comments |
| 🎨 **Dark UI** | Material UI v6 dark theme, Framer Motion animations |

---

## 🛠 Tech Stack

**Frontend:** React 18, React Router v6, MUI v6, Framer Motion, Recharts, Socket.IO Client  
**Backend:** Node.js, Express 4, Mongoose 8, Socket.IO 4, JWT, bcryptjs  
**Database:** MongoDB Atlas

---

## 📁 Structure

```
VbaseD/
├── client/
│   └── src/
│       ├── context/        AuthContext, SocketContext
│       ├── pages/          Login, Register, Dashboard, ProjectPage, CalendarPage
│       ├── components/     Navbar, KanbanBoard, TeamChat, AnalyticsDashboard,
│       │                   TimelineView, TeamPanel, TaskCard, CreateProject/TaskDialog,
│       │                   TaskComments, Loader
│       ├── services/       api.js (axios + interceptors)
│       └── theme.js        MUI dark theme
└── server/
    ├── models/             User, Project, Task, Message
    ├── controllers/        auth, project, task, message
    ├── routes/             auth, project, task, message
    ├── middleware/         auth, error, notFound
    └── server.js           Express + Socket.IO
```

---

## 🚀 Quick Start

### 1. Clone & install

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Configure environment

Edit `server/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### 3. Run

```bash
# Terminal 1 – Server (with Socket.IO)
cd server && npm run dev

# Terminal 2 – Client
cd client && npm run dev
```

App: **http://localhost:3000** | API: **http://localhost:5000**

---

## 🔌 API Reference

### Auth `/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login, returns JWT |
| GET | `/me` | Get current user |
| GET | `/notifications` | Get notifications |
| PUT | `/notifications/read` | Mark all read |
| GET | `/search?q=` | Search users |

### Projects `/api/projects`
| Method | Route | Description |
|---|---|---|
| GET | `/` | All user projects (with task counts) |
| POST | `/` | Create project |
| GET | `/:id` | Get project (with members) |
| PUT | `/:id` | Update project |
| DELETE | `/:id` | Delete project + tasks |
| POST | `/:id/members` | Add member |
| DELETE | `/:id/members/:userId` | Remove member |
| GET | `/:id/analytics` | Task analytics |

### Tasks `/api/tasks`
| Method | Route | Description |
|---|---|---|
| POST | `/` | Create task |
| GET | `/my` | All tasks across user's projects |
| GET | `/:projectId` | Tasks for a project |
| PUT | `/:id` | Update task |
| DELETE | `/:id` | Delete task |
| POST | `/:id/comments` | Add comment |
| DELETE | `/:id/comments/:commentId` | Delete comment |

### Messages `/api/messages`
| Method | Route | Description |
|---|---|---|
| GET | `/:projectId` | Get chat history |
| POST | `/:projectId` | Send message |
| DELETE | `/:id` | Delete own message |

---

## 🔴 Socket.IO Events

| Event | Direction | Payload |
|---|---|---|
| `joinProject` | client→server | `projectId` |
| `leaveProject` | client→server | `projectId` |
| `sendMessage` | client→server | `{ ...message, projectId }` |
| `newMessage` | server→client | message object |
| `typing` | client→server | `{ projectId, name }` |
| `stopTyping` | client→server | `{ projectId, name }` |
| `userTyping` | server→client | `{ name }` |
| `userStopTyping` | server→client | `{ name }` |
| `taskUpdated` | client→server | `{ projectId, task }` |
| `onlineUsers` | server→client | `[userId, …]` |

---

## 📝 License
MIT
