import React from 'react'
import CustomModal from '../../common/Modal/CustomModal';
import { formatDate } from '../../../utils/helper';

const PublisherDetailModal = ({ isOpen, onClose, video }) => {
  if (!video) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={video.topic?.title || "Video Preview"}
      maxWidth="max-w-4xl"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
          {video.uploadedBy?.firstName?.charAt(0)}
          {video.uploadedBy?.lastName?.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {video.uploadedBy
              ? `${video.uploadedBy.firstName} ${video.uploadedBy.lastName}`
              : "Unknown Creator"}
          </p>
          <p className="text-sm text-gray-500">
            Created on {formatDate(video.createdAt)}
          </p>
        </div>
      </div>

      {video.topic?.description && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Topic Description
          </h3>
          <div
            className="text-gray-600 text-sm prose max-w-none"
            dangerouslySetInnerHTML={{ __html: video.topic.description }}
          />
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Video Script
        </h3>
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: video.content }}
        />
      </div>
    </CustomModal>
  );
};

export default PublisherDetailModal