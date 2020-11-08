const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utils/geocoder')
const Federation = require('../models/Federation')

// @desc    Получить список федераций
// @route   GET /api/v1/federations
// @access  Публичный
exports.getFederations = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Получить данные федерации
// @route   GET /api/v1/federations/:id
// @access  Публичный
exports.getFederation = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const federation = await Federation.findById(id)
    .populate('sportobjects')
    .populate('referees')
    .populate('medics')
    .populate('trainers')
    .populate('sportsmens')
  if (!federation) {
    return next(new ErrorResponse(`Федерация с ID - ${id} не найдена`, 404))
  }
  res.status(200).json({ success: true, data: federation })
})

// @desc    Добавить новую  федерацию
// @route   POST /api/v1/federations/:id
// @access  Приватный
exports.createFederation = asyncHandler(async (req, res, next) => {
  req.body.admin = req.user.id

  const publishedFederation = await Federation.findOne({ user: req.user.id })

  if (publishedFederation && req.user.role !== 'Admin') {
    return next(
      new ErrorResponse(
        `Пользователь с ID ${req.user.id} может создать только одну федерацию`,
        400
      )
    )
  }
  const federation = await Federation.create(req.body)

  res.status(201).json({ success: true, data: federation })
})

// @desc    Изменить федерацию
// @route   PUT /api/v1/federation/:id
// @access  Приватный
exports.updateFederation = asyncHandler(async (req, res, next) => {
  let federation = await Federation.findById(req.params.id)
  if (!federation) {
    return next(
      new ErrorResponse(`Федерация с ID ${req.params.id} не найдена`, 404)
    )
  }
  if (
    federation.admin.toString() !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    return next(
      new ErrorResponse(
        `Пользователь ${req.params.id} не может изменить данные этой федерации`,
        401
      )
    )
  }
  federation = await Federation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: federation })
})

// @desc    Удалить федерацию
// @route   DEELETE /api/v1/federation/:id
// @access  Приватный
exports.deleteFederation = asyncHandler(async (req, res, next) => {
  const federation = await Federation.findById(req.params.id)
  if (!federation) {
    return next(
      new ErrorResponse(`Федерация с ID ${req.params.id} не найдена`, 404)
    )
  }

  if (
    federation.admin.toString() !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    return next(
      new ErrorResponse(
        `Пользователь с ID ${req.params.id} не может удалить данную федерацию`,
        401
      )
    )
  }
  federation.remove()

  res.status(200).json({ success: true, data: {} })
})
