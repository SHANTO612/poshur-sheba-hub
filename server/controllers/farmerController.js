const User = require("../models/User")

const getAllFarmers = async (req, res) => {
  try {
    // Get all users with userType "farmer"
    let query = { userType: "farmer", isActive: true }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' }
    }

    // Filter by speciality
    if (req.query.speciality) {
      query.speciality = { $regex: req.query.speciality, $options: 'i' }
    }

    // Filter by verified status
    if (req.query.verified) {
      query.isVerified = req.query.verified === "true"
    }

    // Build sort object
    let sort = { rating: -1 } // Default: highest rating first

    if (req.query.sortBy === "experience_desc") {
      sort = { experience: -1 }
    } else if (req.query.sortBy === "totalSales_desc") {
      sort = { totalSales: -1 }
    }

    const farmers = await User.find(query).sort(sort)

    // Map the database fields to match frontend expectations
    const mappedFarmers = farmers.map(farmer => ({
      id: farmer._id,
      name: farmer.name,
      farmName: farmer.farmName || 'Farm',
      location: farmer.location || 'Location not specified',
      mobile: farmer.phone, // Map phone to mobile
      speciality: farmer.speciality || 'General Farming',
      experience: farmer.experience || 'Experience not specified',
      livestock: 'Livestock information not available', // This field doesn't exist in User model
      rating: farmer.rating,
      isVerified: farmer.isVerified,
      description: farmer.description
    }))

    res.json({ success: true, data: mappedFarmers })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getFarmerById = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id)

    if (!farmer || farmer.userType !== "farmer") {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      })
    }

    // Get farmer's cattle listings
    const Cattle = require("../models/Cattle")
    const farmerCattle = await Cattle.find({ seller: farmer._id })

    // Map the database fields to match frontend expectations
    const mappedFarmer = {
      id: farmer._id,
      name: farmer.name,
      farmName: farmer.farmName || 'Farm',
      location: farmer.location || 'Location not specified',
      mobile: farmer.phone, // Map phone to mobile
      speciality: farmer.speciality || 'General Farming',
      experience: farmer.experience || 'Experience not specified',
      livestock: 'Livestock information not available', // This field doesn't exist in User model
      rating: farmer.rating,
      isVerified: farmer.isVerified,
      description: farmer.description,
      listings: farmerCattle
    }

    res.json({
      success: true,
      data: mappedFarmer,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
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
  getAllFarmers,
  getFarmerById,
}
