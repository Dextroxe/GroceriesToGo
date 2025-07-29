"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, Edit, Trash2, X } from "lucide-react";

// Define the types to match your API response
interface Role {
  _id: string;
  role_name: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UserData {
  _id: string;
  role_id: string;
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: boolean;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UserWithRole {
  user: UserData;
  role: Role;
}

export default function UserTable() {
  // State for users with their roles
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRole[]>([]);
  const [editUser, setEditUser] = useState<UserWithRole | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users and extract available roles
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://groceries-to-go-back-end.vercel.app//api/users`);
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const userData = await response.json();

        if (userData?.success && Array.isArray(userData.data)) {
          setUsersWithRoles(userData.data);

          // Extract unique roles from the data
          const roles = ["staff", "admin", "manager"];
          // const uniqueRoles = Array.from(
          //   new Map(roles.map((role) => [role._id, role])).values()
          // );
          setAvailableRoles(roles);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Function to toggle user active status
  const toggleUserStatus = async (
    userWithRole: UserWithRole,
    newStatus: boolean
  ) => {
    try {
      const updatedUser = {
        ...userWithRole.user,
        status: newStatus,
      };

      const response = await fetch(`https://groceries-to-go-back-end.vercel.app//api/users/update`, {
        method: "POST",
        body: JSON.stringify({
          user_id: userWithRole.user._id,
          userUpdatedData: updatedUser,
        }),
      });

      if (response.ok) {
        // Update local state
        setUsersWithRoles((prevUsers) =>
          prevUsers.map((item) =>
            item.user._id === userWithRole.user._id
              ? { ...item, user: { ...item.user, status: newStatus } }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Function to handle edit button click
  const handleEdit = (userWithRole: UserWithRole) => {
    setEditUser({ ...userWithRole });
  };

  // Function to save edited user
  const updateHandler = async () => {
    try {
      console.log(editUser);
      if (editUser) {
        const response = await fetch(`https://groceries-to-go-back-end.vercel.app//api/users/update`, {
          method: "POST",
          body: JSON.stringify({
            user_id: editUser.user._id,
            userUpdatedData: editUser.user,
          }),
        });
        const responseRole = await fetch(
          `https://groceries-to-go-back-end.vercel.app//api/role/update`,
          {
            method: "POST",
            body: JSON.stringify({
              role_id: editUser.user.role_id,
              role_name: editUser.role.role_name,
            }),
          }
        );

        if (response.ok && responseRole.ok) {
          console.log(responseRole, response);
          // Update the local state
          setUsersWithRoles((prevUsers) =>
            prevUsers.map((item) =>
              item.user._id === editUser.user._id ? editUser : item
            )
          );
          setEditUser(null);
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Function to cancel edit
  const cancelEdit = () => {
    setEditUser(null);
  };

  // Function to handle delete button click
  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`https://groceries-to-go-back-end.vercel.app//api/users/delete`, {
        method: "POST",
        body: JSON.stringify({
          id: userId,
        }),
      });

      if (response.ok) {
        setUsersWithRoles((prevUsers) =>
          prevUsers.filter((item) => item.user._id !== userId)
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Function to handle input changes in edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      setEditUser({
        ...editUser,
        user: {
          ...editUser.user,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  // Function to handle role selection
  const handleRoleChange = async ({
    // userId,
    roleId,
    roleName,
  }: {
    // userId: string;
    roleId: string;
    roleName: string;
  }) => {
    try {
      // Find the user to update
      // const userToUpdate = usersWithRoles.find(
      //   (item) => item.user._id === userId
      // );

      if (roleId && roleName) {
        // Create updated user data
        // const updatedUserData = {
        //   ...userToUpdate.user,
        //   role_id: roleId,
        // };

        // Send update to server
        const response = await fetch(`https://groceries-to-go-back-end.vercel.app//api/role/update`, {
          method: "POST",
          body: JSON.stringify({
            role_name: roleName,
            role_id: roleId,
          }),
        });

        if (response.ok) {
          // Update local state
          setUsersWithRoles((prevUsers) =>
            prevUsers.map((item) =>
              item.user._id === userId
                ? {
                    ...item,
                    user: { ...item.user, role_id: roleId },
                    role: { ...item.role, _id: roleId, role_name: roleName },
                  }
                : item
            )
          );
        }
      }

      // Close the dropdown
      setOpenDropdownId(null);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
              <button
                onClick={cancelEdit}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={editUser.user.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={editUser.user.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editUser.user.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={editUser.user.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={editUser.user.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={editUser.role.role_name}
                    onChange={(e) => {
                      const selectedRole = availableRoles.find(
                        (role) => role === e.target.value
                      );
                      if (selectedRole) {
                        setEditUser({
                          ...editUser,
                          user: { ...editUser.user },
                          role: { ...editUser.role, role_name: selectedRole },
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute w-4 h-4 text-gray-500 pointer-events-none right-3 top-3" />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={updateHandler}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersWithRoles.map((item) => (
              <tr
                key={item.user._id}
                className={`hover:bg-gray-50 ${
                  !item.user.status ? "bg-gray-50 text-gray-500" : ""
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {item.user.first_name.charAt(0)}
                      {item.user.last_name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {item.user.first_name} {item.user.last_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.user.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.user.username}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.user.phone_number}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="relative flex justify-start">
                    <span className="inline-flex items-center mr-2 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
                      {item.role.role_name}
                    </span>

                    {/* {openDropdownId === item.user._id && (
                      <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {availableRoles.map((role, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleRoleChange({
                                  roleId: item.user.role_id,
                                  roleName: item.role.role_name,
                                })
                              }
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                item.role._id === role
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleUserStatus(item, !item.user.status)}
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        item.user.status ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          item.user.status ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="ml-2 text-sm text-gray-500">
                      {item.user.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.user._id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usersWithRoles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      )}
    </div>
  );
}
