const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

async function uploadChatImage(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        status: 'error',
        payload: 'Фото для загрузки не найдены.',
      })
    }
    const uploadedFiles = req.files
    const chatImagesDirectory = path.join(__dirname, '..', 'chat-images')

    if (!fs.existsSync(chatImagesDirectory)) {
      fs.mkdirSync(chatImagesDirectory)
    }

    const savedFiles = []

    Object.values(uploadedFiles).forEach((file) => {
      const uuid = uuidv4()
      const imageUrl = `/chat-images/${uuid}.jpeg`
      try {
        fs.writeFileSync(path.join(__dirname, '..', imageUrl), file.data)
        savedFiles.push(imageUrl)
      } catch (err) {
        console.log(err)
      }
    })

    res.status(200).json({
      status: 'success',
      payload: savedFiles,
    })
  } catch (err) {
    res.status(500)
    console.log(err)
  }
}

async function deleteChatImage(req, res) {
  try {
    const { imageUrl } = req.body
    
    fs.unlink(path.join(__dirname, '..', imageUrl), (err) => {
      if (err) {
        console.log(err)
        throw new Error(err)
      }
      res.status(200).json({
        status: 'success',
        payload: 'Фото удалено.',
      })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'error',
      payload: 'Фото не удалено.',
    })
  }
}

module.exports = {
  uploadChatImage,
  deleteChatImage,
}
