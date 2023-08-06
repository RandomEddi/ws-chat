const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')
const cors = require('cors')
require('dotenv').config()
const dispatchEvent = require('./websocket/dispatchEvent')
const dispatchBinaryEvent = require('./websocket/dispatchBinaryEvent')
const fileUpload = require('express-fileupload')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const usersRouter = require('./routes/users')
const chatRouter = require('./routes/chat')

const app = express()
const server = http.createServer(app)
const webSocketServer = new WebSocket.Server({ server })

app.use(express.static(path.resolve(__dirname, '..', 'dist')))

app.use(express.json())

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))

app.use('/', authRouter)
app.use('/', usersRouter)
app.use('/', chatRouter)
app.use('/', profileRouter(webSocketServer))

const avatarsDirectory = path.join(__dirname, 'avatars')
app.use(
  '/avatars',
  express.static(avatarsDirectory, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'image/jpeg',
    },
  }),
)

const chatImagesDirectory = path.join(__dirname, 'chat-images')
app.use(
  '/chat-images',
  express.static(chatImagesDirectory, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'image/jpeg',
    },
  }),
)

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
})

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
