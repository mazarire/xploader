import fs from "fs"
import path from "path"

const usersPath = path.resolve("./users/users.json")

export function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  next()
}

export function login(req, res) {
  const { username, password } = req.body
  const users = JSON.parse(fs.readFileSync(usersPath))

  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (!user) {
    return res.status(401).send("Invalid login")
  }

  req.session.user = {
    username: user.username,
    role: user.role
  }

  res.redirect("/")
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login")
  })
}
