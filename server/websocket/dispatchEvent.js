const dbConnection = require('../services/db')

const dispatchEvent = (message, ws, webSocketServer) => {
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
              `SELECT m.id AS message_id, m.text AS message_text, u.id as sender_id, u.name AS sender_name, u.imageUrl as sender_image, m.send_at AS send_at
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
      SELECT m.id AS message_id, u.name as sender_name, u.id as sender_id, u.imageUrl as sender_image, m.text AS message_text, m.send_at as send_at
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

module.exports = dispatchEvent
