"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, ClipboardCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user has admin role
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/users/profile");

        if (response.ok) {
          const userData = await response.json();
          if (userData.role === "admin") {
            setIsAdmin(true);
            fetchUsers();
          } else {
            // If not admin, redirect to home
            router.push("/");
          }
        } else {
          // If no profile, redirect to home
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");

        if (response.ok) {
          const userData = await response.json();
          setUsers(userData);
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("An error occurred while fetching users");
      }
    };

    checkAdminStatus();
  }, [router]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Update user in local state
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success("User role updated successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("An error occurred while updating user role");
    }
  };

  // Function to get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield size={18} className="text-purple-500" />;
      case "approver":
        return <ClipboardCheck size={18} className="text-blue-500" />;
      default:
        return <User size={18} className="text-gray-500" />;
    }
  };

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
      <h1 className="text-3xl font-bold text-red-600 mb-6">User Management</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-gray-700 mb-2">
          As an administrator, you can manage user roles and permissions.
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-medium">Role Definitions:</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <User size={18} className="text-gray-500 mr-2" />
              <span className="font-medium">User</span>
            </div>
            <p className="text-sm text-gray-600">
              Can create events and register for approved events.
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <ClipboardCheck size={18} className="text-blue-500 mr-2" />
              <span className="font-medium">Approver</span>
            </div>
            <p className="text-sm text-gray-600">
              Can review and approve/reject event submissions.
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <Shield size={18} className="text-purple-500 mr-2" />
              <span className="font-medium">Admin</span>
            </div>
            <p className="text-sm text-gray-600">
              Has full access to all system features and can manage users.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Users</h2>

        {users.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-md text-center">
            <AlertCircle size={24} className="text-yellow-500 mx-auto mb-2" />
            <p className="text-yellow-800">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-gray-600 font-medium">
                    Name
                  </th>
                  <th className="p-3 text-left text-gray-600 font-medium">
                    Email
                  </th>
                  <th className="p-3 text-left text-gray-600 font-medium">
                    Role
                  </th>
                  <th className="p-3 text-left text-gray-600 font-medium">
                    Joined
                  </th>
                  <th className="p-3 text-left text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{user.name}</td>
                    <td className="p-3 text-gray-800">{user.email}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className="ml-2 capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="user">User</option>
                        <option value="approver">Approver</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
