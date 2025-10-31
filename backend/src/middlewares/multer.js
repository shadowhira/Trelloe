const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { default: cloudinary } = require('~/config/cloudinary')

const storageAvatar = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    format: 'jpg'
  }
})

const upload = multer({ storage: storageAvatar })


export default upload

