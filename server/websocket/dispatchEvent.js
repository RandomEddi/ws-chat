const dbConnection = require('../services/db')

const dispatchEvent = async (message, ws, webSocketServer) => {
  const json = JSON.parse(message)
  try {
    switch (json.event) {
      case 'chat-message':
        const firstWordOfMessage = json.payload.text.split(' ')[0]
        let messageDirectedToId = null

        if (
          firstWordOfMessage.startsWith('@') &&
          firstWordOfMessage.slice(1).length > 0
        ) {
          messageDirectedToId = await new Promise((res) => {
            dbConnection.query(
              `SELECT id, name FROM users WHERE name = "${firstWordOfMessage.slice(
                1,
              )}"`,
              (_, rows) => {
                if (rows[0]) {
                  res(rows[0].id)
                } else {
                  res(null)
                }
              },
            )
          })
        }

        dbConnection.query(
          `INSERT INTO messages (userId, text, images, send_at${
            messageDirectedToId ? ', directedTo' : ''
          }) VALUES (?, ?, ?, ?${messageDirectedToId ? `, ?` : ''})`,
          [
            json.payload.userId,
            json.payload.text,
            JSON.stringify(json.payload.images),
            Date.now(),
            messageDirectedToId,
          ],
          (err, result) => {
            if (err) {
              throw Error(err)
            } else {
              dbConnection.query(
                `SELECT m.id AS message_id, m.text AS message_text, m.directedTo as message_directed_to, u.id as sender_id, u.name AS sender_name,m.images as message_images, u.imageUrl as sender_image, m.send_at AS send_at
                FROM Messages m
                JOIN Users u ON m.userId = u.id
                WHERE m.id = ${result.insertId}
                `,
                (_, rows) => {
                  if (messageDirectedToId) {
                    webSocketServer.clients.forEach((client) => {
                      if (
                        messageDirectedToId === client.userId ||
                        json.payload.userId === client.userId
                      ) {
                        client.send(
                          JSON.stringify({
                            event: 'chat-message',
                            payload: {
                              ...rows[0],
                              isMessageDirected:
                                messageDirectedToId === client.userId,
                            },
                          }),
                        )
                      }
                    })
                  } else {
                    webSocketServer.clients.forEach((client) => {
                      client.send(
                        JSON.stringify({
                          event: 'chat-message',
                          payload: rows[0],
                        }),
                      )
                    })
                  }
                },
              )
            }
          },
        )

        break
      case 'chat-messages':
        dbConnection.query(
          `
        SELECT m.id AS message_id, u.name as sender_name, u.id as sender_id, u.imageUrl as sender_image, m.directedTo as message_directed_to, m.images AS message_images, m.text AS message_text, m.send_at as send_at
        FROM Messages m, Users u
        WHERE m.userId = u.id 
        `,
          (error, rows) => {
            if (error) {
              console.log(error)
            } else {
              ws.send(
                JSON.stringify({
                  event: 'chat-messages',
                  payload:
                    rows
                      .filter((m) => {
                        if (
                          m.sender_id === ws.userId ||
                          m.message_directed_to === null ||
                          m.message_directed_to === ws.userId
                        ) {
                          return m
                        }
                        return null
                      })
                      .sort((a, b) => a.message_id - b.message_id) || [],
                }),
              )
            }
          },
        )

        break
      case 'me':
        ws.userId = json.payload
        break
      default:
        ws.send(new Error('wrong query').message)
        break
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = dispatchEvent
