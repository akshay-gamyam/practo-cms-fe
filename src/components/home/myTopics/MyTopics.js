import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorAssignmentList } from "../../../redux/action/topicAction/TopicAction";
import DetailedCard from "../../common/DetailedCard";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import { ROLE_VARIABLES_MAP } from "../../../utils/helper";
import { ROUTES } from "../../../routes/RouterConstant";
import { useNavigate } from "react-router-dom";
import { LIMIT } from "../../../utils/constants";
import Pagination from "../../common/pagination/Pagination";

const MyTopics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    doctorAssignments = [],
    isDoctorAssignmentLoading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.topics);


  const user = useSelector((state) => state.auth.user);
  const redirecttoUploadById =
    user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR ||
    ROLE_VARIABLES_MAP?.SUPER_ADMIN;

  useEffect(() => {
    dispatch(fetchDoctorAssignmentList(1, LIMIT));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchDoctorAssignmentList(page, LIMIT));
  };

  if (isDoctorAssignmentLoading) {
    return <SkeletonBlock />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Failed to load topics
      </div>
    );
  }

  if (!doctorAssignments.length) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        No topics assigned
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Assigned Topics
            </h1>
            <p className="text-gray-500 mt-1">Overview of Consultant Doctors</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {doctorAssignments.map((topic) => (
              <DetailedCard
                className={
                  topic.status === "DOCTOR_INPUT_RECEIVED"
                    ? ""
                    : "cursor-pointer"
                }
                key={topic?.id}
                title={topic.title}
                description={topic.description}
                status={topic.status}
                createdBy={topic.createdBy}
                createdAt={topic.createdAt}
                counts={topic._count}
                onClick={() => {
                  if (topic.status === "DOCTOR_INPUT_RECEIVED") {
                    return;
                  }
                  if (redirecttoUploadById) {
                    navigate(`${ROUTES.UPLOAD}/${topic.id}`);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className=" sticky bottom-0 backdrop-blur-xl bg-white/30 border-t">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MyTopics;
