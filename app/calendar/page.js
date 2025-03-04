"use client";

import { useState } from "react";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("March 2025");

  // Sample events for the calendar
  const events = [
    {
      date: "March 5",
      title: "Spring Career Fair",
      time: "4:00 PM",
      location: "University Hall",
    },
    {
      date: "March 12",
      title: "University Fall Play",
      time: "7:30 PM",
      location: "Alexander Kasser Theater",
    },
    {
      date: "March 15",
      title: "Alumni Networking Breakfast",
      time: "10:00 AM",
      location: "School of Business",
    },
    {
      date: "March 18",
      title: "Guest Lecture: AI in Education",
      time: "2:00 PM",
      location: "Center for Computing",
    },
    {
      date: "March 24",
      title: "Student Organization Fair",
      time: "12:00 PM",
      location: "Student Center",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Event Calendar</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <button className="p-2 hover:bg-gray-100 rounded-md text-gray-700">
            &lt; Previous Month
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {currentMonth}
          </h2>
          <button className="p-2 hover:bg-gray-100 rounded-md text-gray-700">
            Next Month &gt;
          </button>
        </div>

        {/* Simplified Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold p-2 text-gray-800">
              {day}
            </div>
          ))}

          {/* This is a simplified representation - in a real app, you'd generate this dynamically */}
          {Array.from({ length: 35 }).map((_, index) => {
            const day = index - 4; // Starting from February 26
            const isCurrentMonth = day > 0 && day <= 31;
            const hasEvent = events.some(
              (event) => event.date === `March ${day}`
            );

            return (
              <div
                key={index}
                className={`p-2 rounded-md min-h-12 border ${
                  isCurrentMonth
                    ? "border-gray-200 text-gray-800"
                    : "border-gray-100 text-gray-400"
                } ${hasEvent ? "bg-red-100" : ""}`}
              >
                {day > 0 && day <= 31 ? day : day <= 0 ? 29 + day : day - 31}
                {hasEvent && (
                  <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1"></div>
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

        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-gray-700">{event.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-red-600 font-medium">{event.date}</span>
                  <p className="text-gray-700">{event.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
