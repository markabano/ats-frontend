import { useState, useEffect } from "react";
import { CalendarDays, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAppointments } from "../hooks/useAppointments";
import { useCalendars } from "../hooks/useCalendars";
import { useNotifications } from "../hooks/useNotifications";
import { formatDate } from "../utils/dateUtils";

import Header from "../components/layout/Header";
import LoadingOverlay from "../components/layout/LoadingOverlay";
import CustomCalendar from "../components/calendar/CustomCalendar";
import EventsList from "../components/events/EventsList";
import StatsCards from "../components/dashboard/StatsCard";
import {
  NotificationBell,
  NotificationDropdown,
} from "../components/notifications";

export default function ScheduleCalendar({ onRefresh }) {
  const { user, logout, startAuth } = useAuth();
  const { appointments, loading, fetchAppointments } = useAppointments();
  const { calendars } = useCalendars();
  const { todayAppointments, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(appointments);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCalendar, setSelectedCalendar] = useState("primary");
  const [showNotifications, setShowNotifications] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (user) fetchAppointments(selectedCalendar);
  }, [selectedCalendar, user]);

  // Re-fetch on refresh
  useEffect(() => {
    if (onRefresh !== undefined) {
      fetchAppointments(selectedCalendar);
    }
  }, [onRefresh]);

  const eventDates = appointments.map((event) =>
    event.start?.dateTime
      ? formatDate(new Date(event.start.dateTime))
      : formatDate(new Date(event.start.date)),
  );

  const eventsForSelectedDate = appointments.filter((event) => {
    const eventDate = event.start?.dateTime
      ? formatDate(new Date(event.start.dateTime))
      : formatDate(new Date(event.start.date));
    return eventDate === formatDate(selectedDate);
  });

  const handleNotificationClick = (appointment) => {
    markAsRead(appointment.id);
    const appointmentDate = appointment.start?.dateTime
      ? new Date(appointment.start.dateTime)
      : new Date(appointment.start.date);
    setSelectedDate(appointmentDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT SIDE: Title + Calendar Selector */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Calendar
              </h1>
              {user && calendars.length > 0 && (
                <div className="flex flex-col">
                  <label
                    htmlFor="calendarSelect"
                    className="text-s mb-1 block font-bold text-gray-600"
                  >
                    Select Calendar
                  </label>
                  <div className="relative">
                    <select
                      id="calendarSelect"
                      value={selectedCalendar}
                      onChange={(e) => setSelectedCalendar(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm font-medium text-gray-700 shadow-sm transition-all duration-150 ease-in-out hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none sm:text-base"
                    >
                      {calendars.map((cal) => (
                        <option key={cal.id} value={cal.id}>
                          {cal.summary
                            .split(/[.@]/)[0]
                            .charAt(0)
                            .toUpperCase() +
                            cal.summary.split(/[.@]/)[0].slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    {/* Chevron */}
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Notifications + User */}
            {user && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-4">
                <div className="relative self-start sm:self-auto">
                  <NotificationBell
                    unreadCount={unreadCount}
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      markAllAsRead(); // clear badge when bell clicked
                    }}
                  />
                  {showNotifications && (
                    <NotificationDropdown
                      todayAppointments={todayAppointments}
                      onClose={() => setShowNotifications(false)}
                      onNotificationClick={handleNotificationClick}
                    />
                  )}
                </div>

                <div className="flex items-center space-x-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm sm:px-4 sm:py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white shadow sm:h-10 sm:w-10 sm:text-sm">
                    {user.name?.charAt(0) || <User size={18} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center justify-center space-x-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700 sm:px-4 sm:py-2 sm:text-sm"
                >
                  <LogOut size={14} className="sm:h-4 sm:w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Header
        user={user}
        loading={loading}
        onRefresh={() => fetchAppointments(selectedCalendar)}
        onAuth={startAuth}
      />

      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* MAIN */}
      <main className="p-4 sm:p-6">
        {user ? (
          <>
            <StatsCards appointments={appointments} />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <CustomCalendar
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  eventDates={eventDates}
                  loading={loading}
                />
              </div>
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Selected Date
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <EventsList events={eventsForSelectedDate} loading={loading} />
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-md py-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 shadow-sm">
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Welcome to Calendar
            </h3>
            <p className="mb-8 text-gray-600">
              Connect your Google account to view and manage your appointments.
            </p>
            <button
              onClick={startAuth}
              disabled={loading}
              className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
            >
              Get Started
            </button>
          </div>
        )}
      </main>

      {loading && <LoadingOverlay message="Loading your calendar..." />}
    </div>
  );
}
