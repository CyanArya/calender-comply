import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const calendars = await prisma.calendar.findMany();
    return NextResponse.json(calendars);
  } catch (error: any) {
    console.error('Error fetching calendars:', error);
    return NextResponse.json({ message: 'Failed to fetch calendars', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, color } = await request.json();
    if (!name || !color) {
      return NextResponse.json({ message: 'Name and color are required' }, { status: 400 });
    }
    const newCalendar = await prisma.calendar.create({
      data: { name, color },
    });
    return NextResponse.json(newCalendar, { status: 201 });
  } catch (error: any) {
    console.error('Error creating calendar:', error);
    return NextResponse.json({ message: 'Failed to create calendar', error: error.message }, { status: 500 });
  }
} 