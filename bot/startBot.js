import {
  default as makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import pino from "pino"
import fs from "fs"
import { io } from "../web/server.js"
import { loadPlugins } from "./plugins/index.js"

/* ============================= */
/* START BOT                     */
/* ============================= */

export async function startBot(botId, config) {
  console.log(`🤖 Starting bot: ${botId}`)

  /* ---------- AUTH ---------- */
  const sessionPath = `./sessions/${botId}`
  const { state, saveCreds } =
    await useMultiFileAuthState(sessionPath)

  const { version } = await fetchLatestBaileysVersion()

  let isConnected = false
  let lastQRTime = 0

  /* ---------- SOCKET ---------- */
  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["NovaX-MD", "Chrome", "1.0"]
  })

  /* ---------- LOAD PLUGINS ---------- */
  const plugins = await loadPlugins()
  console.log(`🧩 Loaded ${plugins.length} plugins`)

  /* ============================= */
  /* CONNECTION & QR               */
  /* ============================= */

  sock.ev.on("connection.update", update => {
    const { connection, qr, lastDisconnect } = update

    /* ---- QR ---- */
    if (qr) {
      const now = Date.now()
      if (now - lastQRTime > 8000) {
        lastQRTime = now
        console.log("📱 QR generated")
        io.emit("qr", qr)
      }
    }

    /* ---- CONNECTED ---- */
    if (connection === "open") {
      console.log(`✅ ${botId} connected`)
      isConnected = true
      io.emit("connected")
    }

    /* ---- DISCONNECTED ---- */
    if (connection === "close") {
      isConnected = false
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log(`❌ Disconnected: ${reason}`)

      if (reason !== DisconnectReason.loggedOut) {
        startBot(botId, config)
      } else {
        console.log("🧹 Logged out – delete session to re-pair")
      }
    }
  })

  sock.ev.on("creds.update", saveCreds)

  /* ============================= */
  /* MESSAGE HANDLER               */
  /* ============================= */

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message) return
    if (msg.key.fromMe) return

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      ""

    /* ---- COMMANDS ONLY ---- */
    if (!body.startsWith(".")) return

    /* ---- AUTO REACT ---- */
    try {
      await sock.sendMessage(msg.key.remoteJid, {
        react: {
          text: "⚡",
          key: msg.key
        }
      })
    } catch {}

    const command = body.slice(1).split(" ")[0].toLowerCase()

    /* ---- PLUGINS ---- */
    for (const plugin of plugins) {
      if (!plugin.command) continue
      if (!plugin.command.includes(command)) continue

      try {
        await plugin.run({ sock, msg, config })
      } catch (e) {
        console.error(`❌ Plugin error [${command}]`, e)
      }
    }
  })

  /* ============================= */
  /* DASHBOARD PAIRING (SAFE)      */
  /* ============================= */

  io.on("connection", socket => {
    socket.on("request-pair", async number => {
      try {
        if (!isConnected) {
          socket.emit("pair-code", "WAIT_FOR_CONNECTION")
          return
        }

        const code = await sock.requestPairingCode(number)
        console.log("🔐 Pairing code:", code)
        socket.emit("pair-code", code)

      } catch (err) {
        console.error("❌ Pairing failed", err)
        socket.emit("pair-code", "FAILED")
      }
    })
  })

  return sock
}

