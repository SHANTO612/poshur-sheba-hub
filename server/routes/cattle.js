const express = require("express")
const {
  getAllCattle,
  getCattleById,
  createCattle,
  updateCattle,
  deleteCattle,
  getMyCattle,
} = require("../controllers/cattleController")
const { authenticateToken, optionalAuth, requireRole } = require("../middlewares/auth")
const { upload } = require("../config/cloudinary")

const router = express.Router()

// Public routes
router.get("/", getAllCattle)
router.get("/my/listings", authenticateToken, getMyCattle)

// Protected routes (no conflicts yet)
router.post("/", authenticateToken, requireRole(["farmer"]), upload.array("images", 5), createCattle)

// ✅ Dynamic PUT/DELETE routes before GET /:id
router.put("/:id", authenticateToken, upload.array("images", 5), updateCattle)
router.delete("/:id", authenticateToken, deleteCattle)

// ✅ Make this the LAST route
router.get("/:id", optionalAuth, getCattleById)

module.exports = router
