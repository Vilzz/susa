const mongoose = require('mongoose')

const SportObjectDescriptionSchema = new mongoose.Schema({
  name: { type: String },
  founded: { type: Date },
  introduction: { type: String },
  info: { type: String },
  history: { type: String },
  video: [String],
  images: [String],
  sportobject: {
    type: mongoose.Schema.ObjectId,
    ref: 'SportObject',
    required: true,
  },
  trainers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Требуется указать id администратора спортивного объекта'],
  },
})

SportObjectDescriptionSchema.index(
  { sportobject: 1, admin: 1 },
  { unique: true }
)

module.exports = mongoose.model(
  'SportObjectDescription',
  SportObjectDescriptionSchema
)
