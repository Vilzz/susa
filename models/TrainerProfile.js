const mongoose = require('mongoose')

const TrainerProfileSchema = new mongoose.Schema(
  {
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
      required: [true, 'Требуется выбрать пол'],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
TrainerProfileSchema.virtual('sections', {
  ref: 'Sportsection',
  localField: 'user',
  foreignField: 'trainer',
  justOne: false,
})
module.exports = mongoose.model('TrainerProfile', TrainerProfileSchema)
