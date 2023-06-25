const env = process.env
require('dotenv').config()

const db = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE_NAME
}

module.exports = db
