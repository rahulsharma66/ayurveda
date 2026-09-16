import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { z } from "zod";
import { apiRequest } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Validate form input using your existing Zod schema
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    const fieldErrors: { email?: string; password?: string } = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      fieldErrors[field as keyof typeof fieldErrors] = err.message;
    });
    setErrors(fieldErrors);
    return;
  }
  
  setErrors({});
  setLoading(true);

  try {
    // 2. Call your backend login endpoint
    const response = await apiRequest("/auth/login", { email, password });

    // 3. Save the authentication token and user data
    localStorage.setItem("token", response.token);
    localStorage.setItem("userName", response.user.name);
    localStorage.setItem("userEmail", response.user.email);
    localStorage.setItem("userRole", response.user.role); // Important for permission checks
    
    toast({
      title: "Welcome back!",
      description: `Namaste, ${response.user.name}. You have successfully logged in.`,
    });

    // 4. Role-based Redirection
    if (response.user.role === "admin") {
      // Redirect admins to the product management page
      navigate("/products"); 
    } else {
      // Redirect normal users to the home page or their profile
      navigate("/"); 
    }
  } catch (error: any) {
    // 5. Handle login errors (e.g., "Invalid credentials" or "Email not verified")
    toast({
      variant: "destructive",
      title: "Login Failed",
      description: error.message || "Invalid email or password.",
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
              Welcome Back
            </span>
          </motion.div>
          
          <CardTitle className="font-serif text-2xl text-primary-foreground">
            Sign In
          </CardTitle>
          <CardDescription className="text-primary-foreground/70">
            Enter your credentials to access your account
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
              {errors.email && <p className="text-sm text-red-300">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-primary-foreground">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent"
                />
              </div>
              {errors.password && <p className="text-sm text-red-300">{errors.password}</p>}
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
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-primary-foreground/70">
              Don't have an account?
              <Link
                to="/register"
                className="ml-2 text-accent hover:text-accent/80 font-semibold transition-colors underline-offset-4 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}