import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { z } from "zod";
import { apiRequest } from "@/lib/api";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; name?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Validate with Zod
  const result = registerSchema.safeParse({ name: fullName, email, password, confirmPassword });
  if (!result.success) {
    const fieldErrors: { email?: string; password?: string; confirmPassword?: string; name?: string } = {};
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
    // 2. Call the actual backend API
    const data = await apiRequest("/auth/register", { 
      name: fullName, 
      email: email.trim(), 
      password 
    });

    // 3. Show success message from backend
    toast({
      title: "Registration Successful!",
      description: data.message, // "Registered successfully. Please verify email via OTP."
    });

    // 4. Navigate to verify-email and pass the email address
    navigate("/verify-email", { state: { email: email.trim() } });
    
  } catch (error: any) {
    // 5. Handle backend errors (e.g., "Email already registered")
    toast({
      variant: "destructive",
      title: "Registration Failed",
      description: error.message,
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
              Join Our Family
            </span>
          </motion.div>
          
          <CardTitle className="font-serif text-2xl text-primary-foreground">
            Create Account
          </CardTitle>
          <CardDescription className="text-primary-foreground/70">
            Start your Ayurvedic wellness journey today
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent"
                />
              </div>
              {errors.name && <p className="text-sm text-red-300">{errors.name}</p>}
            </div>

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
              <Label htmlFor="password" className="text-primary-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent"
                />
              </div>
              {errors.password && <p className="text-sm text-red-300">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-primary-foreground">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent"
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-300">{errors.confirmPassword}</p>}
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
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-primary-foreground/70">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 text-accent hover:text-accent/80 font-semibold transition-colors underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}