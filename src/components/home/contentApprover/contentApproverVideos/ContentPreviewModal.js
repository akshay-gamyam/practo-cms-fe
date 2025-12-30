import React from 'react'
import { FiCheckCircle, FiPlay } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const ContentPreviewModal = ({ isOpen, onClose, video, onApprove, onReject }) => {
  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">{video.title}</h2>
              <p className="text-cyan-100 text-sm">Preview Content</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl aspect-video flex items-center justify-center mb-6">
            <button className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all border-4 border-white/30">
              <FiPlay className="w-12 h-12 text-white ml-2" />
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-base font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                onApprove(video.id);
                onClose();
              }}
              className="flex-1 px-6 py-3.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-base font-semibold flex items-center justify-center gap-2"
            >
              <FiCheckCircle className="w-5 h-5" />
              Approve Content
            </button>
            <button
              onClick={() => {
                onReject(video.id);
                onClose();
              }}
              className="flex-1 px-6 py-3.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-base font-semibold flex items-center justify-center gap-2"
            >
              <IoClose className="w-5 h-5" />
              Reject Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewModal
