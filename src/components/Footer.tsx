
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background dark:bg-gray-900 border-t border-border">
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 sm:col-span-2">
            <Link to="/" className="text-xl md:text-2xl font-display font-bold text-primary mb-4 inline-block">
              SchoolEdge
            </Link>
            <p className="text-muted-foreground mb-4 md:mb-6 max-w-md text-sm md:text-base">
              A comprehensive educational platform connecting students, teachers, and parents
              for a seamless learning experience and improved academic outcomes.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Legal</h3>
            <ul className="space-y-1 md:space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/data-protection" className="text-muted-foreground hover:text-primary transition-colors">
                  Data Protection
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 md:mt-12 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-xs md:text-sm">
            &copy; {new Date().getFullYear()} SchoolEdge. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs md:text-sm mt-2 md:mt-0">
            Designed with precision and care for the future of education.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
