import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// Import your new API functions (make sure you added them to src/lib/api.ts!)
import { getDbCart, saveDbCart } from "../lib/api"; 

export interface CartItem {
  productId: string;
  productName: string;
  shortName: string;
  category: string;
  size: string;
  mrp: number;
  salePrice: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // 1. Initialize items from localStorage for an instant load
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("ayurveda_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  
  // This state prevents us from accidentally overwriting the database with an empty cart
  // before we've had a chance to fetch the real data.
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. FETCH from Database when the app loads (if logged in)
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const dbCart = await getDbCart();
          if (dbCart && dbCart.items && dbCart.items.length > 0) {
            setItems(dbCart.items); // Replace local cart with the saved DB cart
          }
        } catch (error) {
          console.error("Failed to load cart from database", error);
        }
      }
      setIsInitialized(true);
    };
    fetchCart();
  }, []);

  // 3. SAVE to LocalStorage AND Database every time items change
  useEffect(() => {
    if (!isInitialized) return; // Wait until initial fetch completes

    // Always save to localStorage (this keeps the cart safe for non-logged in users)
    localStorage.setItem("ayurveda_cart", JSON.stringify(items));

    // Also save to database (only if the user is logged in)
    const token = localStorage.getItem("token");
    if (token) {
      saveDbCart(items);
    }
  }, [items, isInitialized]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.size === newItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId && i.size === newItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("ayurveda_cart"); // Make sure to wipe it here too!
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.salePrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};