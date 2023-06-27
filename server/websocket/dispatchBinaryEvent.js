const dbConnection = require('../services/db')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

const dispatchBinaryEvent = (message, ws, webSocketServer) => {
  const avatarDirectory = path.join(__dirname, '..', 'avatars')
  const imageUrl = `/avatars/${uuidv4()}.jpeg`

  if (!fs.existsSync(avatarDirectory)) {
    fs.mkdirSync(avatarDirectory)
  }
  fs.writeFile(path.join(__dirname, '..', imageUrl), message, (err) => {
    if (err) {
      console.log('Error saving image:', err)
    } else {
      dbConnection.query(
        `SELECT id, imageUrl FROM users WHERE id = ${ws.userId}`,
        (err, rows) => {
          if (!err && rows[0]?.imageUrl) {
            fs.unlink(path.join(__dirname, '..', rows[0].imageUrl), (err) => {
              if (err) {
                console.log(err)
              }
            })
          }
        }
      )
      dbConnection.query(
        `UPDATE users SET imageUrl = "${imageUrl}" WHERE id = ${ws.userId}`
      )
      webSocketServer.clients.forEach((client) =>
        client.send(
          JSON.stringify({
            event: 'avatar-change',
            payload: {
              userId: ws.userId,
              imageUrl
            }
          })
        )
      )
    }
  })
}

module.exports = dispatchBinaryEvent
