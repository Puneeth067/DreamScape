"use client"
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, List, Plus, Filter } from 'lucide-react';
import Link from 'next/link'; 
import EventList from '@/components/EventList';

const EventsPage = () => {
  const { data: session } = useSession();
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [events] = useState([
    {
      id: 1,
      title: 'Team Building Workshop',
      date: '2025-01-15',
      time: '14:00',
      location: 'Main Conference Room',
      attendees: 25,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Product Launch',
      date: '2025-01-20',
      time: '10:00',
      location: 'Virtual Event',
      attendees: 150,
      status: 'planning'
    }
  ]);

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
        <EventList 
          events={events}
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>
    </div>
  );
};

export default EventsPage;