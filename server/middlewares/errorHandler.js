const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack)
  console.error("Request URL:", req.url)
  console.error("Request Method:", req.method)
  console.error("Request Headers:", req.headers)

  // Ensure response hasn't been sent yet
  if (res.headersSent) {
    return next(err)
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    })
  }

  // MongoDB connection errors
  if (err.name === "MongoNetworkError" || err.name === "MongoServerSelectionError") {
    return res.status(503).json({
      success: false,
      message: "Database connection error",
    })
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = errorHandler
