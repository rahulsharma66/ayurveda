const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");

// The store now redirects customers to Meesho, so this route
// only exists to let admins log into the admin panel.
router.post("/login", login);

module.exports = router;