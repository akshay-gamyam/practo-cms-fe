import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiCheckCircle,
  FiEye,
  FiFileText,
  FiVideo,
  FiCalendar,
  FiUpload,
} from "react-icons/fi";
import {
  fetchQueueVideos,
  fetchPublishedVideos,
  publishVideo,
} from "../../../redux/action/publisherAction/PublisherAction";
import PublishConfirmModal from "./PublishConfirmModal";
import { getPublishStatusBadge, formatDate, getWordCount } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import ContentPreviewModal from "../contentApprover/contentApproverVideos/ContentPreviewModal";

const Publisher = () => {
  const dispatch = useDispatch();
  const {
    queueVideos,
    publishedVideos,
    publishedPage,
    isQueueLoading,
    isPublishedLoading,
    isVideoActionLoading,
    error,
  } = useSelector((state) => state.publisher);

  const user = useSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ready-to-publish");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [videoToPublish, setVideoToPublish] = useState(null);

  useEffect(() => {
    if (activeTab === "ready-to-publish") {
      dispatch(fetchQueueVideos());
    } else if (activeTab === "published") {
      dispatch(fetchPublishedVideos({ page: publishedPage }));
    }
  }, [dispatch, activeTab]);

  const handlePublishClick = (video) => {
    setVideoToPublish(video);
    setShowPublishModal(true);
  };

  const handlePublishConfirm = async () => {
    if (!videoToPublish) return;
    
    try {
      await dispatch(publishVideo(videoToPublish.id));
      setShowPublishModal(false);
      setVideoToPublish(null);
    } catch (error) {
      console.error("Failed to publish video:", error);
    }
  };

  const currentVideos = activeTab === "ready-to-publish" ? queueVideos : publishedVideos;
  const isLoading = activeTab === "ready-to-publish" ? isQueueLoading : isPublishedLoading;

  const filteredVideos = currentVideos.filter((video) => {
    const matchesSearch =
      video.topic?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.uploadedBy?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      video.uploadedBy?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  if (error) {
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Failed to load videos: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Publisher Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Manage and publish approved video content
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or creator name..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
          </div>

          <div className="flex gap-6 mt-4 border-b border-gray-200">
            {[
              { key: "ready-to-publish", label: "Ready to Publish" },
              { key: "published", label: "Published" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <SkeletonBlock />
        ) : filteredVideos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <FiVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">
              No videos found
            </p>
            <p className="text-gray-400 text-sm">
              {activeTab === "ready-to-publish"
                ? "There are no videos ready to publish at the moment"
                : "No published videos yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVideos.map((video) => {
              const statusBadge = getPublishStatusBadge(video);
              const isPublished = video.status === "PUBLISHED";
              const wordCount = getWordCount(video.content);

              const authorName = video.uploadedBy
                ? `${video.uploadedBy.firstName} ${video.uploadedBy.lastName}`
                : "Unknown Author";

              const getInitials = (firstName = "", lastName = "") => {
                return `${firstName?.charAt(0) || ""}${
                  lastName?.charAt(0) || ""
                }`.toUpperCase();
              };

              const badge = video.uploadedBy
                ? getInitials(
                    video.uploadedBy.firstName,
                    video.uploadedBy.lastName
                  )
                : "NA";

              return (
                <div
                  key={video.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md ${statusBadge.class}`}
                        >
                          {statusBadge.icon}
                          {statusBadge.text}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          Version {video.version}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {video.topic?.title || "Untitled Video"}
                    </h3>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {badge}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {authorName}
                        </p>
                        <p className="text-xs text-gray-500">Content Creator</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <FiFileText className="w-3.5 h-3.5" />
                        {wordCount} words
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {formatDate(video.createdAt)}
                      </span>
                    </div>

                    {isPublished && video.publishedAt && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          <span className="font-medium">
                            Published on {formatDate(video.publishedAt)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedVideo(video);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiEye className="w-4 h-4" />
                        Preview
                      </button>
                      {!isPublished && (
                        <button
                          onClick={() => handlePublishClick(video)}
                          disabled={isVideoActionLoading}
                          className="flex-1 px-4 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiUpload className="w-4 h-4" />
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <ContentPreviewModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
      />

      <PublishConfirmModal
        isOpen={showPublishModal}
        onClose={() => {
          setShowPublishModal(false);
          setVideoToPublish(null);
        }}
        onConfirm={handlePublishConfirm}
        video={videoToPublish}
        isLoading={isVideoActionLoading}
      />
    </div>
  );
};

export default Publisher;