"use client"

import { useState, useEffect } from "react"
import { CalendarSidebar } from "@/components/calendar-sidebar"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarView } from "@/components/calendar-view"
import { SettingsView } from "@/components/settings-view"
import { EventModal } from "@/components/event-modal"
import { Toast } from "@/components/toast"
import { TableView } from "@/components/table-view"
import type { Event, EventStatus } from "../types/event"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenuItem, DropdownMenuContent, DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus } from "lucide-react"

interface UserInfo {
  name: string
  email: string
}

interface Calendar {
  id: string;
  name: string;
  color: string;
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0)

  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [selectedCalendars, setSelectedCalendars] = useState<Record<string, boolean>>({})
  const [newCalendarName, setNewCalendarName] = useState("")
  const [newCalendarColor, setNewCalendarColor] = useState("#60A5FA")

  const [currentView, setCurrentView] = useState<"day" | "week" | "month" | "table" | "settings">("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [eventModalDate, setEventModalDate] = useState<Date | null>(null)
  const [eventModalTime, setEventModalTime] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setToast({ message: "Failed to load events.", type: "error" });
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch('/api/calendars');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Calendar[] = await response.json();
        setCalendars(data);
        const initialSelected = data.reduce((acc, calendar) => {
          acc[calendar.id] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setSelectedCalendars(initialSelected);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
        setToast({ message: "Failed to load calendars.", type: "error" });
      }
    };
    fetchCalendars();
  }, []);

  const handleAddEvent = async (eventData: Omit<Event, "id">) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newEvent: Event = await response.json();
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setToast({ message: "Event created successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to add event:", error);
      setToast({ message: "Failed to create event.", type: "error" });
    }
    setShowEventModal(false)
    setSelectedEvent(null)
    setEventModalDate(null)
    setEventModalTime(null)
    setUnreadNotifications((prev) => prev + 1)
  }

  const handleUpdateEvent = async (eventData: Omit<Event, "id">) => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...eventData, id: selectedEvent.id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedEvent: Event = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
      );
      setToast({ message: "Event updated successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to update event:", error);
      setToast({ message: "Failed to update event.", type: "error" });
    }
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      setToast({ message: "Event deleted successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to delete event:", error);
      setToast({ message: "Failed to delete event.", type: "error" });
    }
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDateClick = (date: Date) => {
    setEventModalDate(date)
    setShowEventModal(true)
  }

  const handleTimeClick = (time: string) => {
    setEventModalTime(time)
    setShowEventModal(true)
  }

  const handleUpdateStatus = (eventId: string, status: EventStatus) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === eventId ? { ...event, status } : event))
    )
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value

    if (!name.trim() || !email.trim()) {
      setToast({ message: "Please enter both name and email", type: "error" })
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setToast({ message: "Please enter a valid email address", type: "error" })
      return
    }

    setUserInfo({ name, email })
  }

  const handleAddCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalendarName.trim() || !newCalendarColor) {
      setToast({ message: "Calendar name and color are required.", type: "error" });
      return;
    }

    try {
      const response = await fetch('/api/calendars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCalendarName, color: newCalendarColor }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newCalendar: Calendar = await response.json();
      setCalendars((prev) => [...prev, newCalendar]);
      setSelectedCalendars((prev) => ({ ...prev, [newCalendar.id]: true }));
      setNewCalendarName("");
      setToast({ message: "Calendar created successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to add calendar:", error);
      setToast({ message: "Failed to create calendar.", type: "error" });
    }
  };

  const filteredEvents = events
    .filter((event) => {
      return selectedCalendars[event.calendarId]
    })

  if (!userInfo) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Calendar App</h1>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Continue
            </Button>
          </form>
        </div>
      </div>
    )
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
        userName={userInfo.name}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <CalendarHeader
          currentView={currentView}
          currentDate={currentDate}
          onViewChange={setCurrentView}
          onDateChange={setCurrentDate}
          onAddEvent={() => setShowEventModal(true)}
          userName={userInfo.name}
          userEmail={userInfo.email}
          unreadNotifications={unreadNotifications}
          onClearNotifications={() => setUnreadNotifications(0)}
          onSetUserInfo={setUserInfo}
        />
        {currentView === "table" ? (
          <TableView
            events={filteredEvents}
            onEditEvent={handleEventClick}
            onDeleteEvent={handleDeleteEvent}
            onUpdateStatus={handleUpdateStatus}
            onSendEmails={() => setToast({ message: "Emails sent!", type: "success" })}
          />
        ) : currentView === "settings" ? (
          <SettingsView onBack={() => setCurrentView("month")} />
        ) : (
          <CalendarView
            view={currentView}
            currentDate={currentDate}
            selectedCalendars={selectedCalendars}
            events={filteredEvents}
            onAddEvent={(date, time) => {
              if (date) setEventModalDate(date);
              if (time) setEventModalTime(time);
              setShowEventModal(true);
            }}
            onEditEvent={handleEventClick}
            onDeleteEvent={handleDeleteEvent}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>

      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false)
            setSelectedEvent(null)
            setEventModalDate(null)
            setEventModalTime(null)
          }}
          onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
          selectedDate={eventModalDate}
          selectedTime={eventModalTime}
          editingEvent={selectedEvent}
          setToast={setToast}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">My Calendars</h3>
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <div key={calendar.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={calendar.id}
                checked={selectedCalendars[calendar.id]}
                onChange={() =>
                  setSelectedCalendars((prev) => ({
                    ...prev,
                    [calendar.id]: !prev[calendar.id],
                  }))
                }
                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                style={{ accentColor: calendar.color }}
              />
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: calendar.color }}
              ></span>
              <Label htmlFor={calendar.id} className="text-sm text-gray-700">
                {calendar.name}
              </Label>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
          <h4 className="text-md font-semibold text-gray-800">Add New Calendar</h4>
          <form onSubmit={handleAddCalendar} className="space-y-3">
            <div>
              <Label htmlFor="new-calendar-name" className="sr-only">Calendar Name</Label>
              <Input
                id="new-calendar-name"
                placeholder="Calendar Name"
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="new-calendar-color" className="text-sm text-gray-700">Color:</Label>
              <input
                type="color"
                id="new-calendar-color"
                value={newCalendarColor}
                onChange={(e) => setNewCalendarColor(e.target.value)}
                className="w-8 h-8 rounded-full border-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">{newCalendarColor}</span>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Calendar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
