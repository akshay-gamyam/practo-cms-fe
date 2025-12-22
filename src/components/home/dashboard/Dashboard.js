import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDetailedTopicById,
  fetchTopicStatistics,
  fetchUplodedTopcsList,
} from "../../../redux/action/topicAction/TopicAction";
import { buildStats, statusStyles } from "../../../utils/helper";
import TopicDetailsModal from "./TopicViewDetailModal";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [isDetailedTopicModalOpen, setIsDetailedTopicModalOpen] =
    useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const {
    topics,
    selectedTopics,
    isTopicsViewLoading,
    topicStatistics,
    isTopicsListLoading,
    isTopicStatsLoading,
  } = useSelector((state) => state.topics);
  const stats = buildStats(topicStatistics);

  useEffect(() => {
    dispatch(fetchUplodedTopcsList());
    dispatch(fetchTopicStatistics());
  }, [dispatch]);

  useEffect(() => {
    if (isDetailedTopicModalOpen && selectedTopicId) {
      dispatch(fetchDetailedTopicById(selectedTopicId));
    }
  }, [isDetailedTopicModalOpen, selectedTopicId, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Overview of content management system
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isTopicStatsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl p-6 animate-pulse"
                >
                  <SkeletonBlock
                    title={false}
                    lines={3}
                    lineHeight="h-4"
                    lineWidths={["w-24", "w-16", "w-32"]}
                  />
                </div>
              ))
            : stats.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-xl shadow-sm p-6 flex justify-between items-start hover:shadow-md transition"
                >
                  <div>
                    <p className="text-gray-500 text-sm">{item.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {item.value}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white">
                    <item.icon size={22} />
                  </div>
                </div>
              ))}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>

          {!isTopicsListLoading && topics.length === 0 && (
            <p className="text-sm text-gray-500">No activity found</p>
          )}

          {isTopicsListLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="relative bg-white border rounded-xl p-5"
                >
                  <SkeletonBlock
                    title
                    lines={2}
                    showCard={true}
                    lineWidths={["w-3/4", "w-2/3"]}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 cursor-pointer">
              {topics?.map((topic) => (
                <div
                  key={topic?.id}
                  onClick={() => {
                    setSelectedTopicId(topic?.id);
                    setIsDetailedTopicModalOpen(true);
                  }}
                  className="group relative bg-white border rounded-xl p-5 transition
                   hover:shadow-md hover:border-gray-300"
                >
                  <span
                    className={`absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-semibold
            ${statusStyles[topic?.status]}`}
                  >
                    {topic.status.replace("_", " ")}
                  </span>

                  <h3 className="text-lg font-semibold text-gray-900 pr-28">
                    {topic.title}
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

                  {/* <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs text-gray-700">
                      📄 Scripts:{" "}
                      <span className="font-semibold">
                        {topic._count?.scripts}
                      </span>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs text-gray-700">
                      🎥 Videos:{" "}
                      <span className="font-semibold">
                        {topic._count?.videos}
                      </span>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs text-gray-700">
                      👨‍⚕️ Doctors:{" "}
                      <span className="font-semibold">
                        {topic._count?.doctorPointers}
                      </span>
                    </span>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TopicDetailsModal
        isOpen={isDetailedTopicModalOpen}
        topic={selectedTopics}
        isLoading={isTopicsViewLoading}
        onClose={() => {
          setIsDetailedTopicModalOpen(false);
          setSelectedTopicId(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
