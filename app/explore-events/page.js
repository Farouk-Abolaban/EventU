"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "./explore.css";
import EventSearch from "../../components/EventSearch";

export default function ExploreEvents() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
          setAllEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle search submissions
  const handleSearch = async (searchData) => {
    // Destructure search parameters
    const { searchTerm, category, date, location } = searchData;

    try {
      setLoading(true);

      // Build query string for API
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (category && category !== "all") params.append("category", category);
      if (date) params.append("date", date);
      if (location) params.append("location", location);

      const response = await fetch(`/api/events?${params.toString()}`);

      if (response.ok) {
        const filteredEvents = await response.json();
        setEvents(filteredEvents);

        // Update search results state
        setSearchResults({
          query: searchData,
          results: filteredEvents,
        });
      }
    } catch (error) {
      console.error("Error searching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset search and show all events
  const resetSearch = () => {
    setSearchResults(null);
    setEvents(allEvents);
  };

  if (loading) {
    return (
      <div
        className="explore-events-container"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

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
                  matching &quot;{searchResults.query.searchTerm}&quot;
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
                      href={`/event-details/${event.id}`}
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
