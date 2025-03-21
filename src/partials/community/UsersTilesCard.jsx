import React from 'react';
import { Link } from 'react-router-dom';

function UsersTilesCard({ id, name, password, content, link, isSelected, onSelect, onDelete }) {
  return (
    <div className={`col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border ${isSelected ? 'border-red-500' : 'border-slate-200'}`}>
      <div className="flex flex-col h-full">
        {/* Card top */}
        <div className="grow p-5">
          <div className="flex justify-between items-start">
            {/* Image + name */}
            <header>
            
              <div className="flex mb-2">
                
                <Link className="relative inline-flex items-start mr-5" to={`/instagram/view-single?id=${id}&username=${name}&password=${password}&notes=${content}`}>
                  <div className="absolute top-0 right-0 -mr-2 bg-white rounded-full shadow" aria-hidden="true">
                    <svg className="w-8 h-8 fill-current text-amber-500" viewBox="0 0 32 32">
                      <path d="M21 14.077a.75.75 0 01-.75-.75 1.5 1.5 0 00-1.5-1.5.75.75 0 110-1.5 1.5 1.5 0 001.5-1.5.75.75 0 111.5 0 1.5 1.5 0 001.5 1.5.75.75 0 010 1.5 1.5 1.5 0 00-1.5 1.5.75.75 0 01-.75.75zM14 24.077a1 1 0 01-1-1 4 4 0 00-4-4 1 1 0 110-2 4 4 0 004-4 1 1 0 012 0 4 4 0 004 4 1 1 0 010 2 4 4 0 00-4 4 1 1 0 01-1 1z" />
                    </svg>
                  </div>
                </Link>
                <div className="mt-1 pr-1">
                  <Link className="flex flex-col text-slate-800 hover:text-slate-900" to={`/instagram/view-single?id=${id}&username=${name}&password=${password}&notes=${content}`}>
                    <h2 className="text-xl leading-snug justify-center font-semibold">{name}</h2>
                    <p className="text-xs leading-snug justify-center text-grey">{password}</p>
                  </Link>
                </div>
              </div>
            </header>
            <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 mb-4 text-indigo-600 transition duration-150 ease-in-out mr-2"
                  checked={isSelected}
                  onChange={() => onSelect(id)}
                />
          </div>
          {/* Bio */}
          <div className="mt-2">
            <div className="text-sm">{content}</div>
          </div>
        </div>
        {/* Card footer */}
        <div className="border-t border-slate-200">
          <div className="flex divide-x divide-slate-200">
            <Link className="block flex-1 text-center text-sm text-indigo-500 hover:text-indigo-600 font-medium px-3 py-4" to={`/instagram/view-single?id=${id}&username=${name}&password=${password}&notes=${content}`}>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 fill-current shrink-0 mr-2" viewBox="0 0 16 16">
                  <path d="M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
                </svg>
                <span>View Account</span>
              </div>
            </Link>
            <Link className="block flex-1 text-center text-sm text-slate-600 hover:text-slate-800 font-medium px-3 py-4 group" to={`/instagram/edit-account?id=${id}&username=${name}&password=${password}&notes=${content}`}>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-slate-500 shrink-0 mr-2" viewBox="0 0 16 16">
                  <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4  13.6 5 12 6.6z" />
                </svg>
                <span>Edit Account</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersTilesCard;
