"use client"

import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Event, EventStatus } from "@/app/page"

interface WeekViewProps {
  currentDate: Date
  selectedCalendars: Record<string, boolean>
  events: Event[]
  onAddEvent: (date?: Date, time?: string) => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
  onUpdateStatus: (eventId: string, status: EventStatus) => void
}

export function WeekView({
  currentDate,
  selectedCalendars,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onUpdateStatus,
}: WeekViewProps) {
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push(date)
    }
    return days
  }

  const weekDays = getWeekDays()
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i
    const ampm = i < 12 ? "AM" : "PM"
    return {
      display: `${hour.toString().padStart(2, "0")} ${ampm}`,
      value: i,
    }
  })

  const getEventsForDayAndHour = (date: Date, hour: number) => {
    const dateString = date.toISOString().split("T")[0]
    return events.filter((event) => {
      if (event.date !== dateString) return false
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

  return (
    <div className="flex-1 bg-white overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Week header */}
          <div className="grid grid-cols-8 gap-2 sm:gap-4 mb-6">
            <div className="w-12 sm:w-20"></div>
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  {day.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                </div>
                <div
                  className={`text-sm sm:text-lg font-semibold ${
                    day.toDateString() === new Date().toDateString()
                      ? "bg-blue-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mx-auto"
                      : ""
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Week grid */}
          <div className="space-y-0">
            {hours.map((hour, hourIndex) => (
              <div
                key={hour.display}
                className="flex border-b border-gray-100 group hover:bg-gray-50 transition-colors"
                style={{ minHeight: "60px" }}
              >
                <div className="w-12 sm:w-20 text-xs sm:text-sm text-gray-500 py-2 pr-2 sm:pr-4 text-right flex-shrink-0">
                  {hour.display}
                </div>
                <div className="flex-1 grid grid-cols-7 gap-2 sm:gap-4 min-w-0">
                  {weekDays.map((day, dayIndex) => {
                    const dayEvents = getEventsForDayAndHour(day, hour.value)

                    return (
                      <div key={dayIndex} className="border-r border-gray-100 last:border-r-0 relative group/cell">
                        {/* Add event button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-5 w-5 sm:h-6 sm:w-6 p-0 opacity-0 group-hover/cell:opacity-100 transition-opacity z-10"
                          onClick={() => onAddEvent(day, `${hour.value.toString().padStart(2, "0")}:00`)}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>

                        {/* Events */}
                        {dayEvents.map((event, eventIndex) => (
                          <div
                            key={event.id}
                            className={`absolute inset-x-1 top-1 bottom-1 ${event.color} p-1 sm:p-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow group/event`}
                            style={{ zIndex: 5 }}
                            onClick={() => onEditEvent(event)}
                          >
                            <div className="flex items-start justify-between h-full">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="text-gray-600 text-xs hidden sm:block">
                                  {formatTime(event.startTime)}
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover/event:opacity-100 transition-opacity ml-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onEditEvent(event)
                                  }}
                                >
                                  <Edit className="w-2 h-2" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteEvent(event.id)
                                  }}
                                >
                                  <Trash2 className="w-2 h-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
