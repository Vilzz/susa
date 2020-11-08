const mongoose = require('mongoose')

const SportsectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Добавьте наименование спортивной секции'],
    },
    description: {
      type: String,
      required: [true, 'Добавьте описание спортивной секции'],
    },
    schedule: [
      {
        weekday: {
          type: String,
          enum: [
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
          ],
        },
        begintime: String,
        endtime: String,
      },
    ],
    agegroup: {
      from: String,
      to: String,
    },
    sportobject: {
      type: mongoose.Schema.ObjectId,
      ref: 'SportObject',
      required: [true, 'Требуется указать ID спортивного объекта'],
    },
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Требуется указать ID пользователя - тренера секции'],
    },
    cost: {
      type: Number,
      default: null,
    },
    raiting: {
      type: Number,
      min: [1, 'Минимальный рейтинг -  1'],
      max: [10, 'Максимальный рейтинг -  10'],
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Sportsection', SportsectionSchema)
