
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Sun, 
  Languages, 
  Laptop,
  LogOut,
  ChevronRight,
  Save,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { getUserData, updateUserData } from "@/lib/user-utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Settings = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const isMobile = useIsMobile();
  
  const [activeSection, setActiveSection] = useState("profile");
  
  const [profileForm, setProfileForm] = useState({
    name: userData?.name || "John Smith",
    email: userData?.email || "john.smith@example.com",
    bio: userData?.bio || "",
    phone: "+1 (123) 456-7890",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    assignmentReminders: true,
    messageNotifications: true,
    systemAnnouncements: true,
  });
  
  const [appSettings, setAppSettings] = useState({
    language: "english",
    theme: "system",
    fontSize: "medium",
    highContrast: false,
    soundEffects: true,
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    if (userData) {
      updateUserData({
        name: profileForm.name,
        email: profileForm.email,
        bio: profileForm.bio,
      });
    }
    toast.success("Profile settings saved");
  };
  
  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success(`${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} ${notificationSettings[setting as keyof typeof notificationSettings] ? 'disabled' : 'enabled'}`);
  };
  
  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  // Switch sections on small screens
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Auto-scroll to top when changing sections on mobile
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render the active section content for mobile view
  const renderActiveSection = () => {
    switch(activeSection) {
      case "profile":
        return renderProfileSection();
      case "notifications":
        return renderNotificationsSection();
      case "appearance":
        return renderAppearanceSection();
      default:
        return renderProfileSection();
    }
  };
  
  // Profile section content
  const renderProfileSection = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name"
              value={profileForm.name} 
              onChange={handleProfileChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              value={profileForm.email} 
              onChange={handleProfileChange} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            name="bio"
            value={profileForm.bio} 
            onChange={handleProfileChange}
            placeholder="Tell us about yourself"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone"
            value={profileForm.phone} 
            onChange={handleProfileChange} 
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveProfile}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Notifications section content
  const renderNotificationsSection = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch 
            checked={notificationSettings.emailNotifications}
            onCheckedChange={() => handleNotificationToggle("emailNotifications")}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Course Updates</h3>
            <p className="text-sm text-muted-foreground">Get notified about new course materials</p>
          </div>
          <Switch 
            checked={notificationSettings.courseUpdates}
            onCheckedChange={() => handleNotificationToggle("courseUpdates")}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Assignment Reminders</h3>
            <p className="text-sm text-muted-foreground">Receive deadline notifications</p>
          </div>
          <Switch 
            checked={notificationSettings.assignmentReminders}
            onCheckedChange={() => handleNotificationToggle("assignmentReminders")}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Message Notifications</h3>
            <p className="text-sm text-muted-foreground">Get notified about new messages</p>
          </div>
          <Switch 
            checked={notificationSettings.messageNotifications}
            onCheckedChange={() => handleNotificationToggle("messageNotifications")}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">System Announcements</h3>
            <p className="text-sm text-muted-foreground">Important system updates and notices</p>
          </div>
          <Switch 
            checked={notificationSettings.systemAnnouncements}
            onCheckedChange={() => handleNotificationToggle("systemAnnouncements")}
          />
        </div>
      </CardContent>
    </Card>
  );
  
  // Appearance section content
  const renderAppearanceSection = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
        <CardDescription>
          Customize your application experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select 
              value={appSettings.language}
              onValueChange={(value) => setAppSettings(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select 
              value={appSettings.theme}
              onValueChange={(value) => setAppSettings(prev => ({ ...prev, theme: value }))}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Laptop className="h-4 w-4 mr-2" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <Select 
            value={appSettings.fontSize}
            onValueChange={(value) => setAppSettings(prev => ({ ...prev, fontSize: value }))}
          >
            <SelectTrigger id="fontSize">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">High Contrast Mode</h3>
            <p className="text-sm text-muted-foreground">Increases visual contrast for better readability</p>
          </div>
          <Switch 
            checked={appSettings.highContrast}
            onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, highContrast: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Sound Effects</h3>
            <p className="text-sm text-muted-foreground">Play sounds for notifications and actions</p>
          </div>
          <Switch 
            checked={appSettings.soundEffects}
            onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, soundEffects: checked }))}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="text-sm md:text-base"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
        <div className="w-10"></div> {/* Empty div for flex spacing */}
      </div>
      
      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div className="flex mb-4 overflow-x-auto pb-2 no-scrollbar">
          <Button 
            variant={activeSection === "profile" ? "default" : "outline"}
            className="mr-2 flex-shrink-0"
            onClick={() => handleSectionChange("profile")}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button 
            variant={activeSection === "notifications" ? "default" : "outline"}
            className="mr-2 flex-shrink-0"
            onClick={() => handleSectionChange("notifications")}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button 
            variant={activeSection === "appearance" ? "default" : "outline"}
            className="flex-shrink-0"
            onClick={() => handleSectionChange("appearance")}
          >
            <Laptop className="h-4 w-4 mr-2" />
            Appearance
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar - hidden on mobile */}
        <div className={`${isMobile ? 'hidden' : 'block'} md:col-span-1 space-y-4`}>
          <div className="flex items-center p-4 rounded-lg border bg-card">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData?.profilePicture} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profileForm.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="font-semibold">{profileForm.name}</h2>
              <p className="text-sm text-muted-foreground">{profileForm.email}</p>
              <Button variant="link" className="p-0 h-auto text-sm">
                <Upload className="h-3 w-3 mr-1" />
                Change picture
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Settings Menu</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button 
                  variant={activeSection === "profile" ? "secondary" : "ghost"}
                  className="w-full justify-start rounded-none py-2 px-4 font-normal"
                  onClick={() => handleSectionChange("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none py-2 px-4 font-normal"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Security
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button 
                  variant={activeSection === "notifications" ? "secondary" : "ghost"}
                  className="w-full justify-start rounded-none py-2 px-4 font-normal"
                  onClick={() => handleSectionChange("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button 
                  variant={activeSection === "appearance" ? "secondary" : "ghost"}
                  className="w-full justify-start rounded-none py-2 px-4 font-normal"
                  onClick={() => handleSectionChange("appearance")}
                >
                  <Laptop className="h-4 w-4 mr-2" />
                  Appearance
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {isMobile ? (
            renderActiveSection()
          ) : (
            <>
              {renderProfileSection()}
              {renderNotificationsSection()}
              {renderAppearanceSection()}
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-center z-10">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Settings;

