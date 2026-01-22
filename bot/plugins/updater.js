import simpleGit from "simple-git"
const git = simpleGit()

export default async (sock, msg) => {
  if (msg.message.conversation !== ".update") return
  await git.pull()
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ Updated" })
}
