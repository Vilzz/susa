const express = require('express')
const router = express.Router()
const advancedResults = require('../middleware/advancedResults')
const { protect, authorise } = require('../middleware/auth')
const {
  getSportSections,
  getSportSection,
  updateSportSection,
  createSportSection,
  deleteSportSection,
} = require('../controllers/sections')

const Sportsection = require('../models/Sportsection')

router
  .route('/')
  .get(advancedResults(Sportsection), getSportSections)
  .post(protect, authorise('Admin'), createSportSection)

router
  .route('/:id')
  .get(getSportSection)
  .put(protect, authorise('Admin'), updateSportSection)
  .delete(protect, authorise('Admin'), deleteSportSection)

module.exports = router
