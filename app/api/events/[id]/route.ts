import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Event } from '@/types/event';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { attendees, reminders, files, ...eventData }: Event = await request.json();

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        attendees: {
          deleteMany: {},
          create: attendees?.map(a => ({ name: a.name, email: a.email })) || [],
        },
        reminders: {
          deleteMany: {},
          create: reminders?.map(r => ({ time: r.time, type: r.type })) || [],
        },
        files: {
          deleteMany: {},
          create: files?.map(f => ({ name: f.name, type: f.type, url: f.url, size: f.size })) || [],
        },
      },
      include: {
        attendees: true,
        reminders: true,
        files: true,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ message: 'Failed to update event', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ message: 'Failed to delete event', error: error.message }, { status: 500 });
  }
} 