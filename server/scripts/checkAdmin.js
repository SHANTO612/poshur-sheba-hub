const mongoose = require("mongoose")
const User = require("../models/User")
const connectDB = require("../config/database")

const checkAdmin = async () => {
  try {
    await connectDB()

    console.log("🔍 Checking for admin user...")

    // Check if admin exists
    const admin = await User.findOne({ userType: "admin" })
    
    if (admin) {
      console.log("✅ Admin user found!")
      console.log("Email:", admin.email)
      console.log("Name:", admin.name)
      console.log("User Type:", admin.userType)
      console.log("Is Active:", admin.isActive)
      console.log("Is Verified:", admin.isVerified)
    } else {
      console.log("❌ No admin user found!")
      console.log("Creating admin user...")
      
      const newAdmin = await User.create({
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
    }

    // List all users
    const allUsers = await User.find({}).select('name email userType isActive')
    console.log("\n📋 All users in database:")
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.userType} - Active: ${user.isActive}`)
    })

    process.exit(0)
  } catch (error) {
    console.error("❌ Error checking admin:", error)
    process.exit(1)
  }
}

checkAdmin() 