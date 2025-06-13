"use client"

import { useState } from "react"
import { ArrowLeft, X, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SettingsViewProps {
  onBack: () => void
}

export function SettingsView({ onBack }: SettingsViewProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const handleSave = () => {
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>EH</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">Esther Howard</div>
              <div className="text-gray-500 text-xs">esther.howard@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Settings Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="space-y-6">
            {/* General Section */}
            <div>
              <h3 className="font-semibold text-sm mb-4 text-gray-900">GENERAL</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Language and region
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Time Zone
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  World Clock
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Event Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Notification Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  View Options
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Keyboard Shortcut
                </Button>
              </div>
            </div>

            {/* Calendar Section */}
            <div>
              <h3 className="font-semibold text-sm mb-4 text-gray-900">CALENDAR</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm bg-blue-50 text-blue-600">
                  My Calendars
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Other Calendars
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Categories
                </Button>
              </div>
            </div>

            {/* Add Calendar Section */}
            <div>
              <h3 className="font-semibold text-sm mb-4 text-gray-900">ADD CALENDAR</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Subscribe to Calendar
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Create New Calendar
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Browse Calendar
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  From URL
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Settings Content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            {/* My Calendar Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">My Calendar</h2>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-6">View and manage all your calendars</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">😊 Esther Howard</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">🎯 Task</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">🔥 Bootcamp</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-sm font-medium">🎉 Birthday</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">🔔 Reminders</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                  <span className="text-sm font-medium">🎓 College</span>
                </div>
              </div>
            </div>

            {/* Task Settings Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold">Task Settings</h2>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input id="name" value="Task" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="icon" className="text-sm font-medium">
                    Icon
                  </Label>
                  <Select defaultValue="task">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">🎯</SelectItem>
                      <SelectItem value="calendar">📅</SelectItem>
                      <SelectItem value="star">⭐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value="Tasks are office schedules, meetings and also events and office assignments"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="owner" className="text-sm font-medium">
                    Owner
                  </Label>
                  <Input id="owner" value="Esther Howard" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="tag" className="text-sm font-medium">
                    Tag
                  </Label>
                  <Select defaultValue="work">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="calendar-id" className="text-sm font-medium">
                    Calendar ID
                  </Label>
                  <Input id="calendar-id" value="esther.howard@gmail.com" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="timezone" className="text-sm font-medium">
                    Time Zone
                  </Label>
                  <Select defaultValue="jakarta">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">(GMT+07:00) Western Indonesia Time-Jakarta</SelectItem>
                      <SelectItem value="singapore">(GMT+08:00) Singapore Time</SelectItem>
                      <SelectItem value="tokyo">(GMT+09:00) Japan Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notification" className="text-sm font-medium">
                    Event Notification
                  </Label>
                  <Select defaultValue="30min">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 Minutes before</SelectItem>
                      <SelectItem value="15min">15 Minutes before</SelectItem>
                      <SelectItem value="1hour">1 Hour before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Share</Label>
                  <div className="mt-2 flex gap-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">DR</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Darlene Robertson</span>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">BC</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Bessie Cooper</span>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
                    Save Change
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Changed Successfully</div>
            <div className="text-sm text-gray-300">Your data has been successfully replaced</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800 p-1"
            onClick={() => setShowSuccessToast(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
