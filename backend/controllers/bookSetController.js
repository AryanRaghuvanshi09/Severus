const BookSet = require('../models/BookSet');

// Create a new book set
exports.createBookSet = async (req, res) => {
  try {
    const { school, className, books, copies, totalQuantity } = req.body;

    // Calculate the total set price
    let totalSetPrice = 0;

    // Calculate the total price for books
    if (books && books.length > 0) {
      books.forEach(book => {
        totalSetPrice += book.price * (book.quantity || 1); // Default quantity to 1 if not provided
      });
    }

    // Calculate the total price for copies
    if (copies && copies.length > 0) {
      copies.forEach(copy => {
        totalSetPrice += copy.price * (copy.stock || 1); // Use stock as quantity
      });
    }

    // Create a new book set with the provided data and calculated price
    const newBookSet = new BookSet({
      school,
      className,
      books,
      copies,
      setPrice: totalSetPrice, // Automatically calculated set price
      totalQuantity,
    });

    // Save the book set to the database
    await newBookSet.save();

    res.status(201).json(newBookSet);
  } catch (error) {
    console.error('Error creating book set:', error);
    res.status(500).json({ message: 'Error creating book set' });
  }
};

// Fetch all book sets
exports.getBookSets = async (req, res) => {
  try {
    const bookSets = await BookSet.find(); // Retrieve all book sets
    res.json(bookSets);
  } catch (error) {
    console.error('Error fetching book sets:', error);
    res.status(500).json({ message: 'Error fetching book sets' });
  }
};
