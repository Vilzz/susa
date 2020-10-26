const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const SportsmenProfile = require('../models/SportsmenProfile')

// @desc    Получить список профилей спортсменов
// @route   GET /api/v1/sportsmens
// @access  Публичный
exports.getSportsmenProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Получить заданный профиль спортсмена
// @route   GET /api/v1/sportsmens/:id
// @access  Публичный
exports.getSportsmenProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const profile = await SportsmenProfile.findById(id)
  if (!profile) {
    return next(
      new ErrorResponse(`Профиль спортсмена с ID ${id} не найден`, 404)
    )
  }
  res.status(200).json({ success: true, data: profile })
})

// @desc    Создать профиль спортсмена
// @route   POST /api/v1/sportsmens
// @access  Приватный
exports.createSportsmenProfile = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id
  const publishedProfile = await SportsmenProfile.findOne({ user: req.user.id })
  if (publishedProfile) {
    return next(
      new ErrorResponse(`У заданного пользователя уже есть профиль`, 400)
    )
  }
  const profile = await SportsmenProfile.create(req.body)
  res.status(201).json({ success: true, data: profile })
})

// @desc    Изменить профиль спортсмена
// @route   PUT /api/v1/sportsmens/:id
// @access  Приватный
exports.updateSportsmenProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  let profile = await SportsmenProfile.findById(id)
  if (!profile) {
    return next(
      new ErrorResponse(`Профиль спортсмена с ID ${id} не найден`, 404)
    )
  }
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Вы не можете изменить данные этого профиля`, 401)
    )
  }
  profile = await SportsmenProfile.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: profile })
})

// @desc    Удалить профиль спортсмена
// @route   DELETE /api/v1/sportsmens/:id
// @access  Приватный
exports.deleteSportsmenProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const profile = await SportsmenProfile.findById(id)
  if (!profile) {
    return next(
      new ErrorResponse(`Профиль спортсмена с ID ${id} не найден`, 404)
    )
  }
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Вы не можете удалить данные этого профиля`, 401)
    )
  }
  await SportsmenProfile.findByIdAndDelete(id)

  res.status(200).json({ success: true, data: {} })
})
