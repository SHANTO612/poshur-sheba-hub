const mongoose = require("mongoose")

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      maxlength: [300, "Summary cannot exceed 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Health", "Production", "Technology", "Sustainability", "Market", "Government"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    image: {
      url: {
        type: String,
        default: "/placeholder.svg?height=200&width=300",
      },
      publicId: {
        type: String,
        default: null,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    published: {
      type: Boolean,
      default: true,
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

// Indexes
newsSchema.index({ category: 1 })
newsSchema.index({ published: 1 })
newsSchema.index({ featured: 1 })
newsSchema.index({ createdAt: -1 })
newsSchema.index({ views: -1 })

// Text index for search
newsSchema.index({
  title: "text",
  summary: "text",
  content: "text",
  tags: "text",
})

// Increment views
newsSchema.methods.incrementViews = function () {
  this.views += 1
  return this.save()
}

module.exports = mongoose.model("News", newsSchema)
