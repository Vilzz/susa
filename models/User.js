const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
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
      enum: ['Спортсмен', 'Тренер', 'Судья', 'Врач'],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.pre('remove', async function (next) {
  if (this.sportrole === 'Спортсмен') {
    await this.model('SportsmenProfile').deleteOne({
      user: this._id,
    })
  }
  if (this.sportrole === 'Тренер') {
    await this.model('TrainerProfile').deleteOne({
      user: this._id,
    })
  }
  if (this.sportrole === 'Судья') {
    await this.model('RefereeProfile').deleteOne({
      user: this._id,
    })
  }

  next()
})

UserSchema.virtual('sportsmenprofile', {
  ref: 'SportsmenProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
})
UserSchema.virtual('trainerprofile', {
  ref: 'TrainerProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
})
UserSchema.virtual('refereeprofile', {
  ref: 'RefereeProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
})
UserSchema.virtual('medicprofile', {
  ref: 'MedicProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
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
