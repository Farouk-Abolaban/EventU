"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${params.id}`);

        if (response.ok) {
          const eventData = await response.json();
          setEvent(eventData);

          if (isSignedIn && user) {
            // Check if the current user is the organizer
            if (user.id === eventData.organizerId) {
              setIsOrganizer(true);
            }

            // Check if the current user is registered for this event
            if (
              eventData.attendees &&
              eventData.attendees.some((attendee) => attendee.id === user.id)
            ) {
              setRegistered(true);
            } else {
              setRegistered(false);
            }

            // Check user roles
            const userResponse = await fetch("/api/users/profile");
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setIsAdmin(userData.role === "admin");
              setIsApprover(
                userData.role === "approver" || userData.role === "admin"
              );
            }
          }
        } else {
          toast.error("Event not found");
          router.push("/explore-events");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEventDetails();
    }
  }, [params.id, isSignedIn, user, router]);

  const handleRegister = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to register for events");
      return;
    }

    try {
      const response = await fetch(`/api/events/${params.id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setRegistered(true);
        toast.success("Successfully registered for the event");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to register for event");
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("An error occurred while registering");
    }
  };

  const handleCancelRegistration = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/register`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRegistered(false);
        toast.success("Registration cancelled");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to cancel registration");
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      toast.error("An error occurred while cancelling registration");
    }
  };

  const handleApproveEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update the event status in the UI
        setEvent({ ...event, status: "approved" });
        toast.success("Event approved successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to approve event");
      }
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("An error occurred while approving the event");
    }
  };

  const handleRejectEvent = async () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const response = await fetch(`/api/events/${params.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        // Update the event status in the UI
        setEvent({ ...event, status: "rejected", rejectionReason: reason });
        toast.success("Event rejected");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to reject event");
      }
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast.error("An error occurred while rejecting the event");
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Event deleted successfully");
        router.push("/my-events");
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
          icon: <CheckCircle size={16} className="mr-1" />,
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle size={16} className="mr-1" />,
        };
      default:
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertCircle size={16} className="mr-1" />,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 p-8 rounded-lg shadow-md text-center">
          <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-700 mb-4">
            The event you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/explore-events")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {/* Event Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">
            {event.title}
          </h1>
          <div
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}
          >
            {statusBadge.icon}
            <span>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="h-48 bg-blue-100 flex items-center justify-center rounded-lg mb-4">
              <span className="text-blue-600 font-medium">Event Image</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Calendar size={18} className="mr-2 text-blue-600" />
                <span>
                  {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock size={18} className="mr-2 text-blue-600" />
                <span>{event.time}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin size={18} className="mr-2 text-blue-600" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <User size={18} className="mr-2 text-blue-600" />
                <span>
                  Organized by {event.organizer?.name || "EventU User"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              About This Event
            </h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">
              {event.description}
            </p>

            <div className="mt-6">
              {event.status === "approved" && (
                <div>
                  {registered ? (
                    <div className="space-y-4">
                      <p className="text-green-600 font-medium flex items-center">
                        <CheckCircle size={16} className="mr-1" />
                        You&apos;re registered for this event!
                      </p>
                      <button
                        onClick={handleCancelRegistration}
                        className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition"
                      >
                        Cancel Registration
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                    >
                      Register for this Event
                    </button>
                  )}
                </div>
              )}

              {event.status === "rejected" && event.rejectionReason && (
                <div className="bg-red-50 p-4 rounded-md mb-4">
                  <h3 className="font-medium text-red-800 mb-1">
                    Rejection Reason:
                  </h3>
                  <p className="text-red-700">{event.rejectionReason}</p>
                </div>
              )}

              {/* Attendees section */}
              {event.attendees && event.attendees.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Attendees ({event.attendees.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.attendees.map((attendee) => (
                      <span
                        key={attendee.id}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {attendee.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer/Admin Actions */}
              {(isOrganizer || isAdmin) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">
                    {isOrganizer ? "Organizer Actions" : "Admin Actions"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {event.status !== "approved" && (
                      <button
                        onClick={() => router.push(`/edit-event/${event.id}`)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition"
                      >
                        Edit Event
                      </button>
                    )}
                    <button
                      onClick={handleDeleteEvent}
                      className="px-4 py-2 border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-50 transition"
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              )}

              {/* Approver Actions */}
              {isApprover && event.status === "pending" && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Approver Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleApproveEvent}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
                    >
                      Approve Event
                    </button>
                    <button
                      onClick={handleRejectEvent}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
                    >
                      Reject Event
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
