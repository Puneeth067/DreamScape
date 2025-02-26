import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Users
} from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees?: number;
  status: 'upcoming' | 'planning' | 'cancelled' | 'completed';
  eventType: 'conference' | 'workshop' | 'meeting' | 'social';
}

interface EventCalendarProps {
  events: Event[];
}

const EventCalendar = ({ events }: EventCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const today = new Date();
  
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDayOfWeek + 1;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate?.toDateString() === date.toDateString();
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
    
    return {
      date,
      dayNumber,
      isCurrentMonth,
      isToday,
      isSelected,
      events: dayEvents
    };
  });
  
  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, (i + 1) * 7));
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getEventColor = (eventType: string, isHovered: boolean = false) => {
    const colors = {
      conference: `${isHovered ? 'bg-blue-200' : 'bg-blue-100'} border-blue-300 text-blue-800`,
      workshop: `${isHovered ? 'bg-green-200' : 'bg-green-100'} border-green-300 text-green-800`,
      meeting: `${isHovered ? 'bg-yellow-200' : 'bg-yellow-100'} border-yellow-300 text-yellow-800`,
      social: `${isHovered ? 'bg-pink-200' : 'bg-pink-100'} border-pink-300 text-pink-800`
    };
    return colors[eventType as keyof typeof colors] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-green-100 text-green-800',
      planning: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-violet-100 text-violet-700 rounded-full hover:bg-violet-200 transition-colors"
              >
                Today
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-violet-100 rounded-full transition-colors"
                title="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-violet-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-violet-100 rounded-full transition-colors"
                title="Next month"
              >
                <ChevronRight className="w-5 h-5 text-violet-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 p-2 border-b">
                {day.slice(0, 3)}
              </div>
            ))}
            
            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map(({ date, isCurrentMonth, isToday, isSelected, events }, dayIndex) => (
                  <div
                    key={dayIndex}
                    onClick={() => setSelectedDate(date)}
                    className={`min-h-28 border p-1 transition-all ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'border-violet-400' : 'border-gray-200'}
                    ${isSelected ? 'ring-2 ring-violet-500' : ''}
                    ${events.length > 0 ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  >
                    <div className="text-right mb-1">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full
                        ${isToday ? 'bg-violet-600 text-white' : ''}
                        ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 3).map(event => (
                        <TooltipProvider key={event.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/events/${event.id}`}
                                className={`block transition-all ${getEventColor(event.eventType, hoveredEvent?.id === event.id)} 
                                  rounded border p-1 text-xs hover:shadow-md`}
                                onMouseEnter={() => setHoveredEvent(event)}
                                onMouseLeave={() => setHoveredEvent(null)}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="text-gray-600 truncate">{event.time}</div>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="p-0">
                              <div className="p-3 max-w-md">
                                <h4 className="font-semibold mb-2">{event.title}</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {event.time}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {event.location}
                                  </div>
                                  {event.attendees && (
                                    <div className="flex items-center">
                                      <Users className="w-4 h-4 mr-2" />
                                      {event.attendees} attendees
                                    </div>
                                  )}
                                  <div className="flex space-x-2 mt-2">
                                    <Badge variant="secondary" className={getStatusColor(event.status)}>
                                      {event.status}
                                    </Badge>
                                    <Badge variant="secondary" className={getEventColor(event.eventType)}>
                                      {event.eventType}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                      {events.length > 3 && (
                        <div className="text-xs text-gray-600 pl-1">
                          +{events.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Events on {selectedDate.toLocaleDateString()}
              </h3>
              <Badge variant="secondary" className="text-violet-600 bg-violet-100">
                {days.find(day => day.date.toDateString() === selectedDate.toDateString())?.events.length || 0} Events
              </Badge>
            </div>
            <div className="space-y-3">
              {days.find(day => day.date.toDateString() === selectedDate.toDateString())?.events.map(event => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className={`block p-3 rounded-lg border ${getEventColor(event.eventType)} hover:shadow-md transition-all`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary" className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                      <Badge variant="secondary" className={getEventColor(event.eventType)}>
                        {event.eventType}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventCalendar;