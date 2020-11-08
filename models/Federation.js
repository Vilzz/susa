const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')
const slugify = require('slugify')

const FederationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Требуется указать наименование федерации'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Требуется указать описание федерации'],
    },
    slug: String,
    address: {
      type: String,
      required: [true, 'Необходимо добавить адрес объекта'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
        index: '2dsphere',
      },
      formatedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    website: {
      type: String,
      match: [
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
        'Требуется добавить валидный URL образец: https://www.yourdomain.ru',
      ],
    },
    phone: {
      type: String,
      match: [
        /^((\+7|7|8)+([0-9]){10})$/,
        'Номер телефона не соответствует формату 89997777777 или +79997777777 или 79995555555',
      ],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Необходимо добавить валидный e-mail',
      ],
    },
    administration: {
      first_person_title: { type: String },
      first_person_name: { type: String },
      contact: {
        type: String,
        match: [
          /^((\+7|7|8)+([0-9]){10})$/,
          'Номер телефона не соответствует формату 89997777777 или +79997777777 или 79995555555',
        ],
      },
    },
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
)
FederationSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true })
  next()
})
FederationSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address)
  const clarify = await geocoder.reverse({
    lat: loc[0].latitude,
    lon: loc[0].longitude,
  })
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: clarify[0].zipcode,
    country: loc[0].countryCode,
  }

  //Do not save adress in DB
  this.address = undefined
  next()
})

FederationSchema.virtual('sportobjects', {
  ref: 'SportObject',
  localField: '_id',
  foreignField: 'federation',
  justOne: false,
})
FederationSchema.virtual('referees', {
  ref: 'RefereeProfile',
  localField: '_id',
  foreignField: 'federation',
  justOne: false,
})
FederationSchema.virtual('medics', {
  ref: 'MedicProfile',
  localField: '_id',
  foreignField: 'federation',
  justOne: false,
})
FederationSchema.virtual('trainers', {
  ref: 'TrainerProfile',
  localField: '_id',
  foreignField: 'federation',
  justOne: false,
})
FederationSchema.virtual('sportsmens', {
  ref: 'SportsmenProfile',
  localField: '_id',
  foreignField: 'federation',
  justOne: false,
})

module.exports = mongoose.model('Federation', FederationSchema)
