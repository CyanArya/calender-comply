"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Calendar,
  FileText,
  Users,
  Gift,
  Bell,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface CalendarSidebarProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  selectedCalendars: Record<string, boolean>
  onCalendarToggle: (calendars: Record<string, boolean>) => void
  onSettingsClick: () => void
  showSettings: boolean
  userName: string
}

export function CalendarSidebar({
  currentDate,
  onDateChange,
  selectedCalendars,
  onCalendarToggle,
  onSettingsClick,
  showSettings,
  userName,
}: CalendarSidebarProps) {
  const [miniCalendarDate, setMiniCalendarDate] = useState(currentDate)
  const pathname = usePathname()

  const calendars = [
    { id: "esther-howard", name: userName, color: "bg-orange-500", icon: Users },
    { id: "task", name: "Task", color: "bg-red-500", icon: FileText },
    { id: "bootcamp", name: "Bootcamp", color: "bg-yellow-500", icon: GraduationCap },
    { id: "birthday", name: "Birthday", color: "bg-orange-400", icon: Gift },
    { id: "reminders", name: "Reminders", color: "bg-gray-500", icon: Bell },
    { id: "college", name: "College", color: "bg-gray-700", icon: GraduationCap },
  ]

  const categories = [
    { name: "Work", color: "bg-blue-500" },
    { name: "Education", color: "bg-yellow-500" },
    { name: "Personal", color: "bg-red-500" },
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderMiniCalendar = () => {
    const daysInMonth = getDaysInMonth(miniCalendarDate)
    const firstDay = getFirstDayOfMonth(miniCalendarDate)
    const days = []

    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`prev-${i}`} className="text-gray-400 text-sm p-1"></div>)
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === currentDate.getDate() &&
        miniCalendarDate.getMonth() === currentDate.getMonth() &&
        miniCalendarDate.getFullYear() === currentDate.getFullYear()

      days.push(
        <button
          key={day}
          onClick={() => onDateChange(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), day))}
          className={`text-sm p-1 hover:bg-blue-100 rounded ${isToday ? "bg-blue-500 text-white" : "text-gray-900"}`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="w-64 sm:w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="p-4 space-y-2">
        <NavLink href="/month" icon={Calendar} label="Calendar" activePath={pathname} />
        <NavLink href="/table" icon={FileText} label="My Events" activePath={pathname} />
        <NavLink href="/contacts" icon={Users} label="Contacts" activePath={pathname} />
        <NavLink href="/reports" icon={FileText} label="Reports" activePath={pathname} />
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start ${showSettings ? "bg-gray-100" : ""}`}
          onClick={onSettingsClick}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Mini Calendar */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">
              {monthNames[miniCalendarDate.getMonth()]} {miniCalendarDate.getFullYear()}
            </h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() - 1))
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() + 1))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs text-gray-500 text-center p-1 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{renderMiniCalendar()}</div>
        </div>

        {/* Scheduled Section */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Scheduled</h3>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* My Calendars */}
        <div className="px-4 pb-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-2">
              <h3 className="font-semibold text-sm">My Calendars</h3>
              <ChevronRight className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {calendars.map((calendar) => {
                const IconComponent = calendar.icon
                return (
                  <div key={calendar.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCalendars[calendar.id]}
                      onCheckedChange={(checked) =>
                        onCalendarToggle({
                          ...selectedCalendars,
                          [calendar.id]: checked as boolean,
                        })
                      }
                    />
                    <div className={`w-3 h-3 rounded-full ${calendar.color}`} />
                    <span className="text-sm">{calendar.name}</span>
                  </div>
                )
              })}
              <Button variant="ghost" size="sm" className="w-full justify-start text-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Add other
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Other Calendars */}
        <div className="px-4 pb-4">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-2">
              <h3 className="font-semibold text-sm">Other Calendars</h3>
              <ChevronRight className="w-4 h-4" />
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* Categories */}
        <div className="px-4 pb-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-2">
              <h3 className="font-semibold text-sm">Categories</h3>
              <ChevronRight className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  activePath: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, label, activePath }) => {
  const isActive = activePath === href;
  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        size="sm"
        className={`w-full justify-start ${isActive ? "bg-gray-100" : ""}`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </Link>
  );
};
