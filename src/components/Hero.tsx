
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, BookOpen, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/5 dark:from-primary/10 dark:to-background/10"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 rounded-b-[50%] blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col space-y-6"
        >
          <div className="inline-flex px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 self-start">
            The future of education is here
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
            Transform Your School Experience
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            A comprehensive platform that connects students, teachers, and parents for seamless communication and academic excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full group">
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/learn-more">Learn More</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Seamless Learning</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Track Progress</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Stay Connected</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Dashboard preview image */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 opacity-80"></div>
            
            <div className="absolute inset-0 flex flex-col p-8">
              <div className="glass-card p-4 rounded-xl flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Student Dashboard</h3>
                  <p className="text-white/70 text-sm">Track your academic progress</p>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl flex flex-col">
                  <span className="text-white/60 text-xs mb-1">Attendance</span>
                  <span className="text-white font-medium text-xl">95%</span>
                  <div className="mt-auto h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-white"></div>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-xl flex flex-col">
                  <span className="text-white/60 text-xs mb-1">Assignments</span>
                  <span className="text-white font-medium text-xl">4 Due</span>
                  <div className="mt-auto h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-white"></div>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-xl flex flex-col">
                  <span className="text-white/60 text-xs mb-1">Grades</span>
                  <span className="text-white font-medium text-xl">A-</span>
                  <div className="mt-auto h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-white"></div>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-xl flex flex-col">
                  <span className="text-white/60 text-xs mb-1">Upcoming</span>
                  <span className="text-white font-medium text-xl">2 Exams</span>
                  <div className="mt-auto h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[40%] bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-secondary rounded-full blur-2xl opacity-70"></div>
          <div className="absolute -top-6 -left-6 h-24 w-24 bg-primary rounded-full blur-2xl opacity-70"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
