const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')

const SportObjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Добавьте наименование обьекта'],
      unique: true,
      trim: true,
      maxlength: [100, 'Максимальная длина наименования 100 знаков'],
    },
    slug: String,
    shortdesc: {
      type: String,
      required: [true, 'Добавьте описание обьекта'],
      trim: true,
      maxlength: [1000, 'Максимальная длина описание 1000 знаков'],
    },
    objectType: {
      type: [String],
      required: [true, 'Требуется указать тип обьекта'],
      enum: [
        'Спортивная школа',
        'Фитнес центр',
        'Стадион',
        'ФОК',
        'Бассейн крытый',
        'Бассейн открытый',
        'Ледовый корт',
        'Лыжная база',
        'Стрелковый тир',
        'Гребная база',
        'Манеж легкоатлетический',
        'Манеж футбольный',
        'Спортивная площадка',
        'Корт хоккейный',
        'Футбольное поле',
        'Мини-футбольная площадка',
        'Школьный стадион',
        'Зал игровой',
        'Универсальная спортивная площадка',
        'Комплексная спортивная площадка',
        'Зал борьбы',
        'Волейбольная площадка',
        'Зал тренажерный',
        'Баскетбольная площадка',
        'Корт теннисный',
      ],
    },
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
    sports: {
      type: [String],
      required: [true, 'Необходимо добавить хотя бы один вид спорта'],
    },
    averageRating: {
      type: Number,
      min: [1, 'Минимальное значение рейтинга -  1'],
      max: [10, 'Максимальное значение рейтинга - 10'],
    },
    averageCost: Number,
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    federation: {
      type: mongoose.Schema.ObjectId,
      ref: 'Federation',
    },
    administration: {
      first_person: { type: String },
      second_person: { type: String },
      contact: {
        type: String,
        match: [
          /^((\+7|7|8)+([0-9]){10})$/,
          'Номер телефона не соответствует формату 89997777777 или +79997777777 или 79995555555',
        ],
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
)

SportObjectSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})
SportObjectSchema.pre('save', async function (next) {
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

SportObjectSchema.pre('remove', async function (next) {
  console.log(`Будет удалено описание для спортивного объекта ${this._id}`)
  await this.model('SportObjectDescription').deleteOne({
    sportobject: this._id,
  })
  next()
})

SportObjectSchema.virtual('description', {
  ref: 'SportObjectDescription',
  localField: '_id',
  foreignField: 'sportobject',
  justOne: true,
})
SportObjectSchema.virtual('sections', {
  ref: 'Sportsection',
  localField: '_id',
  foreignField: 'sportobject',
  justOne: false,
})

module.exports = mongoose.model('SportObject', SportObjectSchema)
