const express = require('express')
const {
  getMe,
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/auth')
const router = express.Router()
const { protect } = require('../middleware/auth')

router.get('/me', protect, getMe)
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updatepassword', protect, updatePassword)
module.exports = router
