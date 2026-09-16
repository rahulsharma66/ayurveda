const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");

// utility: generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * REGISTER USER / ADMIN
 * Creates account + sends OTP for email verification
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // generate & hash OTP
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // send OTP email
    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.status(201).json({
      message: "Registered successfully. Please verify email via OTP.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * VERIFY EMAIL OTP
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If the email exists, OTP has been sent" });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    // UPDATE: Add a log here to see if sending fails
   try {
  console.log("Attempting to send email to:", email); // Debug log 1

  await transporter.sendMail({
    to: email,
    subject: "Reset your password",
    text: `Your password reset OTP is ${otp}. It expires in 5 minutes.`,
  });

  console.log("✅ OTP Email sent successfully!"); // Debug log 2
} catch (mailError) {
  console.error("❌ NODEMAILER ERROR:", mailError.message); // THIS IS THE KEY
  return res.status(500).json({ 
    message: "Email service failed", 
    error: mailError.message 
  });
}

    res.json({ message: "If the email exists, OTP has been sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * RESET PASSWORD – VERIFY OTP + SET NEW PASSWORD
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // UPDATE LOGIC: Set the password and clear OTP fields
    user.password = newPassword.trim();
    user.otp = undefined;
    user.otpExpires = undefined;

    // Save with 'majority' write concern to ensure it is committed
    await user.save({ w: 'majority' }); 

    // IMPORTANT: Add a tiny delay or ensure the response only sends after the write is confirmed
    return res.status(200).json({ message: "Password reset successful" });
    
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// This function sends the logged-in user's data back to the frontend
exports.getProfile = async (req, res) => {
  try {
    // req.user is populated by your "protect" middleware
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * UPDATE PROFILE
 */
// backend/controllers/auth.controller.js

exports.updateProfile = async (req, res) => {
  try {
    const { phone, name } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    
    // Improved check to capture all valid string inputs
    if (phone !== undefined) user.phone = phone; 

    await user.save(); // This will now work after fixing User.js

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    // Check your terminal for this specific error log
    console.error("Profile Update Error:", error); 
    res.status(500).json({ message: "Server error during update" });
  }
};
/**
 * ADD NEW ADDRESS
 */
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If this address is set as default, unset other default addresses
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push(req.body);
    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
};

/**
 * GET ALL ADDRESSES
 */
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE ADDRESS
 */
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Error deleting address" });
  }
};
/**
 * UPDATE EXISTING ADDRESS
 */
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the specific address in the array
    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Handle "Set as default" logic if changed to true
    if (req.body.isDefault && !address.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // Update the fields
    Object.assign(address, req.body);

    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ message: "Error updating address" });
  }
};
