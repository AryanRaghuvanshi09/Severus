import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoleSelection.css"; // Link to the CSS file

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    navigate(`/login/${role}`);
  };

  const handleSalesInsightsLogin = () => {
    navigate("/login/admin?redirect=sales-insights"); // Login for Sales Insights Dashboard
  };

  return (
    <div className="role-selection">
      <nav className="navbar">
        <h1 className="navbar-title">Stationary Store</h1>
        <div className="navbar-links">
          <a href="#" onClick={() => handleRoleSelection("admin")}>Admin</a>
          <a href="#" onClick={() => handleRoleSelection("salesperson")}>Salesperson</a>
          <a href="#" onClick={handleSalesInsightsLogin}>Sales Insights</a>
        </div>
      </nav>

      <main className="main-content">
        <div className="role-card">
          <h2>Select Your Role</h2>
          <button className="role-button" onClick={() => handleRoleSelection("admin")}>
            Admin
          </button>
          <button className="role-button" onClick={() => handleRoleSelection("salesperson")}>
            Salesperson
          </button>
          <button className="role-button" onClick={handleSalesInsightsLogin}>
            Sales Insights Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default RoleSelection;
