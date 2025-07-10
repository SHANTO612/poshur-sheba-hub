const Cattle = require("../models/Cattle")
const { deleteImage } = require("../config/cloudinary")

const getAllCattle = async (req, res) => {
  try {
    const cattle = await Cattle.find().populate(
      "seller",
      "name phone email farmName location rating",
    );
    res.json({
      success: true,
      data: cattle,
    });
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
    const cattleData = {
      ...req.body,
      seller: req.user._id,
    }

    // Extract numeric price from price string (remove currency symbols and commas)
    if (req.body.price) {
      const numericPrice = req.body.price.replace(/[^\d]/g, '');
      cattleData.priceNumeric = parseInt(numericPrice) || 0;
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      cattleData.images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }))
    }

    const cattle = await Cattle.create(cattleData)
    await cattle.populate("seller", "name phone email farmName location")

    res.status(201).json({
      success: true,
      data: cattle,
      message: "Cattle listing created successfully",
    })
  } catch (error) {
    // Delete uploaded images if cattle creation fails
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
      // Delete old images from Cloudinary
      for (const image of cattle.images) {
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

    // Delete images from Cloudinary
    for (const image of cattle.images) {
      try {
        await deleteImage(image.publicId)
      } catch (error) {
        console.error("Error deleting image:", error)
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
