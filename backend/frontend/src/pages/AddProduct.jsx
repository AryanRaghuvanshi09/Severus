import React, { useState } from "react";
import API from "../services/api";
import "../styles/AddProduct.css"; // Make sure this path is correct

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products/add", formData);
      alert("Product added successfully");
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Category"
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />
      <input
        type="number"
        placeholder="Stock"
        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
      />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
