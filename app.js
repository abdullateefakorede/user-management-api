const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./src/config/config')
const registerRoutes = require('./src/routes/register')

const app = express()

app.use(express.json())
app.use(morgan('combined'))
app.use(express.urlencoded({ extended: true }))
app.use(cors())

registerRoutes(app)

// Enable CORS from client side
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, DELETE, POST, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Apptoken, Access-Control-Allow-Credential'
  )
  res.header('Access-Control-Allow-Credentials', 'true')

  next()
})

app.options('*', cors())

app.listen(config.port, async function () {
  try {
    await mongoose.connect(`${config.db_url}`)
    console.log(`Driver service is running on ${config.port}`)
  } catch (error) {
    console.log(error)
  }
})

module.exports = app
