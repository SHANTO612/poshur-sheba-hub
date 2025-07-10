const express = require("express")
const {
  createRating,
  getVeterinarianRatings,
  getFarmerRating,
  deleteRating,
  getAllRatings,
} = require("../controllers/ratingController")
const { authenticateToken, requireRole } = require("../middlewares/auth")

const router = express.Router()

// Admin route to get all ratings
router.get("/", authenticateToken, requireRole(["admin"]), getAllRatings)

// Protected routes - only farmers can rate veterinarians
router.post("/", authenticateToken, requireRole(["farmer"]), createRating)
router.get("/veterinarian/:veterinarianId", getVeterinarianRatings) // Public route to view ratings
router.get("/farmer/:veterinarianId", authenticateToken, requireRole(["farmer"]), getFarmerRating)
router.delete("/:ratingId", authenticateToken, requireRole(["farmer"]), deleteRating)

module.exports = router 