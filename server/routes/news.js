const express = require("express")
const { getAllNews, getNewsById, getFeaturedNews } = require("../controllers/newsController")
const { optionalAuth } = require("../middlewares/auth")

const router = express.Router()

router.get("/", getAllNews)
router.get("/featured", getFeaturedNews)
router.get("/:id", getNewsById)

module.exports = router
