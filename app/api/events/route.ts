import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Event } from '@/types/event';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    const events = await prisma.event.findMany({
      include: {
        attendees: true,
        reminders: true,
        files: true,
      },
    });
    
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error in GET /api/events:', error);
    
    // Check if it's a database connection error
    if (error.code === 'P1001') {
      return NextResponse.json(
        { message: 'Database connection failed. Please check your database configuration.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Failed to fetch events', 
        error: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    // Test database connection
    await prisma.$connect();
    
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
    console.error('Error in POST /api/events:', error);
    
    // Check if it's a database connection error
    if (error.code === 'P1001') {
      return NextResponse.json(
        { message: 'Database connection failed. Please check your database configuration.' },
        { status: 503 }
      );
    }
    
    // Check if it's a unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'A record with this data already exists.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Failed to create event', 
        error: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 