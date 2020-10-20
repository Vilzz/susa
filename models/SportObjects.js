const mongoose = require('mongoose')
const slugify = require('slugify')

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
    fulldesc: {
      type: mongoose.Schema.ObjectId,
      ref: 'SportObjectDescription',
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
      min: [1, 'Raiting must be at least 1'],
      max: [10, 'Raiting must can not be more then 10'],
    },
    averageCost: Number,
    admin: {
      type: mongoose.Schema.Objectid,
      ref: 'User',
      required: true,
    },
    administration: {
      first_person: { type: String },
      second_person: { type: String },
      contact: {
        type: Number,
        match: [
          /^((\+7|7|8)+([0-9]){10})$/,
          'Номер телефона не соответствует формату 89997777777 или +79997777777 или 79995555555',
        ],
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

module.exports = mongoose.model('SportObject', SportObjectSchema)
