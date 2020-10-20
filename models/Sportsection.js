const mongoose = require('mongoose')

const SportsectionSchema = new mongoose.Schema({
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
    required: true,
  },
  trainer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  cost: {
    type: Number,
  },
  raiting: {
    type: Number,
    min: [1, 'Raiting must be at least 1'],
    max: [10, 'Raiting must can not be more then 10'],
  },
})