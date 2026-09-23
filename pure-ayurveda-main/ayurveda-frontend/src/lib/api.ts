const BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (endpoint: string, data: any = null, method: string = "POST") => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : null,
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.message || "Something went wrong");

  return result;
};

export const getProducts = async () => {
  try {
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
    const response = await fetch(`${BASE_URL}/categories`);

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

export const getProductById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching single product:", error);
    return null;
  }
};

export const getIngredientByName = async (name: string) => {
  try {
    const response = await fetch(`${BASE_URL}/ingredients/${name}`);
    if (!response.ok) {
      throw new Error("Failed to fetch ingredient details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching single ingredient:", error);
    return null;
  }
};