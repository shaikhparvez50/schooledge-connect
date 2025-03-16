
import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Clock, 
  BookOpen, 
  Award,
  BarChart2
} from "lucide-react";

const StudentProfile = () => {
  // Mock student data
  const student = {
    name: "John Smith",
    id: "STU-2023-1234",
    email: "john.smith@example.com",
    phone: "+1 (123) 456-7890",
    dateOfBirth: "15 Sep 2005",
    address: "123 School Street, Education City, 12345",
    grade: "11th Grade",
    class: "XI-A",
    rollNumber: "11A-23",
    attendance: "95%",
    subjects: [
      { name: "Mathematics", grade: "A", progress: 92 },
      { name: "Science", grade: "A-", progress: 87 },
      { name: "English", grade: "B+", progress: 83 },
      { name: "History", grade: "A", progress: 90 },
      { name: "Computer Science", grade: "A+", progress: 96 },
    ],
    achievements: [
      "Science Fair Winner 2022",
      "Mathematics Olympiad - 2nd Place",
      "Perfect Attendance Award",
      "Honor Roll Student"
    ]
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-semibold mb-4">
              {student.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-muted-foreground text-sm">{student.id}</p>
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mt-2">
              {student.grade}
            </div>
          </div>
          
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-muted-foreground mr-3" />
              <div className="text-sm">{student.email}</div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-muted-foreground mr-3" />
              <div className="text-sm">{student.phone}</div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-3" />
              <div className="text-sm">{student.dateOfBirth}</div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-3" />
              <div className="text-sm">{student.address}</div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-border pt-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </h3>
            <ul className="space-y-2">
              {student.achievements.map((achievement, index) => (
                <li key={index} className="text-sm bg-primary/5 dark:bg-primary/10 rounded-lg px-3 py-2">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2 glass-card p-6 rounded-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Academic Details</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Class: {student.class}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Roll: {student.rollNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Attendance: {student.attendance}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Performance by Subject
          </h3>
          
          <div className="space-y-6">
            {student.subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{subject.name}</div>
                  <div className="font-medium text-right">{subject.grade}</div>
                </div>
                <div className="relative h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-primary transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{subject.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
