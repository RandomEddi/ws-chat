const mysql = require('mysql')
const dbConfig = require('../configs/db')
require('dotenv').config()
const test = {
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'mysqlsuka123.',
  database: 'ws_chat'
}
const connection = mysql.createConnection(test)

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
  image BLOB,
  token VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL
)`)

connection.query(`CREATE TABLE IF NOT EXISTS Messages (
  id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT(10) NOT NULL,
  text TEXT NOT NULL,
  send_at DATE NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id)
  )`)

module.exports = connection
