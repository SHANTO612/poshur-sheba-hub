const User = require("../models/User")

const getAllVeterinarians = async (req, res) => {
  try {
    // Get all users with userType "veterinarian"
    let query = { userType: "veterinarian", isActive: true }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' }
    }

    // Filter by specialization
    if (req.query.specialization) {
      query.specialization = { $regex: req.query.specialization, $options: 'i' }
    }

    // Filter by verified status
    if (req.query.verified) {
      query.isVerified = req.query.verified === "true"
    }

    // Build sort object
    let sort = { rating: -1 } // Default: highest rating first

    if (req.query.sortBy === "experience_desc") {
      sort = { experience: -1 }
    } else if (req.query.sortBy === "name_asc") {
      sort = { name: 1 }
    }

    const veterinarians = await User.find(query).sort(sort)

    res.json({ success: true, data: veterinarians })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getVeterinarianById = async (req, res) => {
  try {
    const veterinarian = await User.findById(req.params.id)

    if (!veterinarian || veterinarian.userType !== "veterinarian") {
      return res.status(404).json({
        success: false,
        message: "Veterinarian not found",
      })
    }

    res.json({
      success: true,
      data: veterinarian,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Veterinarian not found",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

module.exports = {
  getAllVeterinarians,
  getVeterinarianById,
} 