import React from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Save the selected role in localStorage or state
    localStorage.setItem("role", role);

    // Navigate to the respective page based on the selected role
    if (role === "admin") {
      navigate("/admin-dashboard"); // Admin Dashboard
    } else if (role === "salesperson") {
      navigate("/salesperson-dashboard"); // Salesperson Dashboard
    }
  };

  return (
    <div>
      <h1>Welcome! Please select your role:</h1>
      <button onClick={() => handleRoleSelection("admin")}>Admin</button>
      <button onClick={() => handleRoleSelection("salesperson")}>
        Salesperson
      </button>
    </div>
  );
};

export default Homepage;
