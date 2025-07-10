const mongoose = require("mongoose")
const User = require("../models/User")
const Cattle = require("../models/Cattle")
const Product = require("../models/Product")
const News = require("../models/News")
const Rating = require("../models/Rating")
const connectDB = require("../config/database")

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Cattle.deleteMany({})
    await Product.deleteMany({})
    await News.deleteMany({})
    await Rating.deleteMany({})

    console.log("🗑️ Cleared all existing data")
    console.log("✅ Database is now empty and ready for real data!")
    console.log("📝 You can now add real users, cattle, products, and news through the application.")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error clearing database:", error)
    process.exit(1)
  }
}

seedData()
