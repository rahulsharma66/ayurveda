import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Package, LogOut, ChevronRight, Edit2, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
   
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/auth/profile", null, "GET");
        setUser(data);
        setPhoneInput(data.phone || "");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again",
        });
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

 const handleSavePhone = async () => {
  try {
    // ACTUAL API CALL: Send the phone number to your backend
    const response = await apiRequest("/auth/update-profile", { phone: phoneInput }, "PUT");
    
    // Update local state so the UI reflects the change immediately
    setUser({ ...user, phone: phoneInput });
    setIsEditingPhone(false);
    
    toast({ 
      title: "Profile Updated", 
      description: "Your mobile number has been saved securely." 
    });
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Update Failed",
      description: error.message || "Could not save phone number.",
    });
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({ title: "Logged out successfully" });
    navigate("/login");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-serif font-bold text-primary mb-6">
              Hi, {user?.name}
            </h1>

            <div className="flex items-center gap-3 py-3">
              <Mail className="h-6 w-6 text-muted-foreground" />
              <span className="text-lg text-foreground">{user?.email}</span>
            </div>

            <div className="flex items-center gap-3 py-3">
              <Phone className="h-6 w-6 text-muted-foreground" />
              {isEditingPhone ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="max-w-[200px] h-10 text-lg"
                  />
                  <Button size="sm" onClick={handleSavePhone}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingPhone(false)}>Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between flex-1">
                  <span className="text-lg text-foreground">
                    {user?.phone || <span className="text-muted-foreground">Add mobile number</span>}
                  </span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={() => setIsEditingPhone(true)}
                  >
                    <Edit2 className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* FIXED: Added Link to make navigation work */}
            <Link 
              to="/addresses" 
              className="flex items-center justify-between w-full py-5 hover:bg-muted/50 transition-colors rounded-xl px-2"
            >
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-xl font-medium text-foreground">Addresses</span>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>

            <Separator />

            {/* 👇 FIXED: Added onClick navigation to this button */}
            <button 
              onClick={() => navigate("/orders")}
              className="flex items-center justify-between w-full py-5 hover:bg-muted/50 transition-colors rounded-xl px-2 text-left"
            >
              <div className="flex items-center gap-4">
                <Package className="h-6 w-6 text-muted-foreground" />
                <div>
                  <span className="text-xl font-medium text-foreground block">My Orders</span>
                  <span className="text-sm text-muted-foreground">Manage your wellness journey</span>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </button>

            <Separator />

            <button 
              className="flex items-center gap-4 w-full py-6 mt-6 hover:bg-destructive/5 rounded-xl px-2 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6 text-destructive" />
              <span className="text-xl text-destructive font-bold">Logout</span>
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;