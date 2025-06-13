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
    console.error('Full error object (GET):', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ message: 'Failed to fetch events', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const eventData: Event = await request.json();
    console.log('Received event data for creation:', eventData);

    const newEvent = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        color: eventData.color,
        type: eventData.type,
        status: eventData.status,
        notes: eventData.notes,
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

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ message: 'Failed to create event', error: error.message }, { status: 500 });
  }
} 