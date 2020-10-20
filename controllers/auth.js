const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

// @desc    Регистрация пользователя
// @route   POST /api/v1/auth/register
// @access  Публичный
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, sportrole, role } = req.body

  // Создаем пользователя
  const user = await User.create({
    name,
    email,
    password,
    sportrole,
    role,
  })

  sendtokenResponse(user, 200, res)
})

// @desc    Вход пользователя
// @route   POST /api/v1/auth/login
// @access  Публичный
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(
      new ErrorResponse('Введите адрес электронной почты и пароль'),
      400
    )
  }
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Данные пользователя не верны'), 401)
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Данные пользователя не верны'), 401)
  }
  sendtokenResponse(user, 200, res)
})

// @desc    Выход пользователя / Очистка куки
// @route   GET /api/v1/auth/logout
// @access  Приватный
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({
    success: true,
    data: {},
  })
})

const sendtokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  })
}
