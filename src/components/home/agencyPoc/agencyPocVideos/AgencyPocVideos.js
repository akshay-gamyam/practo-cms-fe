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
  fetchAssigneeList,
  // deleteVideo
} from "../../../../redux/action/agencyPocAction/AgencyPocAction";
import SkeletonBlock from "../../../common/skeletonBlock/SkeletonBlock";
import ContentPreviewModal from "../../contentApprover/contentApproverVideos/ContentPreviewModal";
import Stage2LanguageAdaptationModal from "./Stage2LanguageAdaptationModal";

const AgencyPocVideos = () => {
  const dispatch = useDispatch();
  const { videos, isVideoListLoading, isSubmitVideoLoading, assigneeList } =
    useSelector((state) => state.agencyPoc);

  const assigneeOptions = Array.isArray(assigneeList?.assigneeReviewer)
    ? assigneeList.assigneeReviewer
    : [];

  const [activeTab, setActiveTab] = useState("all");
  const [activeStage, setActiveStage] = useState("stage1");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isStage2ModalOpen, setIsStage2ModalOpen] = useState(false);
  const [selectedMasterVideo, setSelectedMasterVideo] = useState(null);
  const [videoAssignees, setVideoAssignees] = useState({});

  const REVIEW_STATUSES = [
    "IN_REVIEW",
    "MEDICAL_REVIEW",
    "BRAND_REVIEW",
    "DOCTOR_REVIEW",
    "SUPER_ADMIN_REVIEW",
  ];

  useEffect(() => {
    const filters = {};
    if (activeStage === "stage1") {
      filters.stage = "INITIAL_UPLOAD";
    } else if (activeStage === "stage2") {
      filters.stage = "LANGUAGE_ADAPTATION";
    }
    dispatch(fetchAllVideos(filters));
    // dispatch(fetchAllVideos());
  }, [dispatch, activeStage]);

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
      SUPER_ADMIN_REVIEW: {
        icon: <IoMdTime className="h-4 w-4" />,
        text: "SUPER_ADMIN_REVIEW",
        color: "text-rose-700 bg-rose-50 border-rose-200",
      },
    };
    return badges[status];
  };

  const filteredVideos = videos.filter((video) => {
    if (activeStage === "stage1" && video.stage !== "INITIAL_UPLOAD")
      return false;
    if (activeStage === "stage2" && video.stage !== "LANGUAGE_ADAPTATION")
      return false;
    if (activeTab === "all") return true;

    if (activeTab === "IN_REVIEW") {
      return REVIEW_STATUSES.includes(video.status);
    }

    if (activeTab === "REJECTED") {
      return (
        video?.latestRejection !== null || (video.status === "REJECTED").length
      );
    }
    if (activeTab === "PUBLISHED" && activeStage === "stage1") {
      return video.status === "PUBLISHED" && video.stage === "INITIAL_UPLOAD";
    }

    return video.status === activeTab;
  });

  // const tabCounts = {
  //   all: videos.length,
  //   IN_REVIEW: videos.filter((v) => REVIEW_STATUSES.includes(v.status)).length,
  //   REJECTED: videos.filter((v) => v.status === "REJECTED").length,
  //   PUBLISHED: videos.filter(
  //     (v) => v.status === "PUBLISHED" && v?.stage === "INITIAL_UPLOAD",
  //   ).length,
  //   LOCKED: videos.filter((v) => v.status === "LOCKED").length,
  //   DRAFT: videos.filter((v) => v.status === "DRAFT").length,
  // };

  const getTabCounts = () => {
    const stageFilteredVideos = videos.filter((v) => {
      if (activeStage === "stage1") return v.stage === "INITIAL_UPLOAD";
      if (activeStage === "stage2") return v.stage === "LANGUAGE_ADAPTATION";
      return true;
    });

    return {
      all: stageFilteredVideos.length,
      IN_REVIEW: stageFilteredVideos.filter((v) =>
        REVIEW_STATUSES.includes(v.status),
      ).length,
      REJECTED: stageFilteredVideos.filter(
        (v) => v.status === "REJECTED" || v.latestRejection !== null,
      ).length,
      PUBLISHED: stageFilteredVideos.filter((v) => v.status === "PUBLISHED")
        .length,
      DRAFT: stageFilteredVideos.filter((v) => v.status === "DRAFT").length,
    };
  };

  const tabCounts = getTabCounts();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleViewVideo = (video) => {
    if (!video?.videoUrl) {
      toast.error("Video URL not available");
      return;
    }

    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleReuploadVideo = (video) => {
    toast.info("Video upload coming soon!");
  };

  // const handleSubmitVideo = async (video) => {
  //   const response = await dispatch(submitVideo(video.id));

  //   if (response?.success) {
  //     toast.success("Video submitted for review");
  //   } else {
  //     toast.error(response?.error || "Failed to submit video");
  //   }
  // };

  const handleSubmitVideo = async (video, reviewerId = null) => {
    // For Stage 2 videos, we need assignedReviewerId
    if (video.stage === "LANGUAGE_ADAPTATION" && !reviewerId) {
      toast.error("Please select an assignee before submitting");
      return;
    }

    const response = await dispatch(submitVideo(video.id, reviewerId || null));

    if (response?.success) {
      toast.success("Video submitted for review");
      setVideoAssignees((prev) => {
        const newState = { ...prev };
        delete newState[video.id];
        return newState;
      });
      const filters = {};
      if (activeStage === "stage1") {
        filters.stage = "INITIAL_UPLOAD";
      } else if (activeStage === "stage2") {
        filters.stage = "LANGUAGE_ADAPTATION";
      }
      dispatch(fetchAllVideos(filters));
    } else {
      toast.error(response?.error || "Failed to submit video");
    }
  };

  const handleCreateLanguageAdaptation = (masterVideo) => {
    setSelectedMasterVideo(masterVideo);
    setIsStage2ModalOpen(true);
  };

  const handleStage2Success = () => {
    // Refresh Stage 2 videos
    dispatch(fetchAllVideos({ stage: "LANGUAGE_ADAPTATION" }));
    toast.success("Language adaptation created successfully!");
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

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setActiveStage("stage1");
              setActiveTab("all");
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeStage === "stage1"
                ? "bg-cyan-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Stage 1 (Initial Upload)
          </button>
          <button
            onClick={() => {
              setActiveStage("stage2");
              setActiveTab("all");
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeStage === "stage2"
                ? "bg-cyan-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Stage 2 (Language Adaptation)
          </button>
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
                activeTab === "DRAFT"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Draft ({tabCounts.DRAFT})
            </button>

            <button
              onClick={() => setActiveTab("PUBLISHED")}
              className={`pb-4 px-1 font-medium whitespace-nowrap transition-colors ${
                activeTab === "PUBLISHED"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {activeStage === "stage1" ? "Master Videos" : "Published" } ({tabCounts.PUBLISHED})
            </button>
          </div>
        </div>

        {isVideoListLoading ? (
          <SkeletonBlock />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const rejection = video?.latestRejection;
              const shouldShowAssignBlock =
                video.status === "DRAFT" &&
                ((activeStage === "stage2" &&
                  video.stage === "LANGUAGE_ADAPTATION") ||
                  (activeStage === "stage1" &&
                    video.stage === "INITIAL_UPLOAD"));

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
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}
                      >
                        <span>{badge.icon}</span>
                        {badge.text}
                      </div>

                      <div className="text-sm bg-gray-200 px-2 py-0.5 rounded-full border border text-gray-500">
                        Uploaded: {formatDate(video.createdAt)}
                      </div>
                    </div>

                    <div className="relative group mb-3">
                      <h3 className="text-xl font-bold text-gray-900 truncate">
                        {video?.title || "Untitled Video"}
                      </h3>
                      {video?.title && video.title.length > 30 && (
                        <div className="absolute left-0 top-full mt-1 w-full bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                          {video.title}
                        </div>
                      )}
                    </div>

                    <div className="relative group mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 rounded-lg bg-gray-50 p-2">
                        <span className="text-md font-semibold">
                          Description:{" "}
                          <span
                            className={`text-sm font-normal inline-block align-bottom ${
                              !shouldShowAssignBlock
                                ? "line-clamp-4 max-w-full"
                                : "truncate max-w-[200px]"
                            }`}
                          >
                            {video.description}
                          </span>
                        </span>
                      </div>
                      {video.description.length >
                        (!shouldShowAssignBlock ? 150 : 30) && (
                        <div
                          className="absolute left-0 top-full mt-1 w-full bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg
                   opacity-0 invisible group-hover:opacity-100 group-hover:visible
                   transition-all duration-200 z-10 pointer-events-none"
                        >
                          {video.description}
                        </div>
                      )}
                    </div>

                    {rejection?.comments && (
                      <div className="relative group mb-4">
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-1">
                          <p className="flex items-start gap-2 text-sm text-red-700 leading-relaxed">
                            <RxCrossCircled
                              size={14}
                              className="mt-[5px] flex-shrink-0"
                            />
                            <span className="truncate block overflow-hidden whitespace-nowrap text-ellipsis min-w-0 flex-1">
                              {rejection.comments}
                            </span>
                          </p>
                        </div>
                        {rejection.comments.length > 30 && (
                          <div className="absolute left-0 top-full mt-1 w-full bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none max-h-32 overflow-y-auto">
                            {rejection.comments}
                          </div>
                        )}
                      </div>
                    )}

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
                    <div></div>

                    {activeStage === "stage1" &&
                      activeTab === "PUBLISHED" &&
                      video.status === "PUBLISHED" &&
                      video.stage === "INITIAL_UPLOAD" && (
                        <button
                          onClick={() => handleCreateLanguageAdaptation(video)}
                          className="w-full mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FaCloudUploadAlt className="w-4 h-4" />
                          Create Language
                        </button>
                      )}

                    {shouldShowAssignBlock && (
                      <div className="mt-2 space-y-2">
                        <select
                          value={videoAssignees[video.id] || ""}
                          onChange={(e) => {
                            setVideoAssignees((prev) => ({
                              ...prev,
                              [video.id]: e.target.value,
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          onFocus={async () => {
                            await dispatch(fetchAssigneeList(video.id));
                          }}
                        >
                          <option value="">Select Assignee</option>
                          {assigneeOptions.map((reviewer) => (
                            <option key={reviewer.id} value={reviewer.id}>
                              {reviewer.label}
                            </option>
                          ))}
                        </select>

                        <button
                          disabled={
                            isSubmitVideoLoading || !videoAssignees[video.id]
                          }
                          onClick={() => {
                            handleSubmitVideo(video, videoAssignees[video.id]);
                          }}
                          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaCloudUploadAlt className="w-4 h-4" />
                          {isSubmitVideoLoading
                            ? "Submitting..."
                            : "Submit for Review"}
                        </button>
                      </div>
                    )}
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

      <Stage2LanguageAdaptationModal
        open={isStage2ModalOpen}
        onClose={() => {
          setIsStage2ModalOpen(false);
          setSelectedMasterVideo(null);
        }}
        masterVideo={selectedMasterVideo}
        onSuccess={handleStage2Success}
      />
    </div>
  );
};

export default AgencyPocVideos;
