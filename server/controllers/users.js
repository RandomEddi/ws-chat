const dbConnecton = require('../services/db')

async function getUsersByName(req, res) {
  try {
    dbConnecton.query(`SELECT id, name, imageUrl FROM users${
      req.body.name ? ` WHERE name LIKE '%${req.body.name.toLowerCase()}%'` : ''
    } LIMIT 4`, (err, rows) => {
      if (err) {
        console.log(err)
        throw new Error(err)
      }
      res.status(200).json(rows)
    })
  } catch (err) {
    res.status(500)
    console.log(err)
  }
}

module.exports = {
  getUsersByName,
}
