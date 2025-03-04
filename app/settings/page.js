"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./settings.css";

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(user));
    alert("Profile Updated!");
    router.push("/profile"); // Redirect to profile page
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={user.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={user.email} onChange={handleChange} required />

        <label>Bio:</label>
        <textarea name="bio" value={user.bio} onChange={handleChange} rows="4"></textarea>

        <button  className="submit" type="submit">Save Changes</button>
      </form>
    </div>
  );
}
