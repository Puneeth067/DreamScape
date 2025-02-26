"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Type, Users, Clock } from 'lucide-react';

interface EventFormData {
  title: string;
  description: string;
  datetime: string;
  location: string;
  eventType: string;
}

const CreateEventPage = () => {
  const router = useRouter();
  const { toast } = useToast();


  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    datetime: '',
    location: '',
    eventType: 'conference'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'published'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const data = await response.json();

      toast({
        title: "Success!",
        description: "Event created successfully.",
      });

      router.push(`/events/${data._id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto shadow-lg border-t-4 border-t-violet-500">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Create New Event
            </CardTitle>
            <p className="text-gray-600">Fill in the details below to create your event</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Type className="w-4 h-4 mr-2 text-violet-500" />
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-violet-500 focus:ring-violet-500 transition-colors"
                  placeholder="Enter an engaging title for your event"
                  title="Event Title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Users className="w-4 h-4 mr-2 text-violet-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-violet-500 focus:ring-violet-500 transition-colors"
                  rows={4}
                  placeholder="What can attendees expect from this event?"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-violet-500" />
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-violet-500 focus:ring-violet-500 transition-colors"
                    placeholder="Select date and time"
                    title="Event Date and Time"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-violet-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-violet-500 focus:ring-violet-500 transition-colors"
                    placeholder="Physical address or virtual link"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-violet-500" />
                  Event Type
                </label>
                <select 
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  title="Event Type"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-violet-500 focus:ring-violet-500 transition-colors"
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="meeting">Meeting</option>
                  <option value="social">Social Event</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  onClick={() => router.push('/events')}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-lg hover:from-violet-700 hover:to-pink-700 disabled:opacity-50 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEventPage;