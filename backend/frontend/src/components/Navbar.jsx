import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/products">Product List</Link>
      <Link to="/sales">Sales</Link>
      <Link to="/book-sets">Book Sets</Link>
    </nav>
  );
};

export default Navbar;
