const Rating = require("../models/Rating")
const User = require("../models/User")

// Create or update rating
const createRating = async (req, res) => {
  try {
    const { veterinarianId, rating, review, experience } = req.body

    // Validation
    if (!veterinarianId || !rating || !experience) {
      return res.status(400).json({
        success: false,
        message: "Veterinarian ID, rating, and experience are required",
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      })
    }

    // Check if veterinarian exists and is a veterinarian
    const veterinarian = await User.findById(veterinarianId)
    if (!veterinarian || veterinarian.userType !== "veterinarian") {
      return res.status(404).json({
        success: false,
        message: "Veterinarian not found",
      })
    }

    // Check if farmer is trying to rate themselves
    if (req.user._id.toString() === veterinarianId) {
      return res.status(400).json({
        success: false,
        message: "You cannot rate yourself",
      })
    }

    // Check if farmer has already rated this veterinarian
    const existingRating = await Rating.findOne({
      farmer: req.user._id,
      veterinarian: veterinarianId,
    })

    let result
    if (existingRating) {
      // Update existing rating
      result = await Rating.findByIdAndUpdate(
        existingRating._id,
        {
          rating,
          review,
          experience,
        },
        { new: true, runValidators: true }
      ).populate("farmer", "name").populate("veterinarian", "name clinicName")
    } else {
      // Create new rating
      result = await Rating.create({
        farmer: req.user._id,
        veterinarian: veterinarianId,
        rating,
        review,
        experience,
      })
      await result.populate("farmer", "name")
      await result.populate("veterinarian", "name clinicName")
    }

    res.status(201).json({
      success: true,
      data: result,
      message: existingRating ? "Rating updated successfully" : "Rating created successfully",
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this veterinarian",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get ratings for a veterinarian
const getVeterinarianRatings = async (req, res) => {
  try {
    const { veterinarianId } = req.params

    // Check if veterinarian exists
    const veterinarian = await User.findById(veterinarianId)
    if (!veterinarian || veterinarian.userType !== "veterinarian") {
      return res.status(404).json({
        success: false,
        message: "Veterinarian not found",
      })
    }

    const ratings = await Rating.find({ veterinarian: veterinarianId })
      .populate("farmer", "name farmName")
      .populate("veterinarian", "name clinicName")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: ratings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get farmer's rating for a specific veterinarian
const getFarmerRating = async (req, res) => {
  try {
    const { veterinarianId } = req.params

    const rating = await Rating.findOne({
      farmer: req.user._id,
      veterinarian: veterinarianId,
    })

    res.json({
      success: true,
      data: rating,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Delete rating
const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params

    const rating = await Rating.findById(ratingId)

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      })
    }

    // Check if farmer owns this rating
    if (rating.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own ratings",
      })
    }

    await Rating.findByIdAndDelete(ratingId)

    res.json({
      success: true,
      message: "Rating deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get all ratings (admin only)
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("farmer", "name farmName email")
      .populate("veterinarian", "name clinicName email")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: ratings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

module.exports = {
  createRating,
  getVeterinarianRatings,
  getFarmerRating,
  deleteRating,
  getAllRatings,
} 