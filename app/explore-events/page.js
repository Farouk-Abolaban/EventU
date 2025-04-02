"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "./explore.css";
import EventSearch from "../../components/EventSearch";

export default function ExploreEvents() {
  // Sample event data - in a real app, this would come from an API
  const allEvents = [
    {
      id: 1,
      title: "Tech Conference 2025",
      description:
        "Join top industry professionals and learn about the latest in technology.",
      category: "conferences",
      date: "2025-06-15",
      location: "University Hall",
    },
    {
      id: 2,
      title: "Health & Wellness Workshop",
      description:
        "Learn strategies for maintaining a healthy work-life balance.",
      category: "workshops",
      date: "2025-05-20",
      location: "Student Center",
    },
    {
      id: 3,
      title: "Creative Writing Masterclass",
      description: "Unlock your creativity and develop your writing skills.",
      category: "workshops",
      date: "2025-05-25",
      location: "Arts Building",
    },
    {
      id: 4,
      title: "AI in Education Webinar",
      description:
        "Discover how artificial intelligence is transforming the education sector.",
      category: "webinars",
      date: "2025-06-05",
      location: "Online",
    },
    {
      id: 5,
      title: "Spring Campus Mixer",
      description:
        "Meet and socialize with other students in a fun, relaxed environment.",
      category: "social",
      date: "2025-04-10",
      location: "Student Center Garden",
    },
    {
      id: 6,
      title: "Career Development Workshop",
      description:
        "Enhance your resume and interview skills with guidance from industry experts.",
      category: "workshops",
      date: "2025-04-15",
      location: "Business Building",
    },
  ];

  const [events, setEvents] = useState(allEvents);
  const [searchResults, setSearchResults] = useState(null);

  // Handle search submissions
  const handleSearch = (searchData) => {
    // Destructure search parameters
    const { searchTerm, category, date, location } = searchData;

    // Filter events based on search criteria
    let filteredEvents = [...allEvents];

    // Search term filter (search in title and description)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (category && category !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.category === category
      );
    }

    // Date filter
    if (date) {
      filteredEvents = filteredEvents.filter((event) => event.date === date);
    }

    // Location filter
    if (location) {
      const locationTerm = location.toLowerCase();
      filteredEvents = filteredEvents.filter((event) =>
        event.location.toLowerCase().includes(locationTerm)
      );
    }

    // Update search results
    setSearchResults({
      query: searchData,
      results: filteredEvents,
    });

    // Update displayed events
    setEvents(filteredEvents);
  };

  // Reset search and show all events
  const resetSearch = () => {
    setSearchResults(null);
    setEvents(allEvents);
  };

  return (
    <div
      className="explore-events-container"
      style={{ backgroundColor: "white", color: "black" }}
    >
      {/* Header Section */}
      <header className="header" style={{ backgroundColor: "#fef2f2" }}>
        <div className="header-content">
          <h1 className="header-title" style={{ color: "#dc2626" }}>
            Explore Events
          </h1>
          <p className="header-description" style={{ color: "#4b5563" }}>
            Browse and join exciting events happening near you!
          </p>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="search-section mb-8">
        <EventSearch onSearch={handleSearch} />

        {/* Show search results summary if search was performed */}
        {searchResults && (
          <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center mb-4">
            <div>
              <span className="font-medium">
                Found {searchResults.results.length} event(s)
              </span>
              {searchResults.query.searchTerm && (
                <span className="ml-2">
                  matching "{searchResults.query.searchTerm}"
                </span>
              )}
            </div>
            <button
              onClick={resetSearch}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* Event Categories - Hide when displaying search results */}
      {!searchResults && (
        <section className="event-categories">
          <h2 className="section-title" style={{ color: "#374151" }}>
            Event Categories
          </h2>
          <div className="categories-grid">
            <div className="category-card" style={{ backgroundColor: "white" }}>
              <h3 className="category-title" style={{ color: "#dc2626" }}>
                Workshops
              </h3>
              <p className="category-description" style={{ color: "#6b7280" }}>
                Hands-on events to boost your skills and knowledge.
              </p>
            </div>
            <div className="category-card" style={{ backgroundColor: "white" }}>
              <h3 className="category-title" style={{ color: "#dc2626" }}>
                Conferences
              </h3>
              <p className="category-description" style={{ color: "#6b7280" }}>
                Networking and learning with industry experts.
              </p>
            </div>
            <div className="category-card" style={{ backgroundColor: "white" }}>
              <h3 className="category-title" style={{ color: "#dc2626" }}>
                Social Events
              </h3>
              <p className="category-description" style={{ color: "#6b7280" }}>
                Meet new people and expand your social circle.
              </p>
            </div>
            <div className="category-card" style={{ backgroundColor: "white" }}>
              <h3 className="category-title" style={{ color: "#dc2626" }}>
                Webinars
              </h3>
              <p className="category-description" style={{ color: "#6b7280" }}>
                Join informative online sessions and seminars.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="featured-events">
        <div className="section-content">
          <h2 className="section-title" style={{ color: "#374151" }}>
            {searchResults ? "Search Results" : "Featured Events"}
          </h2>

          {events.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 text-lg">
                No events found matching your search criteria.
              </p>
              <button
                onClick={resetSearch}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                View All Events
              </button>
            </div>
          ) : (
            <div className="featured-events-grid">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="event-card"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="event-image-placeholder"
                    style={{ backgroundColor: "#fecaca", color: "#dc2626" }}
                  >
                    Event Image
                  </div>
                  <div className="event-info">
                    <h3 className="event-title" style={{ color: "#111827" }}>
                      {event.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs mr-2">
                        {event.category.charAt(0).toUpperCase() +
                          event.category.slice(1)}
                      </span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <p
                      className="event-description"
                      style={{ color: "#6b7280" }}
                    >
                      {event.description}
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      Location: {event.location}
                    </div>
                    <Link
                      href={`/event-details?id=${event.id}`}
                      className="event-button"
                      style={{ backgroundColor: "#dc2626", color: "white" }}
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer" style={{ backgroundColor: "white" }}>
        <p className="footer-text" style={{ color: "#6b7280" }}>
          &copy; 2025 EventU - University Event Management System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
