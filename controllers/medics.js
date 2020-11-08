const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const MedicProfile = require('../models/MedicProfile')

// @desc    Получить список профилей медиков
// @route   GET /api/v1/medics
// @access  Публичный
exports.getMedicProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Получить профиль медика
// @route   GET /api/v1/medics/:id
// @access  Публичный
exports.getMedicProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const medic = await MedicProfile.findById(id)
  if (!medic) {
    return next(new ErrorResponse(`Профиль медика с ID ${id} не найден`, 404))
  }
  res.status(200).json({ success: true, data: medic })
})

// @desc    Создать профиль медика
// @route   POST /api/v1/medics
// @access  Приватный
exports.createMedicProfile = asyncHandler(async (req, res, next) => {
  if (req.user.sportrole !== 'Врач') {
    return next(
      new ErrorResponse(
        `Пользователь с ролью '${req.user.sportrole}' не может создать профиль 'Врач'`,
        400
      )
    )
  }
  req.body.user = req.user.id
  const publishedProfile = await MedicProfile.findOne({ user: req.user.id })
  if (publishedProfile) {
    return next(
      new ErrorResponse(`У заданного пользователя уже есть профиль`, 400)
    )
  }
  const profile = await MedicProfile.create(req.body)
  res.status(201).json({ success: true, data: profile })
})

// @desc    Изменить профиль медика
// @route   PUT /api/v1/medics/:id
// @access  Приватный
exports.updateMedicProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  let profile = await MedicProfile.findById(id)
  if (!profile) {
    return next(new ErrorResponse(`Профиль медика с ID ${id} не найден`, 404))
  }
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Вы не можете изменить данные этого профиля`, 401)
    )
  }
  profile = await MedicProfile.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: profile })
})

// @desc    Удалить профиль медика
// @route   DELETE /api/v1/medics/:id
// @access  Приватный
exports.deleteMedicProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const profile = await MedicProfile.findById(id)
  if (!profile) {
    return next(new ErrorResponse(`Профиль медика с ID ${id} не найден`, 404))
  }
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Вы не можете удалить данные этого профиля`, 401)
    )
  }
  await MedicProfile.findByIdAndDelete(id)

  res.status(200).json({ success: true, data: {} })
})
