import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>
        <div className="p-4 flex justify-end space-x-4">
          <button
            className="btn bg-gray-500 hover:bg-gray-600 text-white"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
