"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
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
      setLoading(true);
      router.push("/");
    }
  }, [isSignedIn, router]);

  // Sample featured events data
  const featuredEvents = [
    {
      id: 1,
      tiles:["/montclair-pic2.jpg"],
      title: "Spring Career Fair",
      date: "Mar 5, 2025",
      time: "4:00 PM",
      location: "University Hall (7th Floor)",
      action: "Register",
    },
    {
      id: 2,
      tiles:["/montclair-pic3.jpg"],
      title: "University Fall Play",
      date: "Mar 12, 2025",
      time: "7:30 PM",
      location: "Alexander Kasser Theater",
      action: "Get Tickets",
    },
    {
      id: 3,
      tiles:["/montclair-pic4.jpg"],
      title: "MSU Football Fan Club ",
      date: "Mar 15, 2025",
      time: "10:00 AM",
      location: "School of Business",
      action: "RSVP",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient">
      <Toaster />

      {/* Hero Section */}
      <section className="container px-4 py-12 md:py-20 mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Welcome to EventU!
            </h1>
            <p className="text-lg text-dark mb-6">
              Your comprehensive platform for discovering, organizing, and
              attending university events. From academic lectures to sports
              competitions and social gatherings - find it all in one place.
            </p>
            <div className="flex gap-4">
              <Link
                href="/explore-events"
                className="btn-primary px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
              >
                Explore Events
              </Link>
              <Link
                href="/create-event"
                className="btn-outline px-4 py-2 border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-50 transition"
              >
                Create Event
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/montclair-pic.jpg"
                alt="University events"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400/red/white?text=EventU";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10 text-black">
          Upcoming Featured Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="h-48 bg-red-200 flex items-center justify-center text-red-600 font-bold">
                <div className="h-48 bg-red-200 flex items-center justify-center text-red-600 font-bold">
  {event.tiles && event.tiles.length > 0 && (
    <img src={event.tiles[0]} alt="Event" className="h-full w-auto object-cover" />
  )}
</div>
              </div>
              <div className="p-5">
                <div className="text-red-600 text-sm font-medium mb-1">
                  {event.date} • {event.time}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4">{event.location}</p>
                <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition">
                  {event.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container px-4 py-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">EventU</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Event Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Event Planning
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              © 2025 EventU - University Event Management System. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
