const express = require("express");
const { getAllProducts, getProductById } = require("../controllers/product.controller");

const router = express.Router();

// Get ALL products
router.get("/", getAllProducts);

// Get ONE specific product by its ID
router.get("/:id", getProductById);

module.exports = router;