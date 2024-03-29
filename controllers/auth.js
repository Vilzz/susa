const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

//*************************************/
// @desc    Данные текущего пользователя
// @route   POST /api/v1/auth/me
// @access  Приватный
//*************************************/
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate([
      { path: 'sportsmenprofile', select: '_id -user' },
      { path: 'trainerprofile', select: '_id -user' },
      { path: 'refereeprofile', select: '_id -user' },
      { path: 'medicprofile', select: '_id -user' },
    ])
  res.status(200).json({
    success: true,
    data: user,
  })
})

//*************************************/
// @desc    Регистрация пользователя
// @route   POST /api/v1/auth/register
// @access  Публичный
//*************************************/
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

//*************************************/
// @desc    Вход пользователя
// @route   POST /api/v1/auth/login
// @access  Публичный
//*************************************/
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(
      new ErrorResponse('Отсутствует адрес электронной почты или пароль'),
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

//*************************************/
// @desc    Выход пользователя / Очистка куки
// @route   GET /api/v1/auth/logout
// @access  Приватный
//*************************************/
exports.logout = asyncHandler(async (req, res, next) => {
  const { name } = req.name
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({
    success: true,
    data: name,
  })
})

//*************************************/
// @desc    Изменить пароль
// @route   PUT /api/v1/auth/updatepassword
// @access  Приватный
//*************************************/
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }
  user.password = req.body.newPassword
  await user.save()

  sendtokenResponse(user, 200, res)
})

//*************************************/
// @desc    Забытый пароль
// @route   POST /api/v1/auth/forgotpassword
// @access  Публичный
//*************************************/
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(
      new ErrorResponse(
        `Пользователь с электронной почтой ${req.body.email} не существует!`,
        404
      )
    )
  }
  // Get a reset token
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })
  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`
  const message = `Вы получили это письмо, потому что вы или кто-то запросил сброс пароля. Для смены пароля сделайте PUT запрос на адрес: \n\n ${resetUrl}`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Токен сброса пароля',
      message,
    })
    res.status(200).json({ success: true, data: 'Письмо отправлено' })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })
    return next(new ErrorResponse('Письмо не может быть отправлено', 500))
  }
  res.status(200).json({
    success: true,
    data: user,
  })
})

//*************************************/
// @desc    Сброс пароля
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Публичный
//*************************************/
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400))
  }

  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  sendtokenResponse(user, 200, res)
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
