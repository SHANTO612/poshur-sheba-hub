const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "cattlebes_super_secret_key_2024")
    const user = await User.findById(decoded.userId)

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found or inactive",
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      })
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      })
    }

    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    })
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "cattlebes_super_secret_key_2024")
      const user = await User.findById(decoded.userId)
      if (user && user.isActive) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      })
    }

    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      })
    }

    next()
  }
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
}
