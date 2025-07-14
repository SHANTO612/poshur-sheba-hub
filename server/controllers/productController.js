const Product = require("../models/Product")
const { deleteImage } = require("../config/cloudinary")

const getAllProducts = async (req, res) => {
  try {
    console.log('Product query params:', req.query);
    const query = {}

    // Filter by type
    if (req.query.type) {
      // Handle comma-separated types (e.g., "feed,equipment")
      if (req.query.type.includes(',')) {
        query.type = { $in: req.query.type.split(',') }
      } else {
        query.type = req.query.type
      }
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category
    }

    // Filter by seller
    if (req.query.seller) {
      query.seller = req.query.seller
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.priceNumeric = {}
      if (req.query.minPrice) query.priceNumeric.$gte = Number(req.query.minPrice)
      if (req.query.maxPrice) query.priceNumeric.$lte = Number(req.query.maxPrice)
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
    } else if (req.query.sortBy === "name_desc") {
      sort = { name: -1 }
    }

    // Pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Execute query
    console.log('Final query:', JSON.stringify(query, null, 2));
    const products = await Product.find(query)
      .populate("seller", "name shopName location rating")
      .sort(sort)
      .skip(skip)
      .limit(limit)
    console.log('Found products:', products.length);

    // Get total count for pagination
    const totalItems = await Product.countDocuments(query)

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
      console.log('Uploaded files:', req.files);
      productData.images = req.files.map((file) => {
        console.log('File object:', file);
        
        // Handle Cloudinary storage (has secure_url and public_id)
        if (file.secure_url) {
          return {
            url: file.secure_url,
            publicId: file.public_id,
          }
        }
        
        // Handle memory storage (has path and filename)
        if (file.path) {
          return {
            url: file.path,
            publicId: file.filename,
          }
        }
        
        // Fallback for other storage types
        return {
          url: file.url || file.path,
          publicId: file.public_id || file.filename,
        }
      })
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
      req.body.images = req.files.map((file) => {
        // Handle Cloudinary storage (has secure_url and public_id)
        if (file.secure_url) {
          return {
            url: file.secure_url,
            publicId: file.public_id,
          }
        }
        
        // Handle memory storage (has path and filename)
        if (file.path) {
          return {
            url: file.path,
            publicId: file.filename,
          }
        }
        
        // Fallback for other storage types
        return {
          url: file.url || file.path,
          publicId: file.public_id || file.filename,
        }
      })
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