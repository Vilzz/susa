const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const TrainerProfile = require('../models/TrainerProfile')

// @desc    Получить список профилей тренеров
// @route   GET /api/v1/trainers
// @access  Публичный
exports.getTrainerProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Получить заданный профиль тренера
// @route   GET /api/v1/trainers/:id
// @access  Публичный
exports.getTrainerProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const profile = await TrainerProfile.findById(id).populate({
    path: 'sections',
    select: 'agegroup schedule title -trainer',
    populate: { path: 'sportobject', select: 'name' },
  })
  if (!profile) {
    return next(new ErrorResponse(`Профиль тренера с ID ${id} не найден`, 404))
  }
  res.status(200).json({ success: true, data: profile })
})

// @desc    Создать профиль тренера
// @route   POST /api/v1/trainers
// @access  Приватный
exports.createTrainerProfile = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id
  const publishedProfile = await TrainerProfile.findOne({ user: req.user.id })
  if (publishedProfile) {
    return next(
      new ErrorResponse(`У заданного пользователя уже есть профиль`, 400)
    )
  }
  const profile = await TrainerProfile.create(req.body)
  res.status(201).json({ success: true, data: profile })
})

// @desc    Изменить профиль тренера
// @route   PUT /api/v1/trainers/:id
// @access  Приватный
exports.updateTrainerProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  let profile = await TrainerProfile.findById(id)
  if (!profile) {
    return next(new ErrorResponse(`Профиль тренера с ID ${id} не найден`, 404))
  }
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Вы не можете изменить данные этого профиля`, 401)
    )
  }
  profile = await TrainerProfile.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: profile })
})

// @desc    Удалить профиль тренера
// @route   DELETE /api/v1/trainers/:id
// @access  Приватный
exports.deleteTrainerProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const profile = await TrainerProfile.findById(id)
  if (!profile) {
    return next(new ErrorResponse(`Профиль тренера с ID ${id} не найден`, 404))
  }
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Вы не можете удалить данные этого профиля`, 401)
    )
  }
  await TrainerProfile.findByIdAndDelete(id)

  res.status(200).json({ success: true, data: {} })
})
