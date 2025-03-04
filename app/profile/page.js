"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./Profile.css";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {user ? (
        <div className="profile-card">
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <button onClick={() => router.push("/settings")}>Edit Profile</button>
        </div>
      ) : (
        <div className="profile-card2">
          <p>No profile found. Please update your profile in settings.</p>
          <button className="submit" onClick={() => router.push("/settings")}>Go to Settings</button>
        </div>
      )}
    </div>
  );
}
