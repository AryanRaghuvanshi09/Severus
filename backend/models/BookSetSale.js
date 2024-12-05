const mongoose = require('mongoose');

const bookSetSaleSchema = new mongoose.Schema({
    bookSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'BookSet', required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    copies: { type: Array, default: [] },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookSetSale', bookSetSaleSchema);
