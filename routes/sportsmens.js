const express = require('express')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorise } = require('../middleware/auth')
const router = express.Router()
const {
  getSportsmenProfiles,
  getSportsmenProfile,
  createSportsmenProfile,
  updateSportsmenProfile,
  deleteSportsmenProfile,
} = require('../controllers/sportsmens')
const SportsmenProfile = require('../models/SportsmenProfile')

router
  .route('/')
  .get(advancedResults(SportsmenProfile), getSportsmenProfiles)
  .post(protect, authorise('User'), createSportsmenProfile)
router
  .route('/:id')
  .get(getSportsmenProfile)
  .put(protect, authorise('User'), updateSportsmenProfile)
  .delete(protect, authorise('User'), deleteSportsmenProfile)
module.exports = router
