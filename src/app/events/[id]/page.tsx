"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, Trash2, Share2, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventDetails {
  _id: string;
  title: string;
  description: string;
  datetime: string;
  location: string;
  eventType: 'conference' | 'workshop' | 'meeting' | 'social';
  organizer: {
    _id: string;
    firstName: string;
    email: string;
  };
  attendees: Array<{
    userId: {
      _id: string;
      firstName: string;
      email: string;
    };
    rsvpStatus: 'attending' | 'maybe' | 'declined';
  }>;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const EventDetailsPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userRsvpStatus, setUserRsvpStatus] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    interface RawEventData {
      _id: string;
      title: string;
      description: string;
      datetime: string;
      location: string;
      eventType: 'conference' | 'workshop' | 'meeting' | 'social';
      organizer: {
        _id: string;
        firstName: string;
        email: string;
      };
      attendees: Array<{
        userId: {
          _id: string;
          firstName: string;
          email: string;
        };
        rsvpStatus: 'attending' | 'maybe' | 'declined';
      }>;
      status: string;
    }

    const transformEventData = (rawEvent: RawEventData): EventDetails => {
      const statusMap: { [key: string]: EventDetails['status'] } = {
        'draft': 'upcoming',
        'published': 'upcoming',
        'cancelled': 'cancelled',
        'completed': 'completed'
      };
    
      return {
        ...rawEvent,
        status: statusMap[rawEvent.status] || 'upcoming'
      };
    };
    
    // Update the fetch call in useEffect:
    const fetchEventDetails = async () => {
      try {
        if (!params || !params.id) {
          throw new Error('Event ID not found');
        }
        
        const response = await fetch(`/api/events/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch event details');
        }
        
        const transformedEvent = transformEventData(data);
        setEvent(transformedEvent);
        setIsOrganizer(transformedEvent.organizer._id === session?.user?.id);
        
        // Find current user's RSVP status
        const userAttendee = transformedEvent.attendees.find(
          (attendee) => attendee.userId._id === session?.user?.id
        );
        setUserRsvpStatus(userAttendee?.rsvpStatus || null);
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to load event details',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (params && params.id && session?.user?.id) {
      fetchEventDetails();
    }
  }, [params, session?.user?.id, toast]);

  
  const handleJoinEvent = async () => {
    if (isSubmitting || !params?.id) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'attending' }),
      });

      if (!response.ok) throw new Error('Failed to join event');

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setHasJoined(true);

      toast({
        title: "Success!",
        description: "You've successfully joined the event.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to join event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRSVP = async (status: 'attending' | 'maybe' | 'declined') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (!params) throw new Error('Params not found');
      
      // Check if user is trying to set the same status
      if (status === userRsvpStatus) {
        toast({
          title: "Info",
          description: "You've already selected this RSVP status.",
        });
        return;
      }
  
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
  
      if (!response.ok) throw new Error('Failed to RSVP');
  
      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      
      // Update the RSVP status based on the action
      if (status === 'declined') {
        setUserRsvpStatus(null);
      } else {
        setUserRsvpStatus(status);
      }
  
      // Provide more specific success messages
      const messages = {
        attending: "You're now attending this event!",
        maybe: "Your 'maybe' response has been recorded.",
        declined: "You've declined this event."
      };
  
      toast({
        title: "Success!",
        description: messages[status],
      });
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      toast({
        title: "Error",
        description: "Failed to RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      if (!params) throw new Error('Params not found');
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete event');

      toast({
        title: "Success!",
        description: "Event deleted successfully.",
      });

      router.push('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
      // If Web Share API is not supported, copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Event not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto border-none bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg">
            <div>
              <CardTitle className="text-2xl font-bold text-white">{event?.title}</CardTitle>
              <span className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-medium ${
                event?.status === 'upcoming' ? 'bg-green-400/90 text-white' :
                event?.status === 'completed' ? 'bg-gray-400/90 text-white' :
                event?.status === 'cancelled' ? 'bg-red-400/90 text-white' :
                'bg-blue-400/90 text-white'
              }`}>
                {event?.status.charAt(0).toUpperCase() + event?.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-white">
                  {event.attendees.length} {event.attendees.length === 1 ? 'attendee' : '+'}
                </span>
                {!isOrganizer && !hasJoined && event.status === 'upcoming' && (
                  <Button
                    onClick={handleJoinEvent}
                    disabled={isSubmitting}
                    className="ml-4 text-white hover:bg-white/20"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Joining...' : 'Join Event'}
                  </Button>
                )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                title="Share event"
                className="text-white hover:bg-white/20"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              {isOrganizer && (
                // <>
                //   <Button
                //     variant="ghost"
                //     size="icon"
                //     onClick={() => router.push(`/events/${event?._id}/edit`)}
                //     title="Edit event"
                //     className="text-white hover:bg-white/20"
                //   >
                //     <Edit2 className="w-5 h-5" />
                //   </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                    title="Delete event"
                    className="text-white hover:bg-white/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                // </>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center text-gray-700 bg-purple-50 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                  <span>{new Date(event?.datetime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-700 bg-pink-50 p-3 rounded-lg">
                  <Clock className="w-5 h-5 mr-3 text-pink-600" />
                  <span>{new Date(event?.datetime).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center text-gray-700 bg-cyan-50 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 mr-3 text-cyan-600" />
                  <span>{event?.location}</span>
                </div>
                <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg">
                  <Users className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{event?.attendees.length} attendees</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{event?.description}</p>
              </div>
            </div>

            {/* RSVP Section */}
            {!isOrganizer && event?.status === 'upcoming' && (
              <div className="flex justify-center gap-4 pt-6">
                <Button
                  onClick={() => handleRSVP('attending')}
                  variant={userRsvpStatus === 'attending' ? 'default' : 'outline'}
                  disabled={isSubmitting}
                  className={userRsvpStatus === 'attending' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : ''}
                >
                  Attending
                </Button>
                <Button
                  onClick={() => handleRSVP('maybe')}
                  variant={userRsvpStatus === 'maybe' ? 'default' : 'outline'}
                  disabled={isSubmitting}
                  className={userRsvpStatus === 'maybe' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600' : ''}
                >
                  Maybe
                </Button>
                <Button
                  onClick={() => handleRSVP('declined')}
                  variant={userRsvpStatus === 'declined' ? 'default' : 'outline'}
                  disabled={isSubmitting}
                  className={userRsvpStatus === 'declined' ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' : ''}
                >
                  Can&apos;t Attend
                </Button>
              </div>
            )}

            {/* Attendees List */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Attendees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event?.attendees.map((attendee) => (
                  <div key={attendee.userId?._id || Math.random()} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-medium">
                      {attendee.userId?.firstName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{attendee.userId?.firstName || 'Unknown'}</p>
                      <p className="text-sm text-gray-500 truncate">{attendee.userId?.email || 'No email'}</p>
                    </div>
                    {attendee.rsvpStatus && (
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        attendee.rsvpStatus === 'attending' ? 'bg-green-100 text-green-700' :
                        attendee.rsvpStatus === 'maybe' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {attendee.rsvpStatus.charAt(0).toUpperCase() + attendee.rsvpStatus.slice(1)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventDetailsPage;