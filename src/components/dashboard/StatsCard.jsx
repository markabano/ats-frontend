// src/components/dashboard/StatsCards.jsx
import { CalendarDays, Clock, Bell, Settings, BarChart } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import { startOfWeek, endOfWeek, format } from "date-fns";

// Reusable card component
function StatCard({ icon: Icon, iconBg, iconColor, label, value, subtext }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-md">
      <div className="flex items-center">
        <div className={`rounded-lg ${iconBg} p-2`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

// Helper: Weekly stats
function getWeeklyStats(appointments) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });

  const weeklyEvents = appointments.filter((event) => {
    const date = new Date(event.start?.dateTime || event.start?.date);
    return date >= start && date <= end;
  });

  const byDay = {};
  weeklyEvents.forEach((event) => {
    const day = format(
      new Date(event.start?.dateTime || event.start?.date),
      "EEEE",
    );
    byDay[day] = (byDay[day] || 0) + 1;
  });

  const busiestDay =
    Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return { total: weeklyEvents.length, busiestDay };
}

export default function StatsCards({ appointments }) {
  const today = formatDate(new Date());
  const totalEvents = appointments.length;
  const todaysEvents = appointments.filter((event) => {
    const eventDate = event.start?.dateTime
      ? formatDate(new Date(event.start.dateTime))
      : formatDate(new Date(event.start.date));
    return eventDate === today;
  }).length;

  const upcomingEvents = appointments.filter((event) => {
    const eventDate = new Date(event.start?.dateTime || event.start?.date);
    return eventDate > new Date();
  }).length;

  const thisMonthEvents = appointments.filter((event) => {
    const eventDate = new Date(event.start?.dateTime || event.start?.date);
    const now = new Date();
    return (
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const { total: weeklyTotal, busiestDay } = getWeeklyStats(appointments);

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-5 lg:col-span-5">
      <StatCard
        icon={CalendarDays}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        label="Total Events"
        value={totalEvents}
      />
      <StatCard
        icon={Clock}
        iconBg="bg-green-50"
        iconColor="text-green-600"
        label="Today's Events"
        value={todaysEvents}
      />
      <StatCard
        icon={Bell}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        label="Upcoming"
        value={upcomingEvents}
      />
      <StatCard
        icon={Settings}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
        label="This Month"
        value={thisMonthEvents}
      />
      <StatCard
        icon={BarChart}
        iconBg="bg-pink-50"
        iconColor="text-pink-600"
        label="This Week"
        value={weeklyTotal}
        subtext={`Busiest: ${busiestDay}`}
      />
    </div>
  );
}
