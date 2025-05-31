import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    try {
      // Use the current website URL instead of localhost
      const currentUrl = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${currentUrl}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/5 dark:from-primary/10 dark:to-background/10"></div>
          <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 rounded-b-[50%] blur-3xl opacity-60"></div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-8 left-8"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card w-full max-w-md p-10 text-center"
        >
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to {email}
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSent(false)}
              className="w-full"
            >
              Try Different Email
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/5 dark:from-primary/10 dark:to-background/10"></div>
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 rounded-b-[50%] blur-3xl opacity-60"></div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-8 left-8"
        onClick={() => navigate("/login")}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Reset Your Password
          </h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full rounded-md"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
