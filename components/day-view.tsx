"use client"

import { Users, Video, Trash2, Edit, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Event, EventStatus } from "@/app/page"

interface DayViewProps {
  currentDate: Date
  selectedCalendars: Record<string, boolean>
  events: Event[]
  onAddEvent: (date?: Date, time?: string) => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
  onUpdateStatus: (eventId: string, status: EventStatus) => void
}

export function DayView({
  currentDate,
  selectedCalendars,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onUpdateStatus,
}: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i
    const ampm = i < 12 ? "AM" : "PM"
    return {
      display: `${hour.toString().padStart(2, "0")} ${ampm}`,
      value: i.toString().padStart(2, "0"),
    }
  })

  const formatDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getDayEvents = () => {
    const dateString = formatDateString(currentDate)
    return events.filter((event) => event.date === dateString)
  }

  const getEventsForHour = (hour: number) => {
    const dayEvents = getDayEvents()
    return dayEvents.filter((event) => {
      const eventHour = Number.parseInt(event.startTime.split(":")[0])
      return eventHour === hour
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const calculateEventHeight = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const durationMinutes = endMinutes - startMinutes
    return Math.max(durationMinutes, 30) // Minimum 30 minutes height
  }

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case "In Progress":
        return <Clock className="w-3 h-3 text-blue-500" />
      case "Overdue":
        return <AlertCircle className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex-1 bg-white overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">
                {currentDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()},{" "}
                {currentDate.getDate().toString().padStart(2, "0")}
              </h2>
              <div className="text-sm text-gray-500 mt-1">GMT+07</div>
            </div>
            <Button size="sm" onClick={() => onAddEvent(currentDate)} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          <div className="relative">
            <div className="space-y-0">
              {hours.map((hour, index) => {
                const hourEvents = getEventsForHour(index)

                return (
                  <div
                    key={hour.display}
                    className="flex border-b border-gray-100 relative group hover:bg-gray-50 transition-colors"
                    style={{ minHeight: "60px" }}
                  >
                    <div className="w-16 sm:w-20 text-sm text-gray-500 py-2 pr-2 sm:pr-4 text-right flex-shrink-0">
                      {hour.display}
                    </div>
                    <div className="flex-1 relative min-w-0">
                      {/* Add event button on hover */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={() => onAddEvent(currentDate, hour.value + ":00")}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>

                      {/* Events */}
                      {hourEvents.map((event, eventIndex) => {
                        const eventHeight = calculateEventHeight(event.startTime, event.endTime)

                        return (
                          <div
                            key={event.id}
                            className={`absolute left-2 sm:left-4 right-2 sm:right-4 p-2 sm:p-3 rounded-lg border-l-4 ${event.color} cursor-pointer hover:shadow-md transition-shadow group/event`}
                            style={{
                              height: `${Math.min(eventHeight, 120)}px`,
                              top: `${eventIndex * 4}px`,
                              zIndex: 5,
                            }}
                            onClick={() => onEditEvent(event)}
                          >
                            <div className="flex items-start justify-between h-full">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {event.type === "meeting" && (
                                    <Video className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                  )}
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(event.status)}
                                    <h3 className="font-medium text-xs sm:text-sm truncate">{event.title}</h3>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600 mb-1">
                                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </div>
                                {event.description && (
                                  <p className="text-xs text-gray-600 line-clamp-2 hidden sm:block">
                                    {event.description}
                                  </p>
                                )}
                              </div>

                              {/* Event actions */}
                              <div className="flex gap-1 opacity-0 group-hover/event:opacity-100 transition-opacity ml-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onEditEvent(event)
                                      }}
                                    >
                                      Edit Event
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onUpdateStatus(event.id, "Not Started")
                                      }}
                                    >
                                      Mark as Not Started
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onUpdateStatus(event.id, "In Progress")
                                      }}
                                    >
                                      Mark as In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onUpdateStatus(event.id, "Complete")
                                      }}
                                    >
                                      Mark as Complete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onUpdateStatus(event.id, "Overdue")
                                      }}
                                    >
                                      Mark as Overdue
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteEvent(event.id)
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                <Users className="w-3 h-3 text-gray-400" />
                                <div className="flex -space-x-1">
                                  {event.attendees.slice(0, 3).map((attendee, i) => (
                                    <div
                                      key={i}
                                      className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 rounded-full border border-white flex items-center justify-center text-xs font-medium"
                                      title={`${attendee.name} (${attendee.email})`}
                                    >
                                      {attendee.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                  ))}
                                  {event.attendees.length > 3 && (
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded-full border border-white flex items-center justify-center text-xs">
                                      +{event.attendees.length - 3}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
