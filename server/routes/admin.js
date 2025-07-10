const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const {
  getAllUsers,
  deleteUser,
  deleteCattle,
  deleteProduct,
  deleteNews,
  deleteRating,
  getDashboardStats
} = require('../controllers/adminController');

// All routes require authentication first, then admin check
router.use(authenticateToken);
router.use(adminAuth);

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);

// Content management
router.delete('/cattle/:cattleId', deleteCattle);
router.delete('/products/:productId', deleteProduct);
router.delete('/news/:newsId', deleteNews);
router.delete('/ratings/:ratingId', deleteRating);

module.exports = router; 