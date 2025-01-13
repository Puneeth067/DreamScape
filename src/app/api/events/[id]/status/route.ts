// src/app/api/events/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

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

    const { status } = await req.json();
    
    // Validate status
    if (!['draft', 'published', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Update the status
    event.status = status;
    await event.save();

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error updating event status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}