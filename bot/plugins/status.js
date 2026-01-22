export default async (sock, msg, cfg) => {
  if (!msg.key.remoteJid.includes("status@broadcast")) return
  if (cfg.autoViewStatus) await sock.readMessages([msg.key])
  if (cfg.autoLikeStatus)
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "❤️", key: msg.key }
    })
}
