export default async (sock, msg) => {
  const ctx = msg.message.extendedTextMessage
  if (!ctx?.text.startsWith(".kick")) return
  await sock.groupParticipantsUpdate(
    msg.key.remoteJid,
    ctx.contextInfo.mentionedJid,
    "remove"
  )
}
