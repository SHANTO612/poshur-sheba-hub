const express = require("express")
const { getAllVeterinarians, getVeterinarianById } = require("../controllers/veterinarianController")

const router = express.Router()

// Get all veterinarians
router.get("/", getAllVeterinarians)

// Get veterinarian by ID
router.get("/:id", getVeterinarianById)

module.exports = router 