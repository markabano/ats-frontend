import { X, CalendarDays } from "lucide-react";
import NotificationItem from "./NotificationItem";

export default function NotificationDropdown({
  todayAppointments,
  onClose,
  onNotificationClick,
}) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {todayAppointments.length > 0 ? (
          todayAppointments.map((appointment) => (
            <NotificationItem
              key={appointment.id}
              appointment={appointment}
              onClick={onNotificationClick}
            />
          ))
        ) : (
          <div className="p-6 text-center">
            <CalendarDays className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No appointments today</p>
          </div>
        )}
      </div>
    </div>
  );
}
