"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    category: "",
  });
  const [originalStatus, setOriginalStatus] = useState("");

  useEffect(() => {
    // Check if user is signed in
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${params.id}`);

        if (response.ok) {
          const event = await response.json();

          // Check if the current user is the organizer or an admin
          const userResponse = await fetch("/api/users/profile");
          if (userResponse.ok) {
            const userData = await userResponse.json();
            const isAdmin = userData.role === "admin";

            if (event.organizerId !== user?.id && !isAdmin) {
              toast.error("You don't have permission to edit this event");
              router.push(`/event-details/${params.id}`);
              return;
            }

            // Check if the event is already approved
            if (event.status === "approved" && !isAdmin) {
              toast.error("Approved events cannot be edited");
              router.push(`/event-details/${params.id}`);
              return;
            }
          }

          // Format the date for the input field
          const dateObj = new Date(event.date);
          const formattedDate = dateObj.toISOString().split("T")[0];

          setEventData({
            title: event.title,
            date: formattedDate,
            time: event.time,
            description: event.description,
            location: event.location,
            category: event.category,
          });

          setOriginalStatus(event.status);
        } else {
          toast.error("Event not found");
          router.push("/my-events");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details");
        router.push("/my-events");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [params.id, isSignedIn, user, router]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // If the event was previously approved, we should create a new version pending approval
      // This could be handled in the backend to maintain the original event until approval

      const response = await fetch(`/api/events/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventData,
          // If the event was approved, set it back to pending
          ...(originalStatus === "approved" ? { status: "pending" } : {}),
        }),
      });

      if (response.ok) {
        toast.success("Event updated successfully!");
        router.push(`/event-details/${params.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("An error occurred while updating your event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Edit Event</h1>

      {originalStatus === "approved" && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-yellow-800 border border-yellow-200">
          <p className="font-medium">Note: Your event is already approved.</p>
          <p className="text-sm">
            Editing this event will resubmit it for approval.
          </p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={eventData.category}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="workshops">Workshop</option>
              <option value="conferences">Conference</option>
              <option value="social">Social Event</option>
              <option value="webinars">Webinar</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
              placeholder="Building name, room number, or online"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows="6"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:bg-red-400"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
