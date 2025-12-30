import React from 'react';
import CustomModal from '../../../common/Modal/CustomModal';
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const ContentDetailsModal = ({ isOpen, onClose, content, type = 'script' }) => {
  if (!content) return null;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': 
        return { icon: <FiCheckCircle className="w-3 h-3" />, text: 'APPROVED', class: 'bg-green-50 text-green-700 border border-green-200' };
      case 'rejected': 
        return { icon: <IoClose className="w-3 h-3" />, text: 'REJECTED', class: 'bg-red-50 text-red-700 border border-red-200' };
      case 'pending': 
        return { icon: <FiClock className="w-3 h-3" />, text: 'PENDING REVIEW', class: 'bg-yellow-50 text-yellow-700 border border-yellow-200' };
      default: 
        return { icon: null, text: status, class: 'bg-gray-50 text-gray-700' };
    }
  };

  const statusBadge = getStatusBadge(content.status);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${type === 'script' ? 'Script' : 'Video'} Details`}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-500">Title</label>
          <p className="text-gray-900 mt-1 text-lg font-semibold">{content.title}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Author</label>
            <p className="text-gray-900 mt-1">{content.author}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              {type === 'script' ? 'Department' : 'Category'}
            </label>
            <p className="text-gray-900 mt-1">{content.department || content.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              {type === 'script' ? 'Submitted' : 'Duration'}
            </label>
            <p className="text-gray-900 mt-1">
              {type === 'script' ? content.submittedDate : content.duration}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              {type === 'script' ? 'Word Count' : 'File Size'}
            </label>
            <p className="text-gray-900 mt-1">
              {type === 'script' ? `${content.wordCount} words` : content.fileSize}
            </p>
          </div>
        </div>

        {type === 'video' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Submitted</label>
              <p className="text-gray-900 mt-1">{content.submittedDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Priority</label>
              <p className="text-gray-900 mt-1 capitalize">{content.priority}</p>
            </div>
          </div>
        )}
        {type === 'script' && content.version && (
          <div>
            <label className="text-sm font-medium text-gray-500">Version</label>
            <p className="text-gray-900 mt-1">{content.version}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <div className="mt-1">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md ${statusBadge.class}`}>
              {statusBadge.icon}
              {statusBadge.text}
            </span>
          </div>
        </div>

        {content.status === 'approved' && content.approvedBy && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <FiCheckCircle className="w-4 h-4" />
              <span className="font-medium">Approved by {content.approvedBy}</span>
            </div>
          </div>
        )}

        {content.status === 'rejected' && content.rejectedBy && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-700 mb-2">
              <IoClose className="w-4 h-4" />
              <span className="font-medium">Rejected by {content.rejectedBy}</span>
            </div>
            {content.reason && (
              <p className="text-sm text-red-600">
                <span className="font-medium">Reason:</span> {content.reason}
              </p>
            )}
          </div>
        )}

        {content.comments && content.comments.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Comments</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {content.comments.map((comment, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-900">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default ContentDetailsModal;