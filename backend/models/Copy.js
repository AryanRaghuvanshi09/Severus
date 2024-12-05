// models/Copy.js
const mongoose = require('mongoose');

const copySchema = new mongoose.Schema({
  name: { type: String, default: 'Notebook' },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
});

module.exports = mongoose.model('Copy', copySchema);
