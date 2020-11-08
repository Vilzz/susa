const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')

const SportObjectDescription = require('../models/SportObjectDescription')

//*********************************************************/
// @desc    Получить список описаний спортивных объектов
// @route   GET /api/v1/descriptions
// @access  Публичный
//*********************************************************/

exports.getSportObjectDescriptions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

//*****************************************************************/
// @desc    Получить данные заданного описания спортивного объекта
// @route   GET /api/v1/descriptions/:id
// @access  Публичный
//*****************************************************************/

exports.getSportObjectDescription = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const description = await SportObjectDescription.findById(id)
  if (!description) {
    return next(
      new ErrorResponse(
        `Описание спортивного объекта с ID - ${id} не найдено`,
        404
      )
    )
  }
  res.status(200).json({ success: true, data: description })
})

//****************************************************/
// @desc    Добавить описание для спортивного объекта
// @route   POST /api/v1/descriptions/sportobject/:id
// @access  Приватный
//****************************************************/

exports.createSportObjectDescription = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  req.body.admin = req.user.id
  req.body.sportobject = id
  const description = await SportObjectDescription.create(req.body)

  res.status(201).json({ success: true, data: description })
})

//*************************************/
// @desc    Изменить описание спортивного объекта
// @route   PUT /api/v1/descriptions/:id
// @access  Приватный
//*************************************/

exports.updateSportObjectDescription = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  let description = await SportObjectDescription.findById(id)
  if (!description) {
    return next(
      new ErrorResponse(
        `Описание спортивного объекта с ID ${req.params.id} не найдено`,
        404
      )
    )
  }
  if (
    description.admin.toString() !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    return next(
      new ErrorResponse(
        `Пользователь ${req.params.id} не может изменить описание данного спортивного объекта`,
        401
      )
    )
  }
  description = await SportObjectDescription.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({ success: true, data: description })
})

//*************************************/
// @desc    Удалить описание спортивного объекта
// @route   DEELETE /api/v1/descriptions/:id
// @access  Приватный
//*************************************/

exports.deleteSportObjectDescription = asyncHandler(async (req, res, next) => {
  const description = await SportObjectDescription.findById(req.params.id)
  if (!description) {
    return next(
      new ErrorResponse(
        `Описание спортивного объекта с ID ${req.params.id} не найдено`,
        404
      )
    )
  }
  if (
    description.admin.toString() !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    return next(
      new ErrorResponse(
        `Пользователь с ID ${req.params.id} не может удалить описание данного объекта`,
        401
      )
    )
  }
  description.remove()

  res.status(200).json({ success: true, data: {} })
})
