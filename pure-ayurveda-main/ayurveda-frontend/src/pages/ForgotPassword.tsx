import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, Sparkles, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { z } from "zod";
import { apiRequest } from "@/lib/api"; // <--- Add this line!

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    setEmailError(result.error.errors[0].message);
    return;
  }
  
  setEmailError("");
  setLoading(true);

  try {
    // ACTUAL API CALL to your backend
    await apiRequest("/auth/forgot-password", { email: email.trim() }, "POST");
    
    toast({
      title: "Check your email!",
      description: "We've sent you a password reset code.",
    });
    
    // Navigate to reset page after successful backend response
    navigate("/reset-password", { state: { email: email.trim() } });
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "Failed to send reset code.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout>
      <Card className="bg-primary-foreground/5 backdrop-blur-sm border-primary-foreground/20">
        <CardHeader className="text-center pb-4">
          <motion.div
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full border border-primary-foreground/20 mx-auto mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">
              Password Recovery
            </span>
          </motion.div>
          
          <CardTitle className="font-serif text-2xl text-primary-foreground">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-primary-foreground/70">
            Enter your email to receive a reset code
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent"
                />
              </div>
              {emailError && <p className="text-sm text-red-300">{emailError}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base shadow-lg shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  Send Reset Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}