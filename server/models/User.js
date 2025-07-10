const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^(\+880|880|0)?1[1-9]\d{8}$/, "Please provide a valid Bangladesh phone number"],
    },
    userType: {
      type: String,
      required: [true, "User type is required"],
      enum: ["farmer", "buyer", "veterinarian", "seller"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    // Additional profile fields
    farmName: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    speciality: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    // Veterinarian specific fields
    clinicName: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      trim: true,
    },
    // Seller specific fields
    shopName: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    // Buyer specific fields
    address: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ userType: 1 })
userSchema.index({ isActive: 1 })

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      userType: this.userType,
    },
    process.env.JWT_SECRET || "cattlebes_super_secret_key_2024",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  )
}

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date()
  return this.save()
}

// Transform output (remove sensitive fields)
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.__v
  return user
}

module.exports = mongoose.model("User", userSchema)
