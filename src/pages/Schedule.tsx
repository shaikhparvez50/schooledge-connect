import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  Trash2, 
  Bell,
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ScheduleItem {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description: string;
  timerDuration?: number; // in minutes
}

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem("scheduleItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({
    title: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    description: "",
    timerDuration: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{ id: string, timeLeft: number } | null>(null);
  const timerRef = useRef<number | null>(null);

  const { toast } = useToast();
  
  useEffect(() => {
    const alarmSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3");
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("scheduleItems", JSON.stringify(scheduleItems));
  }, [scheduleItems]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddScheduleItem = () => {
    if (!newItem.title || !newItem.startTime || !newItem.endTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const itemToAdd: ScheduleItem = {
      id: Date.now().toString(),
      title: newItem.title!,
      date: selectedDate,
      startTime: newItem.startTime!,
      endTime: newItem.endTime!,
      description: newItem.description || "",
      timerDuration: newItem.timerDuration
    };
    
    setScheduleItems(prev => [...prev, itemToAdd]);
    setNewItem({
      title: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      description: "",
      timerDuration: 0
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Schedule item added",
    });
  };
  
  const handleDeleteItem = (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item deleted",
      description: "Schedule item has been removed",
    });
  };
  
  const startTimer = (id: string, duration: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const minutes = duration * 60 * 1000; // convert to milliseconds
    const endTime = Date.now() + minutes;
    
    setActiveTimer({ id, timeLeft: minutes });
    
    timerRef.current = window.setInterval(() => {
      const remaining = endTime - Date.now();
      
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setActiveTimer(null);
        toast({
          title: "Timer Finished!",
          description: "Your scheduled timer has ended",
          variant: "destructive",
        });
        
        if (alarmSound) {
          alarmSound.play();
        }
      } else {
        setActiveTimer({ id, timeLeft: remaining });
      }
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveTimer(null);
    toast({
      title: "Timer stopped",
      description: "Your timer has been canceled",
    });
  };
  
  const formatTimeLeft = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const itemsForSelectedDate = scheduleItems.filter(item => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getDate() === selectedDate.getDate() &&
      itemDate.getMonth() === selectedDate.getMonth() &&
      itemDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  return (
    <div className="container mx-auto max-w-6xl py-6 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-accent transition-all duration-300" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Button>
        <h1 className="text-2xl font-semibold font-display bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">My Schedule</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="shadow-md border-primary/10 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-1">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={date => date && setSelectedDate(date)}
                  className="rounded-md border"
                  classNames={{
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                  }}
                />
              </div>
              
              <div className="mt-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-sm flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Schedule Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] border-primary/20 shadow-lg">
                    <DialogHeader>
                      <DialogTitle className="text-center text-lg font-semibold">Add New Schedule Item</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title" className="font-medium">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={newItem.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Math Class"
                          className="border-input/50 focus-visible:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="startTime" className="font-medium">Start Time</Label>
                          <Input
                            id="startTime"
                            name="startTime"
                            type="time"
                            value={newItem.startTime}
                            onChange={handleInputChange}
                            className="border-input/50 focus-visible:ring-primary"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="endTime" className="font-medium">End Time</Label>
                          <Input
                            id="endTime"
                            name="endTime"
                            type="time"
                            value={newItem.endTime}
                            onChange={handleInputChange}
                            className="border-input/50 focus-visible:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description" className="font-medium">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          value={newItem.description}
                          onChange={handleInputChange}
                          placeholder="Enter any details here"
                          className="border-input/50 focus-visible:ring-primary"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="timer" className="font-medium">Timer Duration (minutes)</Label>
                        <Input
                          id="timerDuration"
                          name="timerDuration"
                          type="number"
                          value={newItem.timerDuration || ""}
                          onChange={handleInputChange}
                          placeholder="Enter duration in minutes"
                          min="0"
                          className="border-input/50 focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddScheduleItem} className="bg-primary hover:bg-primary/90">
                        Add to Schedule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          
          {activeTimer && (
            <Card className="mt-4 border-primary shadow-md animate-pulse">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/20 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Active Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold my-4 text-primary">
                    {formatTimeLeft(activeTimer.timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Timer for: {scheduleItems.find(item => item.id === activeTimer.id)?.title}
                  </p>
                  <Button onClick={stopTimer} variant="destructive" size="sm" className="shadow-sm hover:shadow-md transition-all duration-300">
                    Stop Timer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-2">
          <Card className="shadow-md border-primary/10 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="font-medium">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {itemsForSelectedDate.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30 text-primary/30" />
                  <p className="mb-2 text-lg font-medium">No schedule items for this date</p>
                  <p className="text-sm mb-4">Your day looks clear. Add an item to get started.</p>
                  <Button 
                    variant="outline" 
                    className="border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add an Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
                  {itemsForSelectedDate
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(item => (
                      <div 
                        key={item.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-card"
                      >
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-lg">{item.title}</h3>
                            <div className="flex space-x-2">
                              {item.timerDuration && item.timerDuration > 0 && !activeTimer && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-primary/30 hover:border-primary hover:bg-primary/5 text-xs font-medium"
                                  onClick={() => startTimer(item.id, item.timerDuration!)}
                                >
                                  <Bell className="h-3 w-3 mr-1" />
                                  Start Timer
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive opacity-60 hover:opacity-100 hover:bg-destructive/10"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center text-sm px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                              {item.startTime} - {item.endTime}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm mt-2 text-muted-foreground">{item.description}</p>
                          )}
                          {item.timerDuration && item.timerDuration > 0 && (
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <Bell className="h-3 w-3 mr-1 text-primary/60" />
                              <span>Timer: {item.timerDuration} minutes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
