// controllers/copyController.js
const Copy = require('../models/Copy');

// Create a new copy entry
exports.createCopy = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const newCopy = await Copy.create({ name, price, stock });
    res.status(201).json(newCopy);
  } catch (error) {
    console.error('Error creating copy:', error);
    res.status(500).json({ message: 'Error creating copy' });
  }
};

// Fetch all copies
exports.getCopies = async (req, res) => {
  try {
    const copies = await Copy.find();
    res.json(copies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching copies' });
  }
};
