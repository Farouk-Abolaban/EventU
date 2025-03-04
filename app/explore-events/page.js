"use client";

import Link from "next/link";
import "./explore.css";

export default function ExploreEvents() {
  return (
    <div className="explore-events-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Explore Events</h1>
          <p className="header-description">
            Browse and join exciting events happening near you!
          </p>
        </div>
      </header>

      {/* Event Categories */}
      <section className="event-categories">
        <h2 className="section-title">Event Categories</h2>
        <div className="categories-grid">
          <div className="category-card">
            <h3 className="category-title">Workshops</h3>
            <p className="category-description">
              Hands-on events to boost your skills and knowledge.
            </p>
          </div>
          <div className="category-card">
            <h3 className="category-title">Conferences</h3>
            <p className="category-description">
              Networking and learning with industry experts.
            </p>
          </div>
          <div className="category-card">
            <h3 className="category-title">Social Events</h3>
            <p className="category-description">
              Meet new people and expand your social circle.
            </p>
          </div>
          <div className="category-card">
            <h3 className="category-title">Webinars</h3>
            <p className="category-description">
              Join informative online sessions and seminars.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="featured-events">
        <div className="section-content">
          <h2 className="section-title">Featured Events</h2>
          <div className="featured-events-grid">
            {/* Event Card 1 */}
            <div className="event-card">
              <div className="event-image-placeholder">Event Image</div>
              <div className="event-info">
                <h3 className="event-title">Tech Conference 2025</h3>
                <p className="event-description">
                  Join top industry professionals and learn about the latest in
                  technology.
                </p>
                <Link href="/event-details" className="event-button">
                  View Event
                </Link>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="event-card">
              <div className="event-image-placeholder">Event Image</div>
              <div className="event-info">
                <h3 className="event-title">Health & Wellness Workshop</h3>
                <p className="event-description">
                  Learn strategies for maintaining a healthy work-life balance.
                </p>
                <Link href="/event-details" className="event-button">
                  View Event
                </Link>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="event-card">
              <div className="event-image-placeholder">Event Image</div>
              <div className="event-info">
                <h3 className="event-title">Creative Writing Masterclass</h3>
                <p className="event-description">
                  Unlock your creativity and develop your writing skills.
                </p>
                <Link href="/event-details" className="event-button">
                  View Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p className="footer-text">
          &copy; 2025 EventU - University Event Management System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
