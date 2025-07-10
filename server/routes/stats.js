const express = require("express")
const { getStats, getSearch } = require("../controllers/statsController")
const { optionalAuth } = require("../middlewares/auth")

const router = express.Router()

router.get("/", getStats)
router.get("/search", getSearch)

module.exports = router
