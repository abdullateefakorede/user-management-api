const UserController = require('../controllers/user.controller')
const AuthMiddleware = require('../middlewares/auth')
const Validators = require('../middlewares/validator')

const router = require('express').Router()

router.post('/signin', Validators.signIn, UserController.signIn)
router.post('/signup', Validators.signUp, UserController.signUp)
router.post(
  '/profilePicture',
  AuthMiddleware.authenticate,
  UserController.profilePicture
)
router.put(
  '/:username',
  AuthMiddleware.authenticate,
  Validators.editProfile,
  UserController.editProfile
)
router.delete(
  '/:username',
  AuthMiddleware.authenticate,
  UserController.deleteAccount
)

module.exports = router
