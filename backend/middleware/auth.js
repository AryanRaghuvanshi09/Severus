// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(verified.id);
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

// Role authorization middleware
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            return res.status(403).send('Access denied, insufficient permissions');
        }
    };
};

module.exports = { auth, authorizeRole };
