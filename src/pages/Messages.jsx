import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import MessagesSidebar from "../partials/messages/MessagesSidebar";
import MessagesHeader from "../partials/messages/MessagesHeader";
import MessagesBody from "../partials/messages/MessagesBody";
import MessagesFooter from "../partials/messages/MessagesFooter";

import axios from "axios";
import { baseUrl } from "../constants";

function Messages() {
  const contentArea = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [msgSidebarOpen, setMsgSidebarOpen] = useState(true);

  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromUsername = queryParams.get("fromUsername");
  const toUsername = queryParams.get("toUsername");

  useEffect(() => {
    contentArea.current.scrollTop = 99999999;
  }, [msgSidebarOpen]);

  

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
        ref={contentArea}
      >
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="relative flex">
            {/* Messages sidebar */}
              <MessagesSidebar
                msgSidebarOpen={msgSidebarOpen}
                setMsgSidebarOpen={setMsgSidebarOpen}
              />

            {/* Messages body */}
            <div
              className={`grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out w-[500px] ${
                msgSidebarOpen ? "translate-x-1/3" : "translate-x-0"
              }`}
            >
              <MessagesHeader
                msgSidebarOpen={msgSidebarOpen}
                setMsgSidebarOpen={setMsgSidebarOpen}
              />
              <MessagesBody />
              <MessagesFooter />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Messages;
