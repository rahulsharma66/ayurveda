const express = require("express");
const router = express.Router();
const { getCart, saveCart } = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth.middleware");

// Both routes are protected because only logged-in users have DB carts
router.get("/", protect, getCart);
router.post("/", protect, saveCart);

module.exports = router;