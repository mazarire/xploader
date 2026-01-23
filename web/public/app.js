const socket = io()
const status = document.getElementById("status")

socket.on("qr", () => {
  status.innerText = "Scan QR to connect"
})

socket.on("qr-scanned", () => {
  status.innerText = "Bot connected"
})

socket.on("pairing-code", code => {
  status.innerText = "Pairing code: " + code
})
