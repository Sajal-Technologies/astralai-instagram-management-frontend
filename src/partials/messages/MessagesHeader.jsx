import React from 'react';
import { useLocation } from 'react-router-dom';

import User01 from '../../images/user-32-01.jpg';
import User02 from '../../images/user-32-07.jpg';

function MessagesHeader({
  msgSidebarOpen,
  setMsgSidebarOpen
}) {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromUsername = queryParams.get("fromUsername");
  const toUsernames = JSON.parse(queryParams.get("toUsername") || "[]");
  const toNames = JSON.parse(queryParams.get("toName") || "[]");

  return (
    <div className="sticky top-16">
      <div className="flex items-center justify-between bg-white border-b border-slate-200 px-4 sm:px-6 md:px-5 h-16">
        {/* People */}
        <div className="flex items-center">
          {/* Close button */}
          <button
            className="md:hidden text-slate-400 hover:text-slate-500 mr-4"
            onClick={() => setMsgSidebarOpen(!msgSidebarOpen)}
            aria-controls="messages-sidebar"
            aria-expanded={msgSidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* People list */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <a className="block" >
              <img className="rounded-full border-2 border-white box-content" src={User01} width="32" height="32" alt="User 01" />
            </a>
            <div className="whitespace-nowrap overflow-x-scroll py-[20px]">
              <span>{toNames.length > 0 ? toNames.join(', ') : 'Select Recipient'}</span>
              {toUsernames.length > 0 && <span> | </span>}
              <span>{toUsernames.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesHeader;
