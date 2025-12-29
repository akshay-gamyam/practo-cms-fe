import React, { useState } from 'react';
import { FaCloudUploadAlt, FaEye, FaVideo } from 'react-icons/fa';
import { videos } from '../../../../utils/helper';
import { RxCrossCircled } from "react-icons/rx";
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { SiTicktick } from "react-icons/si";
import { IoMdTime } from 'react-icons/io';

const AgencyPocVideos = () => {
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (status) => {
    const badges = {
      approved: { icon: <SiTicktick className='h-4 w-4' />, text: 'APPROVED', color: 'text-green-700 bg-green-50 border-green-200' },
      rejected: { icon: <RxCrossCircled className='h-4 w-4' />, text: 'REJECTED', color: 'text-red-700 bg-red-50 border-red-200' },
      'in-review': { icon: <IoMdTime className='h-4 w-4'/>, text: 'IN REVIEW', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' }
    };
    return badges[status];
  };

  const filteredVideos = videos.filter(video => {
    if (activeTab === 'all') return true;
    return video.status === activeTab;
  });

  const tabCounts = {
    all: videos.length,
    'in-review': videos.filter(v => v.status === 'in-review').length,
    rejected: videos.filter(v => v.status === 'rejected').length,
    approved: videos.filter(v => v.status === 'approved').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Videos</h1>
          <p className="text-gray-600">Videos uploaded for locked scripts</p>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6 mb-8 flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white flex-shrink-0">
              <HiOutlineVideoCamera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-900 mb-2">How to Upload Videos</h3>
            <p className="text-cyan-700">
              Videos can only be uploaded for scripts that have been <span className="font-semibold ">approved and locked</span>. 
              Go to <span className="font-semibold">"Scripts"</span> page, find locked scripts, and click the <span className="font-semibold">"Upload Video"</span> button 
              to upload your video for that specific script.
            </p>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Videos ({tabCounts.all})
            </button>
            <button
              onClick={() => setActiveTab('in-review')}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'in-review'
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              In Review ({tabCounts['in-review']})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'rejected'
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rejected ({tabCounts.rejected})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'approved'
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved ({tabCounts.approved})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const badge = getStatusBadge(video.status);
            return (
              <div
                key={video.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  {video.hasPlayButton ? (
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-gray-700 border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  ) : (
                    <FaVideo className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
                  )}
                  
                  <div className="absolute bottom-3 right-3 bg-gray-800 bg-opacity-90 text-white text-sm px-2 py-1 rounded font-medium">
                    {video.duration}
                  </div>
                </div>

                <div className="p-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${badge.color}`}>
                    <span>{badge.icon}</span>
                    {badge.text}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <span>📄</span>
                    <span>Script ID: {video.scriptId} • {video.wordCount} words</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Uploaded: {video.uploadDate}</span>
                    <span className="font-medium">{video.fileSize}</span>
                  </div>

                  {video.status === 'rejected' && video.rejectionReason && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-700">{video.rejectionReason}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {video.status === 'rejected' && (
                      <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <FaCloudUploadAlt className="w-4 h-4" />
                        Re-upload
                      </button>
                    )}
                    <button className={`${video.status === 'rejected' ? 'flex-1' : 'w-full'} hover:bg-gradient-to-r from-[#518dcd] to-[#7ac0ca] hover:text-white text-black px-4 py-2.5 rounded-lg font-medium transition-colors border border-cyan-300 flex items-center justify-center gap-2`}>
                      <FaEye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgencyPocVideos;