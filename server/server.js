require('dotenv').config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const connectDB = require("./config/database")

// Import routes
const authRoutes = require("./routes/auth")
const cattleRoutes = require("./routes/cattle")
const farmerRoutes = require("./routes/farmers")
const veterinarianRoutes = require("./routes/veterinarians")
const sellerRoutes = require("./routes/sellers")
const productRoutes = require("./routes/products")
const newsRoutes = require("./routes/news")
const statsRoutes = require("./routes/stats")
const ratingRoutes = require("./routes/ratings")
const adminRoutes = require("./routes/admin")
const appointmentRoutes = require("./routes/appointments")

// Import middlewares
const errorHandler = require("./middlewares/errorHandler")
const corsConfig = require("./middlewares/cors")

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middlewares
app.use(corsConfig)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Debug middleware (moved after body parser)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)
  next()
})

// Routes

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "CattleBes API Server v3.0 is running!",
    version: "3.0.0",
    features: ["MongoDB", "Cloudinary", "JWT Auth", "Image Upload"],
    endpoints: {
      auth: "/api/auth",
      cattle: "/api/cattle",
      farmers: "/api/farmers",
      veterinarians: "/api/veterinarians",
      news: "/api/news",
      stats: "/api/stats",
    },
  })
})

// Test endpoint for veterinarians
app.get("/test-veterinarians", async (req, res) => {
  try {
    const User = require("./models/User");
    const veterinarians = await User.find({ userType: "veterinarian" });
    res.json({
      success: true,
      count: veterinarians.length,
      data: veterinarians
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/cattle", cattleRoutes)
app.use("/api/farmers", farmerRoutes)
app.use("/api/veterinarians", veterinarianRoutes)
app.use("/api/sellers", sellerRoutes)
app.use("/api/products", productRoutes)
app.use("/api/news", newsRoutes)
app.use("/api/stats", statsRoutes)
app.use("/api/ratings", ratingRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/contact", require("./routes/contact"))

// Debug route registration
console.log("Registered routes:");
console.log("- /api/veterinarians");
console.log("- /api/appointments");
console.log("- /test-veterinarians");

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CattleBes API Server v3.0 is running on port ${PORT}`)
  console.log(`📍 Server URL: http://localhost:${PORT}`)
  console.log(`📋 Features: MongoDB + Cloudinary + JWT Auth`)
})

module.exports = app
