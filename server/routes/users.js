const { Router } = require('express')
const usersController = require('../controllers/users')

const router = Router()

router.post('/get-users', usersController.getUsersByName)

module.exports = router
