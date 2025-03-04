"use client";

import { useState } from "react";
import "./create.css"; // Import the CSS file

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    time: "",
    description: "",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Created:", eventData);
    alert("Event Created Successfully!");
    setEventData({ name: "", date: "", time: "", description: "" });
  };

  return (
    <div className="create-container">
      <h1>Create Event</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>Event Name:</label>
        <input
          type="text"
          name="name"
          value={eventData.name}
          onChange={handleChange}
          required
        />

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

        <label>Description:</label>
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>

        <button className="submit" type="submit">Create Event</button>
      </form>
    </div>
  );
}
