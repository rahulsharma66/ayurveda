import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Plus, ShoppingBag, Minus, Trash2, CreditCard } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { AddressDialog } from "@/components/addresses/AddressDialog";
import { apiRequest, createPaymentTicket, verifyPayment } from "@/lib/api"; 

interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  fullAddress: string;
  landmark?: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const savings = items.reduce((sum, i) => sum + ((i.mrp || i.salePrice) - i.salePrice) * i.quantity, 0);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/products");
    }
  }, [items, navigate]);

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const data = await apiRequest("/auth/addresses", null, "GET");
      setAddresses(data || []);
      
      const defaultAddr = data?.find((a: Address) => a.isDefault);
      setSelectedAddressId(defaultAddr?._id || data?.[0]?._id || null);

    } catch (error: any) {
      console.error("Address fetch error:", error);
      setAddresses([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({ title: "Please select a delivery address", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 🛡️ 1. ULTIMATE SECURITY CHECK: Validate Cart Before Payment!
      const checkItems = items.map(item => ({ 
        productId: item.productId, 
        shortName: item.shortName 
      }));
      
      // If the API wrapper automatically prepends '/api', use "/orders/validate-cart"
      // Otherwise, adjust to "/api/orders/validate-cart" based on your setup.
      await apiRequest("/orders/validate-cart", { items: checkItems }, "POST");

      // 2. Get the full address
      const fullSelectedAddress = addresses.find(a => a._id === selectedAddressId);

      // 3. Ask backend to generate a Razorpay order ticket
      const ticketRes = await createPaymentTicket(totalPrice);
      const rzpOrder = ticketRes.order;

      // 4. Configure the Razorpay Checkout Popup
      const options = {
        key: "rzp_test_SJ84c1J5PTqzWg", // ⚠️ PASTE YOUR rzp_test_... KEY HERE!
        amount: rzpOrder.amount, 
        currency: rzpOrder.currency,
        name: "Pure Ayurveda",
        description: "Wellness Products Order",
        order_id: rzpOrder.id,
        handler: async function (response: any) {
          // 5. This runs AFTER the user successfully pays
          try {
            toast({ title: "Verifying payment... Please wait.", duration: 4000 });
            
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                items: items,
                totalAmount: totalPrice,
                addressDetails: fullSelectedAddress
              }
            });

            clearCart();
            toast({ title: "Payment Successful! 🎉", description: "Your order is placed." });
            navigate("/order-success"); 

          } catch (verifyErr) {
            console.error(verifyErr);
            toast({ title: "Payment Verification Failed", variant: "destructive" });
          }
        },
        prefill: {
          name: fullSelectedAddress?.firstName + " " + fullSelectedAddress?.lastName,
          contact: fullSelectedAddress?.phone,
        },
        theme: {
          color: "#166534" 
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        toast({ title: "Payment Failed", description: response.error.description, variant: "destructive" });
      });
      
      rzp.open();

    } catch (error: any) {
      console.error("Checkout Blocked:", error);
      
      // If our validation route blocked it, show the specific error from the backend
      const errorMessage = error.message || error.response?.data?.message || "Could not initiate payment. Please check your cart.";
      
      toast({ 
        title: "Cart Update Required", 
        description: errorMessage, 
        variant: "destructive" 
      });
      
    } finally {
      setIsSubmitting(false); 
    }
  };

  if (items.length === 0) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-serif text-2xl font-semibold text-foreground">Checkout</h1>
            </div>

            <div className="grid md:grid-cols-[1fr_380px] gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Delivery Address Box */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="font-serif text-lg font-semibold text-foreground">Delivery Address</h2>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsAddressDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add New
                    </Button>
                  </div>

                  {isLoadingAddresses ? (
                    <p className="text-sm text-muted-foreground">Loading addresses...</p>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-6">
                      <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">No addresses saved</p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsAddressDialogOpen(true)}>
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label
                          key={addr._id} 
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedAddressId === addr._id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="mt-1 accent-[hsl(var(--primary))]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground">
                              {addr.firstName} {addr.lastName} 
                              {addr.isDefault && (
                                <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {addr.fullAddress}
                              {addr.landmark && `, ${addr.landmark}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-xs text-muted-foreground">Phone: {addr.phone}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Items Box */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-lg font-semibold text-foreground">
                      Order Items ({totalItems})
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.shortName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">🌿</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm text-foreground">{item.shortName}</p>
                              <p className="text-xs text-muted-foreground">{item.size} · {item.category}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId, item.size)}
                              className="p-1 hover:bg-destructive/10 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5 border border-border rounded-lg overflow-hidden">
                              <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="px-2 py-1 hover:bg-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                              <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="px-2 py-1 hover:bg-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-primary">₹{(item.salePrice * item.quantity).toLocaleString()}</p>
                              {item.mrp && item.mrp !== item.salePrice && (
                                <p className="text-xs text-muted-foreground line-through">₹{(item.mrp * item.quantity).toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column – Order Summary */}
              <div className="md:sticky md:top-6 h-fit">
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <h2 className="font-serif text-lg font-semibold text-foreground">Order Summary</h2>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                      <span className="font-medium text-foreground">₹{totalPrice.toLocaleString()}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between">
                        <span className="text-neem">You save</span>
                        <span className="font-semibold text-neem">−₹{savings.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-neem font-medium">FREE</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-serif font-semibold text-foreground text-base">Total</span>
                    <span className="font-bold text-primary text-xl">₹{totalPrice.toLocaleString()}</span>
                  </div>

                  {selectedAddress && (
                    <div className="bg-secondary/50 rounded-lg p-3 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground text-sm mb-1">Delivering to:</p>
                      <p>{selectedAddress.firstName} {selectedAddress.lastName}</p>
                      <p>{selectedAddress.fullAddress}, {selectedAddress.city}</p>
                      <p>{selectedAddress.state} - {selectedAddress.pincode}</p>
                    </div>
                  )}

                  <Button className="w-full h-12 text-base gap-2" onClick={handlePlaceOrder} disabled={isSubmitting}>
                    <CreditCard className="w-4 h-4" />
                    {isSubmitting ? "Verifying Cart..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AddressDialog 
        open={isAddressDialogOpen} 
        onOpenChange={setIsAddressDialogOpen} 
        onSuccess={fetchAddresses} 
      />
    </Layout>
  );
};

export default Checkout;