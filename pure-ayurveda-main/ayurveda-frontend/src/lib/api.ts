const BASE_URL = "http://localhost:5000/api"; // Removed /auth to allow other routes like /products

export const apiRequest = async (endpoint: string, data: any = null, method: string = "POST") => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: method,
    headers: { 
      "Content-Type": "application/json",
      // Attach the token so the 'protect' middleware knows who you are
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    // GET requests cannot have a body, so we set it to null if no data
    body: data ? JSON.stringify(data) : null,
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.message || "Something went wrong");

  // If a login/register returns a new token, update it
  if (result.token) {
    localStorage.setItem("token", result.token);
  }

  return result;
};

// src/lib/api.ts

export const getProducts = async () => {
  try {
    // Assuming BASE_URL is defined in this file (e.g., 'http://localhost:5000/api')
    const response = await fetch(`${BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};


export const getCategories = async () => {
  try {
    // Assuming you use fetch. If you use axios, adjust accordingly (e.g. await axios.get('/api/categories'))
    // Replace the URL with your backend URL if it's different
    const response = await fetch("http://localhost:5000/api/categories");
    
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
// Add this to the bottom of src/lib/api.ts

// Fetch the user's cart from the database
export const getDbCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { items: [] }; // If not logged in, return empty

  try {
    const response = await fetch("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch cart");
    return await response.json();
  } catch (error) {
    console.error("Error fetching DB cart:", error);
    return { items: [] };
  }
};

export const saveDbCart = async (items: any[]) => {
  const token = localStorage.getItem("token");
  if (!token) return; 

  try {
    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
  } catch (error) {
    console.error("Error saving DB cart:", error);
  }
};
export const getProductById = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching single product:", error);
    return null;
  }
};
// Add this at the bottom of src/lib/api.ts

export const createOrder = async (orderData: any) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Failed to place order");
  }
  return await response.json();
};
// Fetch orders for the logged-in user
export const getUserOrders = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("http://localhost:5000/api/orders", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return await response.json();
};

// Ask backend to generate a Razorpay ticket
export const createPaymentTicket = async (amount: number) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("http://localhost:5000/api/payments/create", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) throw new Error("Failed to create payment ticket");
  return await response.json();
};

// Send signature to backend to verify and save the order
export const verifyPayment = async (paymentData: any) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch("http://localhost:5000/api/payments/verify", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) throw new Error("Payment verification failed");
  return await response.json();
};
export const getIngredientByName = async (name: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/ingredients/${name}`);
    if (!response.ok) {
      throw new Error("Failed to fetch ingredient details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching single ingredient:", error);
    return null;
  }
};