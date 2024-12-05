import React from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Management Dashboard</h2>
      <p>Welcome, Admin!</p>
      <div className="button-container">
        <Link to="/add-product" className="link-button">
          Add Products
        </Link>
        <Link to="/add-bookset" className="link-button">
          Add Book Sets
        </Link>
        <Link to="/get-product" className="link-button">
          View Products
        </Link>
        <Link to="/get-bookset" className="link-button">
          View Book Sets
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
