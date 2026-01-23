export default {
  command: ["ping"],
  desc: "Ping test",
  run: async ({ sock, msg }) => {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "🏓 Pong!"
    })
  }
}
