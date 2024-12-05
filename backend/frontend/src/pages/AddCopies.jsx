import React, { useState } from "react";
import API from "../services/api";
import "../styles/AddCopies.css"; // Import the CSS

const AddCopy = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
  });
  
  const [alertMessage, setAlertMessage] = useState("");  // For success/error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/copies/create", formData); // Adjust the URL as per your API
      setAlertMessage({ type: "success", message: "Copy added successfully" });
      setFormData({ name: "", price: 0, stock: 0 }); // Reset the form after successful submission
    } catch (error) {
      console.error("Error adding copy", error);
      setAlertMessage({ type: "error", message: "Error adding copy" });
    }
  };

  return (
    <div className="add-copy-container">
      <h2>Add Copy</h2>
      {alertMessage && (
        <div className={`alert ${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}
      <form className="add-copy-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        />
        <button type="submit">Add Copy</button>
      </form>
    </div>
  );
};

export default AddCopy;
