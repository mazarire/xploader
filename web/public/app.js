const socket = io()
const status = document.getElementById("status")

function openQR() {
  window.open("/qr.html", "qr", "width=360,height=480")
}

function pair() {
  const number = document.getElementById("number").value.trim()

  if (!number) {
    alert("Enter your WhatsApp number")
    return
  }

  status.innerText = "Generating pairing code…"
  socket.emit("request-pair", number)
}

socket.on("pair-code", code => {
  alert(
    "PAIRING CODE:\n\n" + code +
    "\n\nOpen WhatsApp → Linked Devices → Link a Device → Enter Code"
  )
  status.innerText = "Enter the code on WhatsApp"
})

socket.on("connected", () => {
  status.innerText = "✅ WhatsApp Connected"
})

socket.on("connect", () => {
  status.innerText = "Dashboard connected"
})
