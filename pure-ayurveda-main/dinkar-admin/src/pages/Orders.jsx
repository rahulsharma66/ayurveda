import { useEffect, useState, Fragment } from "react";
import { ChevronDown, Trash2, MapPin, Package, Truck } from "lucide-react";
import api from "../services/api";
import Toast from "../components/Toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);

  // 1. Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/admin");
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to load orders", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Update Status (Only used for manual orders now!)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/admin/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      setToast({ message: `Order updated to ${newStatus}`, type: "success" });
    } catch (error) {
      setToast({ message: "Failed to update status", type: "error" });
    }
  };

  // 3. Delete Order
  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    
    try {
      await api.delete(`/api/orders/admin/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setToast({ message: "Order deleted successfully", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to delete order", type: "error" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500 animate-pulse text-lg">Loading orders...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Admin — Orders</h1>
        <div className="bg-white px-4 py-2 rounded shadow-sm border text-sm font-medium flex items-center gap-2">
          <Truck className="w-4 h-4 text-green-600" />
          <span>{orders.length} orders</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-700 text-sm">Date</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Order ID</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Customer</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Total</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-sm">Tracking</th>
                <th className="p-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order._id;
                
                const subtotal = order.items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
                const savings = order.items.reduce((sum, item) => sum + (((item.mrp || item.salePrice) - item.salePrice) * item.quantity), 0);

                return (
                  <Fragment key={order._id}>
                    {/* MAIN ROW */}
                    <tr 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    >
                      <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-500">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-900">{order.user?.name || "Guest User"}</div>
                        <div className="text-xs text-gray-500">{order.items.length} item(s)</div>
                      </td>
                      <td className="p-4 font-bold text-green-700">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      
                      {/* SMART STATUS COLUMN */}
                      <td className="p-4">
                        {order.shiprocketOrderId ? (
                          <span className={`px-2 py-1 inline-flex text-xs font-bold rounded border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        ) : (
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            onClick={(e) => e.stopPropagation()} 
                            className={`text-xs font-bold border rounded px-2 py-1 outline-none cursor-pointer ${getStatusColor(order.orderStatus)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>

                      {/* NEW TRACKING COLUMN */}
                      <td className="p-4 text-sm">
                        {order.trackingNumber ? (
                          <a 
                            href={`https://shiprocket.co/tracking/${order.trackingNumber}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()} // Prevents row from expanding when clicking link
                            className="text-blue-600 hover:text-blue-800 underline font-bold"
                          >
                            {order.trackingNumber}
                          </a>
                        ) : order.shiprocketOrderId ? (
                          <span className="text-gray-400 italic text-xs">Awaiting AWB...</span>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(order._id); }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED DETAILS ROW */}
                    {isExpanded && (
                      <tr>
                        {/* Updated colSpan from 6 to 7! */}
                        <td colSpan="7" className="bg-gray-50 p-6 border-b border-gray-200">
                          <div className="grid md:grid-cols-2 gap-8">
                            
                            {/* Left Side: Order Items */}
                            <div>
                              <h4 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Order Items</h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-sm items-center">
                                    <span className="text-gray-700 font-medium">
                                      {item.shortName || item.productName} 
                                      <span className="text-gray-500 text-xs ml-1">({item.size})</span>
                                      <span className="text-gray-500 ml-2">× {item.quantity}</span>
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      ₹{(item.salePrice * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                                
                                <div className="border-t border-gray-200 mt-4 pt-3 space-y-2">
                                  <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                  </div>
                                  {savings > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                      <span>Savings</span>
                                      <span>−₹{savings.toLocaleString()}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                                    <span>Total Amount</span>
                                    <span className="text-green-700">₹{order.totalAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Customer & Address */}
                            <div>
                              <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-green-600" /> Delivery Details
                                </h4>
                                {/* Show Shiprocket logo/text if it's an automated order */}
                                {order.shiprocketOrderId && (
                                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
                                    <Truck className="w-3 h-3" /> Auto-Synced
                                  </span>
                                )}
                              </div>
                              
                              <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                                {/* User Account Details */}
                                <div className="mb-4 pb-3 border-b border-gray-100">
                                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Account Info</p>
                                  <p className="text-sm font-medium text-gray-900">{order.user?.name || "N/A"}</p>
                                  <p className="text-sm text-gray-600">{order.user?.email || "N/A"}</p>
                                </div>

                               {/* Shipping Address */}
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Shipping Address</p>
                                  {order.addressDetails ? (
                                    <div className="text-sm text-gray-700 space-y-1">
                                      <p className="font-bold text-gray-900">
                                        {order.addressDetails.firstName || order.addressDetails.first_name || "Unknown"}{" "}
                                        {order.addressDetails.lastName || order.addressDetails.last_name || ""}
                                      </p>
                                      <p>{order.addressDetails.fullAddress || order.addressDetails.full_address}</p>
                                      {order.addressDetails.landmark && <p>Landmark: {order.addressDetails.landmark}</p>}
                                      <p>{order.addressDetails.city}, {order.addressDetails.state} - {order.addressDetails.pincode}</p>
                                      <p className="pt-1 font-medium text-gray-900">
                                        Phone: {order.addressDetails.phone || order.user?.phone || "N/A"}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-red-500 italic">Address details missing or deleted.</p>
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Toast {...toast} onClose={() => setToast({})} />
    </>
  );
};

export default Orders;