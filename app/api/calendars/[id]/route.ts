import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { name, color } = await request.json();

    const updatedCalendar = await prisma.calendar.update({
      where: { id },
      data: { name, color },
    });

    return NextResponse.json(updatedCalendar);
  } catch (error: any) {
    console.error('Error updating calendar:', error);
    return NextResponse.json({ message: 'Failed to update calendar', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    await prisma.calendar.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Calendar deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting calendar:', error);
    return NextResponse.json({ message: 'Failed to delete calendar', error: error.message }, { status: 500 });
  }
} 