const User = require("../models/User")

const adminAuth = async (req, res, next) => {
  try {
    // Check if user exists and is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      })
    }

    // Check if user is admin
    if (req.user.userType !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Admin access required" 
      })
    }

    next()
  } catch (error) {
    console.error("Admin auth error:", error)
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    })
  }
}

module.exports = adminAuth 