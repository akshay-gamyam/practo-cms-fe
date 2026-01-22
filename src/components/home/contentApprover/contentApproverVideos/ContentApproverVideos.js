import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiPlay,
  FiVideo,
} from "react-icons/fi";
import { TbVersions } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import ContentPreviewModal from "./ContentPreviewModal";
import ContentDetailsModal from "../contentApproverScript/ContentDetailsScriptModal";
import ContentCommentModal from "./ContentCommentModal";
import {
  fetchContentApproverVideos,
  approveVideos,
  rejectVideos,
} from "../../../../redux/action/contentApproverAction/ContentApproverAction";
import { formatDate, getStatusBadge } from "../../../../utils/helper";
import SkeletonBlock from "../../../common/skeletonBlock/SkeletonBlock";

const ContentApproverVideos = () => {
  const dispatch = useDispatch();
  const {
    contentApproverVideos,
    approvedVideos,
    rejectedVideos,
    isVideosListLoading,
    isVideosActionLoading,
    error,
  } = useSelector((state) => state.contentApprover);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentType, setCommentType] = useState("comment");

  useEffect(() => {
    const params = {};

    if (filterStatus === "approved") {
      params.decision = "APPROVED";
    } else if (filterStatus === "rejected") {
      params.decision = "REJECTED";
    }

    if (searchTerm) {
      params.search = searchTerm;
    }

    dispatch(fetchContentApproverVideos(params));
  }, [dispatch, filterStatus]);

  const getCurrentTabData = () => {
    switch (filterStatus) {
      case "approved":
        return approvedVideos;
      case "rejected":
        return rejectedVideos;
      case "all":
      default:
        return contentApproverVideos;
    }
  };

  const handleApprove = (id) => {
    const currentData = getCurrentTabData();
    const video = currentData.find((v) => v.id === id);
    setSelectedVideo(video);
    setCommentType("approve");
    setShowCommentModal(true);
  };

  const handleReject = (id) => {
    const currentData = getCurrentTabData();
    const video = currentData.find((v) => v.id === id);
    setSelectedVideo(video);
    setCommentType("reject");
    setShowCommentModal(true);
  };

  const handleAddComment = (comment) => {
    if (selectedVideo && comment.trim()) {
      if (commentType === "approve") {
        dispatch(approveVideos(selectedVideo?.id, comment))
          .then(() => {
            setShowCommentModal(false);
            dispatch(fetchContentApproverVideos())
            setSelectedVideo(null);
            setCommentType("comment");
          })
          .catch((error) => {
            console.error("Failed to approve video:", error);
          });
      } else if (commentType === "reject") {
        dispatch(rejectVideos(selectedVideo.id, comment))
          .then(() => {
            setShowCommentModal(false);
            dispatch(fetchContentApproverVideos())
            setSelectedVideo(null);
            setCommentType("comment");
          })
          .catch((error) => {
            console.error("Failed to reject video:", error);
          });
      }
    }
  };

  const handleThumbnailClick = (video) => {
    setSelectedVideo(video);
    setShowPreviewModal(true);
  };

  const currentTabData = getCurrentTabData();

  const filteredVideos = currentTabData.filter((video) => {
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

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Failed to load videos
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FiVideo className="w-8 h-8" />
            Videos Review
          </h1>
          <p className="text-sm text-gray-600">
            Final approval authority - Review all content before moving to
            production
          </p>
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
              { key: "all", label: "All" },
              { key: "approved", label: "Approved" },
              { key: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  filterStatus === tab.key
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isVideosListLoading ? (
          <SkeletonBlock />
        ) : filteredVideos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-500">No videos found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredVideos.map((video) => {
              const statusBadge = getStatusBadge(video.status);

              const isFinalStatus =
                video.decision?.toUpperCase() === "APPROVED" ||
                video.decision?.toUpperCase() === "REJECTED";

              const canInteract = !isFinalStatus;

              const authorName = video.uploadedBy
                ? `${video.uploadedBy.firstName} ${video.uploadedBy.lastName}`
                : "Unknown Author";

              const getInitials = (firstName = "", lastName = "") => {
                return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div
                      className="lg:w-2/5 relative bg-gradient-to-br from-blue-100 to-cyan-100 h-64 lg:h-auto group cursor-pointer"
                      onClick={() => handleThumbnailClick(video)}
                    >
                      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md ${statusBadge.class}`}
                        >
                          {statusBadge.icon}
                          {statusBadge.text}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-cyan-500 group-hover:scale-110 transition-all duration-300 shadow-lg pointer-events-auto">
                          <FiPlay className="w-8 h-8 text-gray-900 group-hover:text-white ml-1" />
                        </div>
                      </div>

                      <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-lg z-10">
                        {formatDuration(video.duration)}
                      </div>

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.topic?.title || "Video thumbnail"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiVideo className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="lg:w-3/5 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {video.topic?.title || "Untitled Video"}
                        </h3>

                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {badge}
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              {authorName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Content Creator
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-2 border border-gray-500 px-2 py-1 rounded-xl">
                            <TbVersions className="w-4 h-4" />
                            Version {video.version}
                          </span>
                          <span className="flex items-center gap-2 border border-gray-500 px-2 py-1 rounded-xl">
                            <FiClock className="w-4 h-4" />
                            {formatDate(video.createdAt)}
                          </span>
                        </div>

                        {video.status?.toUpperCase() === "APPROVED" && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <FiCheckCircle className="w-4 h-4" />
                              <span className="font-medium">Approved</span>
                            </div>
                          </div>
                        )}

                        {video.status?.toUpperCase() === "REJECTED" && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-red-700 mb-2">
                              <IoClose className="w-4 h-4" />
                              <span className="font-medium">Rejected</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {!isFinalStatus ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleThumbnailClick(video)}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                          >
                            <FiPlay className="w-4 h-4" />
                            Preview
                          </button>
                          <button
                            onClick={() => handleApprove(video.id)}
                            disabled={!canInteract || isVideosActionLoading}
                            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiCheckCircle className="w-5 h-5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(video.id)}
                            disabled={!canInteract || isVideosActionLoading}
                            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IoClose className="w-5 h-5" />
                            Reject
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
        )}
      </div>

      <ContentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
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

      {/* <ContentCommentModal
        isOpen={showCommentModal}
        onClose={() => {
          setShowCommentModal(false);
          setCommentType("comment");
        }}
        video={selectedVideo}
        onSubmit={handleAddComment}
        commentType={commentType}
      /> */}

      <ContentCommentModal
        isOpen={showCommentModal}
        onClose={() => {
          setShowCommentModal(false);
          setCommentType("comment");
        }}
        video={selectedVideo}
        onSubmit={handleAddComment}
        commentType={commentType}
        showSelect
        selectOptions={[
          { label: "Spam", value: "spam" },
          { label: "Inappropriate", value: "inappropriate" },
          { label: "Other", value: "other" },
        ]}
      />
    </div>
  );
};

export default ContentApproverVideos;
