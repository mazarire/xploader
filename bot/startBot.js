import makeWASocket from "@whiskeysockets/baileys"
import { io } from "../web/server.js"

export async function startBot(id, config) {
  const sock = makeWASocket({ /* your options */ })

  sock.ev.on("connection.update", update => {
    if (update.qr) {
      console.log(`[${id}] QR RECEIVED`)
      io.emit("qr", update.qr)
    }
  })

  return sock
}

}
