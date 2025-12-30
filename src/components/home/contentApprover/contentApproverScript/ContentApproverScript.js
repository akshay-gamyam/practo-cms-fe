import React, { useState } from 'react';
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiEye,
  FiMessageSquare,
  FiFileText
} from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import ContentDetailsModal from './ContentDetailsScriptModal';
import ContentCommentModal from '../contentApproverVideos/ContentCommentModal';

const ContentApproverScript = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [scripts, setScripts] = useState([
    {
      id: 1,
      title: 'Managing Chronic Pain',
      author: 'Dr. Kevin Torres',
      department: 'Pain Management',
      submittedDate: '3 hours ago',
      wordCount: 1320,
      status: 'pending',
      version: 'Version 1',
      badge: 'DKT',
      badgeColor: 'bg-cyan-500',
      comments: []
    },
    {
      id: 2,
      title: 'Exercise for Seniors',
      author: 'Dr. Lisa Brown',
      department: 'Geriatrics',
      submittedDate: '5 hours ago',
      wordCount: 189,
      status: 'pending',
      version: 'Version 1',
      badge: 'DLB',
      badgeColor: 'bg-cyan-500',
      comments: []
    },
    {
      id: 3,
      title: 'Diabetes Management Guidelines',
      author: 'Dr. Sarah Smith',
      department: 'Endocrinology',
      submittedDate: 'Yesterday',
      wordCount: 1200,
      status: 'approved',
      version: 'Version 3',
      badge: 'DSS',
      badgeColor: 'bg-cyan-500',
      approvedBy: 'John Approver',
      comments: []
    },
    {
      id: 4,
      title: 'Asthma Prevention Strategies',
      author: 'Dr. Emily Watson',
      department: 'Pulmonology',
      submittedDate: '3 days ago',
      wordCount: 980,
      status: 'rejected',
      version: 'Version 2',
      badge: 'DEW',
      badgeColor: 'bg-cyan-500',
      rejectedBy: 'John Approver',
      reason: 'Needs more recent research citations and updated treatment protocols',
      comments: []
    }
  ]);

  const [selectedScript, setSelectedScript] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleApprove = (id) => {
    setScripts(scripts.map(script => 
      script.id === id ? { ...script, status: 'approved', approvedBy: 'John Approver' } : script
    ));
    setShowDetailsModal(false);
    setSelectedScript(null);
  };

  const handleReject = (id) => {
    setScripts(scripts.map(script => 
      script.id === id ? { ...script, status: 'rejected', rejectedBy: 'John Approver' } : script
    ));
    setShowDetailsModal(false);
    setSelectedScript(null);
  };

  const handleAddComment = (comment) => {
    if (selectedScript && comment.trim()) {
      const newComment = { text: comment, date: new Date().toISOString() };
      setScripts(scripts.map(script =>
        script.id === selectedScript.id
          ? { ...script, comments: [...script.comments, newComment] }
          : script
      ));
      const updatedScript = scripts.find(s => s.id === selectedScript.id);
      if (updatedScript) {
        setSelectedScript({
          ...updatedScript,
          comments: [...updatedScript.comments, newComment]
        });
      }
      setShowCommentModal(false);
    }
  };

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || script.status === filterStatus;
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
    all: scripts.length,
    pending: scripts.filter(s => s.status === 'pending').length,
    approved: scripts.filter(s => s.status === 'approved').length,
    rejected: scripts.filter(s => s.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Script Approvals</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScripts.map((script) => {
            const statusBadge = getStatusBadge(script.status);
            return (
              <div key={script.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md ${statusBadge.class}`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{script.version}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{script.title}</h3>

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${script.badgeColor} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {script.badge}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{script.author}</p>
                      <p className="text-xs text-gray-500">{script.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <FiFileText className="w-3.5 h-3.5" />
                      {script.wordCount} words
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5" />
                      {script.submittedDate}
                    </span>
                  </div>

                  {script.status === 'approved' && script.approvedBy && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-green-700">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        <span className="font-medium">Approved by {script.approvedBy}</span>
                      </div>
                    </div>
                  )}

                  {script.status === 'rejected' && script.rejectedBy && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-red-700 mb-2">
                        <IoClose className="w-3.5 h-3.5" />
                        <span className="font-medium">Rejected by {script.rejectedBy}</span>
                      </div>
                      {script.reason && (
                        <p className="text-xs text-red-600"><span className="font-medium">Reason:</span> {script.reason}</p>
                      )}
                    </div>
                  )}

                  {script.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedScript(script);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiEye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleApprove(script.id)}
                        className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedScript(script);
                          handleReject(script.id);
                        }}
                        className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <IoClose className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setSelectedScript(script);
                          setShowCommentModal(true);
                        }}
                        className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiMessageSquare className="w-4 h-4" />
                        Comment
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedScript(script);
                        setShowDetailsModal(true);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      View Content
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ContentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedScript(null);
        }}
        content={selectedScript}
        type="script"
      />

      <ContentCommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        video={selectedScript}
        onSubmit={handleAddComment}
      />
    </div>
  );
};

export default ContentApproverScript;