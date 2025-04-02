"use client";

import { useState, useEffect, useRef } from "react";
import { Shield, ChevronDown, User, ClipboardCheck } from "lucide-react";

export default function RoleSwitcher() {
  const [userRole, setUserRole] = useState("user");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get user role from localStorage
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const { role } = JSON.parse(userProfile);
      setUserRole(role);
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Switch to a different role
  const switchRole = (newRole) => {
    // Get current user profile
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      // Update role
      profile.role = newRole;
      // Save back to localStorage
      localStorage.setItem("userProfile", JSON.stringify(profile));
      // Update state
      setUserRole(newRole);
      // Close dropdown
      setDropdownOpen(false);

      // Refresh page to apply role changes
      window.location.reload();
    }
  };

  // Get role icon and color
  const getRoleDetails = (role) => {
    switch (role) {
      case "admin":
        return {
          icon: <Shield size={16} />,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Administrator",
        };
      case "approver":
        return {
          icon: <ClipboardCheck size={16} />,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Event Approver",
        };
      default:
        return {
          icon: <User size={16} />,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "User",
        };
    }
  };

  const currentRoleDetails = getRoleDetails(userRole);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-1 mr-2 px-3 py-1.5 rounded-md border border-red-200 hover:bg-red-50 transition"
      >
        <span className={`${currentRoleDetails.color}`}>
          {currentRoleDetails.icon}
        </span>
        <span className="text-sm hidden md:inline text-red-600">
          {currentRoleDetails.label}
        </span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-1 border border-gray-200 z-50">
          <p className="px-3 py-2 text-xs text-red-500 font-medium">
            Switch Role
          </p>

          {/* User Role */}
          <button
            onClick={() => switchRole("user")}
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
              userRole === "user" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <span className="text-red-600 mr-2">
              <User size={16} />
            </span>
            <span className="text-red-600">User</span>
            {userRole === "user" && (
              <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Approver Role */}
          <button
            onClick={() => switchRole("approver")}
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
              userRole === "approver" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <span className="text-red-600 mr-2">
              <ClipboardCheck size={16} />
            </span>
            <span className="text-red-600">Event Approver</span>
            {userRole === "approver" && (
              <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Admin Role */}
          <button
            onClick={() => switchRole("admin")}
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
              userRole === "admin" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <span className="text-red-600 mr-2">
              <Shield size={16} />
            </span>
            <span className="text-red-600">Administrator</span>
            {userRole === "admin" && (
              <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
