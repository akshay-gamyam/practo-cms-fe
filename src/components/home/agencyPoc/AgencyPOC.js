import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import { LIMIT } from "../../../utils/constants";
import Pagination from "../../common/pagination/Pagination";
import {
  fetchAgencyPocList,
  fetchDetailedAgencyPocById,
} from "../../../redux/action/agencyPocAction/AgencyPocAction";
import AgencyCard from "./AgencyCard";
import { clearSelectedPoc } from "../../../redux/reducer/agencyPocReducer/AgencyPocReducer";
import TopicDetailsModal from "../dashboard/TopicViewDetailModal";
import EditScriptModal from "./scriptting/EditScriptyModal";

const AgencyPOC = () => {
  const dispatch = useDispatch();

  const {
    agencyPoc,
    isPocListLoading,
    error,
    totalPages,
    currentPage,
    selectedAgencyPoc,
    isViewPocLoading,
  } = useSelector((state) => state.agencyPoc);

  const [searchQuery, setSearchQuery] = useState("");
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditScriptModal, setShowEditScriptModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAgencyPocList());
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    dispatch(fetchAgencyPocList(newPage, LIMIT));
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const filteredAgencyPoc = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return agencyPoc
      .filter((item) => item.status === "DOCTOR_INPUT_RECEIVED" || item.status === "IN_PROGRESS" )
      .filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.assignedDoctor?.firstName?.toLowerCase().includes(query) ||
          item.assignedDoctor?.lastName?.toLowerCase().includes(query)
      );
  }, [agencyPoc, searchQuery]);

  // console.log("filteredAgencyPoc", filteredAgencyPoc)

  const getEditButtonText = (topic) => {
    if (!topic?.scripts || topic.scripts.length === 0) {
      return "Write Script";
    }

    const status = topic.scripts[0]?.status;

    switch (status) {
      case "DRAFT":
        return "Continue Draft";
      case "REJECTED":
        return "Fix Script";
      case "IN_REVIEW":
      case "LOCKED":
        return "View Script";
      default:
        return "Write Script";
    }
  };

  const handleViewProfile = async (topicId) => {
    try {
      setShowViewUserModal(true);
      await dispatch(fetchDetailedAgencyPocById(topicId));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const handleEditScript = (topic) => {
    setSelectedTopic(topic);
    setShowEditScriptModal(true);
  };

  const handleCloseViewModal = useCallback(() => {
    setShowViewUserModal(false);
    dispatch(clearSelectedPoc());
  }, [dispatch]);

  const handleCloseEditScriptModal = useCallback(() => {
    setShowEditScriptModal(false);
    setSelectedTopic(null);
    // Refresh the list to get updated script status
    dispatch(fetchAgencyPocList(page, LIMIT));
  }, [dispatch, page]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full mx-auto">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Agency POC
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Topics assigned to you by doctors for script creation
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6 mt-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <CiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-teal-500 hover:text-white border border-gray-300 rounded-xl text-gray-700 font-medium transition-colors whitespace-nowrap">
                <CiFilter size={20} />
                Filter
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {isPocListLoading && <SkeletonBlock />}

          {!isPocListLoading && agencyPoc.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAgencyPoc.map((agency) => (
                <AgencyCard
                  key={agency?.id}
                  project={agency}
                  onViewProject={handleViewProfile}
                  onEditProject={() => handleEditScript(agency)}
                  viewTextButton="View Details"
                  editTextButton={getEditButtonText(agency)}
                />
              ))}
            </div>
          )}

          {!isPocListLoading && filteredAgencyPoc.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "No users found matching your search."
                  : "No users found."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className=" sticky bottom-0 backdrop-blur-xl bg-white/30 border-t">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      <TopicDetailsModal
        isOpen={showViewUserModal}
        topic={selectedAgencyPoc}
        isLoading={isViewPocLoading}
        onClose={handleCloseViewModal}
      />

      <EditScriptModal
        open={showEditScriptModal}
        onClose={handleCloseEditScriptModal}
        topic={selectedTopic}
      />
    </div>
  );
};

export default AgencyPOC;
