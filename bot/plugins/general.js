export default async (sock, msg, cfg) => {
  if (!msg.message) return

  const from = msg.key.remoteJid
  const isGroup = from.endsWith("@g.us")

  const body =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    ""

  if (!body.startsWith(".")) return // only commands

  // 🔹 AUTO-REACT (command verification)
  try {
    await sock.sendMessage(from, {
      react: { text: "⚡", key: msg.key }
    })
  } catch {}

  const command = body.split(" ")[0].toLowerCase()
  const args = body.split(" ").slice(1).join(" ")

  // ===============================
  // BASIC COMMANDS
  // ===============================

  if (command === ".ping") {
    return sock.sendMessage(from, { text: "🏓 Pong! Bot is alive." })
  }

  if (command === ".alive") {
    return sock.sendMessage(from, {
      text: `🤖 ${cfg.botName} is running!\nUptime: ${process.uptime().toFixed(0)}s`
    })
  }

  if (command === ".runtime") {
    return sock.sendMessage(from, {
      text: `⏱ Runtime: ${process.uptime().toFixed(0)} seconds`
    })
  }

  if (command === ".owner") {
    return sock.sendMessage(from, {
      text: `👑 Owner: ${cfg.ownerName || "Bot Owner"}`
    })
  }

  // ===============================
  // FUN COMMANDS
  // ===============================

  if (command === ".joke") {
    return sock.sendMessage(from, {
      text: "😂 Why don’t programmers like nature? Too many bugs."
    })
  }

  if (command === ".quote") {
    return sock.sendMessage(from, {
      text: "💬 “Code is like humor. When you have to explain it, it’s bad.”"
    })
  }

  if (command === ".fact") {
    return sock.sendMessage(from, {
      text: "📌 WhatsApp uses the Signal protocol for encryption."
    })
  }

  if (command === ".coinflip") {
    const res = Math.random() > 0.5 ? "Heads 🪙" : "Tails 🪙"
    return sock.sendMessage(from, { text: res })
  }

  // ===============================
  // GROUP COMMANDS (safe placeholders)
  // ===============================

  if (command === ".tagall" && isGroup) {
    return sock.sendMessage(from, {
      text: "👥 Tagall feature ready (add mentions later)."
    })
  }

  if (command === ".groupinfo" && isGroup) {
    return sock.sendMessage(from, {
      text: "ℹ Group info command active."
    })
  }

  // ===============================
  // UTILITY
  // ===============================

  if (command === ".calc") {
    try {
      const result = eval(args)
      return sock.sendMessage(from, { text: `🧮 Result: ${result}` })
    } catch {
      return sock.sendMessage(from, { text: "❌ Invalid calculation." })
    }
  }

  if (command === ".tts") {
    return sock.sendMessage(from, {
      text: "🔊 TTS command detected (voice engine can be added later)."
    })
  }

  if (command === ".qr") {
    if (!args)
      return sock.sendMessage(from, { text: "❌ Provide text for QR." })

    return sock.sendMessage(from, {
      image: {
        url:
          "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
          encodeURIComponent(args)
      },
      caption: "📱 Generated QR Code"
    })
  }

  // ===============================
  // AI PLACEHOLDER
  // ===============================

  if (command === ".ai" || command === ".ask") {
    return sock.sendMessage(from, {
      text: "🤖 AI feature connected (API can be added later)."
    })
  }

  // ===============================
  // DOWNLOAD PLACEHOLDERS
  // ===============================

  if (
    [".ytmp3", ".ytmp4", ".tiktok", ".instagram", ".facebook"].includes(command)
  ) {
    return sock.sendMessage(from, {
      text: "📥 Downloader detected (engine will be added later)."
    })
  }

  // ===============================
  // FALLBACK
  // ===============================

  return sock.sendMessage(from, {
    text: "❓ Unknown command. Type .menu"
  })
}
