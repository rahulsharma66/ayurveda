import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[75vh] flex items-center justify-center bg-background px-4 py-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-card border border-border rounded-3xl p-8 md:p-10 text-center shadow-lg"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Order Successful!
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Thank you for choosing Pure Ayurveda. Your wellness products are being prepared with care and will be shipped soon.
          </p>
          
          <div className="space-y-3">
            <Button 
              className="w-full h-12 text-base gap-2" 
              onClick={() => navigate("/orders")}
            >
              <Package className="w-5 h-5" /> Track My Order
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-base gap-2" 
              onClick={() => navigate("/products")}
            >
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;