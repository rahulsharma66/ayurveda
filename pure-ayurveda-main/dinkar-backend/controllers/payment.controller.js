const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product"); // 👈 1. ADDED PRODUCT MODEL
const User = require("../models/User");
const { createShiprocketOrder } = require("../services/shiprocket.service");
const sendEmail = require("../utils/sendEmail");

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 2. Create the Razorpay Order (The "Ticket")
exports.createRazorpayOrder = async (req, res) => {
  try {
    // 👇 We now require 'items' from the frontend to validate them 👇
    const { amount, items } = req.body; 

    // 🛡️ ULTIMATE SECURITY CHECK: Validate before opening the Razorpay window
    if (items && items.length > 0) {
      for (const item of items) {
        const liveProduct = await Product.findById(item.productId);
        if (!liveProduct) {
          return res.status(404).json({ 
            success: false, 
            message: `Product "${item.shortName || item.productName || 'Item'}" is no longer available. Please go back to your cart and remove it.` 
          });
        }
      }
    }

    // If valid, generate the Razorpay ticket
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to initialize payment" });
  }
};

// 3. Verify the Payment & Save the Order
exports.verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderData 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      const newOrder = await Order.create({
        user: req.user.id,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        addressDetails: orderData.addressDetails,
        paymentMethod: "Razorpay (Online)",
        orderStatus: "Pending" 
      });

      const user = await User.findById(req.user.id);

      // --- SHIPROCKET TRIGGER ---
      try {
        const shiprocketRes = await createShiprocketOrder(newOrder, orderData.addressDetails, user.email);
        if (shiprocketRes && shiprocketRes.order_id) {
          newOrder.shiprocketOrderId = shiprocketRes.order_id.toString();
          newOrder.shiprocketShipmentId = shiprocketRes.shipment_id ? shiprocketRes.shipment_id.toString() : "";
          newOrder.trackingNumber = shiprocketRes.awb_code || "";
          await newOrder.save();
        }
      } catch (shipErr) {
        console.error("⚠️ Shiprocket integration failed:", shipErr.message);
      }

      // --- SEND EMAIL TRIGGER ---
      try {
        if (user && user.email) {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
              <h2 style="color: #166534;">Order Confirmed! 🎉</h2>
              <p>Hi ${user.name || "there"},</p>
              <p>Thank you for shopping with Pure Ayurveda. Your payment was successful.</p>
            </div>
          `;
          await sendEmail({
            email: user.email,
            subject: "Your Pure Ayurveda Order Confirmation",
            html: emailHtml
          });
        }
      } catch (emailError) {
        console.error("Non-fatal: Failed to send confirmation email");
      }

      return res.status(200).json({ success: true, message: "Payment verified successfully", order: newOrder });

    } else {
      return res.status(400).json({ success: false, message: "Invalid payment signature!" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};