import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Package, ChevronRight, Truck, FileText, Download } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { getUserOrders } from "@/lib/api"; 

interface OrderItem {
  _id?: string;
  productId: string;
  productName?: string;
  shortName?: string;
  size: string;
  quantity: number;
  salePrice: number;
  mrp?: number;
  image?: string;
}

interface Order {
  _id: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  trackingNumber?: string; 
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  Pending: { label: "Pending", variant: "secondary" },
  Processing: { label: "Processing", variant: "secondary" },
  Shipped: { label: "Shipped", variant: "default" },
  Delivered: { label: "Delivered", variant: "outline" },
  Cancelled: { label: "Cancelled", variant: "destructive" },
};

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data || []);
      } catch (error: any) {
        toast({ title: "Failed to load orders", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // 👇 NEW FUNCTION: Handle PDF Download 👇
  const handleDownloadInvoice = async (orderId: string) => {
    try {
      setDownloadingId(orderId);
      // Get the token from localStorage (adjust if you store it elsewhere like cookies)
      const token = localStorage.getItem("token"); 
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/invoice`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to download invoice");

      // Convert the response to a hidden PDF Blob and trigger a browser download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `PureAyurveda-Invoice-${orderId.slice(-6).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({ title: "Success!", description: "Invoice downloaded successfully." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Could not download invoice", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-serif text-2xl font-semibold text-foreground">My Orders</h1>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-xl">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2">No orders yet</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Start shopping to see your orders here.
                </p>
                <Button onClick={() => navigate("/products")}>Browse Products</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const config = statusConfig[order.orderStatus] || statusConfig.Pending;
                  const isExpanded = expandedOrder === order._id;
                  
                  const subtotal = order.items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
                  const savings = order.items.reduce((sum, item) => sum + (((item.mrp || item.salePrice) - item.salePrice) * item.quantity), 0);

                  return (
                    <div
                      key={order._id}
                      className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-md"
                    >
                      <button
                        className="w-full p-5 text-left focus:outline-none"
                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={config.variant} className="font-semibold">{config.label}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(order.createdAt), "dd MMM yyyy")}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1.5">
                              Order #{order._id.slice(-8).toUpperCase()} • {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-foreground">₹{order.totalAmount.toLocaleString()}</span>
                            <div className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-muted' : 'hover:bg-muted'}`}>
                              <ChevronRight
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                              />
                            </div>
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <Separator />
                            <div className="p-5 space-y-4">
                              {/* Order Items */}
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={item._id || idx} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                                      {item.image ? (
                                        <img src={item.image} alt={item.shortName} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-xl">🌿</span>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {item.shortName || item.productName}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{item.size} × {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">
                                      ₹{(item.salePrice * item.quantity).toLocaleString()}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              <Separator />

                              {/* Price Breakdown */}
                              <div className="space-y-1.5 pt-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                                </div>
                                {savings > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-green-600">Savings</span>
                                    <span className="text-green-600 font-medium">−₹{savings.toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-base font-bold pt-2 border-t border-border mt-2">
                                  <span className="text-foreground">Total</span>
                                  <span className="text-primary">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                              </div>

                              {/* ACTIONS CARD: Tracking & Invoice */}
                              <div className="mt-6 pt-5 border-t border-border">
                                <div className="flex flex-col gap-3">
                                  
                                  {/* Tracking Box */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40 p-4 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-background p-2.5 rounded-full shadow-sm border border-border">
                                        <Truck className="h-5 w-5 text-primary" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-foreground">Delivery Status</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {order.trackingNumber 
                                            ? `AWB: ${order.trackingNumber}` 
                                            : "Waiting for courier assignment..."}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {order.trackingNumber ? (
                                      <Button asChild size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                        <a
                                          href={`https://shiprocket.co/tracking/${order.trackingNumber}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Track Package
                                        </a>
                                      </Button>
                                    ) : (
                                      <Badge variant="secondary" className="w-fit">
                                        {order.orderStatus}
                                      </Badge>
                                    )}
                                  </div>

                                  {/* 👇 Invoice Download Box 👇 */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-4 rounded-xl border border-border/50 shadow-sm">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-green-50 p-2.5 rounded-full border border-green-100">
                                        <FileText className="h-5 w-5 text-green-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-foreground">Order Invoice</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Download your tax receipt</p>
                                      </div>
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="w-full sm:w-auto gap-2"
                                      onClick={() => handleDownloadInvoice(order._id)}
                                      disabled={downloadingId === order._id}
                                    >
                                      <Download className="h-4 w-4" />
                                      {downloadingId === order._id ? "Downloading..." : "Download PDF"}
                                    </Button>
                                  </div>

                                </div>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;