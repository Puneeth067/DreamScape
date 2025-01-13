// src/app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

// In src/app/api/events/[id]/route.ts, update the GET function:

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = params.id;
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const event = await Event.findById(eventId)
      .populate('organizer', 'firstName email')
      .populate({
        path: 'attendees.userId',
        select: 'firstName email'
      });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Transform the event data to match the expected format
    const transformedEvent = {
      ...event.toObject(),
      attendees: event.attendees.map((attendee: any) => ({
        userId: attendee.userId,
        rsvpStatus: attendee.rsvpStatus
      }))
    };

    return NextResponse.json(transformedEvent);
  } catch (error: any) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.organizer.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).populate('organizer attendees');

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.organizer.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Event.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}