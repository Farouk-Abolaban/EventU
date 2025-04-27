"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Edit, Trash2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only fetch events if user is signed in
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchUserEvents = async () => {
      try {
        // In a real application, you would have an API endpoint for this
        // For now, we'll fetch all events and filter on the client
        // In production, create a dedicated API endpoint like /api/users/me/events
        const response = await fetch("/api/events");

        if (response.ok) {
          const allEvents = await response.json();
          // Filter events where the user is the organizer
          const userEvents = allEvents.filter(
            (event) => event.organizerId === user?.id
          );
          setEvents(userEvents);
        }
      } catch (error) {
        console.error("Error fetching user events:", error);
        toast.error("Failed to load your events");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [isSignedIn, user]);

  const handleDeleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== id));
        toast.success("Event deleted successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An error occurred while deleting the event");
    }
  };

  // Function to get status badge properties
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle size={14} className="mr-1" />,
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: <AlertCircle size={14} className="mr-1" />,
        };
      default:
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock size={14} className="mr-1" />,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 p-8 rounded-lg shadow-md text-center">
          <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Please sign in
          </h2>
          <p className="text-gray-700 mb-4">
            You need to be signed in to view your events.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600">My Events</h1>
        <Link
          href="/create-event"
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
        >
          Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No events yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't created any events yet. Click the button below to get
            started!
          </p>
          <Link
            href="/create-event"
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const statusBadge = getStatusBadge(event.status);

            return (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {event.title}
                  </h2>
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                  >
                    {statusBadge.icon}
                    <span>
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Time:</span> {event.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Location:</span>{" "}
                      {event.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span>{" "}
                      {event.category.charAt(0).toUpperCase() +
                        event.category.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                    {event.status === "rejected" && event.rejectionReason && (
                      <p className="text-sm text-red-600">
                        <span className="font-medium">Reason:</span>{" "}
                        {event.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/event-details/${event.id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                  >
                    View Details
                  </Link>

                  {event.status !== "approved" && (
                    <Link
                      href={`/edit-event/${event.id}`}
                      className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Link>
                  )}

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
