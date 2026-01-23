import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys"

import fs from "fs"
import { io } from "../web/server.js"
import { messageHandler } from "./core/handler.js"

export async function startBot(id, config) {
  try {
    const sessionPath = `./sessions/${id}`

    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true })
    }

    const { state, saveCreds } =
      await useMultiFileAuthState(sessionPath)

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      browser: ["NovaX-MD", "Chrome", "1.0"]
    })

    /* ---------- SAVE SESSION ---------- */
    sock.ev.on("creds.update", saveCreds)

    /* ---------- CONNECTION + QR ---------- */
    sock.ev.on("connection.update", (update) => {
      const { connection, qr, lastDisconnect } = update

      if (qr) {
        console.log("📸 QR GENERATED")
        io.emit("qr", qr)
      }

      if (connection === "open") {
        console.log("✅ WhatsApp connected")
        io.emit("qr-scanned")
      }

      if (connection === "close") {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut

        console.log(
          "❌ Connection closed. Reconnect:",
          shouldReconnect
        )

        if (shouldReconnect) {
          startBot(id, config)
        }
      }
    })

    /* ---------- MESSAGE HANDLER ---------- */
    sock.ev.on("messages.upsert", async (msg) => {
      await messageHandler(sock, msg)
    })

    return sock
  } catch (err) {
    console.error("❌ Failed to start bot:", err)
  }
}


