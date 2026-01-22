export default async (sock, msg, cfg) => {
  const text = msg.message.conversation
  if (text !== ".menu") return

  await sock.sendMessage(msg.key.remoteJid, {
    text: `
╔═════〔 🤖 ${cfg.botName} 〕═════╗

📥 DOWNLOAD
.ytmp3 <link>
.ytmp4 <link>
.tiktok <link>
.image <name>

🎬 CONVERT
.tomp3 (reply audio)
.tovn (reply video)
.sticker (reply image)

👥 GROUP
.tagall
.kick @user
.add +number

👑 ADMIN
.promote @user
.demote @user

⚙ SYSTEM
.menu
.ping
.update

╚════════════════════════╝`
  })
}
