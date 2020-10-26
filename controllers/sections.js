const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')

const Sportsection = require('../models/Sportsection')

// @desc    Получить список спортивных секций
// @route   GET /api/v1/sections
// @access  Публичный
exports.getSportSections = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Получить спортивную секцию
// @route   GET /api/v1/sections/:id
// @access  Публичный
exports.getSportSection = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const section = await Sportsection.findById(id)
  if (!section) {
    return next(new ErrorResponse('Спортивная секция не найдена', 404))
  }
  res.status(200).json({ success: true, data: section })
})

// @desc    Создать спортивную секцию
// @route   POST /api/v1/sections
// @access  Приватный
exports.createSportSection = asyncHandler(async (req, res, next) => {
  const section = await Sportsection.create(req.body)
  res.status(200).json({ success: true, data: section })
})

// @desc    Изменить данные спортивной секции
// @route   PUT /api/v1/sections/:id
// @access  Приватный
exports.updateSportSection = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  let section = await Sportsection.findById(id)
  if (!section) {
    return next(
      new ErrorResponse(`Спортивная секция с ID: ${id} не найдена`, 404)
    )
  }
  section = await Sportsection.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: section })
})

// @desc    Удалить данные спортивной секции
// @route   DELETE /api/v1/sections/:id
// @access  Приватный
exports.deleteSportSection = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const section = await Sportsection.findById(id)
  if (!section) {
    return next(
      new ErrorResponse(`Спортивная секция с ID: ${id} не найдена`, 404)
    )
  }
  await section.remove()
  res.status(200).json({ success: true, data: {} })
})
