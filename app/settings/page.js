"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import "./settings.css";
import { toast } from "sonner";

export default function Settings() {
  const router = useRouter();
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    bio: "",
    role: "user", // Default role
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch user profile from the API
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/profile");

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          // If profile doesn't exist yet and we have user data from Clerk
          if (user) {
            setUserProfile({
              name: user.fullName || "",
              email: user.emailAddresses[0]?.emailAddress || "",
              bio: "",
              role: "user",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userProfile.name,
          email: userProfile.email,
          bio: userProfile.bio,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        router.push("/profile");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

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
          value={userProfile.bio || ""}
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
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
