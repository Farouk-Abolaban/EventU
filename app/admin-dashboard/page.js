"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user has admin role
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const { role } = JSON.parse(userProfile);
      if (role === "admin") {
        setIsAdmin(true);
      } else {
        // If not admin, redirect to home
        router.push("/");
      }
    } else {
      // If no profile, redirect to home
      router.push("/");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Users</h2>
          <p className="text-3xl font-bold text-red-600">428</p>
          <p className="text-sm text-gray-600">Total registered users</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Events</h2>
          <p className="text-3xl font-bold text-red-600">56</p>
          <p className="text-sm text-gray-600">Active events this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Pending Approval
          </h2>
          <p className="text-3xl font-bold text-red-600">12</p>
          <p className="text-sm text-gray-600">Events awaiting review</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            {
              action: "New User Registration",
              user: "alex.johnson@example.com",
              time: "10 minutes ago",
            },
            {
              action: "Event Approved",
              user: "Spring Career Fair",
              time: "1 hour ago",
            },
            {
              action: "Event Created",
              user: "Student Government Meeting",
              time: "3 hours ago",
            },
            {
              action: "User Role Changed",
              user: "maria.smith@example.com",
              time: "Yesterday",
            },
            {
              action: "Event Cancelled",
              user: "Campus Tour",
              time: "Yesterday",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-100 pb-2"
            >
              <div>
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition">
              Create Announcement
            </button>
            <button className="w-full py-2 px-4 border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-50 transition">
              Manage Users
            </button>
            <button className="w-full py-2 px-4 border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-50 transition">
              Review Events
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Server Status</span>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Database</span>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Authentication</span>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Last Backup</span>
              <span className="text-gray-600 font-medium">
                Today at 03:00 AM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
