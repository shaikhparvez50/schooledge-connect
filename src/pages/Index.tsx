
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
