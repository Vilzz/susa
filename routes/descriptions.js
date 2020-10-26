const express = require('express')
const router = express.Router()
const advancedResults = require('../middleware/advancedResults')
const { protect, authorise } = require('../middleware/auth')
const {
  getSportObjectDescriptions,
  getSportObjectDescription,
  createSportObjectDescription,
  updateSportObjectDescription,
  deleteSportObjectDescription,
} = require('../controllers/descriptions')

const SportObjectDescription = require('../models/SportObjectDescription')
router
  .route('/')
  .get(advancedResults(SportObjectDescription), getSportObjectDescriptions)
router
  .route('/sportobject/:id')
  .post(protect, authorise('Admin'), createSportObjectDescription)
router
  .route('/:id')
  .get(getSportObjectDescription)
  .put(protect, authorise('Admin'), updateSportObjectDescription)
  .delete(protect, authorise('Admin'), deleteSportObjectDescription)
module.exports = router
