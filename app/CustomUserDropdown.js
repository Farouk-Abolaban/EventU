"use client";
import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  Calendar,
  Settings,
  LogOut,
  Shield,
  ClipboardCheck,
} from "lucide-react";

export default function CustomUserDropdown() {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState("user"); // Default to regular user
  const router = useRouter();
  // Add a state for client-side rendering
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);

    // Get user role from localStorage
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const { role } = JSON.parse(userProfile);
      setUserRole(role);
    }
  }, []);

  // Base menu items for all roles
  const baseMenuItems = [
    {
      label: "Profile",
      icon: <User size={16} />,
      action: () => router.push("/profile"),
    },
    {
      label: "My Events",
      icon: <Calendar size={16} />,
      action: () => router.push("/my-events"),
    },
    {
      label: "Settings",
      icon: <Settings size={16} />,
      action: () => router.push("/settings"),
    },
  ];

  // Role-specific menu items
  const roleMenuItems = {
    admin: [
      {
        label: "Admin Dashboard",
        icon: <Shield size={16} />,
        action: () => router.push("/admin-dashboard"),
      },
    ],
    approver: [
      {
        label: "Pending Approvals",
        icon: <ClipboardCheck size={16} />,
        action: () => router.push("/pending-approvals"),
      },
    ],
    user: [], // Regular users just get the base items
  };

  // Combine base menu items with role-specific items
  const menuItems = [...baseMenuItems, ...(roleMenuItems[userRole] || [])];

  // Only render the full component on the client side
  if (!isClient) {
    return (
      <div className="relative">
        <button className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 transition">
          <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-100"></div>
          <ChevronDown size={16} className="text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
      >
        <img
          src={user?.imageUrl || "/default-avatar.png"}
          alt="User Avatar"
          className="w-8 h-8 rounded-full border border-gray-200"
        />
        <ChevronDown size={16} className="text-gray-600" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md p-2 border border-gray-200 z-50">
          <div className="px-4 py-2">
            <p className="text-sm font-semibold text-gray-700 truncate">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
            <p className="text-xs font-medium mt-1 text-red-600 capitalize">
              {userRole}
            </p>
          </div>
          <hr className="my-1" />

          {/* Dropdown Menu Items */}
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
              onClick={item.action}
            >
              <span className="text-gray-500 mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <hr className="my-1" />

          {/* Sign Out */}
          <SignOutButton>
            <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition">
              <span className="text-red-500 mr-2">
                <LogOut size={16} />
              </span>
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}
