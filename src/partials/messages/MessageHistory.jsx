import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../constants";
import Sidebar from "../Sidebar";
import Header from "../Header";

function MessageHistory() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${baseUrl}/api/get-insta-account/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setAccounts(response.data.data);
      } catch (error) {
        setError("Failed to fetch Instagram accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      const fetchMessages = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await axios.post(
            `${baseUrl}/api/get-message/`,
            { instagram_account_id: selectedAccountId },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          setMessages(response.data.Message_data);
        } catch (error) {
          setError("Failed to fetch messages");
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [selectedAccountId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredMessages = messages
    .filter((message) =>
      message["Message content"].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a["Message scheduled_time"]) - new Date(b["Message scheduled_time"]);
      } else {
        return new Date(b["Message scheduled_time"]) - new Date(a["Message scheduled_time"]);
      }
    });

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
            <div className="container mx-auto p-4">
              <h2 className="text-2xl font-semibold mb-4">{selectedAccountId ? 'Message History' : "Select Account to view Message History"}</h2>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <ul className="bg-white shadow-md rounded p-4 lg:w-1/3">
                  {accounts.map((account) => (
                    <li
                      key={account.id}
                      className={`p-2 cursor-pointer rounded mb-2 border-2 ${
                        selectedAccountId === account.id ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                      }`}
                      onClick={() => setSelectedAccountId(account.id)}
                    >
                      {account["Instagram username"]}
                    </li>
                  ))}
                </ul>

                {selectedAccountId && (
                  <div className="lg:w-2/3">
                    <div className="flex space-x-4 mb-4">
                      <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-input w-full px-4 py-2 rounded shadow"
                      />
                      <button
                        onClick={handleSort}
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow"
                      >
                        Sort by Scheduled Time ({sortOrder === "asc" ? "Ascending" : "Descending"})
                      </button>
                    </div>
                    <ul className="bg-white shadow-md rounded p-4 space-y-4">
                      {filteredMessages.map((message) => (
                        <li key={message["Message id"]} className="p-4 border rounded shadow-sm">
                          <p className="text-lg">{message["Message content"]}</p>
                          <p className={`mt-2 ${message["Message sent status"] ? "text-green-500" : "text-red-500"}`}>
                            {message["Message sent status"] ? "Sent" : "Not Sent"}
                          </p>
                          <p className="text-gray-600">Scheduled Time: {new Date(message["Message scheduled_time"]).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MessageHistory;
