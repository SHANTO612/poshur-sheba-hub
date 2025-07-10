const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/cattlebes"
    console.log("🔗 Attempting to connect to MongoDB...")
    console.log("📊 MongoDB URI:", mongoUri ? "Set" : "Not set")
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    })

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`)
    console.log(`✅ Database: ${conn.connection.name}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    console.error("💡 Make sure MongoDB is running locally or set MONGODB_URI environment variable")
    console.error("🔧 Check your Railway environment variables")
    process.exit(1)
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
