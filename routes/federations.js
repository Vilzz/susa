const express = require('express')
const {
  getFederations,
  getFederation,
  createFederation,
  updateFederation,
  deleteFederation,
} = require('../controllers/federations')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorise } = require('../middleware/auth')
const Federation = require('../models/Federation')

const router = express.Router()

router
  .route('/')
  .get(
    advancedResults(
      Federation,
      {
        path: 'sportobjects',
        select: '_id name description -federation',
      },

      'referees',
      'trainers',
      'medics',
      'sportsmens'
    ),
    getFederations
  )
  .post(protect, authorise('User', 'Super'), createFederation)
router
  .route('/:id')
  .get(getFederation)
  .put(protect, authorise('User', 'Super'), updateFederation)
  .delete(protect, authorise('User', 'Super'), deleteFederation)

module.exports = router
