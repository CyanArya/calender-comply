"use client"

import { TableView } from "@/components/table-view"
import { useState } from "react"
import { Event, EventStatus } from "@/app/page"; // Import Event type if needed

const TablePage = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Design Critique",
      description:
        "All members are required to attend the design critique event, to develop the potential of all members, there will be...",
      date: "2023-08-09",
      startTime: "09:00",
      endTime: "11:00",
      color: "bg-green-100 border-green-400",
      type: "meeting",
      attendees: [
        { name: "John Doe", email: "john.doe@example.com" },
        { name: "Jane Smith", email: "jane.smith@example.com" },
      ],
      reminders: [
        { id: "r1", time: 30, type: "notification" },
        { id: "r2", time: 60, type: "email" },
      ],
      notes: "Prepare design mockups for review",
      files: [
        {
          id: "f1",
          name: "design-mockup.pdf",
          type: "application/pdf",
          url: "/files/design-mockup.pdf",
          size: 2500000,
        },
      ],
      status: "In Progress",
    },
    {
      id: "2",
      title: "P2P Zoom",
      description:
        "This meeting will discuss how design thinking works in solving user problems, and it is expected that all participants...",
      date: "2023-08-09",
      startTime: "13:00",
      endTime: "15:00",
      color: "bg-orange-100 border-orange-400",
      type: "meeting",
      attendees: [
        { name: "Alice Johnson", email: "alice.johnson@example.com" },
        { name: "Bob Wilson", email: "bob.wilson@example.com" },
      ],
      reminders: [{ id: "r3", time: 15, type: "notification" }],
      notes: "Prepare agenda and discussion points",
      status: "Not Started",
    },
    {
      id: "3",
      title: "Project Deadline",
      description: "Final submission for the Q3 project",
      date: "2023-08-10",
      startTime: "17:00",
      endTime: "18:00",
      color: "bg-red-100 border-red-400",
      type: "task",
      attendees: [
        { name: "Team Lead", email: "team.lead@example.com" },
        { name: "Project Manager", email: "pm@example.com" },
      ],
      reminders: [
        { id: "r4", time: 60, type: "notification" },
        { id: "r5", time: 1440, type: "email" }, // 1 day before
      ],
      notes: "Ensure all deliverables are ready",
      files: [
        {
          id: "f2",
          name: "project-requirements.docx",
          type: "application/docx",
          url: "/files/project-requirements.docx",
          size: 1500000,
        },
      ],
      status: "Overdue",
    },
  ])

  // Dummy functions for TableView props
  const handleEditEvent = (event: Event) => {};
  const handleDeleteEvent = (eventId: string) => {};
  const handleUpdateStatus = (eventId: string, status: EventStatus) => {};
  const handleSendEmails = (eventId: string) => {};

  return (
    <TableView
      events={events}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
      onUpdateStatus={handleUpdateStatus}
      onSendEmails={handleSendEmails}
    />
  );
};

export default TablePage; 