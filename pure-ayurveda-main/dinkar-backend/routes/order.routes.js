const express = require("express");
const router = express.Router();

const { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus,
  deleteOrder,
  shiprocketWebhook,
  downloadInvoice,
  validateCart // 👈 ADDED THIS IMPORT
} = require("../controllers/order.controller");

const { protect } = require("../middleware/auth.middleware");

// --- Customer Routes ---
router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);
router.get("/:id/invoice", protect, downloadInvoice);

// 👇 ADDED THIS ROUTE FOR CART VALIDATION 👇
router.post("/validate-cart", protect, validateCart); 

// --- Webhook Route ---
// (No 'protect' middleware here because Shiprocket needs public access to send updates)
router.post("/webhook/tracking", shiprocketWebhook); 

// --- Admin Routes ---
router.get("/admin", protect, getAllOrders);
router.put("/admin/:id/status", protect, updateOrderStatus);
router.delete("/admin/:id", protect, deleteOrder);

module.exports = router;