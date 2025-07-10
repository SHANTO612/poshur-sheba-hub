const User = require("../models/User")

const getAllSellers = async (req, res) => {
  try {
    // Get all users with userType "seller"
    let query = { userType: "seller", isActive: true }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' }
    }

    // Filter by business type
    if (req.query.businessType) {
      query.businessType = { $regex: req.query.businessType, $options: 'i' }
    }

    // Filter by verified status
    if (req.query.verified) {
      query.isVerified = req.query.verified === "true"
    }

    // Build sort object
    let sort = { rating: -1 } // Default: highest rating first

    if (req.query.sortBy === "totalSales_desc") {
      sort = { totalSales: -1 }
    } else if (req.query.sortBy === "name_asc") {
      sort = { name: 1 }
    }

    const sellers = await User.find(query).sort(sort)

    res.json({ success: true, data: sellers })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getSellerById = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id)

    if (!seller || seller.userType !== "seller") {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      })
    }

    res.json({
      success: true,
      data: seller,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
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
  getAllSellers,
  getSellerById,
} 