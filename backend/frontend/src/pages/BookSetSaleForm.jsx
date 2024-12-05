import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import API from "../services/api";
import "jspdf-autotable";

const BookSetSaleForm = () => {
  const [bookSets, setBookSets] = useState([]);
  const [filteredBookSets, setFilteredBookSets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookSet, setSelectedBookSet] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [includeCopies, setIncludeCopies] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);

  useEffect(() => {
    const fetchBookSets = async () => {
      try {
        const response = await API.get("/book-sets");
        setBookSets(response.data);
        setFilteredBookSets(response.data);
      } catch (error) {
        console.error("Error fetching book sets:", error);
      }
    };

    fetchBookSets();
  }, []);

  useEffect(() => {
    const calculateTotalCost = () => {
      if (!selectedBookSet) return;

      const bookSet = bookSets.find((set) => set._id === selectedBookSet);
      if (!bookSet) return;

      const baseBookSetCost = bookSet.setPrice; // Includes books and copies initially
      let copiesCost = 0;

      if (bookSet.copies && bookSet.copies.length > 0) {
        copiesCost = bookSet.copies.reduce(
          (sum, copy) => sum + copy.price * (copy.stock || 0),
          0
        );
      }

      const adjustedPricePerUnit = includeCopies
        ? baseBookSetCost
        : baseBookSetCost - copiesCost;

      setPricePerUnit(adjustedPricePerUnit);
      setTotalCost(adjustedPricePerUnit * quantity);
    };

    calculateTotalCost();
  }, [selectedBookSet, quantity, includeCopies, bookSets]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = bookSets.filter((bookSet) =>
      `${bookSet.school} ${bookSet.className}`
        .toLowerCase()
        .includes(searchValue)
    );
    setFilteredBookSets(filtered);
  };

  const handleBookSetSale = async (e) => {
    e.preventDefault();

    if (!selectedBookSet || !quantity) {
      alert("Please select a book set and quantity.");
      return;
    }

    try {
      const response = await API.post("/sales/book-set", {
        bookSetId: selectedBookSet,
        quantity,
        includeCopies,
      });

      const bookSet = bookSets.find((set) => set._id === selectedBookSet);

      const invoiceData = {
        bookSetName: `${bookSet.school} - ${bookSet.className}`,
        school: bookSet.school,
        className: bookSet.className,
        quantity,
        pricePerUnit,
        totalCost,
        date: new Date().toLocaleDateString(),
        includeCopies,
        books: bookSet.books || [],
        copies: bookSet.copies || [],
      };

      generatePDF(invoiceData, "Book Set Sale");

      alert(response.data.message);
    } catch (error) {
      console.error("Error processing book set sale:", error);
      alert("Book set sale failed.");
    }
  };

const generatePDF = (invoiceData, saleType) => {
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

    doc.text("B-71, Shastripuram, Sikandra, Agra", 4, 30);
    doc.text("Contact: 9927128973, 9760018973", 4, 35);

    doc.text(`Sale Type: ${saleType}`, 4, 40);

    // Table Header
    let yPos = 47;
    const startX = 4;
    const colWidths = [22, 8, 8, 10]; // Column widths for Item, Rate, Qty, Amt
    doc.line(startX, yPos - 3, startX + 50, yPos - 3); // Top border of table
    yPos += 2;
    doc.setFontSize(7);
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

    // Adding book rows
    const books = invoiceData.books || [];
    const copies = invoiceData.copies || [];

    books.forEach((book) => {
      const price = parseFloat(book.price) || 0;
      const quantity = parseInt(book.quantity, 10) || 0;
      const total = price * quantity;
      addRow(book.name, price, quantity, total);
    });

    // Adding copy rows if included
    if (invoiceData.includeCopies && copies.length > 0) {
      copies.forEach((copy) => {
        const price = parseFloat(copy.price) || 0;
        const stock = parseInt(copy.stock, 10) || 0;
        const total = price * stock;
        addRow(copy.name, price, stock, total);
      });
    } else if (!invoiceData.includeCopies) {
      addRow("Copies not included", "-", "-", "-");
    }

    // Line below item rows
    doc.line(startX, yPos, startX + 50, yPos);

    // Totals Section
    yPos += 4;
    doc.setFontSize(7);
    doc.text("Total", startX + colWidths[0] + colWidths[1], yPos, {
      align: "right",
    });
    doc.text(`${Math.round(invoiceData.totalCost)}`, startX + 50 - 1, yPos, {
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
      <h2>Book Set Sale</h2>
      <form onSubmit={handleBookSetSale}>
        <label>Search Book Set:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by school or class"
        />

        <label>Select Book Set:</label>
        <select
          value={selectedBookSet}
          onChange={(e) => setSelectedBookSet(e.target.value)}
        >
          <option value="">--Select Book Set--</option>
          {filteredBookSets.map((bookSet) => (
            <option key={bookSet._id} value={bookSet._id}>
              {bookSet.school} - {bookSet.className}
            </option>
          ))}
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <label>Include Copies:</label>
        <input
          type="checkbox"
          checked={includeCopies}
          onChange={(e) => setIncludeCopies(e.target.checked)}
        />

        <label>Total Cost: ₹{totalCost.toFixed(2)}</label>
        <button type="submit">Process Sale</button>
      </form>
    </div>
  );
};

export default BookSetSaleForm;
