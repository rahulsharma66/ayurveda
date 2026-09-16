import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Lock, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { z } from "zod";
import { apiRequest } from "@/lib/api"; 


const resetSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Pre-fill email from forgot password page
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = resetSchema.safeParse({ email, password: newPassword });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field as keyof typeof fieldErrors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit code from your email.",
      });
      return;
    }
    
    setErrors({});
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password reset successful!",
        description: "You can now login with your new password.",
      });
      navigate("/login");
      setLoading(false);
    }, 1000);
  };

  const handleResendOtp = async () => {
  const emailResult = z.string().trim().email().safeParse(email);
  if (!emailResult.success) {
    setErrors({ email: "Please enter a valid email address" });
    return;
  }
  
  setResending(true);

  try {
    // Re-trigger the forgot-password flow on the backend
    await apiRequest("/auth/forgot-password", { email: email.trim() }, "POST");
    
    toast({
      title: "Code resent!",
      description: "Check your email for the new reset code.",
    });
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to resend",
      description: error.message,
    });
  } finally {
    setResending(false);
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
              Reset Password
            </span>
          </motion.div>
          
          <CardTitle className="font-serif text-2xl text-primary-foreground">
            Create New Password
          </CardTitle>
          <CardDescription className="text-primary-foreground/70">
            Enter the code from your email and set a new password
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
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
              <Label className="text-primary-foreground">Reset Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground w-12 h-12 text-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary-foreground">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOtp}
              disabled={resending}
              className="w-full text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              {resending ? (
                <motion.div
                  className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Resend Code
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-primary-foreground/70">
              Remember your password?
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