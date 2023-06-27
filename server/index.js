const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')
const cors = require('cors')
require('dotenv').config()
const dispatchEvent = require('./websocket/dispatchEvent')
const dispatchBinaryEvent = require('./websocket/dispatchBinaryEvent')
const authRouter = require('./routes/auth')

const app = express()

app.use(express.static(path.resolve(__dirname, '..', 'dist')))

app.use(express.json())

app.use(cors())

app.use('/', authRouter)

const avatarsDirectory = path.join(__dirname, 'avatars')
app.use(
  '/avatars',
  express.static(avatarsDirectory, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'image/jpeg'
    }
  })
)

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
})

const server = http.createServer(app)

const webSocketServer = new WebSocket.Server({ server })

webSocketServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    if (typeof message === 'string') {
      dispatchEvent(message, ws, webSocketServer)
    } else if (typeof message === 'object') {
      dispatchBinaryEvent(message, ws, webSocketServer)
    }
  })
  ws.on('error', (event) => ws.send(event))
})

const PORT = process.env.NODE_PORT || 3000

server.listen(PORT, () => console.log('server started'))
