// routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

// Register route
router.post('/register', 
    [
        body('username').isLength({ min: 5 }),
        body('password').isLength({ min: 6 })
    ], 
    register
);

// Login route
router.post('/login', 
    [
        body('username').notEmpty(),
        body('password').notEmpty()
    ], 
    login
);

module.exports = router;
