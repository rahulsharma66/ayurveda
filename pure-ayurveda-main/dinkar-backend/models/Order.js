const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Links the order to the specific user
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    // The items from the cart
    items: [
      {
        productId: { type: String, required: true },
        productName: String,
        shortName: String,
        category: String,
        size: String,
        quantity: { type: Number, required: true },
        salePrice: { type: Number, required: true },
        mrp: Number,
        image: String,
      }
    ],
    totalAmount: { 
      type: Number, 
      required: true 
    },
    // The selected address from checkout
    addressDetails: { 
      type: Object, 
      required: true 
    },
    paymentMethod: { 
      type: String, 
      default: "COD" 
    },
    orderStatus: { 
      type: String, 
      default: "Pending" // Can be: Pending, Processing, Shipped, Delivered, Cancelled
    },
    
    // 👇 ADDED THESE 3 LINES FOR SHIPROCKET 👇
    shiprocketOrderId: { type: String },
    shiprocketShipmentId: { type: String },
    trackingNumber: { type: String } // Also known as the AWB Code
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);