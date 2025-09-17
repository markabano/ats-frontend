import { Clock } from "lucide-react";
import { formatTime } from "../../utils/dateUtils";
import { stripHTML } from "../../utils/htmlUtils";

export default function EventCard({ event }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-shadow">
      {/* Event title */}
      <h4 className="mb-1 font-medium text-gray-900">
        {(event.summary || "Untitled Event").replace(/[()]/g, "").trim()}
      </h4>

      {/* Description */}
      {event.description && (
        <p className="mb-2 text-sm text-gray-600">
          {stripHTML(event.description)}
        </p>
      )}

      {/* Organizer info */}
      {event.organizer && (
        <p className="text-xs text-gray-600">
          Booked by{" "}
          <span className="font-medium">
            {event.organizer.displayName || "Unknown"}
          </span>
        </p>
      )}

      {event.organizer?.email && (
        <p className="text-xs text-gray-500">{event.organizer.email}</p>
      )}

      {/* Time */}
      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
        <Clock size={12} className="shrink-0" />
        <span>
          {event.start?.dateTime
            ? formatTime(event.start.dateTime)
            : "All day"}
        </span>
        {event.end?.dateTime && (
          <span>- {formatTime(event.end.dateTime)}</span>
        )}
      </div>
    </div>
  );
}
