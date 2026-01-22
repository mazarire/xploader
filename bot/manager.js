import fs from "fs"
import { startBot } from "./startBot.js"

const bots = {}

export async function start(id) {
  if (bots[id]) return
  const config = JSON.parse(fs.readFileSync(`./bots/${id}.json`))
  bots[id] = await startBot(id, config)
}
