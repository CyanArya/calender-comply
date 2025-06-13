"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, Plus, Trash2, Upload, Bell, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Event, EventReminder, EventFile, EventStatus } from "@/app/page"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<Event, "id">) => void
  selectedDate: Date | null
  selectedTime: string | null
  editingEvent: Event | null
}

export function EventModal({ isOpen, onClose, onSave, selectedDate, selectedTime, editingEvent }: EventModalProps) {
  const [formData, setFormData] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    color: "bg-blue-100 border-blue-400",
    type: "meeting",
    attendees: [],
    reminders: [],
    notes: "",
    files: [],
    status: "Not Started",
  })

  const [activeTab, setActiveTab] = useState("details")
  const [newAttendee, setNewAttendee] = useState({ name: "", email: "" })
  const [newReminder, setNewReminder] = useState<{ time: number; type: "notification" | "email" }>({
    time: 30,
    type: "notification",
  })
  const [fileUpload, setFileUpload] = useState<File | null>(null)

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description || "",
        date: editingEvent.date,
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        color: editingEvent.color,
        type: editingEvent.type,
        attendees: editingEvent.attendees || [],
        reminders: editingEvent.reminders || [],
        notes: editingEvent.notes || "",
        files: editingEvent.files || [],
        status: editingEvent.status,
      })
    } else if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0]
      const startTime = selectedTime || "09:00"
      const [hours, minutes] = startTime.split(":")
      const endHour = (Number.parseInt(hours) + 1).toString().padStart(2, "0")
      const endTime = `${endHour}:${minutes}`

      setFormData({
        title: "",
        description: "",
        date: dateString,
        startTime,
        endTime,
        color: "bg-blue-100 border-blue-400",
        type: "meeting",
        attendees: [],
        reminders: [],
        notes: "",
        files: [],
        status: "Not Started",
      })
    }
  }, [editingEvent, selectedDate, selectedTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.date || !formData.startTime || !formData.endTime) {
      return
    }

    onSave(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      color: "bg-blue-100 border-blue-400",
      type: "meeting",
      attendees: [],
      reminders: [],
      notes: "",
      files: [],
      status: "Not Started",
    })
    setNewAttendee({ name: "", email: "" })
    setNewReminder({ time: 30, type: "notification" })
    setFileUpload(null)
    setActiveTab("details")
    onClose()
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;

  const addAttendee = () => {
    if (newAttendee.name.trim() && newAttendee.email.trim() && emailRegex.test(newAttendee.email)) {
      setFormData((prev) => ({
        ...prev,
        attendees: [...(prev.attendees || []), { ...newAttendee }],
      }))
      setNewAttendee({ name: "", email: "" })
    } else {
      console.warn("Cannot add attendee: Name and valid email are required.");
    }
  }

  const removeAttendee = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      attendees: (prev.attendees || []).filter((a) => a.email !== email),
    }))
  }

  const addReminder = () => {
    const reminder: EventReminder = {
      id: Date.now().toString(),
      ...newReminder,
    }
    setFormData((prev) => ({
      ...prev,
      reminders: [...(prev.reminders || []), reminder],
    }))
    setNewReminder({ time: 30, type: "notification" })
  }

  const removeReminder = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      reminders: (prev.reminders || []).filter((r) => r.id !== id),
    }))
  }

  const handleFileUpload = () => {
    if (fileUpload) {
      const newFile: EventFile = {
        id: Date.now().toString(),
        name: fileUpload.name,
        type: fileUpload.type,
        url: URL.createObjectURL(fileUpload),
        size: fileUpload.size,
      }
      setFormData((prev) => ({
        ...prev,
        files: [...(prev.files || []), newFile],
      }))
      setFileUpload(null)
    }
  }

  const removeFile = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      files: (prev.files || []).filter((f) => f.id !== id),
    }))
  }

  const colorOptions = [
    { value: "bg-blue-100 border-blue-400", label: "Blue", color: "bg-blue-400" },
    { value: "bg-green-100 border-green-400", label: "Green", color: "bg-green-400" },
    { value: "bg-orange-100 border-orange-400", label: "Orange", color: "bg-orange-400" },
    { value: "bg-red-100 border-red-400", label: "Red", color: "bg-red-400" },
    { value: "bg-purple-100 border-purple-400", label: "Purple", color: "bg-purple-400" },
    { value: "bg-yellow-100 border-yellow-400", label: "Yellow", color: "bg-yellow-400" },
  ]

  const reminderTimeOptions = [
    { value: 5, label: "5 minutes before" },
    { value: 15, label: "15 minutes before" },
    { value: 30, label: "30 minutes before" },
    { value: 60, label: "1 hour before" },
    { value: 120, label: "2 hours before" },
    { value: 1440, label: "1 day before" },
    { value: 2880, label: "2 days before" },
    { value: 10080, label: "1 week before" },
  ]

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  if (!isOpen) return null

  const nameTrimmed = newAttendee.name.trim();
  const emailTrimmed = newAttendee.email.trim();
  const emailRegexTest = emailRegex.test(newAttendee.email);
  const isDisabled = !nameTrimmed || !emailTrimmed || !emailRegexTest;

  console.log('Name trimmed:', nameTrimmed, 'Email trimmed:', emailTrimmed, 'Email regex test:', emailRegexTest, 'Is disabled:', isDisabled);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{editingEvent ? "Edit Event" : "Create New Event"}</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-gray-200">
            <TabsList className="h-auto p-0">
              <TabsTrigger
                value="details"
                className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="people"
                className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                People
              </TabsTrigger>
              <TabsTrigger
                value="reminders"
                className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Reminders
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Notes & Files
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <TabsContent value="details" className="m-0 space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Event Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter event description"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">
                      Date *
                    </Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="startTime" className="text-sm font-medium">
                      Start Time *
                    </Label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-sm font-medium">
                      End Time *
                    </Label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Type, Color and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">
                      Event Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Event["type"]) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="standup">Standup</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="prototype">Prototype</SelectItem>
                        <SelectItem value="reunion">Reunion</SelectItem>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color" className="text-sm font-medium">
                      Color
                    </Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: EventStatus) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="people" className="m-0 space-y-6">
                {/* Attendees */}
                <div>
                  <Label className="text-sm font-medium">People Involved</Label>
                  <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="attendeeName" className="text-xs text-gray-500">
                          Name
                        </Label>
                        <Input
                          id="attendeeName"
                          value={newAttendee.name}
                          onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                          placeholder="Enter name"
                          className="mt-1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="attendeeEmail" className="text-xs text-gray-500">
                          Email
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="attendeeEmail"
                            type="email"
                            value={newAttendee.email}
                            onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                            placeholder="Enter email address"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAttendee())}
                          />
                          <Button
                            type="button"
                            onClick={addAttendee}
                            disabled={isDisabled}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    {formData.attendees && formData.attendees.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {formData.attendees.map((attendee) => (
                              <tr key={attendee.email}>
                                <td className="px-4 py-2 text-sm">{attendee.name}</td>
                                <td className="px-4 py-2 text-sm">{attendee.email}</td>
                                <td className="px-4 py-2 text-right">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                    onClick={() => removeAttendee(attendee.email)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">No attendees added yet</div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reminders" className="m-0 space-y-6">
                {/* Reminders */}
                <div>
                  <Label className="text-sm font-medium">Set Reminders</Label>
                  <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="reminderTime" className="text-xs text-gray-500">
                          Time
                        </Label>
                        <Select
                          value={newReminder.time.toString()}
                          onValueChange={(value) => setNewReminder({ ...newReminder, time: Number(value) })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {reminderTimeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="reminderType" className="text-xs text-gray-500">
                          Type
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Select
                            value={newReminder.type}
                            onValueChange={(value: "notification" | "email") =>
                              setNewReminder({ ...newReminder, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="notification">Notification</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={addReminder}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {formData.reminders && formData.reminders.length > 0 ? (
                      <div className="space-y-2">
                        {formData.reminders.map((reminder) => {
                          const reminderOption = reminderTimeOptions.find((o) => o.value === reminder.time)
                          return (
                            <div
                              key={reminder.id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                {reminder.type === "notification" ? (
                                  <Bell className="w-4 h-4 text-blue-500" />
                                ) : (
                                  <Mail className="w-4 h-4 text-green-500" />
                                )}
                                <span className="text-sm">
                                  {reminderOption?.label || `${reminder.time} minutes before`} (
                                  {reminder.type === "notification" ? "Notification" : "Email"})
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                onClick={() => removeReminder(reminder.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">No reminders set</div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="m-0 space-y-6">
                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about this event"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                {/* Files */}
                <div>
                  <Label className="text-sm font-medium">Files</Label>
                  <div className="mt-2 space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        onChange={(e) => setFileUpload(e.target.files ? e.target.files[0] : null)}
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleFileUpload} disabled={!fileUpload}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>

                    {formData.files && formData.files.length > 0 ? (
                      <div className="space-y-2">
                        {formData.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-blue-700">
                                  {file.name.split(".").pop()?.toUpperCase() || "FILE"}
                                </span>
                              </div>
                              <div className="overflow-hidden">
                                <div className="text-sm font-medium truncate">{file.name}</div>
                                <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => window.open(file.url, "_blank")}
                              >
                                View
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                onClick={() => removeFile(file.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">No files uploaded</div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </form>
          </div>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
            {editingEvent ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </div>
    </div>
  )
}
