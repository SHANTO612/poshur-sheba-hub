const Cattle = require("../models/Cattle")
const { deleteImage } = require("../config/cloudinary")

const getAllCattle = async (req, res) => {
  try {
    const query = { status: { $ne: "sold" } }

    // Filter by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: "i" }
    }

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type
    }

    // Filter by breed
    if (req.query.breed) {
      query.breed = req.query.breed
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
    } else if (req.query.sortBy === "age_asc") {
      sort = { age: 1 }
    } else if (req.query.sortBy === "age_desc") {
      sort = { age: -1 }
    }

    // Pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Execute query
    const cattle = await Cattle.find(query)
      .populate("seller", "name farmName location rating")
      .sort(sort)
      .skip(skip)
      .limit(limit)

    // Get total count for pagination
    const totalItems = await Cattle.countDocuments(query)

    res.json({
      success: true,
      data: cattle,
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

const getCattleById = async (req, res) => {
  try {
    const cattle = await Cattle.findById(req.params.id).populate(
      "seller",
      "name phone email farmName location rating totalSales",
    )

    if (!cattle) {
      return res.status(404).json({
        success: false,
        message: "Cattle not found",
      })
    }

    // Increment views
    await cattle.incrementViews()

    res.json({
      success: true,
      data: cattle,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Cattle not found",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const createCattle = async (req, res) => {
  try {
    console.log('Create cattle request received')
    console.log('User:', req.user)
    console.log('Request body:', req.body)
    console.log('Request files:', req.files)
    
    // Get the current user's profile to extract location and contact info
    const User = require("../models/User")
    const currentUser = await User.findById(req.user._id)
    console.log('Current user found:', currentUser ? 'Yes' : 'No')
    
    // Extract cattle data from form fields
    const cattleData = {
      name: req.body.name,
      breed: req.body.breed,
      weight: req.body.weight,
      age: req.body.age,
      price: req.body.price,
      type: req.body.type,
      description: req.body.description,
      seller: req.user._id,
      // Automatically add location and contact from farmer's profile
      location: currentUser?.location || '',
      contact: currentUser?.phone || '',
    }
    console.log('Cattle data prepared:', cattleData)

    // Extract numeric price from price string (remove currency symbols and commas)
    if (req.body.price) {
      const numericPrice = req.body.price.replace(/[^\d]/g, '');
      cattleData.priceNumeric = parseInt(numericPrice) || 0;
      console.log('Price processed:', cattleData.priceNumeric)
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      // Check if we're using Cloudinary or memory storage
      const hasRealCredentials = process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_KEY !== "demo_key" &&
                               process.env.CLOUDINARY_CLOUD_NAME &&
                               process.env.CLOUDINARY_CLOUD_NAME !== "demo";
      
      if (hasRealCredentials) {
        // Using Cloudinary - files have path and filename
        cattleData.images = req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }))
      } else {
        // Using memory storage - convert buffer to data URL
        cattleData.images = req.files.map((file, index) => {
          const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          return {
            url: dataUrl,
            publicId: `local_image_${Date.now()}_${index}`,
          }
        })
      }
      console.log('Images processed:', cattleData.images.length)
    } else {
      // Add placeholder image if no images provided
      cattleData.images = [{
        url: "/placeholder.svg?height=300&width=400",
        publicId: "placeholder_cattle"
      }]
    }

    const cattle = await Cattle.create(cattleData)
    console.log('Cattle created successfully:', cattle._id)
    await cattle.populate("seller", "name phone email farmName location")

    res.status(201).json({
      success: true,
      data: cattle,
      message: "Cattle listing created successfully",
    })
  } catch (error) {
    console.error('Error creating cattle:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    // Delete uploaded images if cattle creation fails (only for Cloudinary)
    if (req.files && req.files.length > 0) {
      const hasRealCredentials = process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_KEY !== "demo_key" &&
                               process.env.CLOUDINARY_CLOUD_NAME &&
                               process.env.CLOUDINARY_CLOUD_NAME !== "demo";
      
      if (hasRealCredentials) {
        for (const file of req.files) {
          try {
            await deleteImage(file.filename)
          } catch (deleteError) {
            console.error("Error deleting uploaded image:", deleteError)
          }
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

const updateCattle = async (req, res) => {
  try {
    const cattle = await Cattle.findById(req.params.id)

    if (!cattle) {
      return res.status(404).json({
        success: false,
        message: "Cattle not found",
      })
    }

    // Check if user owns this cattle listing
    if (cattle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own listings",
      })
    }

    // Extract numeric price from price string (remove currency symbols and commas)
    if (req.body.price) {
      const numericPrice = req.body.price.replace(/[^\d]/g, '');
      req.body.priceNumeric = parseInt(numericPrice) || 0;
    }

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const hasRealCredentials = process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_KEY !== "demo_key" &&
                               process.env.CLOUDINARY_CLOUD_NAME &&
                               process.env.CLOUDINARY_CLOUD_NAME !== "demo";
      
      // Delete old images from Cloudinary (only if using real credentials)
      if (hasRealCredentials) {
        for (const image of cattle.images) {
          try {
            await deleteImage(image.publicId)
          } catch (error) {
            console.error("Error deleting old image:", error)
          }
        }
      }

      // Add new images
      if (hasRealCredentials) {
        // Using Cloudinary - files have path and filename
        req.body.images = req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }))
      } else {
        // Using memory storage - convert buffer to data URL
        req.body.images = req.files.map((file, index) => {
          const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          return {
            url: dataUrl,
            publicId: `local_image_${Date.now()}_${index}`,
          }
        })
      }
    }

    const updatedCattle = await Cattle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("seller", "name phone email farmName location")

    res.json({
      success: true,
      data: updatedCattle,
      message: "Cattle listing updated successfully",
    })
  } catch (error) {
    // Delete uploaded images if update fails (only for Cloudinary)
    if (req.files && req.files.length > 0) {
      const hasRealCredentials = process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_KEY !== "demo_key" &&
                               process.env.CLOUDINARY_CLOUD_NAME &&
                               process.env.CLOUDINARY_CLOUD_NAME !== "demo";
      
      if (hasRealCredentials) {
        for (const file of req.files) {
          try {
            await deleteImage(file.filename)
          } catch (deleteError) {
            console.error("Error deleting uploaded image:", deleteError)
          }
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

const deleteCattle = async (req, res) => {
  try {
    const cattle = await Cattle.findById(req.params.id)

    if (!cattle) {
      return res.status(404).json({
        success: false,
        message: "Cattle not found",
      })
    }

    // Check if user owns this cattle listing
    if (cattle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own listings",
      })
    }

    // Delete images from Cloudinary (only if using real credentials)
    const hasRealCredentials = process.env.CLOUDINARY_API_KEY && 
                             process.env.CLOUDINARY_API_KEY !== "demo_key" &&
                             process.env.CLOUDINARY_CLOUD_NAME &&
                             process.env.CLOUDINARY_CLOUD_NAME !== "demo";
    
    if (hasRealCredentials) {
      for (const image of cattle.images) {
        try {
          await deleteImage(image.publicId)
        } catch (error) {
          console.error("Error deleting image:", error)
        }
      }
    }

    await Cattle.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Cattle listing deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getMyCattle = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const cattle = await Cattle.find({ seller: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const totalItems = await Cattle.countDocuments({ seller: req.user._id })

    res.json({
      success: true,
      data: cattle,
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
  getAllCattle,
  getCattleById,
  createCattle,
  updateCattle,
  deleteCattle,
  getMyCattle,
}
