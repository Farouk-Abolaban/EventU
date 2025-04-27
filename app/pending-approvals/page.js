"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function PendingApprovalsPage() {
  const [isApprover, setIsApprover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEvents, setPendingEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user has approver role
    const checkApproverStatus = async () => {
      try {
        const response = await fetch("/api/users/profile");

        if (response.ok) {
          const userData = await response.json();
          if (userData.role === "approver" || userData.role === "admin") {
            setIsApprover(true);
            fetchPendingEvents();
          } else {
            // If not approver or admin, redirect to home
            router.push("/");
          }
        } else {
          // If no profile, redirect to home
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking approver status:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPendingEvents = async () => {
      try {
        const response = await fetch("/api/events?status=pending");

        if (response.ok) {
          const events = await response.json();
          setPendingEvents(events);
        } else {
          console.error("Failed to fetch pending events");
        }
      } catch (error) {
        console.error("Error fetching pending events:", error);
      }
    };

    checkApproverStatus();
  }, [router]);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/events/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPendingEvents(pendingEvents.filter((event) => event.id !== id));
        toast.success(`Event has been approved!`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to approve event");
      }
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("An error occurred while approving the event");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/events/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "Event does not meet university guidelines",
        }),
      });

      if (response.ok) {
        setPendingEvents(pendingEvents.filter((event) => event.id !== id));
        toast.success(`Event has been rejected`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to reject event");
      }
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast.error("An error occurred while rejecting the event");
    }
  };

  const handleRequestChanges = async (id) => {
    // In a real application, this would open a dialog to specify changes
    const reason = prompt("Please specify what changes are needed:");
    if (reason) {
      try {
        // This would be an API call in a real application
        // For now, we'll just simulate it by removing the event from the list
        setPendingEvents(pendingEvents.filter((event) => event.id !== id));
        toast.success(`Change request has been sent to organizer`);
      } catch (error) {
        console.error("Error requesting changes:", error);
        toast.error("An error occurred while sending the change request");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isApprover) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">
        Pending Event Approvals
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-gray-700 mb-2">
          As an event approver, you are responsible for reviewing event
          submissions to ensure they meet university guidelines and standards.
        </p>
        <p className="text-gray-700">
          Please review the following events and take appropriate action.
        </p>
      </div>

      {pendingEvents.length === 0 ? (
        <div className="bg-green-50 p-6 rounded-lg shadow-md text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            All caught up!
          </h2>
          <p className="text-gray-700">
            There are no events pending approval at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {event.title}
                </h2>
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Pending Review
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Organizer:</span>{" "}
                    {event.organizer?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Time:</span> {event.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Submitted by:</span>{" "}
                    {event.organizer?.email || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Submission date:</span>{" "}
                    {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-800 mb-1">Description</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleApprove(event.id)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(event.id)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleRequestChanges(event.id)}
                  className="flex items-center px-4 py-2 border border-yellow-600 text-yellow-600 font-medium rounded-md hover:bg-yellow-50 transition"
                >
                  <AlertCircle size={16} className="mr-2" />
                  Request Changes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
