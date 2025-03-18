"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import "./Profile.css";

export default function Profile() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
  }, []);

  // Function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "approver":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  // Function to get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "approver":
        return "Event Approver";
      default:
        return "Regular User";
    }
  };

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {userProfile ? (
        <div className="profile-card bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <img
              src={user?.imageUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-red-200"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {userProfile.name || user?.fullName || "User"}
          </h2>

          <div className="flex justify-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                userProfile.role
              )}`}
            >
              {getRoleDisplayName(userProfile.role)}
            </span>
          </div>

          <div className="text-left space-y-2 mb-6">
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
            {userProfile.bio && (
              <p>
                <strong>Bio:</strong> {userProfile.bio}
              </p>
            )}
            <p>
              <strong>Member since:</strong>{" "}
              {new Date(userProfile.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => router.push("/settings")}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="profile-card2 bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">
            No profile found. Please update your profile in settings.
          </p>
          <button
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
            onClick={() => router.push("/settings")}
          >
            Go to Settings
          </button>
        </div>
      )}
    </div>
  );
}
