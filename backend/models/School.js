// models/School.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  requiredBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classes: [classSchema],
});

module.exports = mongoose.model('School', schoolSchema);
