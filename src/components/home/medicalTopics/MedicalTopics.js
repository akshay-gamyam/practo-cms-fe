import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUplodedTopcsList } from "../../../redux/action/topicAction/TopicAction";
import { statusStyles } from "../../../utils/helper";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import { ROUTES } from "../../../routes/RouterConstant";
import { useNavigate } from "react-router-dom";

const MedicalTopics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { topics, isTopicsListLoading, error } = useSelector(
    (state) => state.topics
  );
  console.log("topics", topics);

  // const handleCardClick = (topicId) => {
  //   navigate(`${ROUTES.UPLOAD}/${topicId}`);
  // };

  useEffect(() => {
    dispatch(fetchUplodedTopcsList());
  }, [dispatch]);

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
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Medical Topics
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of content management system
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Medical Topics
            </h2>
          </div>

          {!isTopicsListLoading && topics.length === 0 && (
            <p className="text-sm text-gray-500">No Medical Topics found</p>
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
              {topics?.map((topic) => {
                if (!topic) return null;
                return (
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

                    <div className="flex flex-wrap gap-3 mt-4">
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalTopics;
