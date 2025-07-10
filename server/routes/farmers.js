const express = require("express")
const { getAllFarmers, getFarmerById } = require("../controllers/farmerController")
const { optionalAuth } = require("../middlewares/auth")

const router = express.Router()

// Always place dynamic routes last
router.get("/", getAllFarmers)

// Any future routes like /top should go here

router.get("/:id", getFarmerById)  // Keep dynamic routes last

module.exports = router
