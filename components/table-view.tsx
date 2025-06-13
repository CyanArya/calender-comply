"use client"

import { useState } from "react"
import { Edit, Trash2, Mail, CheckCircle, Clock, AlertCircle, FileText, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Event, EventStatus } from "@/app/page"

interface TableViewProps {
  events: Event[]
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
  onUpdateStatus: (eventId: string, status: EventStatus) => void
  onSendEmails: (eventId: string) => void
}

export function TableView({ events, onEditEvent, onDeleteEvent, onUpdateStatus, onSendEmails }: TableViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Event>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof Event) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "Complete":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Complete</Badge>
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Overdue</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Not Started</Badge>
    }
  }

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "Overdue":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const filteredAndSortedEvents = events
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.attendees?.some(
          (attendee) =>
            attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "date") {
        aValue = new Date(a.date + "T" + a.startTime).getTime()
        bValue = new Date(b.date + "T" + b.startTime).getTime()
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      } else {
        aValue = String(aValue || "").toLowerCase()
        bValue = String(bValue || "").toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  return (
    <div className="flex-1 bg-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">All Events</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredAndSortedEvents.length} of {events.length} events
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Event Title
                      {sortField === "title" && (
                        <span className="text-blue-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date & Time
                      {sortField === "date" && (
                        <span className="text-blue-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === "status" && (
                        <span className="text-blue-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    People Involved
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reminders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Files
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2">
                        {getStatusIcon(event.status)}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{event.title}</div>
                          {event.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-3 h-3 rounded-full ${event.color?.split(" ")[0] || "bg-gray-400"}`} />
                            <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(event.date)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="cursor-pointer">{getStatusBadge(event.status)}</div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => onUpdateStatus(event.id, "Not Started")}>
                            Mark as Not Started
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(event.id, "In Progress")}>
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(event.id, "Complete")}>
                            Mark as Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(event.id, "Overdue")}>
                            Mark as Overdue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-4 py-4">
                      {event.attendees && event.attendees.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div className="flex -space-x-1">
                            {event.attendees.slice(0, 3).map((attendee, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 bg-gray-300 rounded-full border border-white flex items-center justify-center text-xs font-medium"
                                title={`${attendee.name} (${attendee.email})`}
                              >
                                {attendee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            ))}
                            {event.attendees.length > 3 && (
                              <div className="w-6 h-6 bg-gray-200 rounded-full border border-white flex items-center justify-center text-xs">
                                +{event.attendees.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {event.attendees.length} attendee{event.attendees.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No attendees</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {event.reminders && event.reminders.length > 0 ? (
                        <div className="text-sm text-gray-900">
                          {event.reminders.length} reminder{event.reminders.length !== 1 ? "s" : ""}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No reminders</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {event.files && event.files.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {event.files.length} file{event.files.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No files</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {event.attendees && event.attendees.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onSendEmails(event.id)}
                            title="Send emails to attendees"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEditEvent(event)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => onDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAndSortedEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first event to get started"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
