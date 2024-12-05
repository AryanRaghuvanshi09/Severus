import React, { useState, useMemo } from "react";
import API from "../services/api";
import "../styles/AddBookset.css";

const AddBookSet = () => {
  const [formData, setFormData] = useState({
    school: "",
    className: "",
    books: [{ name: "", price: "", quantity: "" }],
    copies: [{ name: "", price: "", stock: "" }],
    totalQuantity: "",
  });

  // Add a new book
  const handleAddBook = () => {
    setFormData({
      ...formData,
      books: [...formData.books, { name: "", price: "", quantity: "" }],
    });
  };

  // Handle changes to book fields
  const handleBookChange = (index, field, value) => {
    const updatedBooks = formData.books.map((book, i) =>
      i === index ? { ...book, [field]: value } : book
    );
    setFormData({ ...formData, books: updatedBooks });
  };

  // Add a new copy
  const handleAddCopy = () => {
    setFormData({
      ...formData,
      copies: [...formData.copies, { name: "", price: "", stock: "" }],
    });
  };

  // Handle changes to copy fields
  const handleCopyChange = (index, field, value) => {
    const updatedCopies = formData.copies.map((copy, i) =>
      i === index ? { ...copy, [field]: value } : copy
    );
    setFormData({ ...formData, copies: updatedCopies });
  };

  // Calculate total price using useMemo
  const totalPrice = useMemo(() => {
    const booksTotal = formData.books.reduce(
      (sum, book) => sum + (book.price * book.quantity || 0),
      0
    );
    const copiesTotal = formData.copies.reduce(
      (sum, copy) => sum + (copy.price * copy.stock || 0),
      0
    );
    return booksTotal + copiesTotal;
  }, [formData.books, formData.copies]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        setPrice: totalPrice, // Include calculated total price in request
      };
      await API.post("/book-sets/create", dataToSend);
      alert("Book set added successfully");
    } catch (error) {
      console.error("Error adding book set", error);
      alert("Failed to add book set");
    }
  };

  return (
    <form className="add-bookset-form" onSubmit={handleSubmit}>
      <h2>Add Book Set</h2>
      <input
        type="text"
        placeholder="School"
        value={formData.school}
        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
        className="form-input"
      />
      <input
        type="text"
        placeholder="Class Name"
        value={formData.className}
        onChange={(e) =>
          setFormData({ ...formData, className: e.target.value })
        }
        className="form-input"
      />

      {/* Book Fields */}
      <h3>Books</h3>
      {formData.books.map((book, index) => (
        <div className="book-input-group" key={index}>
          <input
            type="text"
            placeholder="Book Name"
            value={book.name}
            onChange={(e) => handleBookChange(index, "name", e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Book Price"
            value={book.price}
            onChange={(e) =>
              handleBookChange(index, "price", parseFloat(e.target.value))
            }
            className="form-input"
          />
          <input
            type="number"
            placeholder="Book Quantity"
            value={book.quantity}
            onChange={(e) =>
              handleBookChange(index, "quantity", parseInt(e.target.value))
            }
            className="form-input"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddBook} className="add-button">
        Add Another Book
      </button>

      {/* Copy Fields */}
      <h3>Copies</h3>
      {formData.copies.map((copy, index) => (
        <div className="copy-input-group" key={index}>
          <input
            type="text"
            placeholder="Copy Name"
            value={copy.name}
            onChange={(e) => handleCopyChange(index, "name", e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Copy Price"
            value={copy.price}
            onChange={(e) =>
              handleCopyChange(index, "price", parseFloat(e.target.value))
            }
            className="form-input"
          />
          <input
            type="number"
            placeholder="Copy Stock"
            value={copy.stock}
            onChange={(e) =>
              handleCopyChange(index, "stock", parseInt(e.target.value))
            }
            className="form-input"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddCopy} className="add-button">
        Add Another Copy
      </button>

      {/* Total Price */}
      <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>

      {/* Total Quantity */}
      <input
        type="number"
        placeholder="Total Quantity"
        value={formData.totalQuantity}
        onChange={(e) =>
          setFormData({ ...formData, totalQuantity: parseInt(e.target.value) })
        }
        className="form-input"
      />
      <button type="submit" className="submit-button">
        Add Book Set
      </button>
    </form>
  );
};

export default AddBookSet;
