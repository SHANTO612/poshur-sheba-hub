const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true,
    },
    priceNumeric: {
      type: Number,
      required: [true, "Numeric price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["beef", "mutton", "chicken", "buffalo", "organ", "bone", "dairy", "milk", "yogurt", "cheese", "butter", "ghee", "cream", "feed", "supplement", "seed", "equipment", "tool", "machine"],
    },
    type: {
      type: String,
      required: [true, "Product type is required"],
      enum: ["meat", "organ", "bone", "processed", "dairy", "feed", "equipment"],
    },
    halal: {
      type: Boolean,
      default: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ["kg", "piece", "pack", "liter", "cup", "bottle", "bag", "ton", "gram", "set", "unit"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // Additional fields
    weight: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    processingDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
productSchema.index({ seller: 1 })
productSchema.index({ category: 1 })
productSchema.index({ status: 1 })
productSchema.index({ available: 1 })
productSchema.index({ featured: 1 })
productSchema.index({ createdAt: -1 })

// Text index for search functionality
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
})

// Virtual for seller name (populated)
productSchema.virtual("sellerName", {
  ref: "User",
  localField: "seller",
  foreignField: "_id",
  justOne: true,
})

// Pre-remove middleware to delete associated images
productSchema.pre("remove", async function (next) {
  try {
    const { deleteImage } = require("../config/cloudinary")

    // Delete all images from Cloudinary
    for (const image of this.images) {
      await deleteImage(image.publicId)
    }

    next()
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model("Product", productSchema) 