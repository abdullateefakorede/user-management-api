const userRoutes = require('./user')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        '_' +
        Date.now() +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    )
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('ONLY_JPG/JPEG/PNG_FORMAT_ARE_ALLOWED!'))
    }
  }
})

module.exports = app => {
  app.use('/user', upload.single('profile_image'), userRoutes)
}
