"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, Plus, Trash2, Upload, Bell, Mail, Users, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Event, EventReminder, EventFile, EventStatus } from "@/types/event"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<Event, "id">) => void
  selectedDate: Date | null
  selectedTime: string | null
  editingEvent: Event | null
  setToast: (toast: { message: string; type: "success" | "error" } | null) => void
}

export function EventModal({ isOpen, onClose, onSave, selectedDate, selectedTime, editingEvent, setToast }: EventModalProps) {
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
  const [newReminder, setNewReminder] = useState<{ time: number; type: "notification" }>({
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
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
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

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const addAttendee = () => {
    const nameTrimmed = newAttendee.name.trim();
    const emailTrimmed = newAttendee.email.trim();
    const isEmailValid = emailRegex.test(emailTrimmed);

    if (!nameTrimmed || !emailTrimmed) {
      setToast({ 
        message: "Please enter both name and email", 
        type: "error" 
      });
      return;
    }

    if (!isEmailValid) {
      setToast({ 
        message: "Please enter a valid email address", 
        type: "error" 
      });
      return;
    }

    // Check if email already exists
    if (formData.attendees?.some(a => a.email === emailTrimmed)) {
      setToast({ 
        message: "This email is already added to the event", 
        type: "error" 
      });
      return;
    }

    setFormData((prev) => {
      const updatedEvent = {
        ...prev,
        type: prev.type as "meeting" | "task" | "reminder" | "lunch" | "standup" | "design" | "prototype" | "reunion" | "breakfast",
        attendees: [...(prev.attendees || []), { 
          name: nameTrimmed, 
          email: emailTrimmed 
        }]
      };
      return updatedEvent;
    });

    setNewAttendee({ name: "", email: "" });
    setToast({ 
      message: `Attendee ${nameTrimmed} (${emailTrimmed}) added successfully`, 
      type: "success" 
    });
  };

  const removeAttendee = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      attendees: (prev.attendees || []).filter((a) => a.email !== email),
    }))
  }

  const addReminder = () => {
    const reminder: EventReminder = {
      id: Date.now().toString(),
      time: newReminder.time,
      type: "notification"
    }
    setFormData((prev) => {
      const updatedEvent = {
        ...prev,
        type: prev.type as "meeting" | "task" | "reminder" | "lunch" | "standup" | "design" | "prototype" | "reunion" | "breakfast",
        reminders: [...(prev.reminders || []), reminder]
      };
      return updatedEvent;
    });
    setNewReminder({ time: 30, type: "notification" });
    setToast({ 
      message: `Reminder set for ${newReminder.time} minutes before the event.`, 
      type: "success" 
    });
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{editingEvent ? "Edit Event" : "Create New Event"}</h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the details below to schedule your event</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="hover:bg-white/50">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b px-6 bg-gray-50">
              <TabsTrigger value="details" className="data-[state=active]:bg-white">
                <Calendar className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="people" className="data-[state=active]:bg-white">
                <Users className="w-4 h-4 mr-2" />
                People
              </TabsTrigger>
              <TabsTrigger value="reminders" className="data-[state=active]:bg-white">
                <Bell className="w-4 h-4 mr-2" />
                Reminders
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-white">
                <Paperclip className="w-4 h-4 mr-2" />
                Files
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="p-6 space-y-6">
              {/* Title and Description */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="What's the event about?"
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Add more details about your event..."
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                      Start Time *
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                      End Time *
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Event Type and Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                    Event Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select event type" />
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
                  <Label className="text-sm font-medium text-gray-700">Color</Label>
                  <div className="grid grid-cols-6 gap-2 mt-1.5">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`w-8 h-8 rounded-full ${option.color} border-2 ${
                          formData.color === option.value ? 'border-gray-900' : 'border-transparent'
                        }`}
                        onClick={() => setFormData((prev) => ({ ...prev, color: option.value }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="people" className="p-6 space-y-6">
              {/* Attendees */}
              <div>
                <Label className="text-sm font-medium text-gray-700">People Involved</Label>
                <div className="mt-2 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="attendee-name">Name</Label>
                      <Input
                        id="attendee-name"
                        value={newAttendee.name}
                        onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                        placeholder="Attendee Name"
                        className="mt-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="attendee-email">Email</Label>
                      <Input
                        id="attendee-email"
                        type="email"
                        value={newAttendee.email}
                        onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                        placeholder="attendee@example.com"
                        className="mt-1.5"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addAttendee}
                      className="w-full sm:w-auto mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Attendee
                    </Button>
                  </div>

                  {formData.attendees && formData.attendees.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {formData.attendees.map((attendee, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{attendee.name}</p>
                            <p className="text-sm text-gray-500">{attendee.email}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttendee(attendee.email)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No attendees added yet</p>
                      <p className="text-sm">Add people to your event</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reminders" className="p-6 space-y-6">
              {/* Reminders */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Event Reminders</Label>
                <div className="mt-2 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="reminder-time">Time Before Event</Label>
                      <Select
                        value={newReminder.time.toString()}
                        onValueChange={(value) => setNewReminder({ ...newReminder, time: parseInt(value) })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="1440">1 day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      onClick={addReminder}
                      className="w-full sm:w-auto mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Add Reminder
                    </Button>
                  </div>

                  {formData.reminders && formData.reminders.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {formData.reminders.map((reminder) => (
                        <div
                          key={reminder.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            {reminder.type === "email" ? (
                              <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            ) : (
                              <Bell className="w-4 h-4 mr-2 text-blue-500" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {reminderTimeOptions.find((opt) => opt.value === reminder.time)?.label}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">{reminder.type}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeReminder(reminder.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No reminders set</p>
                      <p className="text-sm">Add reminders to get notified about your event</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="p-6 space-y-6">
              {/* Files */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Event Files</Label>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="file"
                        onChange={(e) => setFileUpload(e.target.files?.[0] || null)}
                        className="mt-1.5"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={!fileUpload}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>

                  {formData.files && formData.files.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {formData.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <Paperclip className="w-4 h-4 mr-2 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No files attached</p>
                      <p className="text-sm">Upload files related to your event</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
            {editingEvent ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </div>
    </div>
  )
}
