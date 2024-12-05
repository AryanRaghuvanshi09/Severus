// utils/invoiceGenerator.js
const PDFDocument = require('pdfkit');

exports.generate = (items, total) => {
  const doc = new PDFDocument();
  doc.text('Invoice', { align: 'center' });

  items.forEach(item => {
    doc.text(`Item: ${item.name} | Price: ${item.price} | Quantity: ${item.quantity}`);
  });

  doc.text(`Total: ${total}`, { align: 'right' });
  doc.end();

  return doc;  // Return the document stream
};
