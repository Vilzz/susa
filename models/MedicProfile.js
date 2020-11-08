const mongoose = require('mongoose')

const MedicProfileSchema = new mongoose.Schema(
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
      required: true,
      enum: ['жен', 'муж'],
    },
    city: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    education: [
      {
        school: {
          type: String,
          required: [
            true,
            'Требуется добавить наименование учебного заведения',
          ],
        },
        degree: {
          type: String,
          required: [true, 'Требуется добавить степень'],
        },
        fieldofstudy: {
          type: String,
          required: [true, 'Требуется добавить специализацию обучения'],
        },
        from: {
          type: Date,
          required: [true, 'Требуется добавить дату начала обучения'],
        },
        to: {
          type: Date,
          required: [true, 'Требуется добавить дату оканчания обучения'],
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    qualification: [
      {
        category: String,
        assigned: Date,
        sertificate: String,
      },
    ],
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
    medicalcheckup: {
      checkupdate: Date,
      checkupresult: String,
    },
    privateservice: {
      servicetitle: String,
      servicecost: Number,
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
      vk: {
        type: String,
      },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('MedicProfile', MedicProfileSchema)
