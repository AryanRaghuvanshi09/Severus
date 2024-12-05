// routes/productRoutes.js
const express = require('express');
const { addProduct, getProducts } = require('../controllers/productController');
const { auth, authorizeRole } = require('../middleware/auth');
const router = express.Router();

router.post('/add', auth, authorizeRole('admin'), addProduct);
router.get('/', auth, getProducts);

module.exports = router;
