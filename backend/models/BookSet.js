const mongoose = require('mongoose');

// Nested schema for individual book in the book set
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

// Nested schema for individual copy in the book set
const copySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
});

const bookSetSchema = new mongoose.Schema({
  school: { type: String, required: true },
  className: { type: String, required: true },
  books: [bookSchema], // Array of books in the set
  copies: [copySchema], // Array of copies in the set
  setPrice: { type: Number, required: true }, // Total price of the set
  totalQuantity: { type: Number, default: 1 }, // Total quantity of book sets
});

module.exports = mongoose.model('BookSet', bookSetSchema);
