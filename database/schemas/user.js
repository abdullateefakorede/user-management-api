const { default: mongoose } = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  fullname: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: { type: String },
  nationality: { type: String, required: true }
})

exports.User = mongoose.model('User', userSchema)
