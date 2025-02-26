 // src/utils/eventStatus.ts

export interface EventTime {
  _id?: string;
  datetime: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
}

export const getEventStatus = (event: EventTime): 'draft' | 'published' | 'cancelled' | 'completed' => {
  // If event is already cancelled, maintain that status
  if (event.status === 'cancelled') {
    return 'cancelled';
  }

  // If event is in draft state, maintain that status
  if (event.status === 'draft') {
    return 'draft';
  }

  const eventDate = new Date(event.datetime);
  const currentDate = new Date();

  // Check if event has passed
  if (currentDate > eventDate) {
    return 'completed';
  }

  // If none of the above conditions are met, maintain published status
  return 'published';
};

export const updateEventStatus = async (event: EventTime): Promise<EventTime> => {
  const newStatus = getEventStatus(event);
  
  // If status needs to be updated
  if (newStatus !== event.status) {
    // Update in database
    try {
      const response = await fetch(`/api/events/${event._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event status');
      }
      
      return {
        ...event,
        status: newStatus,
      };
    } catch (error) {
      console.error('Error updating event status:', error);
      return event;
    }
  }
  
  return event;
};
