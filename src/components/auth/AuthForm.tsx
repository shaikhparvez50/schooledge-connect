import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, UserCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type AuthFormProps = {
  type: "login" | "register";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  // Effect to redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (type === "register" && !formData.name) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);
    
    try {
      if (type === "login") {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          // Handle specific error messages
          if (error.message.includes('email_not_confirmed') || error.message.includes('Email not confirmed')) {
            toast.error("Please check your email and click the confirmation link to verify your account.");
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password. Please check your credentials and try again.");
          } else {
            toast.error(error.message || "Login failed");
          }
        } else {
          toast.success("Successfully logged in!");
          navigate("/dashboard");
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          name: formData.name,
          role: formData.role
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error("An account with this email already exists. Please try logging in instead.");
          } else {
            toast.error(error.message || "Registration failed");
          }
        } else {
          toast.success("Account created successfully! Please check your email to verify your account.");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
        onClick={() => navigate("/")}
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
            {type === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {type === "login" 
              ? "Sign in to access your account" 
              : "Join SchoolEdge to enhance your educational journey"
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {type === "register" && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
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
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {type === "register" && (
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          )}
          
          {type === "login" && (
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full rounded-md"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                {type === "login" ? "Signing in..." : "Creating account..."}
              </div>
            ) : (
              type === "login" ? "Sign in" : "Create account"
            )}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            {type === "login" ? (
              <>
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthForm;
