const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Требуется ввести имя пользователя'],
  },
  email: {
    type: String,
    required: [true, 'Требуется ввести адрес электронной почты'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Требуется ввести пароль'],
  },
  sportrole: {
    type: String,
    required: [true, 'Требуется выбрать роль'],
    enum: ['Спортсмен', 'Тренер', 'Судья'],
  },
  role: {
    type: String,
    default: 'User',
    enum: ['User', 'Admin', 'Super'],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  return resetToken
}

module.exports = mongoose.model('User', UserSchema)
