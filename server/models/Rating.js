const mongoose = require("mongoose")

const ratingSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer is required"],
    },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Veterinarian is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    review: {
      type: String,
      trim: true,
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
    experience: {
      type: String,
      trim: true,
      required: [true, "Experience description is required"],
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one farmer can only rate one veterinarian once
ratingSchema.index({ farmer: 1, veterinarian: 1 }, { unique: true })

// Update veterinarian's average rating when a new rating is added
ratingSchema.post("save", async function () {
  const Rating = this.constructor
  const stats = await Rating.aggregate([
    { $match: { veterinarian: this.veterinarian } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ])

  if (stats.length > 0) {
    const User = require("./User")
    await User.findByIdAndUpdate(this.veterinarian, {
      rating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal place
    })
  }
})

// Update veterinarian's average rating when a rating is updated
ratingSchema.post("findOneAndUpdate", async function () {
  const Rating = this.model
  const doc = await this.model.findOne(this.getQuery())
  
  if (doc) {
    const stats = await Rating.aggregate([
      { $match: { veterinarian: doc.veterinarian } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ])

    if (stats.length > 0) {
      const User = require("./User")
      await User.findByIdAndUpdate(doc.veterinarian, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
      })
    }
  }
})

// Update veterinarian's average rating when a rating is deleted
ratingSchema.post("findOneAndDelete", async function () {
  const Rating = this.model
  const doc = await this.model.findOne(this.getQuery())
  
  if (doc) {
    const stats = await Rating.aggregate([
      { $match: { veterinarian: doc.veterinarian } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ])

    const User = require("./User")
    if (stats.length > 0) {
      await User.findByIdAndUpdate(doc.veterinarian, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
      })
    } else {
      await User.findByIdAndUpdate(doc.veterinarian, {
        rating: 0,
      })
    }
  }
})

module.exports = mongoose.model("Rating", ratingSchema) 