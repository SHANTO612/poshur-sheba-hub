const express = require("express")
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController")
const { authenticateToken, optionalAuth, requireRole } = require("../middlewares/auth")
const { upload } = require("../config/cloudinary")

const router = express.Router()

// Public routes
router.get("/", getAllProducts)
router.get("/:id", getProductById)

// Protected routes
router.get("/my/products", authenticateToken, requireRole(["seller"]), getMyProducts)
router.post("/", authenticateToken, requireRole(["seller"]), upload.array("images", 5), createProduct)
router.put("/:id", authenticateToken, requireRole(["seller"]), upload.array("images", 5), updateProduct)
router.delete("/:id", authenticateToken, requireRole(["seller"]), deleteProduct)

module.exports = router 