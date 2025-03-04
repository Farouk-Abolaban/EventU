"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useUser,
  SignInButton,
  ClerkProvider,
  SignedOut,
  SignedIn,
} from "@clerk/nextjs";
import { Loader2, Search, Calendar, Info, MessageCircle } from "lucide-react";
import Link from "next/link";
import "./page.css";
import { Toaster } from "sonner";
import CustomUserDropdown from "@/app/CustomUserDropdown";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setLoading(true); // Shows loading state animation before redirect
      router.push("/");
    }
  }, [isSignedIn, router]);

  // Sample featured events data
  const featuredEvents = [
    {
      id: 1,
      title: "Spring Career Fair",
      date: "Mar 5, 2025",
      time: "4:00 PM",
      location: "University Hall (7th Floor)",
      action: "Register",
    },
    {
      id: 2,
      title: "University Fall Play",
      date: "Mar 12, 2025",
      time: "7:30 PM",
      location: "Alexander Kasser Theater",
      action: "Get Tickets",
    },
    {
      id: 3,
      title: "Alumni Networking Breakfast",
      date: "Mar 15, 2025",
      time: "10:00 AM",
      location: "School of Business",
      action: "RSVP",
    },
  ];

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Toaster /> {/* Notifications */}
          <div className="min-h-screen flex flex-col bg-gradient">
            {/* Header/Navigation */}

            {/* Hero Section */}
            <section className="container px-4 py-12 md:py-20">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                  <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                    Welcome to EventU!
                  </h1>
                  <p className="text-lg text-dark mb-6">
                    Your comprehensive platform for discovering, organizing, and
                    attending university events. From academic lectures to
                    sports competitions and social gatherings - find it all in
                    one place.
                  </p>
                  <div className="flex gap-4">
                    <button className="btn-primary">
                      <Link href="/explore-events">Explore Events</Link>
                    </button>
                    <button className="btn-outline">
                      <Link href="/create-event">Create Event</Link>
                    </button>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src="/montclair-pic.jpg"
                      alt="University events"
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevents infinite loop if the placeholder image also fails
                        e.target.src =
                          "https://placehold.co/600x400/red/white?text=EventU";
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Sign In Section */}
            <section className="container mx-auto px-4 py-12">
              <header className="sign-header">
                <h1 className="logo">Montclair State University</h1>

                <nav className="mt-4 md:mt-0">
                  <ul className="flex gap-6">
                    <li>
                      <Link href="#" className="nav-link">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/explore-events" className="nav-link">
                        Events
                      </Link>
                    </li>
                    <li>
                      <Link href="/calendar" className="nav-link">
                        Calendar
                      </Link>
                    </li>
                    <li>
                      <Link href="/about-us" className="nav-link">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="nav-link">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </nav>
                <div className="sign-in-container">
                  <SignedOut>
                    <SignInButton
                      mode="modal"
                      afterSignInUrl="/home"
                      className="sign-in-button"
                    >
                      Sign In
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <CustomUserDropdown />
                  </SignedIn>
                </div>
              </header>
            </section>
            {/* Featured Events Section */}
            <section className="container px-4 py-12">
              <h2 className="text-3xl font-semibold text-center mb-10 text-black">
                Upcoming Featured Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="event-card hover:shadow-lg transition"
                  >
                    <div className="event-image">
                      <img
                        src={`/event-${event.id}.jpg`}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/600x400/red/white?text=Event+${event.id}`;
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <div className="event-date mb-1">
                        {event.date} • {event.time}
                      </div>
                      <h3 className="event-title mb-2">{event.title}</h3>
                      <p className="event-location mb-4">{event.location}</p>
                      <button className="event-button hover:bg-primary-light transition">
                        {event.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="footer mt-auto">
              <div className="container px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <h3 className="footer-heading mb-4">EventU</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="footer-link">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Our Team
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Careers
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="footer-heading mb-4">Resources</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="footer-link">
                          Help Center
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Event Guidelines
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Event Planning
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          FAQs
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="footer-heading mb-4">Legal</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="footer-link">
                          Terms of Service
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Cookie Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Accessibility
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="footer-heading mb-4">Connect</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="footer-link">
                          Facebook
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Twitter
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          Instagram
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="footer-link">
                          LinkedIn
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="copyright mt-8 pt-8">
                  <p>
                    © 2025 EventU - University Event Management System. All
                    rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
