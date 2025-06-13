"use client"

import { useState } from "react"
import { CalendarView } from "@/components/calendar-view"
import { Event, EventStatus } from "@/app/page"
import { EventModal } from "@/components/event-modal"
import { Toast } from "@/components/toast"

const MonthPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCalendars, setSelectedCalendars] = useState({
    "esther-howard": true,
    task: true,
    bootcamp: true,
    birthday: true,
    reminders: true,
    college: true,
  })

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

  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const handleAddEvent = (date?: Date, time?: string) => {
    setSelectedDate(date || currentDate)
    setSelectedTime(time || null)
    setEditingEvent(null)
    setShowEventModal(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setSelectedDate(new Date(event.date))
    setSelectedTime(event.startTime)
    setShowEventModal(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setToast({ message: "Event deleted successfully!", type: "success" })
  }

  const handleUpdateStatus = (eventId: string, status: EventStatus) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status } : event)))
    setToast({ message: `Event marked as ${status}`, type: "success" })
  }

  const handleSaveEvent = (eventData: Omit<Event, "id">) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((event) => (event.id === editingEvent.id ? { ...eventData, id: editingEvent.id } : event))
      )
      setToast({ message: "Event updated successfully!", type: "success" })
    } else {
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
      }
      setEvents((prev) => [...prev, newEvent])
      setToast({ message: "Event created successfully!", type: "success" })
    }
    setShowEventModal(false)
    setEditingEvent(null)
  }

  const handleCloseModal = () => {
    setShowEventModal(false)
    setEditingEvent(null)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  return (
    <div className="flex-1">
      <CalendarView
        view="month"
        currentDate={currentDate}
        selectedCalendars={selectedCalendars}
        events={events}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onUpdateStatus={handleUpdateStatus}
      />

      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          editingEvent={editingEvent}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default MonthPage; 