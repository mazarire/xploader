export default async (sock, msg) => {
  if (msg.message.conversation === ".ping")
    await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pong" })
}
