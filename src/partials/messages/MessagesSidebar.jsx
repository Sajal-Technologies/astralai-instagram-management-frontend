import React from "react";
import ChannelMenu from "./ChannelMenu";
import DirectMessages from "./DirectMessages";
import Channels from "./Channels";

import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { baseUrl } from "../../constants";

function MessagesSidebar({ msgSidebarOpen, setMsgSidebarOpen }) {

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromUsername = queryParams.get("fromUsername");
  const toUsername = queryParams.get("toUsername");

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          `${baseUrl}/api/get-lead-data/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        setLeads(response.data.Lead_data);
        setFilteredLeads(response.data.Lead_data)
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError(err.response?.data?.Message || "Failed to fetch leads.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);



  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredLeads(
      leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(term) ||
          lead.username.toLowerCase().includes(term) ||
          lead.leads_status.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div
      id="messages-sidebar"
      className={`absolute z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${
        msgSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="sticky top-16 bg-white overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-r border-slate-200 md:w-72 xl:w-80 h-[calc(100vh-64px)]">
        {/* #Marketing group */}
        <div>
          {/* Group header */}
          <div className="sticky top-0 z-10">
            <div className="flex items-center bg-white border-b border-slate-200 px-5 h-16">
              <div className="w-full flex items-center justify-between">
                {/* Channel menu */}
                <ChannelMenu />
                {/* Edit button */}
                <button className="p-1.5 shrink-0 rounded border border-slate-200 hover:border-slate-300 shadow-sm ml-2">
                  <svg
                    className="w-4 h-4 fill-current text-slate-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Group body */}
          <div className="p-[10px]">
            {/* Search form */}
            <form className="relative">
              <label htmlFor="msg-search" className="sr-only">
                Search
              </label>
              <input
                id="msg-search"
                className="form-input w-full pl-9 focus:border-slate-300"
                type="search"
                placeholder="Search…"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button
                className="absolute inset-0 right-auto group"
                type="submit"
                aria-label="Search"
              >
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </form>
            {/* Direct messages */}
            {!loading &&
            <DirectMessages
              msgSidebarOpen={msgSidebarOpen}
              setMsgSidebarOpen={setMsgSidebarOpen}
              leads={filteredLeads}
            />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesSidebar;
