"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Loader2, Search, Calendar, Info, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setLoading(true); // Shows loading state animation before redirect
      router.push("/home");
    }
  }, [isSignedIn, router]);

  // Sample featured events data
  const featuredEvents = [
    {
      id: 1,
      title: "Spring Career Fair",
      date: "Mar 5, 2025",
      time: "4:00 PM",
      location: "Student Union Building",
      action: "Register"
    },
    {
      id: 2,
      title: "University Symphony Concert",
      date: "Mar 12, 2025",
      time: "7:30 PM",
      location: "Performing Arts Center",
      action: "Get Tickets"
    },
    {
      id: 3,
      title: "Alumni Networking Breakfast",
      date: "Mar 15, 2025",
      time: "10:00 AM",
      location: "Business School Atrium",
      action: "RSVP"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-red-100">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-red-600">EventU</Link>
          </div>
          
          <nav className="mt-4 md:mt-0">
            <ul className="flex flex-wrap gap-6">
              <li><Link href="#" className="text-gray-700 hover:text-red-600 transition">Home</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-red-600 transition">Events</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-red-600 transition">Calendar</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-red-600 transition">About Us</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-red-600 transition">Contact</Link></li>
            </ul>
          </nav>
          
          <div className="relative mt-4 md:mt-0 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search events..." 
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-full w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">Welcome to EventU!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Your comprehensive platform for discovering, organizing, and attending university events. 
              From academic lectures to sports competitions and social gatherings - find it all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300">
                Explore Events
              </button>
              <button className="px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-lg shadow-md hover:bg-red-50 transition duration-300">
                Create Event
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/campus-events.jpg" 
                alt="University events" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400/red/white?text=EventU";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sign In Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Welcome to EventU!</h1>
          <p className="text-lg text-gray-700 mb-6">University Event Management System</p>

          {/* Shows loading spinner to user when redirecting */}
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin h-10 w-10 text-red-600" />
              <p className="mt-2 text-gray-600">Redirecting...</p>
            </div>
          ) : (
            !isSignedIn && isLoaded && (
              <div>
                <SignInButton
                  mode="modal"
                  afterSignInUrl="/home"
                  className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 focus:ring focus:ring-red-300"
                >
                  Sign In
                </SignInButton>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">OR SIGN IN WITH</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                    Google
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                    University SSO
                  </button>
                </div>
                
                <p className="mt-6 text-gray-600">
                  Don't have an account? <a href="#" className="text-red-600 hover:underline">Register</a>
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-center mb-10">Upcoming Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="h-48 bg-red-200 flex items-center justify-center">
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
                <div className="text-red-600 text-sm font-medium mb-1">{event.date} • {event.time}</div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
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
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">EventU</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-300 hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Our Team</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Help Center</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Event Guidelines</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Event Planning</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Cookie Policy</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Accessibility</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Facebook</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Twitter</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">Instagram</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 EventU - University Event Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}