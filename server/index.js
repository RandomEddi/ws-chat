const express = require('express')
const fs = require('fs')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')

const app = express()

app.use(express.static(path.resolve(__dirname, '..', 'dist')))

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
})

const server = http.createServer(app)

const webSocketServer = new WebSocket.Server({ server })

const dispatchEvent = (message, ws) => {
  const json = JSON.parse(message)
  console.log(json.payload)
  switch (json.event) {
    case 'chat-message':
      const messages =
        JSON.parse(fs.readFileSync('./messages.json')).messages || []
      messages.push(json.payload)
      webSocketServer.clients.forEach((client) =>
        client.send(
          JSON.stringify({ event: 'chat-message', payload: messages })
        )
      )
      fs.writeFile(
        './messages.json',
        JSON.stringify({ messages }),
        (err) => console.log
      )
      break
    default:
      ws.send(new Error('wrong query').message)
      break
  }
}

webSocketServer.on('connection', (ws) => {
  ws.on('message', (m) => {
    dispatchEvent(m, ws)
  })

  ws.on('error', (e) => ws.send(e))
  const messages = JSON.parse(fs.readFileSync('./messages.json')).messages || []
  ws.send(JSON.stringify({ event: 'chat-message', payload: messages }))
})

const PORT = process.env.NODE_PORT || 5000

server.listen(PORT, () => console.log('server started'))
