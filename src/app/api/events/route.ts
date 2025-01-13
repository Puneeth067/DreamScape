// src/app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const organizerId = searchParams.get('organizerId');

    const query: { status?: string; organizer?: string } = {};
    if (status) query.status = status;
    if (organizerId) query.organizer = organizerId;

    const events = await Event.find(query)
      .populate('organizer', 'firstName email')
      .populate('attendees.userId', 'firstName email')
      .sort({ datetime: -1 });

    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { title, description, datetime, location, eventType } = data;

    const event = new Event({
      title,
      description,
      datetime: new Date(datetime),
      location,
      eventType,
      organizer: session.user.id,
      attendees: [{
        userId: session.user.id,
        rsvpStatus: 'attending'
      }],
      status: 'published'
    });

    await event.save();
    
    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'firstName email')
      .populate('attendees.userId', 'firstName email');

    return NextResponse.json(populatedEvent, { status: 201 });
  } catch (error: unknown) {
    console.error('Error fetching events:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}