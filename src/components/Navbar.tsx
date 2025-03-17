
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { clearUserData } from "@/lib/user-utils";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle theme toggle
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleLogout = () => {
    clearUserData();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-12 py-4",
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="text-2xl font-display font-bold text-primary"
        >
          SchoolEdge
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isAuthenticated ? (
            // Links for authenticated users
            <>
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/courses" className="text-foreground hover:text-primary transition-colors">
                Courses
              </Link>
              <Link to="/notes" className="text-foreground hover:text-primary transition-colors">
                Notes
              </Link>
              <Link to="/messages" className="text-foreground hover:text-primary transition-colors">
                Messages
              </Link>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={toggleTheme}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm mr-2">
                    {user?.name || "User"}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              </div>
            </>
          ) : (
            // Links for guests
            <>
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={toggleTheme}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/login">Login</Link>
                </Button>
                
                <Button asChild className="rounded-full">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background dark:bg-gray-900 shadow-lg py-4 px-6 glass animate-slideDown">
          <div className="flex flex-col space-y-4">
            {isAuthenticated ? (
              // Mobile links for authenticated users
              <>
                <Link 
                  to="/dashboard" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/courses" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link 
                  to="/notes" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notes
                </Link>
                <Link 
                  to="/messages" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                
                <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                  <div className="text-sm font-medium mb-2">
                    Signed in as: {user?.name || "User"}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              // Mobile links for guests
              <>
                <Link 
                  to="/" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/about" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  
                  <Button asChild className="w-full">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
