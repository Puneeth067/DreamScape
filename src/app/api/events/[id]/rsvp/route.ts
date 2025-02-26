// src/app/api/events/[id]/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import mongoose from 'mongoose';

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
    
    // Validate status
    if (!['attending', 'maybe', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid RSVP status' },
        { status: 400 }
      );
    }

    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user is already an attendee
    const existingAttendeeIndex = event.attendees.findIndex(
      (attendee: { userId: mongoose.Types.ObjectId }) => attendee.userId.toString() === session.user.id
    );

    if (existingAttendeeIndex !== -1) {
      // Update existing RSVP status
      if (status === 'declined') {
        // Remove attendee if declining
        event.attendees.splice(existingAttendeeIndex, 1);
      } else {
        // Update RSVP status
        event.attendees[existingAttendeeIndex].rsvpStatus = status;
      }
    } else if (status !== 'declined') {
      // Add new attendee only if not declining
      event.attendees.push({
        userId: new mongoose.Types.ObjectId(session.user.id),
        rsvpStatus: status
      });
    }

    await event.save();

    // Fetch updated event with populated fields
    const updatedEvent = await Event.findById(params.id)
      .populate('organizer', 'firstName email')
      .populate('attendees.userId', 'firstName email');

    return NextResponse.json(updatedEvent);
  } catch (error: Error | unknown) {
    console.error('Error updating RSVP:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}