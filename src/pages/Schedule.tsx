
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
import { toast } from "sonner";

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

  // Timer sound
  const alarmSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    alarmSound.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3");
    
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
      toast.error("Please fill in all required fields");
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
    toast.success("Schedule item added");
  };
  
  const handleDeleteItem = (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
    toast.success("Schedule item deleted");
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
        toast.error("Timer finished!", { duration: 10000 });
        
        // Play sound
        if (alarmSound.current) {
          alarmSound.current.play();
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
  };
  
  const formatTimeLeft = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Filter items for the selected date
  const itemsForSelectedDate = scheduleItems.filter(item => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getDate() === selectedDate.getDate() &&
      itemDate.getMonth() === selectedDate.getMonth() &&
      itemDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Schedule</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={date => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              
              <div className="mt-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Schedule Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Schedule Item</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={newItem.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Math Class"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            name="startTime"
                            type="time"
                            value={newItem.startTime}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            name="endTime"
                            type="time"
                            value={newItem.endTime}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          value={newItem.description}
                          onChange={handleInputChange}
                          placeholder="Enter any details here"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="timer">Timer Duration (minutes)</Label>
                        <Input
                          id="timerDuration"
                          name="timerDuration"
                          type="number"
                          value={newItem.timerDuration || ""}
                          onChange={handleInputChange}
                          placeholder="Enter duration in minutes"
                          min="0"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddScheduleItem}>
                        Add to Schedule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          
          {activeTimer && (
            <Card className="mt-4 border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Active Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold my-2">
                    {formatTimeLeft(activeTimer.timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Timer for: {scheduleItems.find(item => item.id === activeTimer.id)?.title}
                  </p>
                  <Button onClick={stopTimer} variant="destructive" size="sm">
                    Stop Timer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>
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
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No schedule items for this date</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add an Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {itemsForSelectedDate
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(item => (
                      <div 
                        key={item.id}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                      >
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="flex space-x-2">
                              {item.timerDuration && item.timerDuration > 0 && !activeTimer && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => startTimer(item.id, item.timerDuration!)}
                                >
                                  <Bell className="h-4 w-4 mr-1" />
                                  Start Timer
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.startTime} - {item.endTime}
                          </p>
                          {item.description && (
                            <p className="text-sm mt-2">{item.description}</p>
                          )}
                          {item.timerDuration && item.timerDuration > 0 && (
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <Bell className="h-3 w-3 mr-1" />
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
