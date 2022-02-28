const AuthService = require('../services/auth')

class AuthMiddleware {
  static authenticate (req, res, next) {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Missing or invalid token',
        success: false,
        data: null
      })
    }

    try {
      const decoded = AuthService.decodeToken(token)
      req.user = decoded
      return next()
    } catch (err) {
      return res.status(401).json({
        message: 'Bad/Expired token',
        success: false,
        data: null
      })
    }
  }
}

module.exports = AuthMiddleware
