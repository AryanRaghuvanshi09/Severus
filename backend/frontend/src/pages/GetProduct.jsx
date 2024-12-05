import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/GetProduct.css"; // Import the CSS here

const GetProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="get-product-container">
      <h2>Product List</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by product name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p className="price">Price: Rs. {product.price}</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))
        ) : (
          <p>No products found...</p>
        )}
      </div>
    </div>
  );
};

export default GetProduct;
