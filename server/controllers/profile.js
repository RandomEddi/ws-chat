const dbConnection = require('../services/db')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

async function changeAvatar(req, res, webSocketServer) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        status: 'error',
        payload: 'Фото для загрузки не найдены.',
      })
    }
    const uploadedFile = req.files.file
    const { userId } = req.body
    const avatarDirectory = path.join(__dirname, '..', 'avatars')
    const imageUrl = `/avatars/${uuidv4()}.jpeg`

    if (!fs.existsSync(avatarDirectory)) {
      fs.mkdirSync(avatarDirectory)
    }

    fs.writeFile(
      path.join(__dirname, '..', imageUrl),
      uploadedFile.data,
      (err) => {
        if (err) {
          console.log('Error saving image:', err)
          return res.status(400).json({
            status: 'error',
            payload: 'Фото не загруженно',
          })
        } else {
          dbConnection.query(
            `SELECT id, imageUrl FROM users WHERE id = ${userId}`,
            (err, rows) => {
              if (!err && rows[0]?.imageUrl) {
                fs.unlink(
                  path.join(__dirname, '..', rows[0].imageUrl),
                  (err) => {
                    if (err) {
                      console.log(err)
                    }
                  },
                )
              }
            },
          )
          dbConnection.query(
            `UPDATE users SET imageUrl = "${imageUrl}" WHERE id = ${userId}`,
          )
          webSocketServer.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                event: 'avatar-change',
                payload: {
                  userId,
                  imageUrl,
                },
              }),
            )
          })

          return res.status(200).json({
            status: 'success',
            payload: 'Фото загруженно',
          })
        }
      },
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'error',
      payload: 'Ошибка сервера',
    })
  }
}

module.exports = {
  changeAvatar,
}
