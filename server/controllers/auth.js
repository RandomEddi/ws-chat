const jwt = require('jsonwebtoken')
const SECRET_KEY = 'za2b-457c33d-5e6f-7g8h'
const dbConnecton = require('../services/db')

async function register(req, res) {
  try {
    const { name, password } = req.body

    const rows = await new Promise((resolve) => {
      dbConnecton.query(
        `SELECT name from users where name = "${name}"`,
        (_, rows) => {
          resolve(rows)
        }
      )
    })

    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        payload: { error: 'name', text: 'Пользователь существует' }
      })
    }

    const signedToken = jwt.sign({ userId: name }, SECRET_KEY)
    dbConnecton.query(
      `INSERT INTO users (name, token, password) VALUES ("${name}", "${signedToken}", "${password}")`
    )
    dbConnecton.query(
      `SELECT id, name, token from users where name = "${name}"`,
      (_, rows) => {
        res.status(200).json({
          status: 'success',
          payload: rows[0]
        })
      }
    )
  } catch (error) {
    res.status(500).json({
      status: 'error',
      payload: 'Ошибка сервера'
    })
  }
}

async function login(req, res) {
  try {
    const { name, password } = req.body
    const rows = await new Promise((resolve) => {
      dbConnecton.query(
        `SELECT id, name, token, password, imageUrl from users where name = "${name}"`,
        (_, rows) => {
          resolve(rows)
        }
      )
    })

    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        payload: { error: 'name', text: 'Пользователь не найден' }
      })
    } else {
      if (rows[0].password === password) {
        res.status(200).json({
          status: 'success',
          payload: {
            name: rows[0].name,
            token: rows[0].token,
            id: rows[0].id,
            image: rows[0].imageUrl
          }
        })
      } else {
        res.status(401).json({
          status: 'error',
          payload: { error: 'password', text: 'Неверный пароль' }
        })
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      payload: 'Ошибка сервера'
    })
  }
}

async function verifyToken(req, res) {
  try {
    const token = req.body.token
    if (!token) {
      return res.status(401).json({
        status: 'error',
        payload: 'Отсутствует токен'
      })
    }

    jwt.verify(token, SECRET_KEY, (error, decodedToken) => {
      if (error) {
        res.status(401).json({
          status: 'error',
          payload: 'Неверный токен'
        })
      } else {
        dbConnecton.query(
          `SELECT id, name, token, imageUrl from users where token = "${token}"`,
          (_, rows) => {
            res.status(200).json({
              status: 'success',
              payload: rows[0]
            })
          }
        )
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      payload: 'Ошибка сервера'
    })
  }
}

module.exports = {
  register,
  login,
  verifyToken
}
