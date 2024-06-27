import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import UserImage01 from "../../images/user-32-01.jpg";
import UserImage02 from "../../images/user-32-02.jpg";

function DirectMessages({ setMsgSidebarOpen, leads }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [uniqueCsvFiles, setUniqueCsvFiles] = useState([]);
  const [selectedCsvFile, setSelectedCsvFile] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const fromUsername = queryParams.get("fromUsername");

  // Filter leads based on fromUsername
  const filteredLeads = useMemo(() => leads.filter(lead => lead.instagram_account === fromUsername), [leads, fromUsername]);

  useEffect(() => {
    const csvFiles = [...new Set(filteredLeads.map((lead) => lead.csv_file_number))];
    setUniqueCsvFiles(csvFiles);
  }, [filteredLeads]);

  const handleClickLead = (leadUsername, leadName) => {
    if (!isSelectionMode) {
      const params = new URLSearchParams(window.location.search);
      params.set("toUsername", JSON.stringify([leadUsername]));
      params.set("toName", JSON.stringify([leadName]));
      navigate({ search: params.toString() });
    } else {
      handleToggleLead({ username: leadUsername, name: leadName });
    }
  };

  const handleToggleLead = (lead) => {
    setSelectedLeads((prevSelectedLeads) => {
      if (prevSelectedLeads.some((selectedLead) => selectedLead.username === lead.username)) {
        return prevSelectedLeads.filter((selectedLead) => selectedLead.username !== lead.username);
      } else {
        return [...prevSelectedLeads, lead];
      }
    });
  };

  const handleFinalizeSelection = () => {
    const usernames = selectedLeads.map((lead) => lead.username);
    const names = selectedLeads.map((lead) => lead.name);
    const params = new URLSearchParams(window.location.search);
    params.set("toUsername", JSON.stringify(usernames));
    params.set("toName", JSON.stringify(names));
    navigate({ search: params.toString() });
  };

  const handleToggleMode = () => {
    setIsSelectionMode((prevMode) => !prevMode);
    setSelectedLeads([]);
    setSelectedCsvFile("");
  };

  const handleSelectCsvFile = (event) => {
    const csvFile = event.target.value;
    setSelectedCsvFile(csvFile);
    if (csvFile) {
      const leadsToSelect = filteredLeads.filter((lead) => lead.csv_file_number === csvFile);
      setSelectedLeads(leadsToSelect);
      setIsSelectionMode(true); // Enter selection mode when a CSV file is selected
    } else {
      setSelectedLeads([]);
      setIsSelectionMode(false); // Exit selection mode when no CSV file is selected
    }
  };

  return (
    <div className="mt-4">
      <div className="text-xs font-semibold text-slate-400 uppercase mb-3">
        LEADS
      </div>
      <div className="mb-4">
        <select
          className="form-select w-full p-2 border border-slate-300 rounded"
          value={selectedCsvFile}
          onChange={handleSelectCsvFile}
        >
          <option value="">Select CSV File</option>
          {uniqueCsvFiles.map((csvFile, index) => (
            <option key={index} value={csvFile}>
              {csvFile}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between mb-4">
        <button
          className={`btn ${isSelectionMode ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"} text-white p-1 m-2 rounded`}
          onClick={handleToggleMode}
        >
          {isSelectionMode ? "Exit Selection Mode" : "Enter Selection Mode"}
        </button>
        {isSelectionMode && (
          <button
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white p-1 m-2 rounded"
            onClick={handleFinalizeSelection}
            disabled={selectedLeads.length === 0}
          >
            Send Messages
          </button>
        )}
      </div>
      <ul className="mb-6">
        {filteredLeads.map((lead, index) => (
          <li
            key={index}
            className={`flex items-center justify-space-between py-2 px-4 cursor-pointer rounded m-1 ${
              selectedLeads.some((selectedLead) => selectedLead.username === lead.username) ? "bg-gray-200" : ""
            }`}
            onClick={() => handleClickLead(lead.username, lead.name)}
          >
            <div className="flex items-center w-full">
              <div className="relative mr-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={index % 2 === 0 ? UserImage01 : UserImage02}
                  width="32"
                  height="32"
                  alt={`Lead ${index + 1}`}
                />
              </div>
              <div className="truncate">
                <span className="text-sm font-medium text-slate-800">
                  {lead.name}
                </span>
                <p className="text-xs text-slate-600">{lead.username}</p>
                <p className="text-xs text-slate-600">{lead.leads_status}</p>
                <p className="text-xs text-slate-600">{lead.csv_file_number}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isSelectionMode && (
        <div className="flex justify-between">
          <button
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white p-1 m-2 rounded"
            onClick={handleFinalizeSelection}
            disabled={selectedLeads.length === 0}
          >
            Send Messages
          </button>
          <button
            className="btn bg-red-500 hover:bg-red-600 text-white p-1 m-2 rounded"
            onClick={handleToggleMode}
          >
            Exit Selection Mode
          </button>
        </div>
      )}
    </div>
  );
}

export default DirectMessages;
