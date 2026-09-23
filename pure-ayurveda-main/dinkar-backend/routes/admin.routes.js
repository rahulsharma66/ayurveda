const express = require("express");
const {
  createProduct,
  getAllProductsAdmin,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

const router = express.Router();

// all routes below are ADMIN ONLY
router.use(protect, adminOnly);

// Products
router.post("/products", createProduct);
router.get("/products", getAllProductsAdmin);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;