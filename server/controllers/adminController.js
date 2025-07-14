const User = require("../models/User")
const Cattle = require("../models/Cattle")
const Product = require("../models/Product")
const News = require("../models/News")
const Rating = require("../models/Rating")

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    res.json({
      success: true,
      data: users,
      count: users.length
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    })
  }
}

// Get all news articles (admin only - includes unpublished)
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ createdAt: -1 })
    res.json({
      success: true,
      data: news,
      count: news.length
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch news"
    })
  }
}

// Delete a user and all their associated data
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // Prevent admin from deleting another admin
    if (user.userType === "admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete another admin user"
      })
    }

    // Delete all associated data
    await Promise.all([
      Cattle.deleteMany({ seller: userId }),
      Product.deleteMany({ seller: userId }),
      Rating.deleteMany({ $or: [{ farmer: userId }, { veterinarian: userId }] })
    ])

    // Delete the user
    await User.findByIdAndDelete(userId)

    res.json({
      success: true,
      message: "User and all associated data deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete user"
    })
  }
}

// Delete cattle listing
exports.deleteCattle = async (req, res) => {
  try {
    const { cattleId } = req.params

    const cattle = await Cattle.findById(cattleId)
    if (!cattle) {
      return res.status(404).json({
        success: false,
        message: "Cattle listing not found"
      })
    }

    await Cattle.findByIdAndDelete(cattleId)

    res.json({
      success: true,
      message: "Cattle listing deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting cattle:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete cattle listing"
    })
  }
}

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    await Product.findByIdAndDelete(productId)

    res.json({
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    })
  }
}

// Delete news article
exports.deleteNews = async (req, res) => {
  try {
    const { newsId } = req.params

    const news = await News.findById(newsId)
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News article not found"
      })
    }

    await News.findByIdAndDelete(newsId)

    res.json({
      success: true,
      message: "News article deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting news:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete news article"
    })
  }
}

// Delete rating
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params

    const rating = await Rating.findById(ratingId)
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found"
      })
    }

    await Rating.findByIdAndDelete(ratingId)

    res.json({
      success: true,
      message: "Rating deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting rating:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete rating"
    })
  }
}

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCattle,
      totalProducts,
      totalNews,
      totalRatings,
      farmers,
      sellers,
      veterinarians,
      buyers
    ] = await Promise.all([
      User.countDocuments(),
      Cattle.countDocuments(),
      Product.countDocuments(),
      News.countDocuments(),
      Rating.countDocuments(),
      User.countDocuments({ userType: "farmer" }),
      User.countDocuments({ userType: "seller" }),
      User.countDocuments({ userType: "veterinarian" }),
      User.countDocuments({ userType: "buyer" })
    ])

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCattle,
        totalProducts,
        totalNews,
        totalRatings,
        userTypes: {
          farmers,
          sellers,
          veterinarians,
          buyers
        }
      }
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats"
    })
  }
} 