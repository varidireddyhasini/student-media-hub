require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const videoRoutes = require('./routes/videos')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Student Media Hub backend is running!',
  })
})

app.use('/api/videos', videoRoutes)

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
  })