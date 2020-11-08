const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const RefereeProfile = require('../models/RefereeProfile')

// @desc    Получить список профилей судей
// @route   GET /api/v1/referees
// @access  Публичный
exports.getRefereeProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Получить заданный профиль судьи
// @route   GET /api/v1/referees/:id
// @access  Публичный
exports.getRefereeProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const profile = await RefereeProfile.findById(id)
  if (!profile) {
    return next(new ErrorResponse(`Профиль судьи с ID ${id} не найден`, 404))
  }
  res.status(200).json({ success: true, data: profile })
})

// @desc    Создать профиль судьи
// @route   POST /api/v1/referees
// @access  Приватный
exports.createRefereeProfile = asyncHandler(async (req, res, next) => {
  if (req.user.sportrole !== 'Судья') {
    return next(
      new ErrorResponse(
        `Пользователь с ролью '${req.user.sportrole}' не может создать профиль 'Судья'`,
        400
      )
    )
  }
  req.body.user = req.user.id
  const publishedProfile = await RefereeProfile.findOne({ user: req.user.id })
  if (publishedProfile) {
    return next(
      new ErrorResponse(`У заданного пользователя уже есть профиль`, 400)
    )
  }
  const profile = await RefereeProfile.create(req.body)
  res.status(201).json({ success: true, data: profile })
})

// @desc    Изменить профиль судьи
// @route   PUT /api/v1/referees/:id
// @access  Приватный
exports.updateRefereeProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  let profile = await RefereeProfile.findById(id)
  if (!profile) {
    return next(new ErrorResponse(`Профиль судьи с ID ${id} не найден`, 404))
  }
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Вы не можете изменить данные этого профиля`, 401)
    )
  }
  profile = await RefereeProfile.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: profile })
})

// @desc    Удалить профиль судьи
// @route   DELETE /api/v1/referees/:id
// @access  Приватный
exports.deleteRefereeProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const profile = await RefereeProfile.findById(id)
  if (!profile) {
    return next(new ErrorResponse(`Профиль судьи с ID ${id} не найден`, 404))
  }
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Вы не можете удалить данные этого профиля`, 401)
    )
  }
  await RefereeProfile.findByIdAndDelete(id)

  res.status(200).json({ success: true, data: {} })
})
