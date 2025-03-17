
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Bell, 
  Video, 
  FileText, 
  UserPlus, 
  Clock, 
  Calendar,
  X, 
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "course" | "message" | "assignment" | "system" | "schedule";
  title: string;
  description: string;
  timestamp: number;
  read: boolean;
  icon: React.ReactNode;
  actionLabel?: string;
  action?: () => void;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      type: "course",
      title: "New lecture uploaded",
      description: "Dr. Sarah Johnson uploaded a new Physics lecture",
      timestamp: Date.now() - 3600000 * 2, // 2 hours ago
      read: false,
      icon: <Video className="h-5 w-5" />,
      actionLabel: "Watch",
      action: () => navigate("/courses")
    },
    {
      id: "notif-2",
      type: "message",
      title: "New message from Emma Wilson",
      description: "Hi there! How are you doing today?",
      timestamp: Date.now() - 3600000 * 5, // 5 hours ago
      read: false,
      icon: <UserPlus className="h-5 w-5" />,
      actionLabel: "Reply",
      action: () => navigate("/messages")
    },
    {
      id: "notif-3",
      type: "assignment",
      title: "Assignment deadline approaching",
      description: "Mathematics assignment due in 24 hours",
      timestamp: Date.now() - 3600000 * 12, // 12 hours ago
      read: true,
      icon: <FileText className="h-5 w-5" />,
      actionLabel: "View",
      action: () => navigate("/dashboard")
    },
    {
      id: "notif-4",
      type: "schedule",
      title: "Schedule reminder",
      description: "Science class in 30 minutes",
      timestamp: Date.now() - 3600000 * 24, // 1 day ago
      read: true,
      icon: <Clock className="h-5 w-5" />,
      actionLabel: "View Schedule",
      action: () => navigate("/schedule")
    },
    {
      id: "notif-5",
      type: "system",
      title: "System maintenance",
      description: "The system will be unavailable on Sunday from 2 AM to 4 AM",
      timestamp: Date.now() - 3600000 * 48, // 2 days ago
      read: true,
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      id: "notif-6",
      type: "course",
      title: "Course material added",
      description: "Prof. Michael Chen added new documents to Advanced Physics",
      timestamp: Date.now() - 3600000 * 72, // 3 days ago
      read: true,
      icon: <FileText className="h-5 w-5" />,
      actionLabel: "View Material",
      action: () => navigate("/courses")
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : activeTab === "unread" 
      ? notifications.filter(n => !n.read) 
      : notifications.filter(n => n.type === activeTab);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                All
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="course">Courses</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
              <TabsTrigger value="assignment">Assignments</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAllNotifications}>
                <X className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {renderNotificationList(filteredNotifications)}
          </TabsContent>
          
          <TabsContent value="unread" className="mt-0">
            {filteredNotifications.length === 0 ? (
              <EmptyNotifications message="No unread notifications" />
            ) : (
              renderNotificationList(filteredNotifications)
            )}
          </TabsContent>
          
          <TabsContent value="course" className="mt-0">
            {filteredNotifications.length === 0 ? (
              <EmptyNotifications message="No course notifications" />
            ) : (
              renderNotificationList(filteredNotifications)
            )}
          </TabsContent>
          
          <TabsContent value="message" className="mt-0">
            {filteredNotifications.length === 0 ? (
              <EmptyNotifications message="No message notifications" />
            ) : (
              renderNotificationList(filteredNotifications)
            )}
          </TabsContent>
          
          <TabsContent value="assignment" className="mt-0">
            {filteredNotifications.length === 0 ? (
              <EmptyNotifications message="No assignment notifications" />
            ) : (
              renderNotificationList(filteredNotifications)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function renderNotificationList(notificationList: Notification[]) {
    if (notificationList.length === 0) {
      return <EmptyNotifications message="No notifications" />;
    }
    
    return (
      <div className="space-y-4">
        {notificationList.map(notification => (
          <Card 
            key={notification.id} 
            className={`p-4 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
          >
            <div className="flex">
              <div className={`
                flex-shrink-0 h-10 w-10 rounded-full 
                ${getNotificationColor(notification.type)} 
                flex items-center justify-center
              `}>
                {notification.icon}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{notification.title}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <div className="mt-2 flex justify-between">
                  <div className="flex space-x-2">
                    {notification.actionLabel && (
                      <Button 
                        variant="link" 
                        className="h-auto p-0" 
                        onClick={notification.action}
                      >
                        {notification.actionLabel}
                      </Button>
                    )}
                    {!notification.read && (
                      <Button
                        variant="link"
                        className="h-auto p-0 text-muted-foreground"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  function getNotificationColor(type: string) {
    switch (type) {
      case "course":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "message":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "assignment":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "schedule":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "system":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  }
};

const EmptyNotifications = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
    <h3 className="text-lg font-medium">{message}</h3>
    <p className="text-muted-foreground">You're all caught up!</p>
  </div>
);

export default Notifications;
