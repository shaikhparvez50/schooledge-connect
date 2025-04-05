import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, BellIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Import the audio file for the alarm
const ALARM_SOUND_URL = '/alarm.mp3'; // This will need to be added to your public folder

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState<EventFormData>({
    title: '',
    date: new Date(),
    time: '',
    description: '',
    reminders: []
  });
  const { toast } = useToast();
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio element when component mounts
  useEffect(() => {
    alarmSoundRef.current = new Audio(ALARM_SOUND_URL);
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setNewEvent({
      title: '',
      date: date || new Date(),
      time: '',
      description: '',
      reminders: []
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddReminder = () => {
    setNewEvent(prev => ({
      ...prev,
      reminders: [...prev.reminders, { time: '', description: '' }]
    }));
  };

  const handleReminderChange = (index: number, field: string, value: string) => {
    const updatedReminders = [...newEvent.reminders];
    updatedReminders[index][field] = value;
    setNewEvent(prev => ({
      ...prev,
      reminders: updatedReminders
    }));
  };

  const handleRemoveReminder = (index: number) => {
    const updatedReminders = [...newEvent.reminders];
    updatedReminders.splice(index, 1);
    setNewEvent(prev => ({
      ...prev,
      reminders: updatedReminders
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEventToAdd = {
      ...newEvent,
      date: date || new Date()
    };
    setEvents(prev => [...prev, newEventToAdd]);
    setShowForm(false);
    toast({
      title: "Event added successfully!",
      description: `Your event "${newEvent.title}" has been scheduled.`,
    });
  };

  const handleDeleteEvent = (index: number) => {
    setEvents(prev => {
      const updatedEvents = [...prev];
      updatedEvents.splice(index, 1);
      return updatedEvents;
    });
    toast({
      title: "Event deleted!",
      description: "The event has been removed from your schedule.",
    });
  };

  // Update the playAlarm function to use the ref
  const playAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.play();
    }
  };

  const stopAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const now = new Date();
    events.forEach(event => {
      event.reminders.forEach(reminder => {
        const eventDateTime = new Date(event.date);
        const [hours, minutes] = reminder.time.split(':').map(Number);
        eventDateTime.setHours(hours, minutes, 0, 0);

        if (eventDateTime > now) {
          const timeUntilReminder = eventDateTime.getTime() - now.getTime();
          setTimeout(() => {
            playAlarm();
            toast({
              title: "Reminder!",
              description: reminder.description || `Reminder for ${event.title} at ${reminder.time}`,
              action: <Button variant="secondary" onClick={stopAlarm}>Stop</Button>,
            });
          }, timeUntilReminder);
        }
      });
    });
  }, [events, toast]);

  useEffect(() => {
    const checkNotifications = () => {
      events.forEach(event => {
        const eventDateTime = new Date(event.date);
        const now = new Date();

        if (eventDateTime > now) {
          const timeUntilEvent = eventDateTime.getTime() - now.getTime();
          setTimeout(() => {
            toast({
              title: "Upcoming Event!",
              description: `Don't forget: ${event.title} is happening now!`,
            });
          }, timeUntilEvent);
        }
      });
    };

    checkNotifications();
  }, [events, toast]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={format(date || new Date(), "PPP")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{format(date || new Date(), "PPP")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleOpenForm} className="mt-4 w-full" variant="secondary">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
        <div className="md:w-2/3 mt-4 md:mt-0 md:ml-4">
          <h2 className="text-xl font-semibold mb-2">
            Events for {format(date || new Date(), "PPP")}
          </h2>
          {events.filter(event => format(event.date, "PPP") === format(date || new Date(), "PPP")).length === 0 ? (
            <p>No events scheduled for this day.</p>
          ) : (
            <ul>
              {events.filter(event => format(event.date, "PPP") === format(date || new Date(), "PPP")).map((event, index) => (
                <li key={index} className="mb-2 p-3 border rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.description}</p>
                      <p className="text-sm">Time: {event.time}</p>
                      {event.reminders.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Reminders:</p>
                          <ul>
                            {event.reminders.map((reminder, reminderIndex) => (
                              <li key={reminderIndex} className="text-xs text-gray-600">
                                {reminder.description} - {reminder.time}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteEvent(index)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800">Add New Event</h3>
            <form onSubmit={handleSubmit} className="mt-4">
              <label className="block text-sm text-gray-600 mb-2">
                Title:
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 text-gray-700 mt-1"
                  required
                />
              </label>
              <label className="block text-sm text-gray-600 mb-2">
                Time:
                <input
                  type="time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 text-gray-700 mt-1"
                  required
                />
              </label>
              <label className="block text-sm text-gray-600 mb-2">
                Description:
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md py-2 px-3 text-gray-700 mt-1"
                  rows={3}
                />
              </label>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Reminders:
                </label>
                {newEvent.reminders.map((reminder, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <input
                      type="time"
                      value={reminder.time}
                      onChange={(e) => handleReminderChange(index, 'time', e.target.value)}
                      className="mr-2 border rounded-md py-2 px-3 text-gray-700"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Reminder description"
                      value={reminder.description}
                      onChange={(e) => handleReminderChange(index, 'description', e.target.value)}
                      className="mr-2 border rounded-md py-2 px-3 text-gray-700"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveReminder(index)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={handleAddReminder}>
                  Add Reminder
                </Button>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={handleCloseForm} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface Event {
  title: string;
  date: Date;
  time: string;
  description: string;
  reminders: Reminder[];
}

interface EventFormData {
  title: string;
  date: Date;
  time: string;
  description: string;
  reminders: Reminder[];
}

interface Reminder {
  time: string;
  description: string;
}

export default Schedule;
