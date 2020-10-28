const express = require('express')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorise } = require('../middleware/auth')
const router = express.Router()
const {
  getTrainerProfiles,
  getTrainerProfile,
  createTrainerProfile,
  updateTrainerProfile,
  deleteTrainerProfile,
} = require('../controllers/trainers')
const TrainerProfile = require('../models/TrainerProfile')

router
  .route('/')
  .get(
    advancedResults(TrainerProfile, {
      path: 'sections',
      select: 'title schedule -trainer',
    }),
    getTrainerProfiles
  )
  .post(protect, authorise('User', 'Super'), createTrainerProfile)
router
  .route('/:id')
  .get(getTrainerProfile)
  .put(protect, authorise('User', 'Super'), updateTrainerProfile)
  .delete(protect, authorise('User', 'Super'), deleteTrainerProfile)
module.exports = router
