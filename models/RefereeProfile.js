const mongoose = require('mongoose')

const RefereeProfile = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    require: true,
  },
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  avatar: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
    enum: ['жен', 'муж'],
  },
  birthday: {
    type: Date,
  },
  bio: {
    type: String,
  },
  phone: {
    type: Number,
    match: [
      /^((\+7|7|8)+([0-9]){10})$/,
      'Номер телефона не соответствует формату 89997777777 или +79997777777 или 79995555555',
    ],
  },
  sportobject: {
    type: mongoose.Schema.ObjectId,
    ref: 'SportObjects',
  },
  kindofsport: { type: String },
  qualification: [
    {
      sportrank: String,
      assigned: Date,
    },
  ],
  awards: [
    {
      competition: String,
      received: Date,
      place: String,
      result: Number,
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
})

module.exports = mongoose.model('RefereeProfile', RefereeProfile.Schema)
