"use client"

import { useState } from "react"
import { CalendarSidebar } from "@/components/calendar-sidebar"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarView } from "@/components/calendar-view"
import { SettingsView } from "@/components/settings-view"
import { EventModal } from "@/components/event-modal"
import { Toast } from "@/components/toast"
import { TableView } from "@/components/table-view"
import { Button } from "@/components/ui/button"
import { useSession, signIn, signOut } from "next-auth/react"

export type EventStatus = "Not Started" | "In Progress" | "Complete" | "Overdue"
export type EventReminder = {
  id: string
  time: number // minutes before event
  type: "notification" | "email"
}

export interface EventFile {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export interface Event {
  id: string
  title: string
  description?: string
  date: string // YYYY-MM-DD format
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  color: string
  type: "meeting" | "task" | "reminder" | "lunch" | "standup" | "design" | "prototype" | "reunion" | "breakfast"
  attendees?: { name: string; email: string }[]
  reminders?: EventReminder[]
  notes?: string
  files?: EventFile[]
  status: EventStatus
}

export default function CalendarApp() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const { data: session, status } = useSession()

  const [selectedCalendars, setSelectedCalendars] = useState({
    "esther-howard": true,
    task: true,
    bootcamp: true,
    birthday: true,
    reminders: true,
    college: true,
  })

  const [currentView, setCurrentView] = useState<"day" | "week" | "month" | "table" | "reports" | "settings" | "contacts">("month")
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedModalDate, setSelectedModalDate] = useState<Date | null>(null)
  const [selectedModalTime, setSelectedModalTime] = useState<string | null>(null)

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Design Critique",
      description:
        "All members are required to attend the design critique event, to develop the potential of all members, there will be...",
      date: "2023-08-09",
      startTime: "09:00",
      endTime: "11:00",
      color: "bg-green-100 border-green-400",
      type: "meeting",
      attendees: [
        { name: "John Doe", email: "john.doe@example.com" },
        { name: "Jane Smith", email: "jane.smith@example.com" },
      ],
      reminders: [
        { id: "r1", time: 30, type: "notification" },
        { id: "r2", time: 60, type: "email" },
      ],
      notes: "Prepare design mockups for review",
      files: [
        {
          id: "f1",
          name: "design-mockup.pdf",
          type: "application/pdf",
          url: "/files/design-mockup.pdf",
          size: 2500000,
        },
      ],
      status: "In Progress",
    },
    {
      id: "2",
      title: "P2P Zoom",
      description:
        "This meeting will discuss how design thinking works in solving user problems, and it is expected that all participants...",
      date: "2023-08-09",
      startTime: "13:00",
      endTime: "15:00",
      color: "bg-orange-100 border-orange-400",
      type: "meeting",
      attendees: [
        { name: "Alice Johnson", email: "alice.johnson@example.com" },
        { name: "Bob Wilson", email: "bob.wilson@example.com" },
      ],
      reminders: [{ id: "r3", time: 15, type: "notification" }],
      notes: "Prepare agenda and discussion points",
      status: "Not Started",
    },
    {
      id: "3",
      title: "Project Deadline",
      description: "Final submission for the Q3 project",
      date: "2023-08-10",
      startTime: "17:00",
      endTime: "18:00",
      color: "bg-red-100 border-red-400",
      type: "task",
      attendees: [
        { name: "Team Lead", email: "team.lead@example.com" },
        { name: "Project Manager", email: "pm@example.com" },
      ],
      reminders: [
        { id: "r4", time: 60, type: "notification" },
        { id: "r5", time: 1440, type: "email" }, // 1 day before
      ],
      notes: "Ensure all deliverables are ready",
      files: [
        {
          id: "f2",
          name: "project-requirements.docx",
          type: "application/docx",
          url: "/files/project-requirements.docx",
          size: 1500000,
        },
      ],
      status: "Overdue",
    },
  ])

  const handleAddEvent = (event: Omit<Event, "id">) => {
    console.log("Adding event:", event);
    setEvents((prev) => {
      const newEvents = [...prev, { ...event, id: String(prev.length + 1) }];
      console.log("Events after adding:", newEvents);
      return newEvents;
    })
    setShowEventModal(false)
  }

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    )
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const onEventClick = (event: Event) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const onUpdateStatus = (eventId: string, status: EventStatus) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, status } : event))
    )
  }

  const filteredEvents = events // Simplified for debugging. Original logic was: events.filter((event) => {
  //   const calendarKey = Object.keys(selectedCalendars).find(
  //     (key) => selectedCalendars[key as keyof typeof selectedCalendars]
  //   )
  //   return calendarKey ? event.type === calendarKey : true
  // })

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Sign In</h1>
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="w-full p-2 border rounded mb-4"
          />
          <Button onClick={() => signIn("credentials", { username: (document.getElementById("username") as HTMLInputElement).value, password: (document.getElementById("password") as HTMLInputElement).value })} className="w-full bg-blue-500 hover:bg-blue-600">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CalendarSidebar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        selectedCalendars={selectedCalendars}
        onCalendarToggle={(calendars) => setSelectedCalendars(calendars as typeof selectedCalendars)}
        onSettingsClick={() => setCurrentView("settings")}
        showSettings={currentView === "settings"}
        userName={session.user?.name || ""}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <CalendarHeader
          currentView={currentView}
          currentDate={currentDate}
          onViewChange={setCurrentView}
          onDateChange={setCurrentDate}
          onAddEvent={() => {
            setShowEventModal(true);
            setSelectedEvent(null);
          }}
          userName={session.user?.name || ""}
          userEmail={session.user?.email || ""}
        />
        {currentView !== "settings" && currentView !== "reports" && currentView !== "table" && (
          <CalendarView
            view={currentView as "day" | "week" | "month"}
            currentDate={currentDate}
            selectedCalendars={selectedCalendars}
            events={filteredEvents}
            onAddEvent={(date?: Date, time?: string) => {
              setShowEventModal(true);
              setSelectedModalDate(date || null);
              setSelectedModalTime(time || null);
              setSelectedEvent(null);
            }}
            onEditEvent={onEventClick}
            onDeleteEvent={handleDeleteEvent}
            onUpdateStatus={onUpdateStatus}
          />
        )}
        {currentView === "table" && (
          <TableView
            events={filteredEvents}
            onEditEvent={onEventClick}
            onDeleteEvent={handleDeleteEvent}
            onUpdateStatus={onUpdateStatus}
            onSendEmails={() => setToast({ message: "Emails sent!", type: "success" })} // Dummy function
          />
        )}
        {currentView === "reports" && (
          <h1 className="text-2xl font-bold m-4">Reports View</h1>
        )}
        {currentView === "settings" && (
          <SettingsView onBack={() => setCurrentView("month")} />
        )}
      </div>

      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false)
            setSelectedEvent(null)
            setSelectedModalDate(null);
            setSelectedModalTime(null);
          }}
          onSave={handleAddEvent}
          selectedDate={selectedModalDate}
          selectedTime={selectedModalTime}
          editingEvent={selectedEvent}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
