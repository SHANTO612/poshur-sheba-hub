const express = require("express")
const { getAllSellers, getSellerById } = require("../controllers/sellerController")

const router = express.Router()

// Get all sellers
router.get("/", getAllSellers)

// Get seller by ID
router.get("/:id", getSellerById)

module.exports = router 