const express = require('express')
const { imageUpload, imageDelete } = require('../controllers/images')
const { protect, authorise } = require('../middleware/auth')
const router = express.Router()

router
  .route('/')
  .post(protect, authorise('User', 'Super'), imageUpload)
  .delete(protect, authorise('User', 'Super'), imageDelete)

module.exports = router
