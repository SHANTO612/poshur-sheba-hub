const Product = require("../models/Product")
const { deleteImage } = require("../config/cloudinary")

const getAllProducts = async (req, res) => {
  try {
    let query = { status: "active" }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category
    }

    // Filter by type (supports comma-separated values)
    if (req.query.type) {
      const types = req.query.type.split(',');
      if (types.length > 1) {
        query.type = { $in: types };
      } else {
        query.type = req.query.type;
      }
    }

    // Filter by seller
    if (req.query.seller) {
      query.seller = req.query.seller
    }

    // Filter by availability
    if (req.query.available !== undefined) {
      query.available = req.query.available === "true"
    }

    // Filter by halal status
    if (req.query.halal !== undefined) {
      query.halal = req.query.halal === "true"
    }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search }
    }

    // Build sort object
    let sort = { createdAt: -1 } // Default: newest first

    if (req.query.sortBy === "price_asc") {
      sort = { priceNumeric: 1 }
    } else if (req.query.sortBy === "price_desc") {
      sort = { priceNumeric: -1 }
    } else if (req.query.sortBy === "name_asc") {
      sort = { name: 1 }
    }

    const products = await Product.find(query)
      .sort(sort)
      .populate("seller", "name shopName location phone rating")

    res.json({ success: true, data: products })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name shopName location phone rating"
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user._id,
    }

    // Extract numeric price from price string
    if (req.body.price) {
      const numericPrice = req.body.price.replace(/[^\d]/g, "")
      productData.priceNumeric = parseInt(numericPrice) || 0
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }))
    }

    const product = await Product.create(productData)
    await product.populate("seller", "name shopName location phone")

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    })
  } catch (error) {
    // Delete uploaded images if product creation fails
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await deleteImage(file.filename)
        } catch (deleteError) {
          console.error("Error deleting uploaded image:", deleteError)
        }
      }
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Check if user owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      })
    }

    // Extract numeric price from price string
    if (req.body.price) {
      const numericPrice = req.body.price.replace(/[^\d]/g, "")
      req.body.priceNumeric = parseInt(numericPrice) || 0
    }

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const image of product.images) {
        try {
          await deleteImage(image.publicId)
        } catch (error) {
          console.error("Error deleting old image:", error)
        }
      }

      // Add new images
      req.body.images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }))
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("seller", "name shopName location phone")

    res.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    })
  } catch (error) {
    // Delete uploaded images if update fails
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await deleteImage(file.filename)
        } catch (deleteError) {
          console.error("Error deleting uploaded image:", deleteError)
        }
      }
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Check if user owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      })
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      try {
        await deleteImage(image.publicId)
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getMyProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalItems = await Product.countDocuments({ seller: req.user._id })

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
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
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} 