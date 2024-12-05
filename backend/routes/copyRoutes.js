// routes/copyRoutes.js
const express = require('express');
const { createCopy, getCopies } = require('../controllers/copyController');
const { auth, authorizeRole } = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, authorizeRole('admin'), createCopy);
router.get('/', auth, getCopies);

module.exports = router;
