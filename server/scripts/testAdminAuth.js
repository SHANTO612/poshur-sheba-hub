const mongoose = require("mongoose")
const User = require("../models/User")
const connectDB = require("../config/database")
const jwt = require("jsonwebtoken")

const testAdminAuth = async () => {
  try {
    await connectDB()

    console.log("🔍 Testing admin authentication...")

    // Find admin user
    const admin = await User.findOne({ userType: "admin" })
    
    if (!admin) {
      console.log("❌ No admin user found! Please create admin first.")
      process.exit(1)
    }

    console.log("✅ Admin user found:", admin.email)

    // Generate token for admin
    const token = admin.generateToken()
    console.log("✅ Admin token generated")

    // Test admin stats endpoint
    console.log("\n🧪 Testing admin stats endpoint...")
    try {
      const response = await fetch('http://localhost:3001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Admin stats endpoint working:", data)
      } else {
        console.log("❌ Admin stats endpoint failed:", response.status, response.statusText)
      }
    } catch (error) {
      console.log("❌ Error testing admin stats:", error.message)
    }

    // Test admin users endpoint
    console.log("\n🧪 Testing admin users endpoint...")
    try {
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Admin users endpoint working:", data.count, "users found")
      } else {
        console.log("❌ Admin users endpoint failed:", response.status, response.statusText)
      }
    } catch (error) {
      console.log("❌ Error testing admin users:", error.message)
    }

    console.log("\n📝 Admin authentication test completed!")
    console.log("If endpoints are working, the issue might be in the frontend.")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error testing admin auth:", error)
    process.exit(1)
  }
}

testAdminAuth() 