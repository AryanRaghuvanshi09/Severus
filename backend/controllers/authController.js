// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      username,
      password, // Password will be hashed in the pre-save hook
      role: role || 'salesperson' // Default to 'salesperson' if no role is provided
    });

    await newUser.save();

    res.status(201).json({ message: 'User created', newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate a token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.json({ token });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};
