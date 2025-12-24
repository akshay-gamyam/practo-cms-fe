import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUplodedTopcsList } from "../../../redux/action/topicAction/TopicAction";
import { statusStyles } from "../../../utils/helper";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import { FiUserPlus } from "react-icons/fi";
import AddMedicalTopicModal from "./AddmedicalTopicModal";
import Pagination from "../../common/pagination/Pagination";
import { LIMIT } from "../../../utils/constants";
// import { ROUTES } from "../../../routes/RouterConstant";
// import { useNavigate } from "react-router-dom";

const MedicalTopics = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { topics, isTopicsListLoading, error, currentPage, totalPages } = useSelector((state) => state.topics);
  const [openMedicalTopicModal, setOpenMedicalTopicModal] = useState(false);

  // const handleCardClick = (topicId) => {
  //   navigate(`${ROUTES.UPLOAD}/${topicId}`);
  // };
  useEffect(() => {
    dispatch(fetchUplodedTopcsList());
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchUplodedTopcsList(page, LIMIT));
  };

  if (error) {
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Failed to load Medical topics
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              My Topics
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Overview of Consultant Doctors
            </p>
          </div>
          <button
            onClick={() => {
              console.log("OPEN MODAL");
              setOpenMedicalTopicModal(true);
            }}
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-400 text-white font-medium shadow-md hover:opacity-90 transition-all duration-200"
          >
            <FiUserPlus size={20} />
            Add Topics
          </button>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Medical Topics
            </h2>
          </div>

          {isTopicsListLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-xl p-5">
                  <SkeletonBlock
                    title
                    lines={2}
                    showCard
                    lineWidths={["w-3/4", "w-2/3"]}
                  />
                </div>
              ))}
            </div>
          )}
          {!isTopicsListLoading && topics.length === 0 && (
            <p className="text-sm text-gray-500">No Medical Topics found</p>
          )}
          {!isTopicsListLoading && topics.length > 0 && (
            <>
              <div className="space-y-4 cursor-pointer">
                {topics?.map((topic) => {
                  if (!topic) return null;
                  return (
                    <>
                      <div
                        key={topic?.id}
                        // onClick={() => handleCardClick(topic?.id)}
                        className="group relative bg-white border rounded-xl p-5 transition hover:shadow-md hover:border-gray-300"
                      >
                        <span
                          className={`absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-semibold
            ${statusStyles[topic?.status] || ""}`}
                        >
                          {topic.status.replace("_", " ") || "---"}
                        </span>

                        <h3 className="text-lg font-semibold text-gray-900 pr-28">
                          {topic?.title}
                        </h3>

                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <span>
                            {topic.assignedDoctor?.firstName}{" "}
                            {topic.assignedDoctor?.lastName}
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 border border-gray-300 text-gray-700">
                            {topic.assignedDoctor?.specialty}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          Created by{" "}
                          <span className="font-medium text-gray-700">
                        {topic.createdBy?.firstName} {topic.createdBy?.lastName}
                          </span>
                          <span className="mx-1">•</span>
                      {new Date(topic.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                      })}
                        </p>
                      </div>
                    </>
                  );
                })}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      <AddMedicalTopicModal
        open={openMedicalTopicModal}
        onClose={() => setOpenMedicalTopicModal(false)}
      />
    </div>
  );
};

export default MedicalTopics;
