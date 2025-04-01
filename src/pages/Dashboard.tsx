import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search,
  BarChart2,
  AlertTriangle,
  FileText,
  Upload,
  Notebook,
  Send,
  UserCog,
  CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Stats from "@/components/dashboard/Stats";
import StudentProfile from "@/components/dashboard/StudentProfile";
import { getUserData } from "@/lib/user-utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [attendanceCount, setAttendanceCount] = useState(() => {
    const saved = localStorage.getItem("attendanceCount");
    return saved ? JSON.parse(saved) : 0;
  });
  const [lastAttendanceDate, setLastAttendanceDate] = useState(() => {
    const saved = localStorage.getItem("lastAttendanceDate");
    return saved || "";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  const markAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (lastAttendanceDate === today) {
      toast.error("Attendance already marked for today!");
      return;
    }
    
    const newCount = attendanceCount + 1;
    setAttendanceCount(newCount);
    setLastAttendanceDate(today);
    
    localStorage.setItem("attendanceCount", JSON.stringify(newCount));
    localStorage.setItem("lastAttendanceDate", today);
    
    toast.success("Attendance marked successfully!");
  };

  const handleProfileClick = () => {
    navigate("/settings");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }
    
    // Get courses from localStorage for searching
    const publicCourses = JSON.parse(localStorage.getItem("publicCourses") || "[]");
    
    const filteredResults = publicCourses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) || 
      course.description?.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filteredResults);
    setShowSearchResults(true);
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div 
        className={`
          w-64 bg-white dark:bg-gray-900 border-r border-border fixed h-full z-20 transition-all duration-300 
          ${mobileMenuOpen ? "left-0" : "-left-64 md:left-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="text-2xl font-display font-bold text-primary">SchoolEdge</div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              Overview
            </Button>
            <Button 
              variant={activeTab === "profile" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/courses")}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Courses
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/schedule")}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Schedule
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/messages")}
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              Messages
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              <UserCog className="h-5 w-5 mr-3" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/notes")}
            >
              <Notebook className="h-5 w-5 mr-3" />
              My Notes
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/upload-courses")}
            >
              <Upload className="h-5 w-5 mr-3" />
              Upload Materials
            </Button>
          </nav>
          
          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden mr-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-9 w-full md:w-72"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                
                {showSearchResults && searchQuery && (
                  <div className="absolute mt-1 w-full bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <div className="p-2 text-muted-foreground">No courses found</div>
                    ) : (
                      <div>
                        <div className="p-2 border-b border-border">
                          <span className="text-sm font-semibold">Search Results</span>
                        </div>
                        {searchResults.map((course) => (
                          <div 
                            key={course.id} 
                            className="p-2 hover:bg-accent cursor-pointer"
                            onClick={() => navigate("/courses")}
                          >
                            <div className="font-medium">{course.title}</div>
                            {course.description && (
                              <div className="text-sm text-muted-foreground truncate">{course.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                onClick={markAttendance}
                className="hidden md:flex"
              >
                <CheckSquare className="h-5 w-5 mr-2" />
                Mark Attendance
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="h-5 w-5" />
              </Button>
              
              <div 
                className="flex items-center gap-3 cursor-pointer" 
                onClick={handleProfileClick}
              >
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="font-medium text-sm">
                    {userData?.name ? userData.name.split(" ").map(n => n[0]).join("") : "JS"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">
                    {userData?.name || "John Smith"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {userData?.role || "Student"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-display font-bold">Dashboard</h1>
                <Button 
                  variant="outline"
                  onClick={markAttendance}
                  className="md:hidden"
                >
                  <CheckSquare className="h-5 w-5 mr-2" />
                  Mark Attendance
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Stats
                  title="Attendance"
                  value={`${attendanceCount}`}
                  change={"+1"}
                  trend="up"
                  description={`Last marked: ${lastAttendanceDate || 'Never'}`}
                  icon={<Calendar className="h-5 w-5" />}
                />
                
                <Stats
                  title="Assignments"
                  value="4"
                  change="2"
                  trend="neutral"
                  description="Due this week"
                  icon={<BookOpen className="h-5 w-5" />}
                />
                
                <Stats
                  title="Overall Grade"
                  value="A-"
                  change="-3.2%"
                  trend="down"
                  description="From last semester"
                  icon={<BarChart2 className="h-5 w-5" />}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 col-span-1 lg:col-span-2">
                  <h2 className="text-lg font-semibold mb-4">Upcoming Schedule</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Mathematics</h3>
                        <p className="text-sm text-muted-foreground">Algebra - Room 101</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">09:00 AM</div>
                        <div className="text-sm text-muted-foreground">Today</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Science</h3>
                        <p className="text-sm text-muted-foreground">Physics - Room 203</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">11:30 AM</div>
                        <div className="text-sm text-muted-foreground">Today</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">History</h3>
                        <p className="text-sm text-muted-foreground">World History - Room 105</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">02:15 PM</div>
                        <div className="text-sm text-muted-foreground">Today</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Announcements</h2>
                  <div className="space-y-4">
                    <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center gap-2 text-yellow-500 mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Important</span>
                      </div>
                      <h3 className="font-medium">Mid-term Exams</h3>
                      <p className="text-sm text-muted-foreground">Mid-term exams start next week. Make sure to check the schedule.</p>
                    </div>
                    
                    <div className="p-3 rounded-lg border">
                      <h3 className="font-medium">School Concert</h3>
                      <p className="text-sm text-muted-foreground">Annual school concert on Friday at 6:00 PM in the auditorium.</p>
                    </div>
                    
                    <div className="p-3 rounded-lg border">
                      <h3 className="font-medium">Library Hours</h3>
                      <p className="text-sm text-muted-foreground">Extended library hours during exam week - open until 8:00 PM.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-display font-bold">Student Profile</h1>
              <StudentProfile />
            </div>
          )}
          
          {activeTab !== "overview" && activeTab !== "profile" && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
                <p className="text-muted-foreground">This feature is under development.</p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
