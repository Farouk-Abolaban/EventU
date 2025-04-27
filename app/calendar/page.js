"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarDays, setCalendarDays] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

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
  ];

  // Function to get the current month and year string
  const getCurrentMonthYear = () => {
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Function to generate calendar days for the current month
  const generateCalendarDays = (date, eventsList) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    // Total days in the month
    const daysInMonth = lastDay.getDate();

    // Days from previous month to fill in the calendar
    const previousMonthDays = [];
    if (firstDayOfWeek > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthDaysCount = prevMonth.getDate();

      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        previousMonthDays.push({
          day: prevMonthDaysCount - i,
          month: month - 1,
          year,
          isCurrentMonth: false,
          events: [],
        });
      }
    }

    // Current month days
    const currentMonthDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // Find events for this day
      const dayEvents = eventsList.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year
        );
      });

      currentMonthDays.push({
        day,
        month,
        year,
        isCurrentMonth: true,
        events: dayEvents,
      });
    }

    // Next month days to fill out the calendar grid (to make 6 rows)
    const nextMonthDays = [];
    const totalCalendarCells = 42; // 6 rows of 7 days
    const remainingCells =
      totalCalendarCells - (previousMonthDays.length + currentMonthDays.length);

    for (let day = 1; day <= remainingCells; day++) {
      nextMonthDays.push({
        day,
        month: month + 1,
        year,
        isCurrentMonth: false,
        events: [],
      });
    }

    // Combine all days
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // This will fetch all approved events
        const response = await fetch("/api/events?status=approved");

        if (response.ok) {
          const data = await response.json();
          setEvents(data);

          // Generate upcoming events (sort by date, limit to next 5)
          const now = new Date();
          const upcoming = data
            .filter((event) => new Date(event.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

          setUpcomingEvents(upcoming);

          // Generate calendar days with events
          const days = generateCalendarDays(currentDate, data);
          setCalendarDays(days);
        } else {
          console.error("Failed to fetch events for calendar");
        }
      } catch (error) {
        console.error("Error fetching events for calendar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  // Format date for display
  const formatEventDate = (dateString) => {
    const eventDate = new Date(dateString);
    return eventDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Event Calendar</h1>
        <div className="flex justify-center items-center min-h-64">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Event Calendar</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-md text-gray-700 flex items-center"
          >
            <ChevronLeft size={20} className="mr-1" /> Previous Month
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {getCurrentMonthYear()}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md text-gray-700 flex items-center"
          >
            Next Month <ChevronRight size={20} className="ml-1" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="font-semibold p-2 text-gray-800 border-b border-gray-200"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            const isToday =
              day.isCurrentMonth &&
              new Date().getDate() === day.day &&
              new Date().getMonth() === day.month &&
              new Date().getFullYear() === day.year;

            return (
              <div
                key={index}
                className={`p-2 min-h-14 border rounded-md flex flex-col ${
                  day.isCurrentMonth
                    ? isToday
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 text-gray-800"
                    : "border-gray-100 text-gray-400 bg-gray-50"
                }`}
              >
                <div className="font-medium mb-1">{day.day}</div>
                {day.events.length > 0 && (
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {day.events.slice(0, 2).map((event, eventIndex) => (
                      <Link
                        key={eventIndex}
                        href={`/event-details/${event.id}`}
                        className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-1 truncate hover:bg-red-200 transition"
                      >
                        {event.title}
                      </Link>
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{day.events.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Upcoming Events
        </h2>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No upcoming events scheduled. Check back soon!
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <Link href={`/event-details/${event.id}`} key={index}>
                <div className="border-l-4 border-red-500 pl-4 py-2 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-gray-700">{event.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-600 font-medium">
                        {formatEventDate(event.date)}
                      </span>
                      <p className="text-gray-700">{event.time}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
