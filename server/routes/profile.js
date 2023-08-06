const { Router } = require('express')
const profileController = require('../controllers/profile')

const router = Router()

function profileRouter(webSocketServer) {
  router.post('/change-avatar', (req, res) => {
    profileController.changeAvatar(req, res, webSocketServer);
  });

  return router
}


module.exports = profileRouter
