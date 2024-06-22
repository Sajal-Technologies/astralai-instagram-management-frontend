import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import axios from "axios";
import { baseUrl } from "../../constants";
import GroupAvatar01 from "../../images/group-avatar-01.png";
import GroupAvatar02 from "../../images/group-avatar-02.png";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import UsersTilesCard from "../../partials/community/UsersTilesCard";

function ViewSingleAccount() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newLead, setNewLead] = useState({
    name: "",
    username: "",
    status: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({
    name: "",
    username: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");
  const password = queryParams.get("password");
  const notes = queryParams.get("notes");
  const id = queryParams.get("id");


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
        setFilteredLeads(response.data.Lead_data);
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError(err.response?.data?.Message || "Failed to fetch leads.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleSelectLead = (leadId) => {
    setSelectedLeads((prevSelected) =>
      prevSelected.includes(leadId)
        ? prevSelected.filter((id) => id !== leadId)
        : [...prevSelected, leadId]
    );
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${baseUrl}/api/delete-lead-id/`,
        {
          lead_id: selectedLeads,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setLeads((prevLeads) =>
        prevLeads.filter((lead) => !selectedLeads.includes(lead.lead_id))
      );
      setFilteredLeads((prevLeads) =>
        prevLeads.filter((lead) => !selectedLeads.includes(lead.lead_id))
      );
      setSuccess("Leads deleted successfully.");
      setSelectedLeads([]);
    } catch (err) {
      console.error("Error deleting leads:", err);
      setError(err.response?.data?.Message || "Failed to delete leads.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 5000);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.username) {
      setError("All fields are required for adding a new lead.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${baseUrl}/api/save-lead-data/`,
        {
          instagram_id: id,
          leads: [newLead],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setLeads((prevLeads) => [...prevLeads, newLead]);
      setFilteredLeads((prevLeads) => [...prevLeads, newLead]);
      setSuccess("Lead added successfully.");
      setNewLead({ name: "", username: "", status: "" });
    } catch (err) {
      console.error("Error adding lead:", err);
      setError(err.response?.data?.Message || "Failed to add lead.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 5000);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleFileUpload = (e) => {
    setCsvFile(e.target.files[0]);
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      error: (err) => {
        console.error("Error parsing CSV file:", err);
        setError("Failed to parse CSV file.");
        setTimeout(() => setError(""), 5000);
      },
    });
  };

  const handleFieldMappingChange = (e) => {
    setFieldMapping({ ...fieldMapping, [e.target.name]: e.target.value });
  };

  const handleUploadCsvData = async () => {
    const mappedData = csvData
      .map((row) => {
        const name = row[fieldMapping.name];
        const username = row[fieldMapping.username];
        const status = row[fieldMapping.status] || "New";

        if (!name || !username) {
          console.error("Missing required fields in row:", row);
          return null;
        }

        return { name, username, status };
      })
      .filter((data) => data !== null);

    if (mappedData.length === 0) {
      setError(
        "No valid data to upload. Please check your CSV file and mappings."
      );
      return;
    }

    console.log("Mapped Data:", mappedData);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${baseUrl}/api/save-lead-data/`,
        {
          instagram_id: id,
          leads: mappedData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setLeads((prevLeads) => [...prevLeads, ...mappedData]);
      setFilteredLeads((prevLeads) => [...prevLeads, ...mappedData]);
      setSuccess("CSV file uploaded and leads added successfully.");
      setCsvFile(null);
      setCsvData([]);
      setFieldMapping({ name: "", username: "", status: "" });
    } catch (err) {
      console.error("Error uploading CSV data:", err);
      setError(err.response?.data?.Message || "Failed to upload CSV data.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 5000);
      setTimeout(() => setError(""), 5000);
    }
  };

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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto">
            <div className="xl:flex">
              {/* Left content */}
              <div className="flex-1 md:ml-8 xl:mx-4 2xl:mx-8">
                <div className="md:py-8">
                  {/* Account Details */}
                  <div
                    className={`col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200`}
                  >
                    <div className="flex flex-col h-full">
                      {/* Card top */}
                      <div className="grow p-5">
                        <div className="flex justify-between items-start">
                          {/* Image + name */}
                          <header>
                            <div className="flex mb-2">
                              <Link
                                className="relative inline-flex items-start mr-5"
                                to={`#`}
                              >
                                <div
                                  className="absolute top-0 right-0 -mr-2 bg-white rounded-full shadow"
                                  aria-hidden="true"
                                >
                                  <svg
                                    className="w-8 h-8 fill-current text-amber-500"
                                    viewBox="0 0 32 32"
                                  >
                                    <path d="M21 14.077a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 010 1.5 1.5 1.5 0 00-1.5 1.5.75.75 0 01-.75.75zM14 24.077a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z" />
                                  </svg>
                                </div>
                              </Link>
                              <div className="mt-1 pr-1">
                                <Link
                                  className="flex flex-col text-slate-800 hover:text-slate-900"
                                  to={`#`}
                                >
                                  <h2 className="text-xl leading-snug justify-center font-semibold">
                                    {username}
                                  </h2>
                                  <p className="text-xs leading-snug justify-center text-grey">
                                    {password}
                                  </p>
                                </Link>
                              </div>
                            </div>
                          </header>

                          <Link
                            className="block flex-1 text-center text-sm text-indigo-500 hover:text-indigo-600 font-medium px-3 py-4"
                            to={`/messages?fromUsername=${username}`}
                          >
                            <div className="flex items-center justify-end">
                              <svg
                                className="w-4 h-4 fill-current shrink-0 mr-2"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
                              </svg>
                              <span>Messages</span>
                            </div>
                          </Link>
                        </div>
                        {/* Bio */}
                        <div className="mt-2">
                          <div className="text-sm">{notes}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADD NEW LEAD */}
                <div>
                  <div className="bg-white p-4 rounded border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4">
                      Add New Leads
                    </h2>
                    <div className="">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                      />
                      {csvData.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Map CSV Fields
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Name Field
                              </label>
                              <select
                                className="form-select w-full"
                                name="name"
                                value={fieldMapping.name}
                                onChange={handleFieldMappingChange}
                              >
                                <option value="">Select Name Field</option>
                                {Object.keys(csvData[0]).map((field, index) => (
                                  <option key={index} value={field}>
                                    {field}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Username Field
                              </label>
                              <select
                                className="form-select w-full"
                                name="username"
                                value={fieldMapping.username}
                                onChange={handleFieldMappingChange}
                              >
                                <option value="">Select Username Field</option>
                                {Object.keys(csvData[0]).map((field, index) => (
                                  <option key={index} value={field}>
                                    {field}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Status Field (Optional)
                              </label>
                              <select
                                className="form-select w-full"
                                name="status"
                                value={fieldMapping.status}
                                onChange={handleFieldMappingChange}
                              >
                                <option value="">Default to New</option>
                                {Object.keys(csvData[0]).map((field, index) => (
                                  <option key={index} value={field}>
                                    {field}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button
                            className="btn-sm bg-blue-500 hover:bg-blue-600 text-white mt-4"
                            onClick={handleUploadCsvData}
                          >
                            Upload CSV Data
                          </button>
                        </div>
                      )}
                    </div>
                    <p className=" mt-4 mb-2">OR</p>
                    <div className="space-y-1">
                      <div>
                        <input
                          className="form-input w-full"
                          placeholder="Name"
                          type="text"
                          value={newLead.name}
                          onChange={(e) =>
                            setNewLead({ ...newLead, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <input
                          className="form-input w-full"
                          type="text"
                          placeholder="Username"
                          value={newLead.username}
                          onChange={(e) =>
                            setNewLead({
                              ...newLead,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <input
                          className="form-input w-full mb-2"
                          type="text"
                          placeholder="Status eg. New"
                          value={newLead.status}
                          onChange={(e) =>
                            setNewLead({ ...newLead, status: e.target.value })
                          }
                        />
                      </div>
                      <button
                        className="btn-sm bg-blue-500 hover:bg-blue-600 text-white "
                        onClick={handleAddLead}
                      >
                        Add Lead
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right content */}
              <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar md:py-8 w-[50%]">
                <div className="mb-6">
                  <form className="relative">
                    <label htmlFor="feed-search-desktop" className="sr-only">
                      Search
                    </label>
                    <input
                      id="feed-search-desktop"
                      className="form-input w-full focus:border-slate-300"
                      type="search"
                      placeholder="Search Leads…"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </form>
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-4">
                    Leads
                  </div>

                  {/* Leads Actions */}
                  <div className="flex justify-start space-x-4 mt-4 mb-4">
                    <button
                      className="btn-sm bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleDelete}
                      disabled={selectedLeads.length === 0}
                    >
                      {loading
                        ? "Deleting..."
                        : selectedLeads.length !== 0
                        ? "Delete Selected"
                        : "Select to Delete"}
                    </button>
                  </div>

                  {loading && <p className="text-blue-500">Loading...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {success && <p className="text-green-500">{success}</p>}
                  <ul className="space-y-3">
                    {filteredLeads.map((lead, index) => (
                      lead.instagram_account === username
                        &&
                        <li
                        key={index}
                        className="flex items-center justify-space-between"
                      >
                        <div className="flex items-center w-[-webkit-fill-available]">
                          <input
                            type="checkbox"
                            className="form-checkbox mr-2"
                            checked={selectedLeads.includes(lead["Lead ID"])}
                            onChange={() => handleSelectLead(lead["Lead ID"])}
                          />
                          <div className="relative mr-3">
                            <img
                              className="w-8 h-8 rounded-full"
                              src={
                                index % 2 === 0 ? GroupAvatar01 : GroupAvatar02
                              }
                              width="32"
                              height="32"
                              alt={`Lead ${index + 1}`}
                            />
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-medium text-slate-800">
                              {lead.name}
                            </span>
                            <p className="text-xs text-slate-600">
                              {lead.username}
                            </p>
                            <p className="text-xs text-slate-600">
                              {lead.leads_status}
                            </p>
                            <p className="text-xs text-slate-600">
                              {lead.csv_file_number}
                            </p>
                          </div>
                          <Link
                            className="block flex-1 text-center text-sm text-indigo-500 hover:text-indigo-600 font-medium px-3 py-4"
                            to={`/messages?fromUsername=${username}&toUsername=${JSON.stringify([lead.username])}&toName=${JSON.stringify([lead.name])}`}
                          >
                            <div className="flex items-center justify-end">
                              <svg
                                className="w-4 h-4 fill-current shrink-0 mr-2"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
                              </svg>
                              <span>Message</span>
                            </div>
                          </Link>
                        </div>
                      </li> 
                      
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ViewSingleAccount;
