import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import axios from "axios";
import { baseUrl } from "../../constants";

function EditInstagramAccount() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const instaId = queryParams.get("id");

  const isAdmin = localStorage.getItem('is_admin') === 'true' || localStorage.getItem('is_admin') === true ? true : false;


  useEffect(() => {
    setUsername(queryParams.get("username") || "");
    setPassword(queryParams.get("password") || "");
    setNotes(queryParams.get("notes") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${baseUrl}${isAdmin ? '/api/admin/edit-insta-accounts/' : '/api/edit-insta-account/'}`,
        {
          insta_id: instaId,
          username,
          password,
          notes,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setSuccess("Account updated successfully.");
      setTimeout(() => {
        navigate("/instagram/accounts");
      }, 2000);
    } catch (err) {
      console.error("Error updating Instagram account:", err);
      setError(
        err.response?.data?.Message || "Failed to update Instagram account."
      );
    } finally {
      setLoading(false);
    }
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
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                  Edit Instagram Account ✨
                </h1>
              </div>
            </div>

            {/* Form */}
            <div className="max-w-lg bg-white p-8 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      className="form-input w-full border border-gray-300 rounded-md p-2"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      className="form-input w-full border border-gray-300 rounded-md p-2"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="notes"
                    >
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      className="form-input w-full border border-gray-300 rounded-md p-2"
                      type="textarea"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                {loading && <p className="text-blue-500 mt-4">Submitting...</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">{success}</p>}
                <div className="flex items-center justify-between mt-6">
                  <button
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Update Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditInstagramAccount;
