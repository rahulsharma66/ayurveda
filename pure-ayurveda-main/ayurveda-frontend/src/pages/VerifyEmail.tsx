import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, ArrowRight, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Pre-fill email from registration state
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate Email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setEmailError(emailResult.error.errors[0].message);
      return;
    }
    setEmailError("");

    // 2. Validate OTP Length
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit code from your email.",
      });
      return;
    }
    
    setLoading(true);

    try {
      // 3. Call Backend Verify Endpoint
      const response = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            email: email.trim(), 
            otp 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // 4. Success! Redirect to Login
      // (Backend does not return token on verify, so user must log in again)
      toast({
        title: "Email verified!",
        description: "Your account is active. Please log in.",
      });
      navigate("/login");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Invalid OTP or Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setEmailError(emailResult.error.errors[0].message);
      return;
    }
    setEmailError("");
    setResending(true);

    try {
      // Workaround: Using 'forgot-password' to generate a new OTP 
      // because there is no dedicated 'resend-verification' endpoint.
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      toast({
        title: "Code resent!",
        description: "Check your email for the new code.",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
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
              Verify Your Email
            </span>
          </motion.div>
          
          <CardTitle className="font-serif text-2xl text-primary-foreground">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-primary-foreground/70">
            We've sent a 6-digit code to your email
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
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

            <div className="space-y-2">
              <Label className="text-primary-foreground">Verification Code</Label>
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
                  Verify Email
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
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Resend Code
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-primary-foreground/70">
              Back to
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