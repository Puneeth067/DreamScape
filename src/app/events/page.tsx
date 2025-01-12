// src/app/events/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, List, Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import EventList from '@/components/EventList';
import { useToast } from "@/hooks/use-toast";

// Type for raw event data from API
interface RawEvent {
  _id: string;
  title: string;
  datetime: string;
  location: string;
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

// Type for transformed event data
interface TransformedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'planning' | 'cancelled' | 'completed';
}

// Function to transform event data
const transformEventData = (event: RawEvent): TransformedEvent => {
  const dateTime = new Date(event.datetime);
  
  // Map API status to UI status
  const statusMap: { [key: string]: TransformedEvent['status'] } = {
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
    status: statusMap[event.status] || 'upcoming'
  };
};

const EventsPage = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [events, setEvents] = useState<TransformedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const rawData: RawEvent[] = await response.json();
        
        // Transform the raw event data
        const transformedEvents = rawData.map(transformEventData);
        setEvents(transformedEvents);
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

    if (session?.user) {
      fetchEvents();
    }
  }, [session, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
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

        {/* View Toggle and Filters */}
        <Card className="mb-6">
          <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-violet-100 text-violet-600' : 'text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg ${
                  viewMode === 'calendar' ? 'bg-violet-100 text-violet-600' : 'text-gray-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </CardContent>
        </Card>

        {/* Events List */}
        {events.length > 0 ? (
          <EventList 
            events={events}
            filters={filters}
            onFilterChange={setFilters}
          />
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-600">
              No events found. Create your first event to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventsPage;