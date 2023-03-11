const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const WebSocket = require('ws')

const app = express()

const server = http.createServer(app)

const webSocketServer = new WebSocket.Server({ server })

const dispatchEvent = (message, ws) => {
  const json = JSON.parse(message)
  console.log(json.payload)
  switch (json.event) {
    case 'chat-message':
      webSocketServer.clients.forEach((client) => client.send(message))
      break
    default:
      ws.send(new Error('wrong query').message)
      break
  }
}

webSocketServer.on('connection', (ws) => {
  ws.on('message', (m, isBinary) => {
    console.log(isBinary)
    dispatchEvent(m, ws)
  })

  ws.on('error', (e) => ws.send(e))

  ws.send('Hello world!')
})

const PORT = process.env.NODE_PORT || 5000

server.listen(PORT, () => console.log('server started'))
