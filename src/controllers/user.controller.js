const bcrypt = require('bcryptjs')
const { User } = require('../../database/schemas/user')
const AuthService = require('../services/auth')
const queryHelper = require('../helpers/query')
const responseHelper = require('../helpers/response')

class UserController {
  static async signIn (req, res) {
    try {
      const { email, username, password } = req.body
      const user = await User.findOne().or([
        { email: email },
        { username: username }
      ])
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return responseHelper.errorHandler(
          res,
          'INCORRECT_EMAIL_OR_PASSWORD',
          400
        )
      }
      const data = { username: user.username, id: user.id }
      const token = AuthService.generateToken(data)
      AuthService.decodeToken(token)
      req.user = data
      return responseHelper.successHandler(res, 'LOGIN_SUCCESSFUL', {
        token,
        user: data
      })
    } catch (error) {
      console.log(error)
    }
  }

  static async signUp (req, res) {
    try {
      const user = await User.findOne().or([
        { email: req.body.email },
        { username: req.body.username }
      ])
      if (user) {
        return responseHelper.errorHandler(
          res,
          'USER_ALREADY_EXIST_PLEASE_SIGNIN',
          400
        )
      }
      const password = await AuthService.hashPassword(req.body.password, 10)
      const newUser = {
        ...req.body,
        password
      }
      await User.create(newUser)
      const data = queryHelper.hidePassword(newUser)
      return responseHelper.successHandler(res, 'SIGNUP_SUCCESSFUL', data)
    } catch (error) {
      console.log(error)
    }
  }

  static async profilePicture (req, res) {
    try {
      const imagePath =
        req.protocol + '://' + req.hostname + '/' + req.file.path
      const data = await User.findOneAndUpdate(
        { username: req.user.username },
        { imageUrl: imagePath },
        {
          new: true
        }
      )
      return responseHelper.successHandler(
        res,
        'PROFILE_PICTURE_SUCCESSFULLY_UPDATED',
        data
      )
    } catch (error) {
      console.log(error)
    }
  }

  static async editProfile (req, res) {
    try {
      const user = await User.findOne({ username: req.params.username }).exec()
      if (!user) {
        return responseHelper.errorHandler(res, 'USER_NOT_FOUND', 400)
      }
      if (user.username !== req.user.username) {
        return responseHelper.errorHandler(res, 'NOT_AUTHORIZED', 401)
      }
      const password = await AuthService.hashPassword(req.body.password, 10)
      const userData = {
        ...req.body,
        password
      }
      const data = await User.findOneAndUpdate(
        { username: req.params.username },
        userData,
        {
          new: true
        }
      )
      return responseHelper.successHandler(
        res,
        'USER_PROFILE_SUCCESSFULLY_UPDATED',
        data
      )
    } catch (error) {
      console.log(error)
    }
  }

  static async deleteAccount (req, res) {
    try {
      const user = await User.findOne({ username: req.params.username }).exec()
      if (!user) {
        return responseHelper.errorHandler(res, 'USER_NOT_FOUND', 400)
      }
      if (user.username !== req.user.username) {
        return responseHelper.errorHandler(res, 'NOT_AUTHORIZED', 401)
      }
      await user.remove()
      return responseHelper.successHandler(res, 'USER_SUCCESSFULLY_DELETED', {})
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = UserController
