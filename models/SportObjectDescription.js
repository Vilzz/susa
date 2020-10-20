const mongoose = require('mongoose')
const slugify = require('slugify')

const SportObjectDescription = new mongoose.Schema({
  name: { type: String },
  founded: { type: Date },
  introduction: { type: String },
  info: { type: String },
  history: { type: String },
  video: [String],
  images: [String],
  trainers: [],
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
    type: mongoose.Schema.Objectid,
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model(
  'SportObjectDescription',
  SportObjectDescription.Schema
)
