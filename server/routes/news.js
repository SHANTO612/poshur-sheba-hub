const express = require("express")
const { getAllNews, getNewsById, getFeaturedNews, getLatestNews } = require("../controllers/newsController")
const { optionalAuth } = require("../middlewares/auth")
const fetch = require('node-fetch');

const router = express.Router()

router.get("/", getAllNews)
router.get("/featured", getFeaturedNews)
router.get("/latest", getLatestNews)

// Proxy external news APIs (GNews, NewsAPI) - must be before /:id
router.get('/external', async (req, res) => {
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
  const NEWSAPI_API_KEY = process.env.NEWSAPI_API_KEY;
  const NEWS_QUERY = '"cattle farm" OR "dairy farm" OR "livestock equipment" OR "dairy farmer" OR "cattle feed" OR "dairy equipment" OR "farm equipment" OR "cattle disease" OR "milk production" OR "livestock market"';

  if (!GNEWS_API_KEY && !NEWSAPI_API_KEY) {
    return res.status(500).json({ success: false, message: 'News API keys are not configured on the server.' });
  }

  try {
    // GNews
    let gnewsResult = { articles: [] };
    if (GNEWS_API_KEY) {
      try {
        const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(NEWS_QUERY)}&lang=en&max=15&token=${GNEWS_API_KEY}`;
        const gnewsRes = await fetch(gnewsUrl);
        gnewsResult = await gnewsRes.json();
      } catch (err) {
        gnewsResult = { articles: [], error: 'Failed to fetch from GNews' };
      }
    }
    // NewsAPI
    let newsApiResult = { articles: [] };
    if (NEWSAPI_API_KEY) {
      try {
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(NEWS_QUERY)}&pageSize=15&sortBy=publishedAt&language=en&apiKey=${NEWSAPI_API_KEY}`;
        const newsApiRes = await fetch(newsApiUrl);
        newsApiResult = await newsApiRes.json();
      } catch (err) {
        newsApiResult = { articles: [], error: 'Failed to fetch from NewsAPI' };
      }
    }
    // If both failed
    if ((!gnewsResult.articles || gnewsResult.articles.length === 0) && (!newsApiResult.articles || newsApiResult.articles.length === 0)) {
      return res.status(502).json({ success: false, message: 'Failed to fetch news from all external sources.' });
    }
    res.json({
      success: true,
      gnews: gnewsResult,
      newsapi: newsApiResult
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch external news', error: error.message });
  }
});

router.get("/:id", optionalAuth, getNewsById)


module.exports = router
