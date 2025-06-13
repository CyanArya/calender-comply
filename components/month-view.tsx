"use client"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Event, EventStatus } from "@/app/page"

interface MonthViewProps {
  currentDate: Date
  selectedCalendars: Record<string, boolean>
  events: Event[]
  onAddEvent: (date?: Date, time?: string) => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
  onUpdateStatus: (eventId: string, status: EventStatus) => void
}

export function MonthView({
  currentDate,
  selectedCalendars,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onUpdateStatus,
}: MonthViewProps) {
  console.log("MonthView received events:", events);
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Previous month days
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0)
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonth.getDate() - i,
      isCurrentMonth: false,
      date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i),
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
    })
  }

  // Next month days to fill the grid
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day),
    })
  }

  const getEventsForDay = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateString)
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
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-px mb-4">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div key={day} className="p-2 sm:p-4 text-center text-xs sm:text-sm font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((dayInfo, index) => {
              const dayEvents = dayInfo.isCurrentMonth ? getEventsForDay(dayInfo.date) : []
              const isToday =
                dayInfo.isCurrentMonth &&
                dayInfo.day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()

              return (
                <div
                  key={index}
                  className={`bg-white p-1 sm:p-2 min-h-[100px] sm:min-h-[120px] group hover:bg-gray-50 transition-colors ${
                    !dayInfo.isCurrentMonth ? "text-gray-400" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`text-xs sm:text-sm font-medium ${
                        isToday
                          ? "bg-blue-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
                          : ""
                      }`}
                    >
                      {dayInfo.day}
                    </div>
                    {dayInfo.isCurrentMonth && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 sm:h-6 sm:w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onAddEvent(dayInfo.date)}
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded truncate cursor-pointer hover:bg-gray-100 group/event flex items-center justify-between"
                        onClick={() => onEditEvent(event)}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{formatTime(event.startTime)}</span>
                          <span className="ml-1 text-gray-700 truncate">{event.title}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover/event:opacity-100 transition-opacity">
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
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 p-1">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
