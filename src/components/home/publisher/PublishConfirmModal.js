import React from 'react'
import { FiCheckCircle, FiUpload } from 'react-icons/fi';
import CustomModal from '../../common/Modal/CustomModal';

const PublishConfirmModal = ({ isOpen, onClose, onConfirm, video, isLoading }) => {
  if (!video) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Video"
      maxWidth="max-w-md"
    >
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mx-auto mb-4">
          <FiUpload className="w-8 h-8 text-cyan-600" />
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to publish <span className="font-semibold">"{video.topic?.title}"</span>? This action will make the video live.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Publishing...
              </>
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4" />
                Publish
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default PublishConfirmModal