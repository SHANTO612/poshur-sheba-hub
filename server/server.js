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

// Import middlewares
const errorHandler = require("./middlewares/errorHandler")
const corsConfig = require("./middlewares/cors")

const app = express()
const PORT = process.env.PORT || 3001

// Connect to MongoDB
connectDB()

// Middlewares
app.use(corsConfig)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))


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
      news: "/api/news",
      stats: "/api/stats",
    },
  })
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
app.use("/api/contact", require("./routes/contact"))

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
