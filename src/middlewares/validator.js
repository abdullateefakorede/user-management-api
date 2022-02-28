const { signInSchema, signUpSchema } = require('../utils/schemas')

class Validators {
  static signIn (req, res, next) {
    const { error } = signInSchema.validate(req.body, { abortEarly: false })

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        data: { error: error.details }
      })
    }
    next()
  }

  static signUp (req, res, next) {
    const { error } = signUpSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        data: { error: error.details }
      })
    }
    next()
  }

  static editProfile (req, res, next) {
    const { error } = editProfileSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        data: { error: error.details }
      })
    }
    next()
  }
}

module.exports = Validators
