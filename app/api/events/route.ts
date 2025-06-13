import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Event } from '@/types/event';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        attendees: true,
        reminders: true,
        files: true,
      },
    });
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch events', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const eventData: Event = await request.json();
    console.log('Received event data for creation:', JSON.stringify(eventData, null, 2));

    // Validate required fields
    if (!eventData.title || !eventData.date || !eventData.startTime || !eventData.endTime) {
      return NextResponse.json(
        { message: 'Missing required fields', required: ['title', 'date', 'startTime', 'endTime'] },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description || '',
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        color: eventData.color || '#3788d8',
        type: eventData.type || 'default',
        status: eventData.status || 'pending',
        notes: eventData.notes || '',
        attendees: {
          create: eventData.attendees?.map(attendee => ({
            name: attendee.name,
            email: attendee.email,
          })) || [],
        },
        reminders: {
          create: eventData.reminders?.map(reminder => ({
            time: reminder.time,
            type: reminder.type,
          })) || [],
        },
        files: {
          create: eventData.files?.map(file => ({
            name: file.name,
            type: file.type,
            url: file.url,
            size: file.size,
          })) || [],
        },
      },
      include: {
        attendees: true,
        reminders: true,
        files: true,
      },
    });

    console.log('Successfully created event:', JSON.stringify(newEvent, null, 2));
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create event', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
} 