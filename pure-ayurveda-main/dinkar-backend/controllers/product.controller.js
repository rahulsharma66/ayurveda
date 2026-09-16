const Product = require("../models/Product");

/**
 * CREATE PRODUCT (ADMIN)
 */
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

/**
 * GET ALL PRODUCTS (ADMIN)
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/**
 * UPDATE PRODUCT (ADMIN)
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

/**
 * DELETE PRODUCT (ADMIN)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/**
 * GET SINGLE PRODUCT (PUBLIC)
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    // 1. Check if the ID is a 24-character MongoDB ID
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } 
    // 2. If it's a simple static ID (like "1" or "ayurvedic-soap")
    else {
      product = await Product.findOne({ id: id });
    }
    
    // 3. If no product was found in the database
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).json({ message: "Server error fetching product" });
  }
};