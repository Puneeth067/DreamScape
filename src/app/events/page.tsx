"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, List, Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import EventList from '@/components/EventList';
import { useToast } from "@/hooks/use-toast";
import { updateEventStatus } from '@/utils/eventStatus';
import EventCalendar from '@/components/EventCalendar';

interface RawEvent {
  _id: string;
  title: string;
  datetime: string;
  location: string;
  eventType: 'conference' | 'workshop' | 'meeting' | 'social';
  attendees: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    rsvpStatus: 'attending' | 'maybe' | 'declined';
  }>;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
}

interface TransformedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'planning' | 'cancelled' | 'completed';
  eventType: 'conference' | 'workshop' | 'meeting' | 'social';
}

interface Filters {
  status?: string;
  type?: string;
  search?: string;
}

const transformEventData = (event: RawEvent): TransformedEvent => {
  const dateTime = new Date(event.datetime);
  const statusMap: Record<string, TransformedEvent['status']> = {
    draft: 'planning',
    published: 'upcoming',
    cancelled: 'cancelled',
    completed: 'completed'
  };

  return {
    id: event._id,
    title: event.title,
    date: dateTime.toISOString().split('T')[0],
    time: dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: event.location,
    attendees: event.attendees.length,
    status: statusMap[event.status] ?? 'upcoming',
    eventType: event.eventType
  };
};

const EventsPage = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [events, setEvents] = useState<TransformedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TransformedEvent[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    type: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters to events
  const applyFilters = (allEvents: TransformedEvent[], currentFilters: Filters) => {
    return allEvents.filter(event => {
      const statusMatch = !currentFilters.status || event.status === currentFilters.status;
      const typeMatch = !currentFilters.type || event.eventType === currentFilters.type;
      const searchMatch = !currentFilters.search || 
        event.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(currentFilters.search.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
    });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  // Update filtered events whenever events or filters change
  useEffect(() => {
    setFilteredEvents(applyFilters(events, filters));
  }, [events, filters]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const rawData: RawEvent[] = await response.json();
        
        const updatedData = await Promise.all(
          rawData.map(async (event) => {
            const updatedEvent = await updateEventStatus(event) as RawEvent;
            return transformEventData(updatedEvent);
          })
        );
        
        setEvents(updatedData);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load events.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
    const statusCheckInterval = setInterval(fetchEvents, 60000);
    return () => clearInterval(statusCheckInterval);
  }, [session, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const activeFilterCount = [
    filters.status,
    filters.type,
    filters.search
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600">Manage and organize your events</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link 
              href="/events/create"
              className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </Link>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <button
                onClick={() => setViewMode('list')}
                title='List View'
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-violet-100 text-violet-600' : 'text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                title='Calendar View'
                className={`p-2 rounded-lg ${
                  viewMode === 'calendar' ? 'bg-violet-100 text-violet-600' : 'text-gray-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
            <button 
              className={`inline-flex items-center px-3 py-2 border rounded-lg ${
                showFilters ? 'bg-violet-100 text-violet-600 border-violet-200' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-violet-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </CardContent>
        </Card>

        {viewMode === 'list' ? (
          <EventList 
            events={filteredEvents}
            filters={filters}
            onFilterChange={handleFilterChange}
            showFilters={showFilters}
          />
        ) : (
          <EventCalendar events={filteredEvents} />
        )}
      </div>
    </div>
  );
};

export default EventsPage;