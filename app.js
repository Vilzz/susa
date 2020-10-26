const express = require('express')
const path = require('path')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileupload = require('express-fileupload')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')

dotenv.config({ path: './config/config.env' })
const connectDB = require('./config/db')
connectDB()

const app = express()

const auth = require('./routes/auth')
const sportobjects = require('./routes/sportobjects')
const descriptions = require('./routes/descriptions')
const sportsmens = require('./routes/sportsmens')
const sections = require('./routes/sections')

app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(express.static(path.join(__dirname, 'public')))
app.use(fileupload())
app.use(mongoSanitize())
app.use(helmet())
app.use(xss())
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
})
app.use(limiter)
app.use(hpp())
app.use(cors())

app.use('/api/v1/auth', auth)
app.use('/api/v1/sportobjects', sportobjects)
app.use('/api/v1/descriptions', descriptions)
app.use('/api/v1/sportsmens', sportsmens)
app.use('/api/v1/sections', sections)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () =>
  console.log(
    `Сервер запущен в режиме ${process.env.NODE_ENV} на порту ${PORT}`.cyan
  )
)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})
