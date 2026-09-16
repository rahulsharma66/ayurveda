const express = require("express");
const router = express.Router();
const { 
  register, 
  verifyEmail, 
  login, 
  getProfile, 
  updateProfile,
  forgotPassword,  // Added
  resetPassword,   // Added
  addAddress, 
  getAddresses, 
  deleteAddress,
  updateAddress    // Added: This fixes your ReferenceError
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// --- PUBLIC ROUTES ---
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // Added
router.post("/reset-password", resetPassword);   // Added

// --- PRIVATE ROUTES (Auth Required) ---
router.get("/profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);

// Address Management Routes
router.get("/addresses", protect, getAddresses);
router.post("/add-address", protect, addAddress);
router.put("/address/:id", protect, updateAddress); // Now this will work
router.delete("/address/:id", protect, deleteAddress);

module.exports = router;