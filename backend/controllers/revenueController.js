const ProductSale = require('../models/ProductSale');
const BookSetSale = require('../models/BookSetSale');

exports.calculateRevenue = async (req, res) => {
    try {
        // Calculate revenue from product sales
        const productSales = await ProductSale.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
        ]);
        const productRevenue = productSales[0]?.totalRevenue || 0;

        // Calculate revenue from book set sales
        const bookSetSales = await BookSetSale.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
        ]);
        const bookSetRevenue = bookSetSales[0]?.totalRevenue || 0;

        // Total revenue
        const totalRevenue = productRevenue + bookSetRevenue;

        res.status(200).json({
            productRevenue,
            bookSetRevenue,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
