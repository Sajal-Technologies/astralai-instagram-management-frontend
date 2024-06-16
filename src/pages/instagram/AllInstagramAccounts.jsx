import React, { useState, useEffect } from 'react';
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import UsersTilesCard from '../../partials/community/UsersTilesCard';
import axios from 'axios';
import { baseUrl } from '../../constants';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal'; // Import the confirmation modal

const AllInstagramAccounts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState(null);

  const navigate = useNavigate();

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
        setSuccess('Instagram accounts fetched successfully.');
        clearMessagesAfterDelay();
      } catch (err) {
        console.error('Error fetching Instagram accounts:', err);
        setError(err.response?.data?.Message || 'Failed to fetch Instagram accounts.');
        clearMessagesAfterDelay();
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramAccounts();
  }, []);

  const clearMessagesAfterDelay = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000); // Clear messages after 5 seconds
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const idsToDelete = deleteAccountId ? [deleteAccountId] : selectedAccounts;
      await axios.post(`${baseUrl}/api/delete-insta-account/`, {
        insta_id: idsToDelete
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      setInstagramAccounts(instagramAccounts.filter(account => !idsToDelete.includes(account.id)));
      setSuccess('Accounts deleted successfully.');
      setSelectedAccounts([]);
      setDeleteAccountId(null);
      clearMessagesAfterDelay();
    } catch (err) {
      console.error('Error deleting Instagram accounts:', err);
      setError(err.response?.data?.Message || 'Failed to delete Instagram accounts.');
      clearMessagesAfterDelay();
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleSelectAccount = (id) => {
    setSelectedAccounts(prevSelected =>
      prevSelected.includes(id) ? prevSelected.filter(accountId => accountId !== id) : [...prevSelected, id]
    );
  };

  const handleIndividualDelete = (id) => {
    setDeleteAccountId(id);
    setShowConfirmation(true);
  };

  const filteredAccounts = instagramAccounts.filter(account =>
    account["Instagram username"].toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Instagram Accounts ✨</h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Search form */}
                <div className="relative">
                  <input
                    type="text"
                    className="form-input w-full"
                    placeholder="Search by username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {/* Add member button */}
                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" onClick={() => navigate('/instagram/add-account')}>
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Add Instagram Account</span>
                </button>
                {/* Bulk delete button */}
                { selectedAccounts.length > 0 ? (
                  <button className="btn bg-red-500 hover:bg-red-600 text-white" onClick={() => setShowConfirmation(true)}>
                    <span className="hidden xs:block ml-2">Delete {selectedAccounts.length} Selected</span>
                  </button>
                ) : 
                <button className="btn bg-red-500 hover:bg-red-600 text-white" disabled={true}>
                    <span className="hidden xs:block ml-2">Select to Delete</span>
                  </button>
                }
              </div>
              
            </div>
            

            {/* Messages */}
            {loading && <div className="col-span-12"><p className="text-blue-500">Loading...</p></div>}
            {error && <div className="col-span-12"><p className="text-red-500">{error}</p></div>}
            {success && <div className="col-span-12"><p className="text-green-500">{success}</p></div>}

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {!loading && !error && filteredAccounts.length === 0 && (
                <div className="col-span-12"><p>No Instagram accounts found.</p></div>
              )}
              {filteredAccounts.map(item => (
                <UsersTilesCard
                  key={item.id}
                  id={item.id}
                  name={item["Instagram username"]}
                  password={item["Instagram password"]}
                  content={item.notes || 'No notes for this account.'}
                  link={'#'}
                  isSelected={selectedAccounts.includes(item.id)}
                  onSelect={handleSelectAccount}
                  onDelete={handleIndividualDelete}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Are you sure you want to delete the selected Instagram accounts?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default AllInstagramAccounts;
