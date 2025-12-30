import React, { useState } from 'react';
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiPlay,
  FiMessageSquare,
  FiDownload,
  FiVideo
} from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import ContentPreviewModal from './ContentPreviewModal';
import ContentDetailsModal from '../contentApproverScript/ContentDetailsScriptModal';
import ContentCommentModal from './ContentCommentModal';

const ContentApproverVideos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Exercise for Seniors',
      author: 'Dr. Lisa Brown',
      department: 'Geriatrics',
      category: 'Geriatrics',
      submittedDate: '5 hours ago',
      duration: '5:30',
      fileSize: '189 MB',
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      status: 'pending',
      badge: 'DLB',
      badgeColor: 'bg-cyan-500',
      priority: 'high',
      comments: []
    },
    {
      id: 2,
      title: 'Heart Health Basics',
      author: 'Dr. Michael Chen',
      department: 'Cardiology',
      category: 'Cardiology',
      submittedDate: '1 day ago',
      duration: '8:15',
      fileSize: '245 MB',
      thumbnail: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=800',
      status: 'pending',
      badge: 'DMC',
      badgeColor: 'bg-cyan-500',
      priority: 'medium',
      comments: []
    },
    {
      id: 3,
      title: 'Nutrition Tips for Diabetics',
      author: 'Dr. Sarah Smith',
      department: 'Endocrinology',
      category: 'Endocrinology',
      submittedDate: '2 days ago',
      duration: '6:45',
      fileSize: '198 MB',
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      status: 'approved',
      badge: 'DSS',
      badgeColor: 'bg-cyan-500',
      approvedBy: 'John Approver',
      priority: 'low',
      comments: []
    },
    {
      id: 4,
      title: 'Breathing Techniques',
      author: 'Dr. Emily Watson',
      department: 'Pulmonology',
      category: 'Pulmonology',
      submittedDate: '3 days ago',
      duration: '4:20',
      fileSize: '156 MB',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      status: 'rejected',
      badge: 'DEW',
      badgeColor: 'bg-cyan-500',
      rejectedBy: 'John Approver',
      reason: 'Video quality needs improvement and audio is unclear',
      priority: 'medium',
      comments: []
    }
  ]);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleApprove = (id) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, status: 'approved', approvedBy: 'John Approver' } : video
    ));
  };

  const handleReject = (id) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, status: 'rejected', rejectedBy: 'John Approver' } : video
    ));
  };

  const handleAddComment = (comment) => {
    if (selectedVideo && comment.trim()) {
      const newComment = { text: comment, date: new Date().toISOString() };
      setVideos(videos.map(video =>
        video.id === selectedVideo.id
          ? { ...video, comments: [...video.comments, newComment] }
          : video
      ));
      setShowCommentModal(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || video.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const statusCounts = {
    all: videos.length,
    pending: videos.filter(v => v.status === 'pending').length,
    approved: videos.filter(v => v.status === 'approved').length,
    rejected: videos.filter(v => v.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FiVideo className="w-8 h-8" />
            Videos Review
          </h1>
          <p className="text-sm text-gray-600">Final approval authority - Review all content before moving to production</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or doctor name..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>

          <div className="flex gap-6 mt-4 border-b border-gray-200">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending Review' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  filterStatus === tab.key
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({statusCounts[tab.key]})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredVideos.map((video) => {
            const statusBadge = getStatusBadge(video.status);
            return (
              <div key={video.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-2/5 relative bg-gradient-to-br from-blue-100 to-cyan-100 h-64 lg:h-auto">
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md ${statusBadge.class}`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                      {video.duration}
                    </div>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="lg:w-3/5 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{video.title}</h3>

                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 ${video.badgeColor} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                          {video.badge}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-900">{video.author}</p>
                          <p className="text-sm text-gray-500">{video.department}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-2">
                          <FiDownload className="w-4 h-4" />
                          {video.fileSize}
                        </span>
                        <span className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          {video.submittedDate}
                        </span>
                      </div>

                      {video.status === 'approved' && video.approvedBy && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-green-700">
                            <FiCheckCircle className="w-4 h-4" />
                            <span className="font-medium">Approved by {video.approvedBy}</span>
                          </div>
                        </div>
                      )}

                      {video.status === 'rejected' && video.rejectedBy && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-red-700 mb-2">
                            <IoClose className="w-4 h-4" />
                            <span className="font-medium">Rejected by {video.rejectedBy}</span>
                          </div>
                          {video.reason && (
                            <p className="text-sm text-red-600"><span className="font-medium">Reason:</span> {video.reason}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {video.status === 'pending' ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedVideo(video);
                            setShowPreviewModal(true);
                          }}
                          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <FiPlay className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleApprove(video.id)}
                          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(video.id)}
                          className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <IoClose className="w-5 h-5" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVideo(video);
                            setShowCommentModal(true);
                          }}
                          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <FiMessageSquare className="w-5 h-5" />
                          Comment
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedVideo(video);
                          setShowDetailsModal(true);
                        }}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <FiPlay className="w-4 h-4" />
                        View Content
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ContentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        video={selectedVideo}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ContentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedVideo(null);
        }}
        content={selectedVideo}
        type="video"
      />

      <ContentCommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        video={selectedVideo}
        onSubmit={handleAddComment}
      />
    </div>
  );
};

export default ContentApproverVideos;