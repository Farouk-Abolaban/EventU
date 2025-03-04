"use client";

import Link from "next/link";
import "./create.css";

export default function ExploreEvents() {
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

      {/* Event Categories */}
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

      {/* Featured Events Section */}
      <section className="featured-events">
        <div className="section-content">
          <h2 className="section-title" style={{ color: "#374151" }}>
            Featured Events
          </h2>
          <div className="featured-events-grid">
            {/* Event Card 1 */}
            <div className="event-card" style={{ backgroundColor: "white" }}>
              <div
                className="event-image-placeholder"
                style={{ backgroundColor: "#fecaca", color: "#dc2626" }}
              >
                Event Image
              </div>
              <div className="event-info">
                <h3 className="event-title" style={{ color: "#111827" }}>
                  Tech Conference 2025
                </h3>
                <p className="event-description" style={{ color: "#6b7280" }}>
                  Join top industry professionals and learn about the latest in
                  technology.
                </p>
                <Link
                  href="/event-details"
                  className="event-button"
                  style={{ backgroundColor: "#dc2626", color: "white" }}
                >
                  View Event
                </Link>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="event-card" style={{ backgroundColor: "white" }}>
              <div
                className="event-image-placeholder"
                style={{ backgroundColor: "#fecaca", color: "#dc2626" }}
              >
                Event Image
              </div>
              <div className="event-info">
                <h3 className="event-title" style={{ color: "#111827" }}>
                  Health & Wellness Workshop
                </h3>
                <p className="event-description" style={{ color: "#6b7280" }}>
                  Learn strategies for maintaining a healthy work-life balance.
                </p>
                <Link
                  href="/event-details"
                  className="event-button"
                  style={{ backgroundColor: "#dc2626", color: "white" }}
                >
                  View Event
                </Link>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="event-card" style={{ backgroundColor: "white" }}>
              <div
                className="event-image-placeholder"
                style={{ backgroundColor: "#fecaca", color: "#dc2626" }}
              >
                Event Image
              </div>
              <div className="event-info">
                <h3 className="event-title" style={{ color: "#111827" }}>
                  Creative Writing Masterclass
                </h3>
                <p className="event-description" style={{ color: "#6b7280" }}>
                  Unlock your creativity and develop your writing skills.
                </p>
                <Link
                  href="/event-details"
                  className="event-button"
                  style={{ backgroundColor: "#dc2626", color: "white" }}
                >
                  View Event
                </Link>
              </div>
            </div>
          </div>
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
