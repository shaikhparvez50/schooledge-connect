
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, Clock, Book, LineChart, Users, MessageCircle, 
  Bot, Bell, Calendar, FileText, LightbulbIcon, ShieldCheck, Moon, 
  Smartphone, Search
} from "lucide-react";

const featureItems = [
  {
    title: "Role-Based Access",
    description: "Specialized dashboards for students, teachers, parents, and administrators",
    icon: <Users className="h-10 w-10 text-primary" />,
    delay: 0.1,
  },
  {
    title: "Academic Management",
    description: "Track grades, assignments, attendance, and class schedules in one place",
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    delay: 0.2,
  },
  {
    title: "Real-time Tracking",
    description: "Monitor student progress with visual performance graphs and insights",
    icon: <LineChart className="h-10 w-10 text-primary" />,
    delay: 0.3,
  },
  {
    title: "Social Collaboration",
    description: "Engage in classroom discussions, share updates, and collaborate on projects",
    icon: <MessageCircle className="h-10 w-10 text-primary" />,
    delay: 0.4,
  },
  {
    title: "AI Assistance",
    description: "24/7 chatbot support for students, parents, and teachers",
    icon: <Bot className="h-10 w-10 text-primary" />,
    delay: 0.5,
  },
  {
    title: "Smart Notifications",
    description: "Stay updated with push notifications for important events and deadlines",
    icon: <Bell className="h-10 w-10 text-primary" />,
    delay: 0.6,
  },
  {
    title: "Parent-Teacher Portal",
    description: "Schedule meetings and facilitate direct communication between parents and teachers",
    icon: <Calendar className="h-10 w-10 text-primary" />,
    delay: 0.7,
  },
  {
    title: "Resource Sharing",
    description: "Access study materials, notes, and submit assignments in a secure environment",
    icon: <FileText className="h-10 w-10 text-primary" />,
    delay: 0.8,
  },
  {
    title: "AI Insights",
    description: "Receive AI-generated progress reports and personalized improvement suggestions",
    icon: <LightbulbIcon className="h-10 w-10 text-primary" />,
    delay: 0.9,
  },
  {
    title: "Enhanced Security",
    description: "Role-based access control and data encryption to protect user information",
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    delay: 1.0,
  },
  {
    title: "Dark & Light Themes",
    description: "Customize your learning experience with theme options",
    icon: <Moon className="h-10 w-10 text-primary" />,
    delay: 1.1,
  },
  {
    title: "Fully Responsive",
    description: "Access the platform on any device - desktop, tablet, or smartphone",
    icon: <Smartphone className="h-10 w-10 text-primary" />,
    delay: 1.2,
  }
];

const Features = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/5 dark:from-primary/10 dark:to-background/10"></div>
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 rounded-b-[50%] blur-3xl opacity-60"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            Powerful Features
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6"
          >
            Transform Education with SchoolEdge
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Our comprehensive platform is designed to enhance the educational experience for students, teachers, and parents through cutting-edge technology and innovative features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              className="glass-card p-8 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="bg-primary/10 p-4 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="text-center"
        >
          <Button asChild size="lg" className="rounded-full group">
            <Link to="/register">
              Get Started Today
              <Clock className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Features;
