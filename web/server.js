import express from "express"
import http from "http"
import path from "path"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
export const io = new Server(server)

app.use(express.static("web/public"))

server.listen(process.env.PORT || 3000)

