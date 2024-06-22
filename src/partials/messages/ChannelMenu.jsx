import React, { useState, useRef, useEffect } from 'react';
import Transition from '../../utils/Transition';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { baseUrl } from '../../constants';

import ChannelImage from '../../images/user-avatar-32.png';
import ChannelImage01 from '../../images/channel-01.png';
import ChannelImage02 from '../../images/channel-02.png';
import ChannelImage03 from '../../images/channel-03.png';

function ChannelMenu() {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromUsername = queryParams.get("fromUsername");
  const toUsername = queryParams.get("toUsername");

  const navigate = useNavigate();

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const fetchInstagramAccounts = async () => {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await axios.get(`${baseUrl}/api/get-insta-account/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        setInstagramAccounts(response.data.data);
        console.log(response.data.data)
        setSuccess('Instagram accounts fetched successfully.');
      } catch (err) {
        console.error('Error fetching Instagram accounts:', err);
        setError(err.response?.data?.Message || 'Failed to fetch Instagram accounts.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramAccounts();
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleClickUsername = (fromUsername) => {
    const params = new URLSearchParams(window.location.search);
    params.set('fromUsername', fromUsername);
    navigate({ search: params.toString() });
  };

  return (
    <div className="relative">
      <button
        ref={trigger}
        className="grow flex items-center truncate"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img className="w-8 h-8 rounded-full mr-2" src={ChannelImage} width="32" height="32" alt="Group 01" />
        <div className="truncate">
          <span className="font-semibold text-slate-800">{fromUsername || "Select from account"}</span>
        </div>
        <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
        </svg>
      </button>
      <Transition
        className="origin-top-right z-10 absolute top-full left-0 min-w-60 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <ul
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {!loading &&
            instagramAccounts.map((item, index) => (
              <li key={index} className='cursor-pointer' onClick={() => handleClickUsername(item["Instagram username"])}> 
              <a className="font-medium text-sm text-slate-600 hover:text-slate-800 block py-1.5 px-3" href="#0" onClick={() => setDropdownOpen(false)}>
                <div className="flex items-center justify-between">
                  <div className="grow flex items-center truncate">
                    <img className="w-7 h-7 rounded-full mr-2" src={ChannelImage01} width="28" height="28" alt="Channel 01" />
                    <div className="truncate">{item["Instagram username"]}</div>
                  </div>
                  {fromUsername === item["Instagram username"] && <svg className="w-3 h-3 shrink-0 fill-current text-indigo-500 ml-1" viewBox="0 0 12 12">
                    <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                  </svg>}
                </div>
              </a>
            </li>
            ))
          }
        </ul>
      </Transition>
    </div>
  )
}

export default ChannelMenu;