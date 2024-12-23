import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ChevronLeft, ChevronRight, Plus, Search, Trash2, Pencil } from 'lucide-react';

// Utility functions for date handling
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    description: '',
    color: '#3b82f6'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowEventModal(true);
    setIsEditing(false);
    setEditingEventIndex(null);
    setNewEvent({
      title: '',
      startTime: '',
      endTime: '',
      description: '',
      color: '#3b82f6'
    });
  };

  const handleEditEvent = (dateKey, eventIndex) => {
    const event = events[dateKey][eventIndex];
    setNewEvent({ ...event });
    setIsEditing(true);
    setEditingEventIndex(eventIndex);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title || !newEvent.startTime || !newEvent.endTime) return;

    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    
    // Check for overlapping events (skip checking the event being edited)
    const dateEvents = events[dateKey] || [];
    const isOverlapping = dateEvents.some((event, index) => {
      if (isEditing && index === editingEventIndex) return false;
      
      const newStart = new Date(`2000-01-01T${newEvent.startTime}`);
      const newEnd = new Date(`2000-01-01T${newEvent.endTime}`);
      const eventStart = new Date(`2000-01-01T${event.startTime}`);
      const eventEnd = new Date(`2000-01-01T${event.endTime}`);
      
      return (newStart < eventEnd && newEnd > eventStart);
    });

    if (isOverlapping) {
      alert('Event overlaps with existing event!');
      return;
    }

    setEvents(prev => {
      const updatedEvents = { ...prev };
      if (isEditing) {
        updatedEvents[dateKey][editingEventIndex] = newEvent;
      } else {
        updatedEvents[dateKey] = [...(prev[dateKey] || []), newEvent];
      }
      return updatedEvents;
    });

    setNewEvent({
      title: '',
      startTime: '',
      endTime: '',
      description: '',
      color: '#3b82f6'
    });
    setIsEditing(false);
    setEditingEventIndex(null);
    setShowEventModal(false);
  };

  const handleDeleteEvent = (dateKey, eventIndex) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((_, index) => index !== eventIndex)
    }));
  };

  const sortEventsByTime = (events) => {
    return [...events].sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`2000-01-01T${b.startTime}`).getTime();
      return timeA - timeB;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-200" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const dayEvents = events[dateKey] || [];
      const filteredEvents = searchTerm
        ? dayEvents.filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : dayEvents;
      
      const sortedEvents = sortEventsByTime(filteredEvents);

      const isToday = new Date().toDateString() === date.toDateString();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push(
        <div
          key={day}
          onClick={() => handleDateSelect(date)}
          className={`p-2 border border-gray-200 min-h-24 cursor-pointer transition-colors
            ${isToday ? 'bg-blue-50' : ''}
            ${isWeekend ? 'bg-gray-50' : ''}
            hover:bg-gray-100`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>{day}</span>
            {sortedEvents.length > 0 && (
              <span className="text-xs bg-blue-500 text-white px-1.5 rounded-full">
                {sortedEvents.length}
              </span>
            )}
          </div>
          <div className="mt-1">
            {sortedEvents.slice(0, 2).map((event, index) => (
              <div
                key={index}
                className="text-xs p-1 mb-1 rounded"
                style={{ backgroundColor: event.color }}
              >
                {event.title}
              </div>
            ))}
            {sortedEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{sortedEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Event' : 'Add Event'} - {' '}
              {selectedDate?.toLocaleDateString('default', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Enter event description"
              />
            </div>
            <div>
              <Label htmlFor="color">Event Color</Label>
              <Input
                id="color"
                type="color"
                value={newEvent.color}
                onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
                className="h-10 p-1"
              />
            </div>
            <Button onClick={handleAddEvent} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Event' : 'Add Event'}
            </Button>

            {selectedDate && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Events for this day:</h3>
                {sortEventsByTime(events[`${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`] || [])
                  .map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded mb-2"
                      style={{ backgroundColor: `${event.color}20` }}
                    >
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-600">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(
                              `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`,
                              index
                            );
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(
                              `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`,
                              index
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;