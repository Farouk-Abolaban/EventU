"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function RoleSwitcher() {
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    // Fetch user profile to determine role
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/users/profile");

        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.role);
          setIsAdmin(userData.role === "admin");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Don't show the component if not admin
  if (!isClient || !isAdmin) {
    return null;
  }

  return (
    <div className="relative mr-4">
      <button
        onClick={() => router.push("/admin-dashboard")}
        className="flex items-center space-x-1 text-sm px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
      >
        <Shield size={14} />
        <span>Admin</span>
      </button>
    </div>
  );
}
