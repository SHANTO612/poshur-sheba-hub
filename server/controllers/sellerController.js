const User = require("../models/User")

const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ userType: "seller", isActive: true })
      .select("name email phone shopName location rating totalSales createdAt")
      .sort({ rating: -1, createdAt: -1 })

    const formattedSellers = sellers.map(seller => ({
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      shopName: seller.shopName,
      location: seller.location,
      rating: seller.rating,
      totalSales: seller.totalSales,
      createdAt: seller.createdAt
    }))

    res.json({
      success: true,
      data: formattedSellers,
    })
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
      .select("name email phone shopName location rating totalSales createdAt")

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      })
    }

    if (seller.userType !== "seller") {
      return res.status(404).json({
        success: false,
        message: "User is not a seller",
      })
    }

    const formattedSeller = {
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      shopName: seller.shopName,
      location: seller.location,
      rating: seller.rating,
      totalSales: seller.totalSales,
      createdAt: seller.createdAt
    }

    res.json({
      success: true,
      data: formattedSeller,
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