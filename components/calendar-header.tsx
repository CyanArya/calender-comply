"use client"

import { ChevronLeft, ChevronRight, Search, Bell, Filter, Plus, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

interface CalendarHeaderProps {
  currentView: "day" | "week" | "month" | "table" | "settings"
  currentDate: Date
  onViewChange: (view: "day" | "week" | "month" | "table" | "settings") => void
  onDateChange: (date: Date) => void
  onAddEvent: () => void
  userEmail: string
  userName: string
  unreadNotifications: number
  onClearNotifications: () => void
  onSetUserInfo: (userInfo: { name: string; email: string } | null) => void
}

export function CalendarHeader({
  currentView,
  currentDate,
  onViewChange,
  onDateChange,
  onAddEvent,
  userEmail,
  userName,
  unreadNotifications,
  onClearNotifications,
  onSetUserInfo,
}: CalendarHeaderProps) {
  const formatDate = () => {
    if (currentView === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } else if (currentView === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    }
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    }
    onDateChange(newDate)
  }

  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editName, setEditName] = useState(userName)
  const [editEmail, setEditEmail] = useState(userEmail)

  useEffect(() => {
    setEditName(userName)
    setEditEmail(userEmail)
  }, [userName, userEmail])

  const handleSaveUserEdit = () => {
    if (!editName.trim() || !editEmail.trim()) {
      // You might want to add a toast/error message here
      return
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(editEmail)) {
      // You might want to add a toast/error message here
      return
    }
    onSetUserInfo({ name: editName, email: editEmail })
    setShowEditUserModal(false)
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentView === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("day")}
              className="text-xs sm:text-sm"
            >
              Day
            </Button>
            <Button
              variant={currentView === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("week")}
              className="text-xs sm:text-sm"
            >
              Week
            </Button>
            <Button
              variant={currentView === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("month")}
              className="text-xs sm:text-sm"
            >
              Month
            </Button>
            <Button
              variant={currentView === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("table")}
              className="text-xs sm:text-sm"
            >
              <List className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-1" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search for anything" className="pl-10 w-64" />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
          {/* Date Navigation */}
          {currentView !== "table" && currentView !== "settings" && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-base sm:text-xl font-semibold min-w-[150px] sm:min-w-[200px] text-center">
                {formatDate()}
              </h1>
              <Button variant="ghost" size="sm" onClick={() => navigateDate("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => onDateChange(new Date())}>
            Today
          </Button>

          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Filter className="w-4 h-4" />
          </Button>

          <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={onAddEvent}>
            <Plus className="w-4 h-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Add Schedule</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <div className="relative">
              <Bell className="w-4 h-4" onClick={onClearNotifications} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </div>
          </Button>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm hidden sm:block">
                  <div className="font-medium">{userName}</div>
                  <div className="text-gray-500 text-xs">{userEmail}</div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AlertDialog open={showEditUserModal} onOpenChange={setShowEditUserModal}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Profile</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                      Update your name and email address.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editName" className="text-right">Name</Label>
                      <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editEmail" className="text-right">Email</Label>
                      <Input id="editEmail" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="col-span-3" />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSaveUserEdit}>Save</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <DropdownMenuItem onClick={() => onSetUserInfo(null)}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
