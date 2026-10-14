const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    field: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
)

videoSchema.virtual('averageRating').get(function () {
  if (this.reviews.length === 0) return 0

  const total = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  )

  return Number((total / this.reviews.length).toFixed(1))
})

videoSchema.set('toJSON', { virtuals: true })
videoSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Video', videoSchema)