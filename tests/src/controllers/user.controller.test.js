const { mockRequest, mockResponse } = require('mock-req-res')
const { User } = require('../../../database/schemas/user')
const UserController = require('../../../src/controllers/user.controller')
const queryHelper = require('../../../src/helpers/query')
const responseHelper = require('../../../src/helpers/response')
const AuthService = require('../../../src/services/auth')
const bcrypt = require('bcryptjs')

describe('UserController', () => {
  beforeEach(() => jest.clearAllMocks())
  describe('signIn', () => {
    it('should call successHandler with valid details', async () => {
      const mockReq = mockRequest({
        body: {
          email: 'test01@gmail.com',
          password: 'Test0890@'
        }
      })
      const mockRes = mockResponse()
      const user = new User({
        _id: 'fg7642fy8w3rfr378fr',
        email: mockReq.body.email,
        username: 'test01',
        password: 'fgsvf326fegv264vffbh24f84f2ywhf2478f4f8'
      })
      const data = { username: user.username, id: user.id }
      const message = 'LOGIN_SUCCESSFUL'
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          or: () => user
        }))
      const mockCompare = jest.spyOn(bcrypt, 'compare').mockReturnValue(true)
      const token = '76r243ft3g4f734f73uf3uhc3eyt2etyfdgefgjy23#761e23f'
      const mockGenerateToken = jest
        .spyOn(AuthService, 'generateToken')
        .mockReturnValue(token)
      const mockSuccessHandler = jest.spyOn(responseHelper, 'successHandler')

      await UserController.signIn(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockCompare).toHaveBeenNthCalledWith(
        1,
        mockReq.body.password,
        user.password
      )
      expect(mockGenerateToken).toHaveBeenNthCalledWith(1, data)
      expect(mockSuccessHandler).toHaveBeenCalledTimes(1)
      expect(mockSuccessHandler).toHaveBeenCalledWith(mockRes, message, {
        token,
        user: data
      })
    })
    it('should call errorHandler with invalid password', async () => {
      const mockReq = mockRequest({
        body: {
          email: 'test01@gmail.com',
          password: 'test0890@'
        }
      })
      const mockRes = mockResponse()
      const user = new User({
        _id: 'fg7642fy8w3rfr378fr',
        email: mockReq.body.email,
        username: 'test01',
        password: 'fgsvf326fegv264vffbh24f84f2ywhf2478f4f8'
      })
      const message = 'INCORRECT_EMAIL_OR_PASSWORD'
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          or: () => user
        }))
      const mockCompare = jest.spyOn(bcrypt, 'compare').mockReturnValue(false)
      const mockErrorHandler = jest.spyOn(responseHelper, 'errorHandler')

      await UserController.signIn(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockCompare).toHaveBeenNthCalledWith(
        1,
        mockReq.body.password,
        user.password
      )
      expect(mockErrorHandler).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledWith(mockRes, message, 400)
    })
  })

  describe('signUp', () => {
    it('should call successHandler with valid details', async () => {
      const mockReq = mockRequest({
        body: {
          username: 'test03',
          email: 'test03@gmail.com',
          password: 'Test0890@',
          fullname: 'Test 03',
          nationality: 'Nigerian'
        }
      })
      const mockRes = mockResponse()
      const password = '76r243ft3g4f734f73uf3uhc3eyt2etyfdgefgjy23%re23yu4f'
      const user = {
        ...mockReq.body,
        password
      }
      const data = {
        username: mockReq.body.username,
        email: mockReq.body.email,
        fullname: mockReq.body.fullname,
        nationality: mockReq.body.nationality
      }
      const message = 'SIGNUP_SUCCESSFUL'
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          or: () => undefined
        }))
      const mockCreate = jest
        .spyOn(User, 'create')
        .mockImplementationOnce(() => user)
      const mockHashPassword = jest
        .spyOn(AuthService, 'hashPassword')
        .mockReturnValue(password)
      const mockQueryHandler = jest
        .spyOn(queryHelper, 'hidePassword')
        .mockImplementationOnce(() => data)
      const mockSuccessHandler = jest.spyOn(responseHelper, 'successHandler')

      await UserController.signUp(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockHashPassword).toHaveBeenNthCalledWith(
        1,
        mockReq.body.password,
        10
      )
      expect(mockCreate).toHaveBeenNthCalledWith(1, user)
      expect(mockQueryHandler).toHaveBeenNthCalledWith(1, user)
      expect(mockSuccessHandler).toHaveBeenCalledTimes(1)
      expect(mockSuccessHandler).toHaveBeenCalledWith(mockRes, message, data)
    })
    it('should call errorHandler when user already exist', async () => {
      const mockReq = mockRequest({
        body: {
          username: 'test01',
          email: 'test01@gmail.com',
          password: 'fest0890@',
          fullname: 'Test Test',
          nationality: 'Nigerian'
        }
      })
      const mockRes = mockResponse()
      const message = 'USER_ALREADY_EXIST_PLEASE_SIGNIN'
      const user = new User({
        _id: 'fg7642fy8w3rfr378fr',
        email: mockReq.body.email,
        username: mockReq.body.username,
        password: 'fgsvf326fegv264vffbh24f84f2ywhf2478f4f8'
      })
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          or: () => user
        }))
      const mockErrorHandler = jest.spyOn(responseHelper, 'errorHandler')

      await UserController.signUp(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledWith(mockRes, message, 400)
    })
  })

  describe('profilePicture', () => {
    it('should call successHandler with valid payload', async () => {
      const mockReq = mockRequest({
        file: {
          path: 'public/uploads'
        },
        host: 'localhost',
        user: {
          username: 'test01'
        },
        protocol: 'http'
      })
      const mockRes = mockResponse()
      const imagePath =
        mockReq.protocol + '://' + mockReq.hostname + '/' + mockReq.file.path
      const message = 'PROFILE_PICTURE_SUCCESSFULLY_UPDATED'
      const data = {}
      const mockFindOneAndUpdate = jest
        .spyOn(User, 'findOneAndUpdate')
        .mockImplementationOnce(() => data)
      const mockSuccessHandler = jest.spyOn(responseHelper, 'successHandler')

      await UserController.profilePicture(mockReq, mockRes)

      expect(mockFindOneAndUpdate).toHaveBeenNthCalledWith(
        1,
        { username: mockReq.user.username },
        { imageUrl: imagePath },
        {
          new: true
        }
      )
      expect(mockSuccessHandler).toHaveBeenCalledTimes(1)
      expect(mockSuccessHandler).toHaveBeenCalledWith(mockRes, message, data)
    })
    it('should log error when error is found', async () => {
      const mockReq = mockRequest({
        file: {
          path: 'public/uploads'
        },
        host: 'localhost',
        user: {
          username: 'test01'
        },
        protocol: 'http'
      })
      const mockRes = mockResponse()
      const imagePath =
        mockReq.protocol + '://' + mockReq.hostname + '/' + mockReq.file.path
      const error = new Error()
      const mockFindOneAndUpdate = jest
        .spyOn(User, 'findOneAndUpdate')
        .mockImplementationOnce(() => {
          throw error
        })
      const mockLog = jest.spyOn(console, 'log')

      await UserController.profilePicture(mockReq, mockRes)

      expect(mockFindOneAndUpdate).toHaveBeenNthCalledWith(
        1,
        { username: mockReq.user.username },
        { imageUrl: imagePath },
        {
          new: true
        }
      )
      expect(mockLog).toHaveBeenCalledTimes(1)
      expect(mockLog).toHaveBeenCalledWith(error)
    })
  })

  describe('editProfile', () => {
    it('should call successHandler with valid details', async () => {
      const mockReq = mockRequest({
        body: {
          username: 'test01',
          email: 'test01@gmail.com',
          password: 'Test0890@',
          fullname: 'Test 01',
          nationality: 'Nigerian'
        },
        params: {
          username: 'test01'
        },
        user: {
          username: 'test01'
        }
      })
      const mockRes = mockResponse()
      const user = new User({
        _id: 'fg7642fy8w3rfr378fr',
        email: mockReq.body.email,
        username: mockReq.body.username,
        password: 'fgsvf326fegv264vffbh24f84f2ywhf2478f4f8',
        fullname: mockReq.body.fullname,
        nationality: mockReq.body.nationality
      })
      const data = {
        username: mockReq.body.username,
        email: mockReq.body.email,
        password: 'fgsvf326fegv264vffbh24f84f2ywhf2478f4f8',
        fullname: mockReq.body.fullname,
        nationality: mockReq.body.nationality
      }
      const message = 'USER_PROFILE_SUCCESSFULLY_UPDATED'
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          exec: () => user
        }))
      const mockFindOneAndUpdate = jest
        .spyOn(User, 'findOneAndUpdate')
        .mockImplementationOnce(() => data)
      const mockHashPassword = jest
        .spyOn(AuthService, 'hashPassword')
        .mockReturnValue(data.password)
      const mockSuccessHandler = jest.spyOn(responseHelper, 'successHandler')

      await UserController.editProfile(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockHashPassword).toHaveBeenNthCalledWith(
        1,
        mockReq.body.password,
        10
      )
      expect(mockFindOneAndUpdate).toHaveBeenNthCalledWith(
        1,
        { username: mockReq.params.username },
        data,
        {
          new: true
        }
      )
      expect(mockSuccessHandler).toHaveBeenCalledTimes(1)
      expect(mockSuccessHandler).toHaveBeenCalledWith(mockRes, message, data)
    })
    it('should call errorHandler when user does not exist', async () => {
      const mockReq = mockRequest({
        body: {
          username: 'test01',
          email: 'test01@gmail.com',
          password: 'fest0890@',
          fullname: 'Test Test',
          nationality: 'Nigerian'
        },
        params: {
          username: 'test05'
        }
      })
      const mockRes = mockResponse()
      const message = 'USER_NOT_FOUND'
      const user = undefined
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          exec: () => user
        }))
      const mockErrorHandler = jest.spyOn(responseHelper, 'errorHandler')

      await UserController.editProfile(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledWith(mockRes, message, 400)
    })
    it('should call errorHandler when user does not exist', async () => {
      const mockReq = mockRequest({
        body: {
          username: 'test01',
          email: 'test01@gmail.com',
          password: 'fest0890@',
          fullname: 'Test Test',
          nationality: 'Nigerian'
        },
        params: {
          username: 'test01'
        },
        user: {
          username: 'test05'
        }
      })
      const mockRes = mockResponse()
      const message = 'NOT_AUTHORIZED'
      const user = new User({
        _id: 'fg7642fy8w3rfr378fr',
        email: mockReq.body.email,
        username: mockReq.body.username,
        password: 'fgsvf326fegv264vffbh24f84f2ywhf2478f4f8',
        fullname: mockReq.body.fullname,
        nationality: mockReq.body.nationality
      })
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          exec: () => user
        }))
      const mockErrorHandler = jest.spyOn(responseHelper, 'errorHandler')

      await UserController.editProfile(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledWith(mockRes, message, 401)
    })
  })

  describe('deleteAccount', () => {
    it('should call successHandler with valid details', async () => {
      const mockReq = mockRequest({
        body: {
          username: 'test01',
          email: 'test01@gmail.com',
          password: 'Test0890@',
          fullname: 'Test 01',
          nationality: 'Nigerian'
        },
        params: {
          username: 'test01'
        },
        user: {
          username: 'test01'
        }
      })
      const mockRes = mockResponse()
      const user = new User({
        _id: 'fg7642fy8w3rfr378fr',
        email: mockReq.body.email,
        username: mockReq.body.username,
        password: 'fgsvf326fegv264vffbh24f84f2ywhf2478f4f8',
        fullname: mockReq.body.fullname,
        nationality: mockReq.body.nationality
      })
      const message = 'USER_SUCCESSFULLY_DELETED'
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          exec: () => user
        }))
      const mockRemove = jest
        .spyOn(user, 'remove')
        .mockImplementationOnce(() => user)
      const mockSuccessHandler = jest.spyOn(responseHelper, 'successHandler')

      await UserController.deleteAccount(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockRemove).toHaveBeenCalledTimes(1)
      expect(mockSuccessHandler).toHaveBeenCalledTimes(1)
      expect(mockSuccessHandler).toHaveBeenCalledWith(mockRes, message, {})
    })
    it('should call errorHandler when user does not exist', async () => {
      const mockReq = mockRequest({
        body: {
          username: 'test01',
          email: 'test01@gmail.com',
          password: 'fest0890@',
          fullname: 'Test Test',
          nationality: 'Nigerian'
        },
        params: {
          username: 'test05'
        }
      })
      const mockRes = mockResponse()
      const message = 'USER_NOT_FOUND'
      const user = undefined
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          exec: () => user
        }))
      const mockErrorHandler = jest.spyOn(responseHelper, 'errorHandler')

      await UserController.deleteAccount(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledWith(mockRes, message, 400)
    })
    it('should call errorHandler when user does not exist', async () => {
      const mockReq = mockRequest({
        body: {
          username: 'test01',
          email: 'test01@gmail.com',
          password: 'fest0890@',
          fullname: 'Test Test',
          nationality: 'Nigerian'
        },
        params: {
          username: 'test01'
        },
        user: {
          username: 'test05'
        }
      })
      const mockRes = mockResponse()
      const message = 'NOT_AUTHORIZED'
      const user = new User({
        _id: 'fg7642fy8w3rfr378fr',
        email: mockReq.body.email,
        username: mockReq.body.username,
        password: 'fgsvf326fegv264vffbh24f84f2ywhf2478f4f8',
        fullname: mockReq.body.fullname,
        nationality: mockReq.body.nationality
      })
      const mockFindOne = jest
        .spyOn(User, 'findOne')
        .mockImplementationOnce(() => ({
          exec: () => user
        }))
      const mockErrorHandler = jest.spyOn(responseHelper, 'errorHandler')

      await UserController.deleteAccount(mockReq, mockRes)

      expect(mockFindOne).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledTimes(1)
      expect(mockErrorHandler).toHaveBeenCalledWith(mockRes, message, 401)
    })
  })
})
