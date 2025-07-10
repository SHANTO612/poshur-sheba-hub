const express = require("express")
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} = require("../controllers/authController")
const { authenticateToken } = require("../middlewares/auth")
const { upload } = require("../config/cloudinary")

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/profile", authenticateToken, getProfile)
router.put("/profile", authenticateToken, updateProfile)
router.post("/change-password", authenticateToken, changePassword)
router.post("/upload-avatar", authenticateToken, upload.single("avatar"), uploadAvatar)



module.exports = router
