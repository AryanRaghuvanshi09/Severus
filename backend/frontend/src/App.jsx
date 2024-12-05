// App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SalesInsightsDashboard from "./pages/SalesInsightsDashboard"; // New Sales Insights Dashboard
import SalespersonDashboard from "./pages/SalespersonDashboard";
import AddProduct from "./pages/AddProduct";
import AddBookSet from "./pages/AddBookSet";
import BookSets from "./pages/BookSets";
import GetProduct from "./pages/GetProduct";
import AddCopy from "./pages/AddCopies";
import GetCopies from "./pages/GetCopies";
import ProductSalesPage from "./pages/ProductSalesPage"; // New page for product sales
import BookSetSalesPage from "./pages/BookSetSalesPage"; 

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route
        path="/sales-insights-dashboard"
        element={<SalesInsightsDashboard />}
      />{" "}
      {/* New Sales Insights route */}
      <Route path="/salesperson-dashboard" element={<SalespersonDashboard />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/add-bookset" element={<AddBookSet />} />
      <Route path="/get-bookset" element={<BookSets />} />
      <Route path="/get-product" element={<GetProduct />} />
      <Route path="/add-copies" element={<AddCopy />} />
      <Route path="/get-copies" element={<GetCopies />} />
      <Route path="/product-sales" element={<ProductSalesPage />} />
       <Route path="/book-set-sales" element={<BookSetSalesPage />} />
    </Routes>
  );
};

export default App;
