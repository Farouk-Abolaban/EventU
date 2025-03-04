"use client";
import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Calendar, Settings, LogOut } from "lucide-react";

export default function CustomUserDropdown() {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
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

  return (
    <div className="relative">
      {/* Improved button styling and alignment */}
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
