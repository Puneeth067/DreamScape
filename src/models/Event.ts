// src/models/Event.ts
import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  rsvpStatus: {
    type: String,
    enum: ['attending', 'maybe', 'declined'],
    default: 'attending'
  }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  datetime: { type: Date, required: true },
  location: { type: String },
  eventType: { 
    type: String, 
    enum: ['conference', 'workshop', 'meeting', 'social'],
    default: 'meeting'
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  attendees: [attendeeSchema],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

eventSchema.index({ datetime: -1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'attendees.userId': 1 });

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);