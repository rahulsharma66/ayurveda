import { ShoppingBag, X, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const savings = items.reduce(
    (sum, i) => sum + (i.mrp - i.salePrice) * i.quantity,
    0
  );

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-foreground/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-md bg-background shadow-elevated flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="text-xs font-semibold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold text-foreground">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add some Ayurvedic goodness!
                    </p>
                  </div>
                  <Button onClick={closeCart} variant="outline" size="sm">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.size}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-card border border-border/60 rounded-xl p-4"
                      >
                        <div className="flex gap-3">
                          {/* Product Icon / Image */}
                      <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.shortName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">🌿</span>
                        )}
                      </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-sm text-foreground leading-tight">
                                  {item.shortName}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.size} · {item.category}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.productId, item.size)}
                                className="p-1 hover:bg-destructive/10 rounded-md transition-colors group shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive transition-colors" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 border border-border rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, item.size, item.quantity - 1)
                                  }
                                  className="px-2.5 py-1.5 hover:bg-secondary transition-colors"
                                >
                                  <Minus className="w-3 h-3 text-foreground" />
                                </button>
                                <span className="text-sm font-semibold text-foreground w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.productId, item.size, item.quantity + 1)
                                  }
                                  className="px-2.5 py-1.5 hover:bg-secondary transition-colors"
                                >
                                  <Plus className="w-3 h-3 text-foreground" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-sm font-bold text-primary">
                                  ₹{(item.salePrice * item.quantity).toLocaleString()}
                                </p>
                                {item.mrp !== item.salePrice && (
                                  <p className="text-xs text-muted-foreground line-through">
                                    ₹{(item.mrp * item.quantity).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer – Order Summary */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-4 bg-card">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium text-foreground">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neem">You save</span>
                      <span className="font-semibold text-neem">
                        −₹{savings.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-neem font-medium">FREE</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-serif font-semibold text-foreground text-base">
                    Total
                  </span>
                  <span className="font-bold text-primary text-xl">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <Button
                  className="w-full gap-2 bg-primary hover:bg-primary/90 h-12 text-base"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
