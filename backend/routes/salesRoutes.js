// routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Import controllers and middleware
const { bookSetSale, productSale } = require('../controllers/salesController');
const revenueController = require('../controllers/revenueController');
const { auth } = require('../middleware/auth');

// Route for calculating revenue
router.get('/revenue', auth, revenueController.calculateRevenue);
router.get('/products', auth, salesController.getProductSales);  // Get product sales data
router.get('/book-sets',auth , salesController.getBookSetSales);  // Get book set sales data

// Route for selling book sets
router.post('/book-set', auth, bookSetSale);

// Route for selling individual products
router.post('/product', auth, productSale);

module.exports = router;
