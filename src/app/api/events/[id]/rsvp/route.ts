// src/app/api/events/[id]/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Update RSVP status
    const attendeeIndex = event.attendees.indexOf(session.user.id);
    if (status === 'attending' && attendeeIndex === -1) {
      event.attendees.push(session.user.id);
    } else if (status === 'declined' && attendeeIndex !== -1) {
      event.attendees.splice(attendeeIndex, 1);
    }

    await event.save();

    const updatedEvent = await Event.findById(params.id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    console.error('Error updating RSVP:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}