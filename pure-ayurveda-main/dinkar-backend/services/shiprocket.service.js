const axios = require("axios");

// 1. Log into Shiprocket to get a secure token
const getShiprocketToken = async () => {
  try {
    const response = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    // This prints the EXACT reason Shiprocket is blocking the login
    console.error("❌ Shiprocket Auth Error:", error.response?.data || error.message);
    return null;
  }
};

// 2. Send the order details to Shiprocket
const createShiprocketOrder = async (order, addressDetails, userEmail) => {
  try {
    const token = await getShiprocketToken();
    if (!token) {
      console.log("⚠️ Could not get token, aborting Shiprocket order creation.");
      return null;
    }

    const shiprocketData = {
      order_id: order._id.toString(), 
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: "Home", // MUST match the exact name of the pickup location on your Shiprocket dashboard!
      billing_customer_name: addressDetails.firstName || addressDetails.name || "Customer",
      billing_last_name: addressDetails.lastName || "User",
      billing_address: addressDetails.fullAddress || addressDetails.street || addressDetails.address || "Address Not Provided",
      billing_city: addressDetails.city,
      billing_pincode: addressDetails.pincode,
      billing_state: addressDetails.state,
      billing_country: "India",
      billing_email: userEmail || "customer@example.com",
      billing_phone: addressDetails.phone,
      shipping_is_billing: true,
      order_items: order.items.map(item => ({
        name: item.productName || "Product",
        sku: item.productId.toString(), 
        units: item.quantity,
        selling_price: item.salePrice,
      })),
      payment_method: "Prepaid", 
      sub_total: order.totalAmount,
      length: 15, breadth: 15, height: 10, weight: 0.5 
    };

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      shiprocketData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Order pushed to Shiprocket successfully!");
    return response.data; 
  } catch (error) {
    // This prints exactly what is wrong with the customer's address or order details
    console.error("❌ Failed to push to Shiprocket:", error.response?.data || error.message);
    return null; 
  }
};

module.exports = { createShiprocketOrder };