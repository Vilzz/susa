const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const ErrorResponce = require('../utils/errorResponse')
const User = require('../models/User')

exports.saybyebye = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.cookie) {
    token = req.headers.cookie.split('=')[1]
  }
  if (!token || token === 'none') {
    return next(
      new ErrorResponce('Для того чтобы выйти, надо сначала зайти', 500)
    )
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.name = await User.findById(decoded.id).select('name -_id')
    next()
  } catch (err) {
    return next(new ErrorResponce('Странная ошибка,', 500))
  }
})

exports.protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return next(
      new ErrorResponce('Необходимо авторизоваться для доступа к ресурсу', 401)
    )
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('role sportrole _id')
    next()
  } catch (err) {
    return next(
      new ErrorResponce('Необходимо авторизоваться для доступа к ресурсу', 401)
    )
  }
})

exports.authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponce(
          `Ресурс не доступен для пользователя с ролью ${req.user.role}`,
          403
        )
      )
    }
    next()
  }
}
