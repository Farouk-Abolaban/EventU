"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import "./settings.css";

export default function Settings() {
  const router = useRouter();
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    bio: "",
    role: "user", // Default role
    userId: "",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    // Load user profile from localStorage
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    } else if (user) {
      // If no stored profile but user is logged in, create defaults
      setUserProfile({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        bio: "",
        role: "user",
        userId: user.id,
        createdAt: new Date().toISOString(),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make sure we don't overwrite the role and other important fields
    const storedUser = localStorage.getItem("userProfile");
    let updatedProfile = { ...userProfile };

    if (storedUser) {
      const existingProfile = JSON.parse(storedUser);
      // Preserve these fields from the existing profile
      updatedProfile = {
        ...updatedProfile,
        role: existingProfile.role,
        userId: existingProfile.userId || user?.id,
        createdAt: existingProfile.createdAt,
      };
    }

    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    alert("Profile Updated!");
    router.push("/profile"); // Redirect to profile page
  };

  return (
    <div className="settings-container">
      <h1>Profile Settings</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={userProfile.name}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userProfile.email}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <label>Bio:</label>
        <textarea
          name="bio"
          value={userProfile.bio}
          onChange={handleChange}
          rows="4"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        ></textarea>

        {/* Read-only role display */}
        <label>Role:</label>
        <div className="p-2 bg-gray-100 border border-gray-300 rounded text-gray-700">
          {userProfile.role === "admin" && "Administrator"}
          {userProfile.role === "approver" && "Event Approver"}
          {userProfile.role === "user" && "Regular User"}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Your role determines what actions you can perform on EventU. Contact
          an administrator if you need your role changed.
        </p>

        <button
          className="submit bg-red-600 text-white p-2 rounded hover:bg-red-700 transition mt-4"
          type="submit"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
