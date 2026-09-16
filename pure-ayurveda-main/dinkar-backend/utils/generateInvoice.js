const PDFDocument = require("pdfkit");

const generateInvoice = (order, res) => {
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50 });

  // 1. Pipe the PDF directly to the user's browser download stream
  doc.pipe(res);

  // 2. Add Company Branding (Header)
  doc.fillColor("#166534") // Dark Green
    .fontSize(28)
    .text("Pure Ayurveda", 50, 50);
    
  doc.fontSize(10)
    .fillColor("#6b7280") // Gray
    .text("123 Wellness Street", 50, 85)
    .text("Jaipur, Rajasthan, India - 302001")
    .text("Email: support@pureayurveda.com");

  doc.fillColor("#000000"); // Back to black

  // 3. Add Invoice Title & Details
  doc.fontSize(20).text("TAX INVOICE", 50, 140, { align: "right" });
  
  doc.fontSize(10)
    .text(`Order ID: #${order._id.toString().slice(-8).toUpperCase()}`, { align: "right" })
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, { align: "right" })
    .text(`Payment: ${order.paymentMethod || "Online"}`, { align: "right" });

  doc.moveDown();

  // 4. Add Customer "Bill To" Address
  doc.fontSize(12).font("Helvetica-Bold").text("Billed To:", 50, 160);
  doc.font("Helvetica").fontSize(10);
  
  if (order.addressDetails) {
    const addr = order.addressDetails;
    doc.text(`${addr.firstName || addr.name || "Customer"} ${addr.lastName || ""}`)
       .text(`${addr.fullAddress || addr.street || "Address Not Provided"}`)
       .text(`${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`)
       .text(`Phone: ${addr.phone || "N/A"}`);
  } else {
    doc.text("Customer Name: " + (order.user?.name || "Guest"));
  }

  // 5. Draw the Items Table Header
  const tableTop = 270;
  doc.font("Helvetica-Bold");
  doc.text("Item", 50, tableTop);
  doc.text("Qty", 350, tableTop);
  doc.text("Price", 400, tableTop);
  doc.text("Total", 480, tableTop);
  
  // Draw a horizontal line underneath the header
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  // 6. Draw the Order Items
  doc.font("Helvetica");
  let yPosition = tableTop + 25;

  order.items.forEach((item) => {
    const itemName = item.productName || item.shortName || "Product";
    const itemTotal = item.salePrice * item.quantity;

    doc.text(itemName, 50, yPosition, { width: 280 });
    doc.text(item.quantity.toString(), 350, yPosition);
    doc.text(`Rs. ${item.salePrice}`, 400, yPosition);
    doc.text(`Rs. ${itemTotal}`, 480, yPosition);

    yPosition += 20; // Move down for the next item
  });

  // Draw a horizontal line under the items
  doc.moveTo(50, yPosition + 5).lineTo(550, yPosition + 5).stroke();

  // 7. Draw the Grand Total
  doc.font("Helvetica-Bold").fontSize(12);
  doc.text("Grand Total:", 380, yPosition + 15);
  doc.fillColor("#166534").text(`Rs. ${order.totalAmount}`, 480, yPosition + 15);

  // 8. Footer
  doc.fillColor("#6b7280").fontSize(10).font("Helvetica");
  doc.text("Thank you for choosing Pure Ayurveda!", 50, 700, { align: "center" });

  // 9. Finalize and send the PDF!
  doc.end();
};

module.exports = generateInvoice;