const express = require("express");
const router = express.Router();
const { createRazorpayOrder, verifyPaymentAndCreateOrder } = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth.middleware");

// Generate the Razorpay ticket
router.post("/create", protect, createRazorpayOrder);

// Verify payment and save the order
router.post("/verify", protect, verifyPaymentAndCreateOrder);

module.exports = router;