const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/category.controller");

// 1. Correctly import 'protect' and 'adminOnly'
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware"); 

// Public route (Main website needs to see categories)
router.get("/", getCategories);

// Admin only routes
// 2. Use 'adminOnly' here instead of 'admin'
router.post("/", protect, adminOnly, createCategory); 
router.delete("/:id", protect, adminOnly, deleteCategory); 

module.exports = router;