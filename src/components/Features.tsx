
import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Calendar, 
  BarChart2, 
  MessageCircle, 
  Bot, 
  Bell, 
  Users, 
  LineChart, 
  FileText,
  Shield
} from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Academic Management",
    description: "Comprehensive tools for managing student profiles, assignments, and grades in one place."
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Class Schedules",
    description: "Interactive timetables with subject-wise slots and important academic dates."
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Progress Tracking",
    description: "Real-time student progress tracking with intuitive performance visualizations."
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Communication",
    description: "Interactive forums and posting system for discussions and knowledge sharing."
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI Assistance",
    description: "24/7 AI-powered chatbot to answer queries about schedules, exams, and policies."
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Notifications",
    description: "Stay updated with push notifications for deadlines, events, and announcements."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Collaboration",
    description: "Connect parents and teachers for better student support and guidance."
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Analytics",
    description: "Detailed insights and analytics on student and class performance trends."
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Resource Sharing",
    description: "Easy access to study materials, notes, and syllabus for each class."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure & Protected",
    description: "Role-based access controls and data encryption for maximum security."
  }
];

const Features = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-secondary/50 dark:bg-secondary/10 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Powerful Features for Modern Education
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Everything you need to transform the educational experience for students, 
            teachers, and parents - all in one platform.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="glass-card p-8 rounded-2xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
