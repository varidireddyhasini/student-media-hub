const express = require('express')
const Video = require('../models/Video')

const router = express.Router()

// GET all videos
router.get('/', async (req, res) => {
  try {
    const filter = {}

    if (req.query.field) {
      filter.field = req.query.field
    }

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: 'i',
      }
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 })
    res.json(videos)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos' })
  }
})

// GET one video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    res.json(video)
  } catch (error) {
    res.status(400).json({ message: 'Invalid video ID' })
  }
})

// ADD a video
router.post('/', async (req, res) => {
  try {
    const { title, description, field, videoUrl, thumbnailUrl } = req.body

    if (!title || !description || !field || !videoUrl) {
      return res.status(400).json({
        message: 'Title, description, field, and video URL are required',
      })
    }

    const video = await Video.create({
      title,
      description,
      field,
      videoUrl,
      thumbnailUrl: thumbnailUrl || '',
    })

    res.status(201).json(video)
  } catch (error) {
    res.status(400).json({ message: 'Could not add video' })
  }
})

// ADD a student review
router.post('/:id/reviews', async (req, res) => {
    console.log('TEST: REVIEW ROUTE IS RUNNING')
    console.log('REVIEW ROUTE REACHED')
  try {
    const { studentName, rating, comment } = req.body
    console.log('REVIEW DATA:', req.body)
    console.log('FULL REQUEST BODY:', JSON.stringify(req.body))
console.log('RATING VALUE:', rating)
console.log('RATING TYPE:', typeof rating)
    console.log('Request body:', req.body)
     console.log('Incoming review:', {
  studentName,
  rating,
  comment,
})
console.log('Student name:', JSON.stringify(studentName))
console.log('Rating:', rating, 'Type:', typeof rating)
console.log('Comment:', JSON.stringify(comment))
    if (
      !studentName?.trim() ||
      !comment?.trim() ||
      !Number.isFinite(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        message: 'Enter your name, a comment, and a rating from 1 to 5',
      })
    }

    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    video.reviews.push({
      studentName: studentName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
    })

    await video.save()
    res.status(201).json(video)
  } catch (error) {
  console.error('REVIEW ERROR:', error)
  res.status(400).json({
    message: 'Could not add review',
    error: error.message,
  })
}
})

module.exports = router