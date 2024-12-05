import React, { useState } from "react";
import API from "../services/api";

const Sales = () => {
  const [salesData, setSalesData] = useState({ productId: "", quantity: 1 });

  const handleSale = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/sales/product", salesData);
      alert(`Sale completed: ${response.data.invoice}`);
    } catch (error) {
      console.error("Error completing sale", error);
    }
  };

  return (
    <form onSubmit={handleSale}>
      <h2>Product Sale</h2>
      <input
        type="text"
        placeholder="Product ID"
        onChange={(e) =>
          setSalesData({ ...salesData, productId: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Quantity"
        onChange={(e) =>
          setSalesData({ ...salesData, quantity: e.target.value })
        }
      />
      <button type="submit">Complete Sale</button>
    </form>
  );
};

export default Sales;
