const express = require("express")
const { getAllNews, getNewsById, getFeaturedNews, getLatestNews } = require("../controllers/newsController")
const { optionalAuth } = require("../middlewares/auth")

const router = express.Router()

router.get("/", getAllNews)
router.get("/featured", getFeaturedNews)
router.get("/latest", getLatestNews)
router.get("/:id", optionalAuth, getNewsById)

module.exports = router
