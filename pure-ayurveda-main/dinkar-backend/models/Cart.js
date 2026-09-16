const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per user
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productName: String,
        shortName: String,
        category: String,
        size: String,
        mrp: Number,
        salePrice: Number,
        quantity: { type: Number, default: 1 },
        image: String,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);