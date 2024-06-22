import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../constants";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/view-all-users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setUsers(response.data.Data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  const handleEditUser = async (user) => {
    try {
      setLoading(true);
      await axios.post(
        `${baseUrl}/api/admin/modify-user/`,
        {
          email: user.email,
          new_name: user.new_name,
          new_password: user.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("User updated successfully.");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user.");
      setLoading(false);
    }
  };

  const handleDeleteUser = async (email) => {
    try {
      setLoading(true);
      await axios.post(
        `${baseUrl}/api/admin/delete-user/`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("User deleted successfully.");
      setDeleteUser(null);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    handleEditUser(editUser);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="p-4 bg-white shadow rounded">
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
              <h1 className="text-xl font-bold mb-4">User Management</h1>

              {editUser && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold mb-2">Edit User</h2>
                  <form onSubmit={handleEditSubmit} className="bg-gray-100 p-4 rounded">
                    <div className="mb-2">
                      <label className="block mb-1 font-semibold">New Name:</label>
                      <input
                        type="text"
                        name="new_name"
                        value={editUser.new_name || ""}
                        onChange={handleEditChange}
                        className="border p-2 rounded w-full"
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block mb-1 font-semibold">New Password:</label>
                      <input
                        type="password"
                        name="new_password"
                        value={editUser.new_password || ""}
                        onChange={handleEditChange}
                        className="border p-2 rounded w-full"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditUser(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {deleteUser && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold mb-2">Delete User</h2>
                  <p>Are you sure you want to delete this user?</p>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDeleteUser(deleteUser)}
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteUser(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Created</th>
                    <th className="py-2 px-4 border-b">Insta Accounts</th>
                    <th className="py-2 px-4 border-b">Messages</th>
                    <th className="py-2 px-4 border-b">Leads</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.user_data.id}>
                      <td className="border px-4 py-2">{user.user_data.email}</td>
                      <td className="border px-4 py-2">{user.user_data.name}</td>
                      <td className="border px-4 py-2">
                        {new Date(user.user_data.created).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">{user.Total_Insta_account}</td>
                      <td className="border px-4 py-2">{user.Total_Message_count}</td>
                      <td className="border px-4 py-2">{user.Total_lead_count}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => setEditUser({ ...user.user_data })}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => setDeleteUser(user.user_data.email)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersManagementPage;
