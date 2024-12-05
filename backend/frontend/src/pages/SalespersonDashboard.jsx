import React, { useState } from "react";
import ProductSaleForm from "./ProductSaleForm";
import BookSetSaleForm from "./BookSetSaleForm";
import "../styles/SalesDashboard.css"; // Import the CSS file

const SalesDashboard = () => {
  const [selectedForm, setSelectedForm] = useState("product"); // Track selected form

  // Toggle between product sale form and book set sale form
  const handleFormChange = (formType) => {
    setSelectedForm(formType);
  };

  return (
    <div className="sales-dashboard-container">
      <h1>Sales Dashboard</h1>
      {/* Buttons to switch between forms */}
      <div className="form-toggle-buttons">
        <button onClick={() => handleFormChange("product")}>
          Product Sale
        </button>
        <button onClick={() => handleFormChange("bookSet")}>
          Book Set Sale
        </button>
      </div>
      {/* Conditionally render forms based on the selected form */}
      {selectedForm === "product" && (
        <div className="form-container">
          <ProductSaleForm />
        </div>
      )}
      {selectedForm === "bookSet" && (
        <div className="form-container">
          <BookSetSaleForm />
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
