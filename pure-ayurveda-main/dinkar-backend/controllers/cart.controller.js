const Cart = require("../models/Cart");

// Get the logged-in user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    
    // If they don't have a cart yet, return an empty array
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Save or update the user's cart
exports.saveCart = async (req, res) => {
  try {
    const { items } = req.body;

    // Find the cart by user ID, or create a new one if it doesn't exist
    let cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items },
      { new: true, upsert: true } // upsert creates it if not found
    );

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error saving cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};