// Login.jsx
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import "../styles/Login.css";

const Login = () => {
  const { role } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Extract the redirect parameter from the query string
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(`/auth/login`, { ...formData, role });
      localStorage.setItem("token", response.data.token);
      alert("Login successful");

      // Redirect based on role and redirect parameter
      if (role === "admin") {
        if (redirect === "sales-insights") {
          navigate("/sales-insights-dashboard"); // Go to Sales Insights Dashboard
        } else {
          navigate("/admin-dashboard"); // Regular Admin Dashboard
        }
      } else if (role === "salesperson") {
        navigate("/salesperson-dashboard");
      } else {
        alert("Invalid role");
        navigate("/"); // Redirect to role selection if role is invalid
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
