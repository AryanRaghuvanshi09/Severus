import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/GetCopies.css"; // Import the CSS

const GetCopies = () => {
  const [copies, setCopies] = useState([]);

  useEffect(() => {
    const fetchCopies = async () => {
      try {
        const response = await API.get("/copies"); // Adjust the URL as per your API
        setCopies(response.data);
      } catch (error) {
        console.error("Error fetching copies", error);
      }
    };

    fetchCopies();
  }, []);

  return (
    <div className="get-copies-container">
      <h2>Copies</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {copies.length > 0 ? (
            copies.map((copy) => (
              <tr key={copy._id}>
                <td>{copy.name}</td>
                <td>{copy.price}</td>
                <td>{copy.stock}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No copies available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GetCopies;
