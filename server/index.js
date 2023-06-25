const express = require('express')
const fs = require('fs')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')
const cors = require('cors')
const dbConnection = require('./services/db')
require('dotenv').config()

const authRouter = require('./routes/auth')

const app = express()

app.use(express.static(path.resolve(__dirname, '..', 'dist')))

app.use(express.json())

app.use(cors())

app.use('/', authRouter)

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
})

const server = http.createServer(app)

const webSocketServer = new WebSocket.Server({ server })

const dispatchEvent = (message, ws) => {
  const json = JSON.parse(message)
  switch (json.event) {
    case 'chat-message':
      dbConnection.query(
        `INSERT INTO messages (userId, text, send_at) VALUES (${
          json.payload.userId
        }, "${json.payload.text}", ${Date.now()})`,
        (err, result) => {
          if (err) {
            throw Error(err)
          } else {
            dbConnection.query(
              `SELECT m.id AS message_id, m.text AS message_text, u.name AS sender_name, m.send_at AS send_at
              FROM Messages m
              JOIN Users u ON m.userId = u.id
              WHERE m.id = ${result.insertId}
              `,
              (_, rows) => {
                webSocketServer.clients.forEach((client) =>
                  client.send(
                    JSON.stringify({ event: 'chat-message', payload: rows[0] })
                  )
                )
              }
            )
          }
        }
      )

      break
    case 'chat-messages':
      dbConnection.query(
        `
      SELECT m.id AS message_id, u.name as sender_name, m.text AS message_text, m.send_at as send_at
      FROM Messages m, Users u
      WHERE m.userId = u.id 
      `,
        (error, rows) => {
          if (error) {
          } else {
            ws.send(
              JSON.stringify({
                event: 'chat-messages',
                payload: rows || []
              })
            )
          }
        }
      )

      break
    case 'me':
      ws.userId = json.payload
      break
    default:
      ws.send(new Error('wrong query').message)
      break
  }
}
const dispatchBinaryEvent = (message, ws) => {
  const avatarDirectory = path.join(__dirname, 'avatars');
  const imageUrl = path.join(avatarDirectory, `${ws.userId}.jpeg`);

  if (!fs.existsSync(avatarDirectory)) {
    fs.mkdirSync(avatarDirectory);
  }
  fs.writeFile(imageUrl, message, (err) => {
    if (err) {
      console.log('Error saving image:', err)
    } else {
      console.log('ggodd')
      dbConnection.query(
        `UPDATE users SET imageUrl = ${imageUrl} WHERE id=${ws.userId}`
      )
    }
  })
}

webSocketServer.on('connection', (ws, req) => {
  ws.on('message', (m) => {
    if (typeof m === 'string') {
      dispatchEvent(m, ws)
    } else if (typeof m === 'object') {
      dispatchBinaryEvent(m, ws)
    }
  })
  ws.on('error', (e) => ws.send(e))
})

const PORT = process.env.NODE_PORT || 5000

server.listen(PORT, () => console.log('server started'))
