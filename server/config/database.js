const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/cattlebes"
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    console.log("💡 Make sure MongoDB is running locally or set MONGODB_URI environment variable")
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
