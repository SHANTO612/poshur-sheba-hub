const News = require("../models/News")

const getAllNews = async (req, res) => {
  try {
    const query = { published: true }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category
    }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search }
    }

    // Build sort object
    let sort = { createdAt: -1 } // Default: newest first

    if (req.query.sortBy === "views_desc") {
      sort = { views: -1 }
    } else if (req.query.sortBy === "featured") {
      sort = { featured: -1, createdAt: -1 }
    }

    // Pagination - ensure minimum of 5 items
    const page = Number.parseInt(req.query.page) || 1
    const limit = Math.max(Number.parseInt(req.query.limit) || 10, 5) // Minimum 5 items
    const skip = (page - 1) * limit

    // Execute query
    const news = await News.find(query).sort(sort).skip(skip).limit(limit)

    // Get total count for pagination
    const totalItems = await News.countDocuments(query)

    res.json({
      success: true,
      data: news,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(totalItems / limit),
        hasPrevPage: page > 1,
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

const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      })
    }

    // Increment views
    await news.incrementViews()

    res.json({
      success: true,
      data: news,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getFeaturedNews = async (req, res) => {
  try {
    // Support configurable limit with minimum of 5
    const limit = Math.max(Number.parseInt(req.query.limit) || 5, 5)
    
    const news = await News.find({ published: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)

    res.json({
      success: true,
      data: news,
      count: news.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getLatestNews = async (req, res) => {
  try {
    // Get latest news with configurable limit, minimum 5
    const limit = Math.max(Number.parseInt(req.query.limit) || 10, 5)
    
    const news = await News.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(limit)

    res.json({
      success: true,
      data: news,
      count: news.length,
      lastUpdated: new Date(),
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
  getAllNews,
  getNewsById,
  getFeaturedNews,
  getLatestNews,
}
