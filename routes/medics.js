const express = require('express')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorise } = require('../middleware/auth')
const router = express.Router()
const {
  getMedicProfiles,
  getMedicProfile,
  createMedicProfile,
  updateMedicProfile,
  deleteMedicProfile,
} = require('../controllers/medics')
const MedicProfile = require('../models/MedicProfile')

router
  .route('/')
  .get(advancedResults(MedicProfile), getMedicProfiles)
  .post(protect, authorise('User', 'Super'), createMedicProfile)
router
  .route('/:id')
  .get(getMedicProfile)
  .put(protect, authorise('User', 'Super'), updateMedicProfile)
  .delete(protect, authorise('User', 'Super'), deleteMedicProfile)

module.exports = router
