"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "./create.css"; // Import the CSS file

export default function CreateEvent() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    category: "other",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        toast.success(
          "Event created successfully! It will be reviewed by an approver."
        );
        router.push("/my-events");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An error occurred while creating your event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-container">
      <h1>Create Event</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>Event Name:</label>
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          value={eventData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="workshops">Workshop</option>
          <option value="conferences">Conference</option>
          <option value="social">Social Event</option>
          <option value="webinars">Webinar</option>
          <option value="other">Other</option>
        </select>

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />

        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          required
          placeholder="Building name, room number, or online"
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>

        <button className="submit" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
