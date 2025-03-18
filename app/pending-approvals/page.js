"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function PendingApprovalsPage() {
  const [isApprover, setIsApprover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user has approver role
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const { role } = JSON.parse(userProfile);
      if (role === "approver" || role === "admin") {
        setIsApprover(true);
      } else {
        // If not approver or admin, redirect to home
        router.push("/");
      }
    } else {
      // If no profile, redirect to home
      router.push("/");
    }
    setIsLoading(false);
  }, [router]);

  const [pendingEvents, setPendingEvents] = useState([
    {
      id: 1,
      title: "Tech Workshop: Introduction to AI",
      organizer: "Computer Science Club",
      date: "Apr 15, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Science Hall, Room 201",
      description:
        "Learn the basics of artificial intelligence and machine learning in this hands-on workshop. No prior experience required.",
      submittedBy: "john.smith@university.edu",
      submittedOn: "Mar 10, 2025",
    },
    {
      id: 2,
      title: "Cultural Night: International Cuisine Festival",
      organizer: "International Students Association",
      date: "Apr 22, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Student Center Ballroom",
      description:
        "Experience cuisines from around the world! Students will prepare and share traditional dishes from their home countries.",
      submittedBy: "maria.rodriguez@university.edu",
      submittedOn: "Mar 12, 2025",
    },
    {
      id: 3,
      title: "Career Panel: Jobs in Finance",
      organizer: "Business Student Association",
      date: "Apr 18, 2025",
      time: "3:00 PM - 5:00 PM",
      location: "Business Building, Room 305",
      description:
        "Join us for a panel discussion with finance professionals from major banks and investment firms. Learn about career paths and opportunities.",
      submittedBy: "david.chen@university.edu",
      submittedOn: "Mar 15, 2025",
    },
  ]);

  const handleApprove = (id) => {
    setPendingEvents(pendingEvents.filter((event) => event.id !== id));
    alert(`Event #${id} has been approved!`);
  };

  const handleReject = (id) => {
    setPendingEvents(pendingEvents.filter((event) => event.id !== id));
    alert(`Event #${id} has been rejected.`);
  };

  const handleRequestChanges = (id) => {
    // In a real application, this would open a dialog to specify changes
    const reason = prompt("Please specify what changes are needed:");
    if (reason) {
      alert(`Change request for Event #${id} has been sent to organizer.`);
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
                    {event.organizer}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Date:</span> {event.date}
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
                    {event.submittedBy}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Submission date:</span>{" "}
                    {event.submittedOn}
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
