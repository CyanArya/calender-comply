"use client"

import { DayView } from "./day-view"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import type { Event, EventStatus } from "@/app/page"

interface CalendarViewProps {
  view: "day" | "week" | "month" | "table"
  currentDate: Date
  selectedCalendars: Record<string, boolean>
  events: Event[]
  onAddEvent: (date?: Date, time?: string) => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
  onUpdateStatus: (eventId: string, status: EventStatus) => void
}

export function CalendarView({
  view,
  currentDate,
  selectedCalendars,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onUpdateStatus,
}: CalendarViewProps) {
  switch (view) {
    case "day":
      return (
        <DayView
          currentDate={currentDate}
          selectedCalendars={selectedCalendars}
          events={events}
          onAddEvent={onAddEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onUpdateStatus={onUpdateStatus}
        />
      )
    case "week":
      return (
        <WeekView
          currentDate={currentDate}
          selectedCalendars={selectedCalendars}
          events={events}
          onAddEvent={onAddEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onUpdateStatus={onUpdateStatus}
        />
      )
    case "month":
      return (
        <MonthView
          currentDate={currentDate}
          selectedCalendars={selectedCalendars}
          events={events}
          onAddEvent={onAddEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onUpdateStatus={onUpdateStatus}
        />
      )
    default:
      return (
        <DayView
          currentDate={currentDate}
          selectedCalendars={selectedCalendars}
          events={events}
          onAddEvent={onAddEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onUpdateStatus={onUpdateStatus}
        />
      )
  }
}
