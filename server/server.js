require('dotenv').config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const connectDB = require("./config/database")

console.log('🚀 Starting application...')
console.log('📊 Environment check:')
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'Not set')
console.log('  - PORT:', process.env.PORT || 'Not set (will use 3001)')
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET - This will cause failure!')
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'NOT SET - This will cause failure!')

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

console.log('🔧 Setting up middleware...')

// Middlewares
app.use(corsConfig)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

console.log('✅ Middleware setup complete')

// Connect to MongoDB with error handling
console.log('🔗 Attempting to connect to MongoDB...')
try {
  const connectDB = require("./config/database")
  connectDB()
  console.log('✅ MongoDB connection initiated')
} catch (error) {
  console.error('❌ Failed to load database config:', error.message)
  process.exit(1)
}

// Routes

// Health check
app.get("/", (req, res) => {
  try {
    res.json({
      message: "CattleBes API Server v3.0 is running!",
      version: "3.0.0",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3001,
      railway: {
        publicDomain: process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set',
        serviceName: process.env.RAILWAY_SERVICE_NAME || 'Not set',
        environment: process.env.RAILWAY_ENVIRONMENT_NAME || 'Not set'
      },
      features: ["MongoDB", "Cloudinary", "JWT Auth", "Image Upload"],
      endpoints: {
        auth: "/api/auth",
        cattle: "/api/cattle",
        farmers: "/api/farmers",
        news: "/api/news",
        stats: "/api/stats",
      },
    })
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Additional health check for Railway
app.get("/health", (req, res) => {
  try {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Simple test route for debugging
app.get("/test", (req, res) => {
  try {
    res.json({
      success: true,
      message: "Test endpoint working",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Simple ping route
app.get("/ping", (req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() })
})

// API Routes
console.log('🔧 Registering API routes...')
try {
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
  console.log("✅ All routes registered successfully")
} catch (error) {
  console.error("❌ Error registering routes:", error)
  process.exit(1)
}

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

console.log('🚀 Starting server...')

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CattleBes API Server v3.0 is running on port ${PORT}`)
  console.log(`📍 Server URL: http://localhost:${PORT}`)
  console.log(`🌐 Railway URL: https://cattle-bes.up.railway.app`)
  console.log(`📋 Features: MongoDB + Cloudinary + JWT Auth`)
  console.log(`✅ Server is ready to accept requests`)
}).on('error', (error) => {
  console.error('❌ Server failed to start:', error.message)
  if (error.code === 'EADDRINUSE') {
    console.error('💡 Port is already in use. Try a different port.')
  }
  process.exit(1)
})

module.exports = app

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
