const mysql = require('mysql')
const dbConfig = require('../configs/db')
require('dotenv').config()

const connection = mysql.createConnection(dbConfig)

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ', err)
    return
  }
  console.log('Успешное подключение к базе данных')
})

connection.query(`CREATE TABLE IF NOT EXISTS Users (
  id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  imageUrl VARCHAR(50),
  token VARCHAR(1000) NOT NULL,
  password VARCHAR(1000) NOT NULL
)`)

connection.query(`CREATE TABLE IF NOT EXISTS Messages (
  id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT(10) NOT NULL,
  text TEXT NOT NULL,
  images JSON NOT NULL DEFAULT ('[]'),
  send_at DATE NOT NULL,
  directedTo INT(10),
  FOREIGN KEY (directedTo) REFERENCES Users(id),
  FOREIGN KEY (userId) REFERENCES Users(id)
  )`)

module.exports = connection
