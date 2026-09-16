const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const generateInvoice = require("../utils/generateInvoice");
const Product = require("../models/Product");

// 1. CREATE ORDER (With Security Validation)
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, addressDetails, paymentMethod } = req.body;

    const userId = req.user.id || req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User ID missing from auth token" });
    }

    // 🛡️ SECURITY CHECK: Validate every item against the live database
    // This prevents users from buying products that were deleted while in their cart
    for (const item of items) {
      const liveProduct = await Product.findById(item.productId);

      // Check if product still exists in the database
      if (!liveProduct) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.productName}" is no longer available. Please remove it from your cart before proceeding.`,
        });
      }

      // Optional: Check if the quantity requested is actually available
      if (liveProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${liveProduct.stock} units of "${item.productName}" are left in stock. Please update your cart.`,
        });
      }
    }

    // If all products are valid, create the order
    const newOrder = await Order.create({
      user: userId,
      items,
      totalAmount,
      addressDetails,
      paymentMethod,
    });

    console.log("✅ Order successfully validated and saved to database!");
    res.status(201).json(newOrder);

  } catch (error) {
    console.error("🔥 DATABASE ERROR CREATING ORDER:");
    console.error(error);
    res.status(500).json({ message: "Failed to create order", details: error.message });
  }
};

// 2. GET USER ORDERS (For Profile Page)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 3. GET ALL ORDERS (For Admin Dashboard)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// 4. UPDATE ORDER STATUS (Admin Action)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// 5. DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

// 6. SHIPROCKET WEBHOOK (Live Tracking Updates)
exports.shiprocketWebhook = async (req, res) => {
  try {
    const { awb, current_status, sr_order_id } = req.body;
    console.log("🔔 SHIPROCKET WEBHOOK FIRED! Data received:", { awb, current_status, sr_order_id });

    if (sr_order_id) {
      const order = await Order.findOne({ shiprocketOrderId: sr_order_id.toString() }).populate("user");

      if (order) {
        if (awb) order.trackingNumber = awb;

        const statusMap = {
          "AWB ASSIGNED": "Processing",
          "MANIFEST GENERATED": "Processing",
          "PICKED UP": "Shipped",
          "IN TRANSIT": "Shipped",
          "OUT FOR DELIVERY": "Shipped",
          "DELIVERED": "Delivered",
          "CANCELED": "Cancelled",
          "RTO INITIATED": "Cancelled"
        };

        if (statusMap[current_status]) {
          const isNewlyShipped = order.orderStatus !== "Shipped" && statusMap[current_status] === "Shipped";
          order.orderStatus = statusMap[current_status];

          // Send Email if the status just changed to "Shipped"
          if (isNewlyShipped && awb && order.user && order.user.email) {
            try {
              const trackingHtml = `
                <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">
                  <h2 style="color: #2563eb;">Your package is on the way! 🚚</h2>
                  <p>Great news! Your Pure Ayurveda order has been packed and handed over to our delivery partner.</p>
                  <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Tracking Number (AWB): <br/><b>${awb}</b></p>
                  <a href="https://shiprocket.co/tracking/${awb}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
                    Track Your Package
                  </a>
                </div>
              `;

              await sendEmail({
                email: order.user.email,
                subject: "Your Pure Ayurveda Order has Shipped!",
                html: trackingHtml
              });
            } catch (emailErr) {
              console.error("Non-fatal: Failed to send tracking email", emailErr);
            }
          }
        }

        await order.save();
        console.log(`✅ MongoDB Updated! Order ${order._id} is now ${order.orderStatus}`);
      }
    }

    res.status(200).send("Webhook received successfully");
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).send("Server Error");
  }
};

// 7. DOWNLOAD INVOICE (PDF Generation)
exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🛡️ SECURITY: Verify user ownership or Admin role
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: "Not authorized to view this invoice" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=PureAyurveda-Invoice-${order._id.toString().slice(-8).toUpperCase()}.pdf`
    );

    generateInvoice(order, res);

  } catch (error) {
    console.error("❌ Invoice Generation Error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

// 👇 8. ADDED THIS NEW FUNCTION FOR CART VALIDATION 👇
// VALIDATE CART: Checks if products still exist before checkout
exports.validateCart = async (req, res) => {
  try {
    const { items } = req.body;
    
    // Loop through the cart and check the live database
    for (const item of items) {
      const liveProduct = await Product.findById(item.productId);
      
      if (!liveProduct) {
        return res.status(404).json({ 
          success: false, 
          message: `The product "${item.shortName || item.productName || 'Item'}" is no longer available. Please remove it from your cart.` 
        });
      }
    }

    // If it finishes the loop without errors, the cart is 100% safe!
    res.status(200).json({ success: true, message: "Cart is valid" });
  } catch (error) {
    console.error("Cart Validation Error:", error);
    res.status(500).json({ success: false, message: "Server error during cart validation" });
  }
};