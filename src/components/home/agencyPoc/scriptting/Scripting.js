import React, { useCallback, useEffect, useState } from "react";
import {
  FiEye,
  FiEdit2,
  FiUpload,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiLock,
  FiFileText,
  FiUser,
  FiSend,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchAllScripts,
  fetchAllVideosID,
  fetchVideoDataByID,
  // deleteScript
} from "../../../../redux/action/agencyPocAction/AgencyPocAction";
import EditScriptModal from "./EditScriptModal";
import SkeletonBlock from "../../../common/skeletonBlock/SkeletonBlock";
import VideoUploadModal from "./ViewUploadModal";
import { getVideoButtonState, getWordCount } from "../../../../utils/helper";
import { LIMIT } from "../../../../utils/constants";
import Pagination from "../../../common/pagination/Pagination";
import { clearSelectedVideoData } from "../../../../redux/reducer/agencyPocReducer/AgencyPocReducer";

const Scriptting = () => {
  const dispatch = useDispatch();
  const {
    scripts,
    isScriptListLoading,
    totalPages,
    allVideosId,
    selectedVideoIdData,
  } = useSelector((state) => state.agencyPoc);

  const [activeTab, setActiveTab] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);
  const [scriptForUpload, setScriptForUpload] = useState(null);
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  // const [scriptToDelete, setScriptToDelete] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    dispatch(fetchAllScripts({ page, size: LIMIT }));
  }, [dispatch, page]);

  useEffect(() => {
    dispatch(fetchAllVideosID());
  }, [dispatch]);

  const REVIEW_STATUSES = [
    "IN_REVIEW",
    "MEDICAL_REVIEW",
    "BRAND_REVIEW",
    "DOCTOR_REVIEW",
  ];

  const tabs = [
    { id: "all", label: "All Scripts", count: scripts?.length },
    {
      id: "DRAFT",
      label: "Drafts",
      count: scripts.filter(
        (s) => s.status === "DRAFT" && s.latestRejection === null
      ).length,
    },
    {
      id: "IN_REVIEW",
      label: "In Review",
      count: scripts.filter((s) => REVIEW_STATUSES.includes(s.status)).length,
    },
    {
      id: "REJECTED",
      label: "Rejected",
      count:
        scripts.filter((s) => s.status === "REJECTED").length ||
        scripts.filter((s) => s.latestRejection !== null).length,
    },
    {
      id: "LOCKED",
      label: "Locked",
      count: scripts.filter((s) => s.status === "LOCKED").length,
    },
  ];

  const filteredScripts = scripts.filter((script) => {
    if (activeTab === "all") return true;

    if (activeTab === "IN_REVIEW") {
      return REVIEW_STATUSES.includes(script.status);
    }

    if (activeTab === "REJECTED") {
      return script.status === "REJECTED" || script.latestRejection !== null;
    }

    if (activeTab === "DRAFT") {
      return script.status === "DRAFT" && script.latestRejection === null;
    }

    return script.status === activeTab;
  });

  // Helper function to check if script has uploaded video
  const hasUploadedVideo = (script) => {
    // Check if script has any videos at all
    if (!script.videos || script.videos.length === 0) return false;

    // If allVideosId is available, check if any video is in the uploaded list
    if (allVideosId && allVideosId.length > 0) {
      return script.videos.some(video => allVideosId.includes(video.id));
    }

    // Fallback: if videos array exists and has items, consider it as having video
    return script.videos.length > 0;
  };

  // Helper function to get video ID for script
  const getScriptVideoId = (script) => {
    if (!script.videos || script.videos.length === 0) return null;
    const uploadedVideo = script.videos.find(video => 
      allVideosId && allVideosId.includes(video.id)
    );
    return uploadedVideo ? uploadedVideo.id : null;
  };

  const getStatusBadge = (status) => {
    const badges = {
      IN_REVIEW: {
        icon: FiClock,
        text: "IN REVIEW",
        color: "bg-amber-50 text-amber-700 border-amber-200",
      },
      MEDICAL_REVIEW: {
        icon: FiClock,
        text: "MEDICAL REVIEW",
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      BRAND_REVIEW: {
        icon: FiClock,
        text: "BRAND REVIEW",
        color: "bg-purple-50 text-purple-700 border-purple-200",
      },
      DOCTOR_REVIEW: {
        icon: FiClock,
        text: "DOCTOR REVIEW",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      },
      REJECTED: {
        icon: FiXCircle,
        text: "REJECTED",
        color: "bg-red-50 text-red-700 border-red-200",
      },
      LOCKED: {
        icon: FiLock,
        text: "LOCKED",
        color: "bg-purple-50 text-purple-700 border-purple-200",
      },
      DRAFT: {
        icon: FiFileText,
        text: "DRAFT",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
    };

    const badge = badges[status] || badges.DRAFT;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium border ${badge.color}`}
      >
        <Icon size={12} />
        {badge.text}
      </span>
    );
  };

  const handleEditScript = (script) => {
    const topic = {
      id: script.topicId,
      title: script.topic?.title || "Script",
      description: script.topic?.description || "",
      scripts: [script],
    };
    setSelectedScript(topic);
    setShowEditModal(true);
  };

  const handleViewScript = (script) => {
    const topic = {
      id: script.topicId,
      title: script.topic?.title || "Script",
      description: script.topic?.description || "",
      scripts: [script],
    };
    setSelectedScript(topic);
    setShowEditModal(true);
  };

  // const handleDeleteScript = async (scriptId) => {
  //   if (!window.confirm("Are you sure you want to delete this script?")) {
  //     return;
  //   }

  //   setScriptToDelete(scriptId);
  //   const response = await dispatch(deleteScript(scriptId));

  //   if (response?.success) {
  //     toast.success("Script deleted successfully");
  //   } else {
  //     toast.error(response?.error || "Failed to delete script");
  //   }
  //   setScriptToDelete(null);
  // };

  // New function to handle video upload modal
  const handleUploadVideo = (script) => {
    dispatch(clearSelectedVideoData());
    setScriptForUpload(script);
    setShowVideoUploadModal(true);
  };

  const handleSubmitForReview = async (script) => {
    const videoId = getScriptVideoId(script);
    if (!videoId && script.videos && script.videos.length > 0) {
      // Use the first video from the videos array (most recent)
      videoId = script.videos[0].id;
    }

    if (videoId) {
      try {
        await dispatch(fetchVideoDataByID(videoId));
        // Video data will be available in selectedVideoIdData from Redux
        setScriptForUpload(script);
        setShowVideoUploadModal(true);
      } catch (error) {
        toast.error("Error loading video data");
        console.error("Error fetching video:", error);
      }
    } else {
      setScriptForUpload(script);
      setShowVideoUploadModal(true);
    }
  };

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedScript(null);
    dispatch(fetchAllScripts({ page, size: LIMIT }));
  }, [dispatch]);

  const handleCloseVideoUploadModal = useCallback(() => {
    setShowVideoUploadModal(false);
    setScriptForUpload(null);
  }, []);

  const handleVideoUploadSuccess = useCallback(
    (videoData) => {
      toast.success("Video uploaded successfully!");
      dispatch(fetchAllScripts({ page, size: LIMIT }));
      dispatch(fetchAllVideosID());
    },
    [dispatch, page]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isScriptLocked = (status) =>
    status === "LOCKED" ||
    status === "IN_REVIEW" ||
    status === "MEDICAL_REVIEW" ||
    status === "BRAND_REVIEW" ||
    status === "DOCTOR_REVIEW";

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Scripts</h1>
            <p className="text-gray-500 mt-1">
              Manage all your scripts and upload videos for locked scripts
            </p>
          </div>

          <div className="max-w-7xl mx-auto border-b border-gray-300">
            <div className="flex gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {isScriptListLoading ? (
          <div className="max-w-7xl mx-auto py-4 mt-4">
            <SkeletonBlock />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto py-4 mt-4">
            <div className="space-y-4">
              {filteredScripts.map((script) => {
                const hasVideo = hasUploadedVideo(script);
                 const buttonState = getVideoButtonState(script);
                return (
                  <div
                    key={script.id}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                              {script.topic?.title || "Untitled Script"}
                            </h3>
                            {getStatusBadge(script.status)}
                            {script.status === "LOCKED" && (
                              <span className="inline-flex items-center gap-1 px-2 rounded-xl py-1 rounded text-xs font-medium border bg-teal-50 text-teal-700 border-teal-200">
                                <FiCheckCircle size={12} />
                                READY FOR VIDEO
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FiClock size={14} className="flex-shrink-0" />
                              Last updated: {formatDate(script.updatedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiFileText size={14} className="flex-shrink-0" />
                              {getWordCount(script.content) || 0} words
                            </span>
                            {script.createdBy && (
                              <span className="flex items-center gap-1">
                                <FiUser size={14} className="flex-shrink-0" />
                                {script.createdBy.firstName}{" "}
                                {script.createdBy.lastName}
                              </span>
                            )}
                            {script.status === "LOCKED" && (
                              <span className="flex items-center gap-1 text-purple-600">
                                <FiLock size={14} className="flex-shrink-0" />
                                Locked on: {formatDate(script.lockedAt)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                           {script.status === "LOCKED" && (
                            <>
                              {buttonState.buttonType === "upload" && (
                                <button
                                  onClick={() => handleUploadVideo(script)}
                                  className="flex items-center gap-1 px-3 py-1.5 sm:px-4 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
                                >
                                  <FiUpload size={14} />
                                  <span className="hidden sm:inline">
                                    Upload Video
                                  </span>
                                  <span className="sm:hidden">Upload</span>
                                </button>
                              )}

                              {buttonState.buttonType === "submit" && (
                                <button
                                  onClick={() => handleSubmitForReview(script)}
                                  className="flex items-center gap-1 px-3 py-1.5 sm:px-4 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-400 rounded-xl hover:brightness-110 transition-all"
                                >
                                  <FiSend size={14} />
                                  <span className="hidden sm:inline">
                                    Submit for Review
                                  </span>
                                  <span className="sm:hidden">Submit</span>
                                </button>
                              )}

                              {buttonState.buttonType === "uploaded" && (
                                <button
                                  disabled
                                  className="flex items-center gap-1 px-3 py-1.5 sm:px-4  text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl cursor-not-allowed opacity-75"
                                >
                                  <FiCheckCircle size={14} />
                                  <span className="hidden sm:inline">
                                    Video Uploaded
                                  </span>
                                  <span className="sm:hidden">Uploaded</span>
                                </button>
                              )}
                            </>
                          )}

                          {script.status === "REJECTED" && (
                            <button
                              onClick={() => handleEditScript(script)}
                              className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
                            >
                              <FiEdit2 size={14} />
                              <span className="hidden sm:inline">
                                Fix Script
                              </span>
                              <span className="sm:hidden">Fix</span>
                            </button>
                          )}

                          {/* {script.status === "DRAFT" && (
                            <button
                              onClick={() => handleEditScript(script)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl sm:px-4 sm:py-2 text-sm font-medium text-white ${
                                scripts.latestRejection 
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }  transition-colors`}
                            >
                              <FiEdit2 size={14} />
                              <span className="hidden sm:inline">
                                {scripts.latestRejection
                                  ? "Fix Script"
                                  : "Edit"}
                              </span>
                            </button>
                          )} */}
                          {script.status === "DRAFT" && (
                            <button
                              onClick={() => handleEditScript(script)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl sm:px-4 sm:py-2 text-sm font-medium text-white ${
                                script.latestRejection
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              } transition-colors`}
                            >
                              <FiEdit2 size={14} />
                              <span className="hidden sm:inline">
                                {script.latestRejection ? "Fix Script" : "Edit"}
                              </span>
                              <span className="sm:hidden">
                                {script.latestRejection ? "Fix" : "Edit"}
                              </span>
                            </button>
                          )}

                          {isScriptLocked(script.status) && (
                            <button
                              onClick={() => handleViewScript(script)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            >
                              <FiEye size={14} />
                              <span className="hidden sm:inline">
                                View
                                {script.status === "LOCKED" ? " Script" : ""}
                              </span>
                            </button>
                          )}

                          {/* {script.status === "DRAFT" && (
                          <button
                            onClick={() => handleDeleteScript(script.id)}
                            disabled={
                              isDeleteScriptLoading &&
                              scriptToDelete === script.id
                            }
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )} */}
                        </div>
                      </div>

                      {script.rejectionReason &&
                        script.status === "REJECTED" && (
                          <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <FiXCircle size={16} className="text-red-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-red-900 mb-1">
                                  Feedback:
                                </p>
                                <p className="text-sm text-red-800 break-words">
                                  {script.rejectionReason}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      {script.status === "LOCKED" && (
                        <div className="mt-4 p-3 sm:p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <FiCheckCircle
                                size={16}
                                className="text-purple-600"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-purple-900 mb-1">
                                Script Approved & Locked!
                              </p>
                              <p className="text-sm text-purple-800 break-words">
                                This script has been approved by all reviewers
                                and is now locked. You can proceed to upload the
                                video.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredScripts.length === 0 && !isScriptListLoading && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-base sm:text-lg">
                    No scripts found in this category
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
      {selectedScript && (
        <EditScriptModal
          open={showEditModal}
          onClose={handleCloseEditModal}
          topic={selectedScript}
        />
      )}

      {scriptForUpload && (
        <VideoUploadModal
          open={showVideoUploadModal}
          onClose={handleCloseVideoUploadModal}
          script={scriptForUpload}
          existingVideoData={selectedVideoIdData}
          isNewUpload={!selectedVideoIdData}
          onUploadSuccess={handleVideoUploadSuccess}
        />
      )}
    </div>
  );
};

export default Scriptting;
