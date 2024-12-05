// routes/bookSetRoutes.js
const express = require('express');
const { createBookSet, getBookSets } = require('../controllers/bookSetController');
const { auth, authorizeRole } = require('../middleware/auth'); // Ensure this is correct
const router = express.Router();

router.post('/create', auth, authorizeRole('admin'), createBookSet);
router.get('/', auth, getBookSets);

module.exports = router;
