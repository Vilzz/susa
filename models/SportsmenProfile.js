const mongoose = require('mongoose')

const SportsmenProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Необходимо указать имя'],
    },
    lastname: {
      type: String,
    },
    avatar: {
      type: String,
    },
    gender: {
      type: String,
      required: [true, 'Необходимо выбрать пол'],
      enum: ['жен', 'муж'],
    },
    birthday: {
      type: Date,
    },
    bio: {
      type: String,
    },
    phone: {
      type: String,
      match: [
        /^((\+7|7|8)+([0-9]){10})$/,
        'Номер телефона не соответствует формату 89997777777 или +79997777777 или 79995555555',
      ],
    },
    federation: {
      type: mongoose.Schema.ObjectId,
      ref: 'Federation',
    },
    sportsection: {
      type: mongoose.Schema.ObjectId,
      ref: 'Sportsection',
    },
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    kindofsport: {
      type: String,
      required: [true, 'Необходимо указать вид спорта'],
    },
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
    medicalcheckup: [
      {
        checkupdate: Date,
        checkupresult: String,
      },
    ],
    results: [
      {
        competition: String,
        place: String,
        date: Date,
        result: String,
      },
    ],
    isdisqualificated: {
      result: { type: Boolean, default: false },
      from: Date,
      untill: Date,
    },
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
  },
  { timestamps: true }
)

module.exports = mongoose.model('SportsmenProfile', SportsmenProfileSchema)
