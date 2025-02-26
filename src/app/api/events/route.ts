// src/app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

import mongoose from 'mongoose';

// Function to validate and convert to ObjectId
function toObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
}

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

    const query: { status?: string; organizer?: mongoose.Types.ObjectId | string } = {};

    if (status) query.status = status;
    if (organizerId) query.organizer = toObjectId(organizerId); // ✅ Convert if valid

    const events = await Event.find(query)
      .populate('organizer', 'firstName email')
      .populate('attendees.userId', 'firstName email')
      .sort({ datetime: -1 });

    return NextResponse.json(events);
  } catch (error: unknown) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
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
      organizer: toObjectId(session.user.id), // ✅ Convert if valid
      attendees: [{
        userId: toObjectId(session.user.id), // ✅ Convert if valid
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
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}