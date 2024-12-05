import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import API from "../services/api";

const ProductSaleForm = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(searchValue)
    );
    setFilteredProducts(filtered);
  };

  const handleProductSelection = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) || value <= 0 ? 0 : value);
  };

  const addProductToOrder = () => {
    const product = products.find((p) => p._id === selectedProduct);
    if (!product || quantity <= 0) return;

    const newItem = {
      productId: product._id, // Save the product's _id
      productName: product.name,
      pricePerUnit: product.price,
      quantity,
      totalPrice: product.price * quantity,
    };

    setOrderItems((prevItems) => [...prevItems, newItem]);
    setTotalPrice((prevTotal) => prevTotal + newItem.totalPrice);
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleProductSale = async (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert("Please add products to the order.");
      return;
    }

    try {
      // Loop through the orderItems and send individual requests
      for (const item of orderItems) {
        const saleData = {
          productId: item.productId, // Send the correct productId
          quantity: item.quantity,
        };

        console.log("Sending sale data:", saleData); // Log data before sending for debugging

        // Send individual API request for each item
        await API.post("/sales/product", saleData);
      }

      generatePDF({
        orderItems,
        totalPrice,
        date: new Date().toLocaleDateString(),
      });

      alert("Sale successful!");
      setOrderItems([]); // Clear items after successful sale
      setTotalPrice(0); // Reset total price
    } catch (error) {
      console.error("Error processing product sale:", error);
      alert("Product sale failed.");
    }
  };

  const generatePDF = (invoiceData, saleType) => {
    // Retrieve the last used receipt number from localStorage
    let receiptCounter = parseInt(
      localStorage.getItem("receiptCounter") || "1",
      10
    );

    const doc = new jsPDF({ unit: "mm", format: [58, 180] });

    // Header Section
    doc.setFontSize(9);
    doc.text("SWASTIK TRADERS", 29, 8, { align: "center" });
    doc.setFontSize(8);
    doc.text("GST No. 09CASPS6827B1Z6", 29, 13, { align: "center" });

    // Invoice Details
    doc.setFontSize(7);
    doc.text(`Date: ${invoiceData.date}`, 4, 20);
    doc.text(`Receipt No: ${receiptCounter}`, 4, 25);

    // Store Information
    doc.text("B-71, Shastripuram, Sikandra, Agra", 4, 30);
    doc.text("Contact: 9927128973, 9760018973", 4, 35);

    // Sale Type
    doc.setFontSize(7);

    // Item Table Header
    let yPos = 47;
    const startX = 4;
    const colWidths = [22, 8, 8, 10]; // Column widths for Item, Rate, Qty, Amt
    doc.line(startX, yPos - 3, startX + 50, yPos - 3); // Top border of table
    yPos += 2;
    doc.text("Item", startX + 1, yPos);
    doc.text("Rate", startX + colWidths[0] + 1, yPos, { align: "center" });
    doc.text("Qty", startX + colWidths[0] + colWidths[1] + 1, yPos, {
      align: "center",
    });
    doc.text(
      "Amt",
      startX + colWidths[0] + colWidths[1] + colWidths[2] + 1,
      yPos,
      { align: "center" }
    );

    // Line under header
    yPos += 2;
    doc.line(startX, yPos, startX + 50, yPos);

    // Populate Items in the Table
    yPos += 4;

    const addRow = (name, rate, qty, amt) => {
      const wrappedText = doc.splitTextToSize(name, colWidths[0]); // Wrap item names to fit in column width
      const rowHeight = wrappedText.length * 4; // Calculate row height based on wrapped lines

      wrappedText.forEach((line, index) => {
        doc.text(line, startX + 1, yPos + index * 4); // Item column
      });

      // Remove decimals: use Math.round to round the price, quantity, and total
      doc.text(`${Math.round(rate)}`, startX + colWidths[0] + 1, yPos, {
        align: "center",
      });
      doc.text(
        `${Math.round(qty)}`,
        startX + colWidths[0] + colWidths[1] + 1,
        yPos,
        { align: "center" }
      );
      doc.text(
        `${Math.round(amt)}`,
        startX + colWidths[0] + colWidths[1] + colWidths[2] + 1,
        yPos,
        { align: "center" }
      );

      yPos += rowHeight + 2; // Move to the next row
    };

    invoiceData.orderItems.forEach((item) => {
      const price = parseFloat(item.pricePerUnit) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      const total = price * quantity;
      addRow(item.productName, price, quantity, total);
    });

    // Line below item rows
    doc.line(startX, yPos, startX + 50, yPos);

    // Totals Section
    yPos += 4;
    doc.setFontSize(7);
    doc.text("Total", startX + colWidths[0] + colWidths[1], yPos, {
      align: "right",
    });
    doc.text(`${Math.round(invoiceData.totalPrice)}`, startX + 50 - 1, yPos, {
      align: "right",
    });

    // Footer
    yPos += 8;
    doc.setFontSize(6);
    doc.text("Thank you for shopping with us!", 29, yPos, { align: "center" });

    // Save the PDF
    doc.save(`${saleType}_invoice_${receiptCounter}.pdf`);

    // Increment and save receipt number
    receiptCounter++;
    localStorage.setItem("receiptCounter", receiptCounter);
  };

  return (
    <div>
      <h2>Product Sale</h2>
      <form onSubmit={handleProductSale}>
        <label>Search Product:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or category"
        />

        <label>Select Product:</label>
        <select value={selectedProduct} onChange={handleProductSelection}>
          <option value="">--Select Product--</option>
          {filteredProducts.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - ₹{product.price}
            </option>
          ))}
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={handleQuantityChange}
        />

        <button type="button" onClick={addProductToOrder}>
          Add to Order
        </button>

        <div>
          <h3>Order Summary:</h3>
          <ul>
            {orderItems.map((item, index) => (
              <li key={index}>
                {item.productName} - ₹{item.pricePerUnit} x {item.quantity} = ₹
                {item.totalPrice}
              </li>
            ))}
          </ul>
          <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
        </div>

        <button type="submit">Complete Sale</button>
      </form>
    </div>
  );
};

export default ProductSaleForm;
