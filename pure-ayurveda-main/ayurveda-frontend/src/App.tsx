import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Ayurveda from "./pages/Ayurveda";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Profile from "./pages/profile";
import Addresses from "./pages/Addresses"; 
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import IngredientDetail from "./pages/IngredientDetail";

// Cart Imports
import { CartProvider } from "./context/CartContext";
import { CartDrawer } from "./components/cart/CartDrawer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            
            {/* 2. ADDED THE PRODUCT DETAIL ROUTE HERE */}
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/ingredient/:name" element={<IngredientDetail />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/ayurveda" element={<Ayurveda />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* PROTECTED ROUTES - Authenticated users only */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* CATCH-ALL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <CartDrawer />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;