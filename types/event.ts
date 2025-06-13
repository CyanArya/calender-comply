export type EventStatus = "Not Started" | "In Progress" | "Complete" | "Overdue";

export interface EventReminder {
  id: string;
  time: number; // minutes before event
  type: "notification";
}

export interface EventFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  color: string;
  type: "meeting" | "task" | "reminder" | "lunch" | "standup" | "design" | "prototype" | "reunion" | "breakfast";
  attendees?: { name: string; email: string }[];
  reminders?: EventReminder[];
  notes?: string;
  files?: EventFile[];
  status: EventStatus;
  calendarId: string;
} 