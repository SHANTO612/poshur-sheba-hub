const Cattle = require("../models/Cattle")
const User = require("../models/User")
const News = require("../models/News")

const getStats = async (req, res) => {
  try {
    // Get basic counts
    const [totalCattle, totalFarmers, totalNews] = await Promise.all([
      Cattle.countDocuments({ status: { $ne: "sold" } }),
      User.countDocuments({ userType: "farmer", isActive: true }),
      News.countDocuments({ published: true }),
    ])

    // Get cattle by type
    const cattleByType = await Cattle.aggregate([
      { $match: { status: { $ne: "sold" } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ])

    // Convert to object format
    const cattleTypeStats = {}
    cattleByType.forEach((item) => {
      cattleTypeStats[item._id.toLowerCase()] = item.count
    })

    // Get average price
    const priceStats = await Cattle.aggregate([
      { $match: { status: { $ne: "sold" } } },
      { $group: { _id: null, avgPrice: { $avg: "$priceNumeric" } } },
    ])

    // Get top locations
    const locationStats = await Cattle.aggregate([
      { $match: { status: { $ne: "sold" } } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    // Get recent listings
    const recentListings = await Cattle.find({ status: "available" })
      .populate("seller", "name farmName")
      .sort({ createdAt: -1 })
      .limit(3)

    const stats = {
      totalCattle,
      totalFarmers,
      totalNews,
      cattleByType: cattleTypeStats,
      averagePrice: Math.round(priceStats[0]?.avgPrice || 0),
      topLocations: locationStats.map((item) => item._id),
      recentListings,
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getSearch = async (req, res) => {
  try {
    const query = req.query.q?.trim()
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    // Search cattle
    const cattleResults = await Cattle.find({
      $text: { $search: query },
      status: { $ne: "sold" },
    })
      .populate("seller", "name farmName")
      .limit(10)

    // Search farmers
    const farmerResults = await User.find({
      $and: [
        { userType: "farmer" },
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { farmName: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { speciality: { $regex: query, $options: "i" } },
          ],
        },
      ],
    }).limit(10)

    // Search news
    const newsResults = await News.find({
      $text: { $search: query },
      published: true,
    }).limit(10)

    res.json({
      success: true,
      data: {
        cattle: cattleResults,
        farmers: farmerResults,
        news: newsResults,
        totalResults: cattleResults.length + farmerResults.length + newsResults.length,
      },
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
  getStats,
  getSearch,
}
