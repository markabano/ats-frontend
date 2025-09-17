// src/components/events/EventsList.jsx
import { useState } from "react";
import { Clock, CalendarDays } from "lucide-react";
import { formatTime } from "../../utils/dateUtils";

export default function EventsList({ events = [], loading }) {
  const [page, setPage] = useState(1);
  const eventsPerPage = 2; // 🔹 adjust kung ilang events per page

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginatedEvents = events.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  const getEventStatus = (event) => {
    const now = new Date();
    const start = event.start?.dateTime
      ? new Date(event.start.dateTime)
      : new Date(event.start?.date);

    if (!start) return "upcoming";
    if (start.toDateString() === now.toDateString()) return "today";
    if (start < now) return "past";
    return "upcoming";
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "today":
        return "bg-green-100 text-green-700";
      case "past":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white shadow-sm px-6 py-4 animate-pulse"
          >
            <div className="h-4 w-40 rounded bg-gray-300 mb-2"></div>
            <div className="h-3 w-28 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 shadow-inner">
          <CalendarDays className="h-8 w-8 text-gray-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">
          No events scheduled for this date
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Events */}
      <div className="space-y-3">
        {paginatedEvents.map((event) => {
          const status = getEventStatus(event);
          return (
            <div
              key={event.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm px-6 py-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                {/* Title + Organizer */}
                <div>
                  <p className="font-semibold text-gray-900">
                    {(event.summary || "Untitled Event")
                      .replace(/[()]/g, "")
                      .trim()}
                  </p>
                  {event.organizer?.displayName && (
                    <p className="mt-0.5 text-xs text-gray-600">
                      Booked by{" "}
                      <span className="font-medium text-gray-800">
                        {event.organizer.displayName}
                      </span>
                    </p>
                  )}
                  {event.organizer?.email && (
                    <p className="text-xs text-gray-500">
                      {event.organizer.email}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <span
                  className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeColor(
                    status
                  )}`}
                >
                  {status === "today"
                    ? "Today"
                    : status === "past"
                    ? "Past"
                    : "Upcoming"}
                </span>
              </div>

              {/* Time */}
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1 text-gray-400" />
                <span>
                  {event.start?.dateTime
                    ? formatTime(event.start.dateTime)
                    : "All day"}
                </span>
                {event.end?.dateTime && (
                  <span className="ml-1">
                    – {formatTime(event.end.dateTime)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
