import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt, FaEye, FaVideo } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { SiTicktick } from "react-icons/si";
import { IoMdTime } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCirclePlay } from "react-icons/fa6";
import {
  fetchAllVideos,
  submitVideo,
  // deleteVideo
} from "../../../../redux/action/agencyPocAction/AgencyPocAction";
import SkeletonBlock from "../../../common/skeletonBlock/SkeletonBlock";
import ContentPreviewModal from "../../contentApprover/contentApproverVideos/ContentPreviewModal";

const AgencyPocVideos = () => {
  const dispatch = useDispatch();
  const {
    videos,
    isVideoListLoading,
    isDeleteVideoLoading,
    isSubmitVideoLoading,
  } = useSelector((state) => state.agencyPoc);

  const [activeTab, setActiveTab] = useState("all");
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  console.log("selectedVideo", selectedVideo);

  const REVIEW_STATUSES = [
    "IN_REVIEW",
    "MEDICAL_REVIEW",
    "BRAND_REVIEW",
    "DOCTOR_REVIEW",
  ];

  useEffect(() => {
    dispatch(fetchAllVideos());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const badges = {
      APPROVED: {
        icon: <SiTicktick className="h-4 w-4" />,
        text: "APPROVED",
        color: "text-green-700 bg-green-50 border-green-200",
      },
      REJECTED: {
        icon: <RxCrossCircled className="h-4 w-4" />,
        text: "REJECTED",
        color: "text-red-700 bg-red-50 border-red-200",
      },
      IN_REVIEW: {
        icon: <IoMdTime className="h-4 w-4" />,
        text: "IN REVIEW",
        color: "text-yellow-700 bg-yellow-50 border-yellow-200",
      },
      DRAFT: {
        icon: <IoMdTime className="h-4 w-4" />,
        text: "DRAFT",
        color: "text-yellow-700 bg-yellow-50 border-yellow-200",
      },
      MEDICAL_REVIEW: {
        icon: <IoMdTime className="h-4 w-4" />,
        text: "MEDICAL REVIEW",
        color: "text-blue-700 bg-blue-50 border-blue-200",
      },
      BRAND_REVIEW: {
        icon: <IoMdTime className="h-4 w-4" />,
        text: "BRAND REVIEW",
        color: "text-purple-700 bg-purple-50 border-purple-200",
      },
      DOCTOR_REVIEW: {
        icon: <IoMdTime className="h-4 w-4" />,
        text: "DOCTOR REVIEW",
        color: "text-indigo-700 bg-indigo-50 border-indigo-200",
      },
      LOCKED: {
        icon: <IoMdTime className="h-4 w-4" />,
        text: "LOCKED",
        color: "text-red-700 bg-red-50 border-red-200",
      },
      PUBLISHED: {
        icon: <IoMdTime className="h-4 w-4" />,
        text: "PUBLISHED",
        color: "text-cyan-700 bg-cyan-50 border-cyan-200",
      },
    };
    return badges[status];
  };

  const filteredVideos = videos.filter((video) => {
    if (activeTab === "all") return true;

    if (activeTab === "IN_REVIEW") {
      return REVIEW_STATUSES.includes(video.status);
    }

    return video.status === activeTab;
  });

  const tabCounts = {
    all: videos.length,
    IN_REVIEW: videos.filter((v) => REVIEW_STATUSES.includes(v.status)).length,
    REJECTED: videos.filter((v) => v.status === "REJECTED").length,
    // APPROVED: videos.filter((v) => v.status === "APPROVED").length,
    LOCKED: videos.filter((v) => v.status === "LOCKED").length,
    DRAFT: videos.filter((v) => v.status === "DRAFT").length,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // const formatFileSize = (bytes) => {
  //   if (!bytes) return 'N/A';
  //   const mb = bytes / (1024 * 1024);
  //   return `${mb.toFixed(2)} MB`;
  // };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // const handleDeleteVideo = async (videoId) => {
  //   if (!window.confirm('Are you sure you want to delete this video?')) {
  //     return;
  //   }

  //   setVideoToDelete(videoId);
  //   const response = await dispatch(deleteVideo(videoId));

  //   if (response?.success) {
  //     toast.success('Video deleted successfully');
  //   } else {
  //     toast.error(response?.error || 'Failed to delete video');
  //   }
  //   setVideoToDelete(null);
  // };

  // const handleViewVideo = (video) => {
  //   console.log("View video:", video);
  //   toast.info("Video player coming soon!");
  // };

  const handleViewVideo = (video) => {
    if (!video?.videoUrl) {
      toast.error("Video URL not available");
      return;
    }

    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleReuploadVideo = (video) => {
    console.log("Reupload video:", video);
    toast.info("Video upload coming soon!");
  };

  const handleSubmitVideo = async (video) => {
    const response = await dispatch(submitVideo(video.id));

    if (response?.success) {
      toast.success("Video submitted for review");
    } else {
      toast.error(response?.error || "Failed to submit video");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Videos
          </h1>
          <p className="text-gray-600">Videos uploaded for locked scripts</p>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6 mb-8 flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white flex-shrink-0">
              <HiOutlineVideoCamera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-900 mb-2">
              How to Upload Videos
            </h3>
            <p className="text-cyan-700">
              Videos can only be uploaded for scripts that have been{" "}
              <span className="font-semibold">approved and locked</span>. Go to{" "}
              <span className="font-semibold">"Scripts"</span> page, find locked
              scripts, and click the{" "}
              <span className="font-semibold">"Upload Video"</span> button to
              upload your video for that specific script.
            </p>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === "all"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Videos ({tabCounts.all})
            </button>
            <button
              onClick={() => setActiveTab("IN_REVIEW")}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === "IN_REVIEW"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              In Review ({tabCounts.IN_REVIEW})
            </button>
            <button
              onClick={() => setActiveTab("REJECTED")}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === "REJECTED"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Rejected ({tabCounts.REJECTED})
            </button>
            <button
              onClick={() => setActiveTab("DRAFT")}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === "APPROVED"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Draft ({tabCounts.DRAFT})
            </button>
            <button
              onClick={() => setActiveTab("LOCKED")}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === "APPROVED"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Locked ({tabCounts.LOCKED})
            </button>
          </div>
        </div>

        {isVideoListLoading ? (
          <SkeletonBlock />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              console.log("video", video);
              const badge = getStatusBadge(video?.status);
              return (
                <div
                  key={video?.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.script?.topic?.title || "Video thumbnail"}
                        className="w-full h-full object-cover"
                      />
                    ) : video.videoUrl ? (
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-gray-700 border-b-8 border-b-transparent ml-1"></div>
                      </div>
                    ) : (
                      <FaVideo className="w-16 h-16 text-gray-400" />
                    )}

                    <div className="absolute justify-center">
                      <FaCirclePlay
                        onClick={() => handleViewVideo(video)}
                        className="w-12 h-12 cursor-pointer text-gray-700"
                      />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-gray-800 bg-opacity-90 text-white text-sm px-2 py-1 rounded font-medium">
                      {formatDuration(video.duration)}
                    </div>
                  </div>

                  <div className="p-5">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${badge.color}`}
                    >
                      <span>{badge.icon}</span>
                      {badge.text}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {video?.title || "Untitled Video"}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 border border-gray-300 rounded-lg bg-gray-50 p-2">
                      <span className="text-md font-semibold">
                        Description:{" "}
                        <span className="text-sm font-normal">
                          {video?.description}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Uploaded: {formatDate(video.createdAt)}</span>
                      {/* <span className="font-medium">{formatFileSize(video.fileSize)}</span> */}
                    </div>

                    {video.status === "REJECTED" && video.rejectionReason && (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-red-900 mb-1">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700">
                          {video.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {video.status === "REJECTED" && (
                        <button
                          onClick={() => handleReuploadVideo(video)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FaCloudUploadAlt className="w-4 h-4" />
                          Re-upload
                        </button>
                      )}
                      <button
                        onClick={() => handleViewVideo(video)}
                        className={`${
                          video.status === "REJECTED" ? "flex-1" : "w-full"
                        } hover:bg-gradient-to-r from-[#518dcd] to-[#7ac0ca] hover:text-white text-black px-4 py-2.5 rounded-lg font-medium transition-colors border border-cyan-300 flex items-center justify-center gap-2`}
                      >
                        <FaEye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                    <div>
                      {video.status === "DRAFT" && (
                        <button
                          disabled={isSubmitVideoLoading}
                          onClick={() => handleSubmitVideo(video)}
                          className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FaCloudUploadAlt className="w-4 h-4" />
                          {isSubmitVideoLoading ? "Submitting..." : "Submit"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredVideos.length === 0 && !isVideoListLoading && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 text-base sm:text-lg">
                  No videos found in this category
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <ContentPreviewModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
      />
    </div>
  );
};

export default AgencyPocVideos;
