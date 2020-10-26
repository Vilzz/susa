const express = require('express')
const {
  getSportObjects,
  getSportObject,
  createSportObject,
  updateSportObject,
  deleteSportObject,
  getSportObjectsInRadius,
  getPOsitionFromAddress,
} = require('../controllers/sportobjects')

const SportObject = require('../models/SportObjects')

const router = express.Router()
const advancedResults = require('../middleware/advancedResults')
const { protect, authorise } = require('../middleware/auth')

router.route('/radius/:zipcode/:distance').get(getSportObjectsInRadius)
router.route('/position/:address/:zipcode').get(getPOsitionFromAddress)
router
  .route('/')
  .get(advancedResults(SportObject, 'description', 'sections'), getSportObjects)
  .post(protect, authorise('Admin'), createSportObject)

router
  .route('/:id')
  .get(getSportObject)
  .put(protect, authorise('Admin'), updateSportObject)
  .delete(protect, authorise('Admin'), deleteSportObject)

module.exports = router
