const BookSet = require('../models/BookSet');
const Copy = require('../models/Copy');
const Product = require('../models/Product');
const ProductSale = require('../models/ProductSale');
const BookSetSale = require('../models/BookSetSale');
const mongoose = require('mongoose');

// Sale of normal products/stationary items
exports.productSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const product = await Product.findById(productId).session(session);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const totalPrice = product.price * quantity;
    product.stock -= quantity;
    await product.save({ session });

    // Log the sale in the database
    const sale = new ProductSale({ productId, quantity, total: totalPrice });
    await sale.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      message: 'Product sale completed successfully',
      product: product.name,
      quantity,
      total: totalPrice,
      invoice: `Generated invoice for ${quantity} of ${product.name}`
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error processing product sale:', error);
    res.status(500).json({ message: 'Error processing product sale' });
  } finally {
    session.endSession();
  }
};

exports.bookSetSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookSetId, quantity, includeCopies, copies } = req.body;

    if (!bookSetId || !quantity) {
      return res.status(400).json({ message: 'Book Set ID and quantity are required' });
    }

    const bookSet = await BookSet.findById(bookSetId).session(session);
    if (!bookSet) return res.status(400).json({ message: 'Book set not found' });

    if (bookSet.totalQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient book set quantity available' });
    }

    // Start with the set price of the book set
    let totalPrice = bookSet.setPrice * quantity;

    // If copies are not included, reduce the price of the copies from the set price
    if (!includeCopies && bookSet.copies && Array.isArray(bookSet.copies)) {
      let copiesPrice = 0;

      // Calculate total price for copies to be subtracted
      bookSet.copies.forEach(copy => {
        copiesPrice += copy.price * (copy.stock || 1); // Consider stock as the quantity of copies
      });

      totalPrice -= copiesPrice * quantity; // Subtract the copies price from totalPrice
    }

    const copyDetails = [];

    // If copies are included, calculate the total price for copies
    if (includeCopies && copies && Array.isArray(copies)) {
      for (const copyItem of copies) {
        const { name, quantity: copyQuantity } = copyItem;

        if (!name || !copyQuantity) {
          return res.status(400).json({ message: 'Each copy item must have a name and quantity' });
        }

        const copy = await Copy.findOne({ name }).session(session);
        if (!copy) {
          return res.status(400).json({ message: `Copy ${name} not found` });
        }

        const requiredStock = copyQuantity * quantity;
        if (copy.stock < requiredStock) {
          return res.status(400).json({ message: `Insufficient stock for ${name}` });
        }

        totalPrice += copy.price * requiredStock; // Add the copy price to the total if included
        copy.stock -= requiredStock;
        await copy.save({ session });

        copyDetails.push({
          name: copy.name,
          quantity: copyQuantity,
          total: copy.price * requiredStock,
        });
      }
    }

    // Deduct the book set quantity after the sale
    bookSet.totalQuantity -= quantity;
    await bookSet.save({ session });

    const sale = new BookSetSale({
      bookSetId,
      quantity,
      total: totalPrice,
      copies: copyDetails,
    });
    await sale.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      message: 'Book set sale completed successfully',
      total: totalPrice,
      invoice: `Invoice for ${quantity} of ${bookSet.className} with specified copies`,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error processing book set sale:', error);
    res.status(500).json({ message: 'Error processing book set sale' });
  } finally {
    session.endSession();
  }
};


// Get sales data for products
exports.getProductSales = async (req, res) => {
  try {
    const sales = await ProductSale.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$productDetails.name' },
          totalQuantitySold: { $sum: '$quantity' },
          totalRevenue: { $sum: '$total' },
          averagePrice: { $avg: '$total' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    if (sales.length === 0) {
      return res.status(404).json({ message: 'No sales data found' });
    }

    res.status(200).json({ sales });
  } catch (error) {
    console.error('Error fetching product sales:', error);
    res.status(500).json({ message: 'Error fetching product sales data' });
  }
};

// Get sales data for book sets
// Get sales data for book sets
exports.getBookSetSales = async (req, res) => {
  try {
    const sales = await BookSetSale.aggregate([
      {
        $lookup: {
          from: 'booksets',
          localField: 'bookSetId',
          foreignField: '_id',
          as: 'bookSetDetails',
        },
      },
      { $unwind: '$bookSetDetails' },
      {
        $lookup: {
          from: 'copies',
          localField: 'copies.name',
          foreignField: 'name',
          as: 'copyDetails',
        },
      },
      { $unwind: { path: '$copyDetails', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$bookSetId',
          bookSetName: { $first: '$bookSetDetails.className' },
          school: { $first: '$bookSetDetails.school' },
          className: { $first: '$bookSetDetails.className' },
          description: { $first: '$bookSetDetails.description' },
          totalQuantitySold: { $sum: '$quantity' },
          totalRevenue: { $sum: '$total' },
          copies: {
            $push: {
              name: '$copies.name',
              quantitySold: '$copies.quantity',
              total: '$copies.total',
            },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    if (sales.length === 0) {
      return res.status(404).json({ message: 'No book set sales data found' });
    }

    res.status(200).json({ sales });
  } catch (error) {
    console.error('Error fetching book set sales:', error);
    res.status(500).json({ message: 'Error fetching book set sales data' });
  }
};

