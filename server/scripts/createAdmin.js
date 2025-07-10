const mongoose = require("mongoose")
const User = require("../models/User")
const connectDB = require("../config/database")

const createAdmin = async () => {
  try {
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ userType: "admin" })
    if (existingAdmin) {
      console.log("❌ Admin user already exists!")
      console.log("Email:", existingAdmin.email)
      process.exit(1)
    }

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@cattlebes.com",
      phone: "+8801712345678",
      userType: "admin",
      password: "admin123456",
      isVerified: true,
      isActive: true,
      description: "System Administrator"
    })

    console.log("✅ Admin user created successfully!")
    console.log("Email: admin@cattlebes.com")
    console.log("Password: admin123456")
    console.log("⚠️  Please change the password after first login!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    process.exit(1)
  }
}

createAdmin() 