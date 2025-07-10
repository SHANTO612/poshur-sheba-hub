const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/cattlebes"
    console.log("🔗 Attempting to connect to MongoDB...")
    console.log("📊 MongoDB URI:", mongoUri ? "Set" : "Not set")
    
    // Add timeout to prevent hanging
    const connectionPromise = mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    })

    // Add timeout to the connection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 15000) // 15 second timeout
    })

    const conn = await Promise.race([connectionPromise, timeoutPromise])

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`)
    console.log(`✅ Database: ${conn.connection.name}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    console.error("💡 Make sure MongoDB is running locally or set MONGODB_URI environment variable")
    console.error("🔧 Check your Railway environment variables")
    // Don't exit immediately, let the app try to start
    console.log("⚠️ Continuing without database connection...")
  }
}

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected")
})

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close()
  console.log("🔄 Mongoose connection closed through app termination")
  process.exit(0)
})

module.exports = connectDB
