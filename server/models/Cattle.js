const mongoose = require("mongoose")

const cattleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cattle name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true,
    },
    weight: {
      type: String,
      required: [true, "Weight is required"],
      trim: true,
    },
    age: {
      type: String,
      required: [true, "Age is required"],
      trim: true,
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
    type: {
      type: String,
      required: [true, "Cattle type is required"],
      enum: ["Cow", "Bull", "Calf", "Buffalo"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
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
    location: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
cattleSchema.index({ seller: 1 })
cattleSchema.index({ type: 1 })
cattleSchema.index({ status: 1 })
cattleSchema.index({ location: 1 })
cattleSchema.index({ priceNumeric: 1 })
cattleSchema.index({ createdAt: -1 })
cattleSchema.index({ featured: 1 })

// Text index for search functionality
cattleSchema.index({
  name: "text",
  breed: "text",
  description: "text",
  location: "text",
})

// Virtual for seller name (populated)
cattleSchema.virtual("sellerName", {
  ref: "User",
  localField: "seller",
  foreignField: "_id",
  justOne: true,
})

// Increment views
cattleSchema.methods.incrementViews = function () {
  this.views += 1
  return this.save()
}

// Pre-remove middleware to delete associated images
cattleSchema.pre("remove", async function (next) {
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

module.exports = mongoose.model("Cattle", cattleSchema)
