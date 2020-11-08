const express = require('express')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorise } = require('../middleware/auth')
const router = express.Router()
const {
  getRefereeProfile,
  getRefereeProfiles,
  createRefereeProfile,
  updateRefereeProfile,
  deleteRefereeProfile,
} = require('../controllers/referees')
const RefereeProfile = require('../models/RefereeProfile')

router
  .route('/')
  .get(advancedResults(RefereeProfile), getRefereeProfiles)
  .post(protect, authorise('User', 'Super'), createRefereeProfile)
router
  .route('/:id')
  .get(getRefereeProfile)
  .put(protect, authorise('User', 'Super'), updateRefereeProfile)
  .delete(protect, authorise('User', 'Super'), deleteRefereeProfile)
module.exports = router
