const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const geocoder = require('../utils/geocoder')
const SportObject = require('../models/SportObjects')

// @desc    Получить список объектов
// @route   GET /api/v1/sportobjects
// @access  Публичный
exports.getSportObjects = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Получить данные спортивного объекта
// @route   GET /api/v1/sportobjects/:id
// @access  Публичный
exports.getSportObject = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const sportobject = await SportObject.findById(id)
    .populate('description')
    .populate('sections')
  if (!sportobject) {
    return next(new ErrorResponse(`Объект с ID - ${id} не найден`, 404))
  }
  res.status(200).json({ success: true, data: sportobject })
})

// @desc    Добавить новый объект
// @route   POST /api/v1/sportobjects/:id
// @access  Приватный
exports.createSportObject = asyncHandler(async (req, res, next) => {
  req.body.admin = req.user.id

  const publishedSportObject = await SportObject.findOne({ user: req.user.id })

  if (publishedSportObject && req.user.role !== 'Admin') {
    return next(
      new ErrorResponse(
        `Пользователь с ID ${req.user.id} может создать только один объект`,
        400
      )
    )
  }
  const sportobject = await SportObject.create(req.body)

  res.status(201).json({ success: true, data: sportobject })
})

// @desc    Изменить спортивный объект
// @route   PUT /api/v1/sportobjects/:id
// @access  Приватный
exports.updateSportObject = asyncHandler(async (req, res, next) => {
  let sportobject = await SportObject.findById(req.params.id)
  if (!sportobject) {
    return next(
      new ErrorResponse(
        `Спортивный объект с ID ${req.params.id} не найден`,
        404
      )
    )
  }
  if (req.user.role !== 'Super') {
    if (
      sportobject.admin.toString() !== req.user.id &&
      req.user.role !== 'Admin'
    ) {
      return next(
        new ErrorResponse(
          `Пользователь ${req.params.id} не может изменить данный объект`,
          401
        )
      )
    }
  }
  sportobject = await SportObject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: sportobject })
})

// @desc    Удалить объект
// @route   DEELETE /api/v1/sportobjects/:id
// @access  Приватный
exports.deleteSportObject = asyncHandler(async (req, res, next) => {
  const sportobject = await SportObject.findById(req.params.id)
  if (!sportobject) {
    return next(
      new ErrorResponse(
        `Спортивный объект с ID ${req.params.id} не найден`,
        404
      )
    )
  }

  if (
    sportobject.admin.toString() !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    return next(
      new ErrorResponse(
        `Пользователь с ID ${req.params.id} не может удалить данный объект`,
        401
      )
    )
  }
  sportobject.remove()

  res.status(200).json({ success: true, data: {} })
})

// @desc    Получить спортивные объекты в радиусе
// @route   GET /api/v1/sportobjects/radius/:zipcode/:distance
// @access  Приватный
exports.getSportObjectsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 6371 km
  const radius = distance / 6371
  const sportobjects = await SportObject.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })
  res.status(200).json({
    success: true,
    count: sportobjects.length,
    data: sportobjects,
  })
})

exports.getPOsitionFromAddress = asyncHandler(async (req, res, next) => {
  const { address, zipcode } = req.params
  const loc = await geocoder.geocode(address)
  console.log(loc[0])
  const response = await geocoder.reverse({
    lat: loc[0].latitude,
    lon: loc[0].longitude,
  })
  console.log(response[0])
  res.status(200).json({
    success: true,
    data: response,
  })
})
