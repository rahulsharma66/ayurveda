const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Simple description for the card view
    description: {
      type: String,
      required: true,
    },
    // NEW: Long description for the detailed view
    longDescription: {
      type: String,
    },
    // NEW: Stores sizes (e.g., 500g, 1kg) and their prices
    // This replaces the single 'price' field for complex products
    variants: [
      {
        size: { type: String, required: true }, 
        mrp: { type: Number, required: true },  
        salePrice: { type: Number, required: true } 
      }
    ],
    // NEW: Stores bullet points for product benefits
    benefits: [
      {
        type: String,
      }
    ],
    ingredients: [
      { type: String }
    ],
    usage: [
      { type: String }
    ],
    category: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    // NEW: To show on the "Featured Products" section
    featured: {
      type: Boolean,
      default: false,
    },
    // Keep these for backward compatibility or simple products
    price: {
      type: Number,
      default: 0, 
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);