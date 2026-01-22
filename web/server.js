import express from "express"
import session from "express-session"
import http from "http"
import path from "path"
import { Server } from "socket.io"

import { requireAuth, login, logout } from "./auth.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET || "novax-secret",
    resave: false,
    saveUninitialized: false
  })
)

/* ---------- AUTH ROUTES ---------- */

app.get("/login", (_, res) =>
  res.sendFile(path.resolve("web/public/login.html"))
)

app.post("/login", login)

app.get("/logout", logout)

/* ---------- PROTECTED ROUTES ---------- */

app.use(requireAuth)

app.use(
  express.static(path.resolve("web/public"))
)

app.get("/", (_, res) =>
  res.sendFile(path.resolve("web/public/index.html"))
)

/* ---------- SOCKET.IO (QR STREAMING) ---------- */

io.on("connection", socket => {
  console.log("Dashboard connected")

  socket.on("disconnect", () => {
    console.log("Dashboard disconnected")
  })
})

/* ---------- START SERVER ---------- */

server.listen(PORT, () => {
  console.log(`🌐 Dashboard running on http://localhost:${PORT}`)
})

export { io }
