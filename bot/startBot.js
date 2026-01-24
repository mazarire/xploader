import fs from "fs"
import {
  default as makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import pino from "pino"
import config from "../config.js"
import { loadPlugins } from "./plugins/index.js"

export async function startBot() {
  if (!fs.existsSync("./session"))
    fs.mkdirSync("./session")

  if (!fs.existsSync("./session/creds.json")) {
    const data =
      Buffer.from(config.SESSION_ID, "base64")
    fs.writeFileSync("./session/creds.json", data)
  }

  const { state, saveCreds } =
    await useMultiFileAuthState("./session")

  const { version } =
    await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: "silent" }),
    browser: ["NovaX-MD", "Chrome", "1.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  const plugins = await loadPlugins()

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message || msg.key.fromMe) return

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (!body.startsWith(config.prefix)) return

    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "⚡", key: msg.key }
    })

    const cmd =
      body.slice(1).split(" ")[0].toLowerCase()

    for (const p of plugins) {
      if (p.command.includes(cmd)) {
        await p.run({ sock, msg, config })
      }
    }
  })

  console.log("✅ NovaX-MD connected")
}
