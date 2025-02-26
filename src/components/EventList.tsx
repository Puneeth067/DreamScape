import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import Link from 'next/link';

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

interface Filters {
  status?: string;
  type?: string;
  search?: string;
}

interface EventListProps {
  events: Event[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  showFilters: boolean;
}

const EventListItem = ({ event }: { event: Event }) => {
  const eventDate = new Date(event.date);
  const statusColors = {
    upcoming: 'bg-green-100 text-green-800',
    planning: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {eventDate.toLocaleDateString()} at {event.time}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
              {event.attendees && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees} attendees
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[event.status]}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
              </span>
            </div>
            <Link
              href={`/events/${event.id}`}
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EventList: React.FC<EventListProps> = ({ events, filters, onFilterChange, showFilters }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  // Update searchQuery when filters.search changes
  useEffect(() => {
    setSearchQuery(filters.search || '');
  }, [filters.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchQuery });
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <select 
                className="px-3 py-2 border rounded-lg bg-white min-w-[150px]"
                title='Filter by status'
                value={filters.status || ''}
                onChange={(e) => onFilterChange({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                className="px-3 py-2 border rounded-lg bg-white min-w-[150px]"
                title='Filter by event type'
                value={filters.type || ''}
                onChange={(e) => onFilterChange({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="meeting">Meeting</option>
                <option value="social">Social Event</option>
              </select>

              <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="px-3 py-2 border rounded-lg bg-white flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <EventListItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-gray-600">
            No events match your current filters. Try adjusting your filters to see more events.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventList;