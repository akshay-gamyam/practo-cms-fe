import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiEye,
  FiFileText,
} from "react-icons/fi";
import ContentDetailsModal from "./ContentDetailsScriptModal";
import {
  fetchContentApproverScripts,
  claimScript,
  contentApproverScript,
  approveScript,
} from "../../../../redux/action/contentApproverAction/ContentApproverAction";
import {
  formatDate,
  getStatusBadge,
  getWordCount,
} from "../../../../utils/helper";
import { toast } from "react-toastify";
import SkeletonBlock from "../../../common/skeletonBlock/SkeletonBlock";

const ContentApproverScript = () => {
  const dispatch = useDispatch();
  const {
    contentApproverScripts,
    myClaimsScripts,
    myLockedScripts,
    isScriptsListLoading,
    isScriptActionLoading,
    error,
  } = useSelector((state) => state.contentApprover);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedScript, setSelectedScript] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const buildFetchParams = () => {
    const params = {};
    if (searchTerm) {
      params.search = searchTerm;
    }
    return params;
  };

  const refetchScripts = () => {
    dispatch(fetchContentApproverScripts(buildFetchParams()));
  };

  useEffect(() => {
    refetchScripts();
  }, [filterStatus, searchTerm]);

  const getCurrentTabData = () => {
    switch (filterStatus) {
      case "my-claims":
        return myClaimsScripts;
      case "approved":
        return myLockedScripts;
      case "all":
      default:
        return contentApproverScripts;
    }
  };

  const handleClaim = async (id) => {
    try {
      await dispatch(claimScript(id));
      await dispatch(fetchContentApproverScripts(buildFetchParams()));
    } catch (error) {
      toast.error("Failed to claim script:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      dispatch(approveScript(id));
      toast.success("Script locked successfully");
      setTimeout(() => {
        window.location.reload();
      }, 300);
      // dispatch(fetchContentApproverScripts(buildFetchParams()));
    } catch (error) {
      console.error("Failed to approve script:", error);
      toast.error("Failed to approve script");
    }
  };

  const handleTabChange = async (tabKey) => {
    setFilterStatus(tabKey);
    if (tabKey === "approved") {
      try {
        await dispatch(contentApproverScript());
      } catch (error) {
        console.error("Failed to fetch approved scripts:", error);
      }
    }
  };

  const currentTabData = getCurrentTabData();

  const filteredScripts = currentTabData.filter((script) => {
    const matchesSearch =
      script.topic?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.uploadedBy?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      script.uploadedBy?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (error) {
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Failed to load scripts
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Script Approvals
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
              { key: "my-claims", label: "My Claims" },
              { key: "approved", label: "Approved" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
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

        {isScriptsListLoading ? (
          <SkeletonBlock />
        ) : filteredScripts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-500">No scripts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredScripts.map((script) => {
              const statusBadge = getStatusBadge(script.displayStatus);
              const isClaimed =
                filterStatus === "my-claims"
                  ? script.assignedReviewerId !== null
                  : script.lockedById !== null;

              const isContentApprovalStatus =
                script.status === "LOCKED" ||
                script.displayStatus === "CONTENT_APPROVAL";

              const canInteract =
                isContentApprovalStatus && isClaimed && !isScriptActionLoading;

              const canShowClaimButton = isContentApprovalStatus && !isClaimed;

              const authorName = script.uploadedBy
                ? `${script.uploadedBy.firstName} ${script.uploadedBy.lastName}`
                : "Unknown Author";

              const getInitials = (firstName = "", lastName = "") => {
                return `${firstName.charAt(0)}${lastName.charAt(
                  0
                )}`.toUpperCase();
              };

              const badge = script.uploadedBy
                ? getInitials(
                    script.uploadedBy.firstName,
                    script.uploadedBy.lastName
                  )
                : "NA";

              const wordCount = getWordCount(script.content);

              return (
                <div
                  key={script.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
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
                          Version {script.version}
                        </span>
                      </div>

                      <div>
                        {canShowClaimButton && (
                          <button
                            onClick={() => handleClaim(script.id)}
                            disabled={isScriptActionLoading}
                            className="border border-gray-400 rounded-xl px-6 py-1 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isScriptActionLoading ? "Claiming..." : "Claim"}
                          </button>
                        )}
                        {/* {!canShowClaimButton && isClaimed && ( */}
                        {filterStatus !== "approved" &&
                          !canShowClaimButton &&
                          isClaimed && (
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                              Claimed
                            </span>
                          )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {script.topic?.title || "Untitled Script"}
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

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <FiFileText className="w-3.5 h-3.5" />
                        {wordCount} words
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" />
                        {formatDate(script.createdAt)}
                      </span>
                    </div>

                    {filterStatus === "approved" && script.reviewComments && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          <span className="font-medium">
                            {script?.reviewComments}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedScript(script);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiEye className="w-4 h-4" />
                        {filterStatus === "approved"
                          ? "View Content"
                          : "Preview"}
                      </button>
                      {filterStatus !== "approved" && (
                        <button
                          onClick={() => handleApprove(script.id)}
                          disabled={!canInteract || isScriptActionLoading}
                          className="flex-1 px-4 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                          {isScriptActionLoading ? "Locking..." : "Lock"}
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

      <ContentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedScript(null);
        }}
        content={selectedScript}
        type="script"
      />
    </div>
  );
};

export default ContentApproverScript;
