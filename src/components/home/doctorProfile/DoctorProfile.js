import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorsList } from "../../../redux/action/topicAction/TopicAction";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import { statusStyles } from "../../../utils/helper";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { doctors, isTopicsListLoading } = useSelector((state) => state.topics);

  console.log("doctors", doctors)
  useEffect(() => {
    dispatch(fetchDoctorsList());
  }, [dispatch]);

  return (
      <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Doctor Profiles
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Overview of Consultant Doctors
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Doctor Profiles
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
            {!isTopicsListLoading && doctors.length === 0 && (
              <p className="text-sm text-gray-500">No Doctor Profile found</p>
            )}
            {!isTopicsListLoading && doctors.length > 0 && (
              <div className="space-y-4 cursor-pointer">
                {doctors?.map((doctor) => {
                  if (!doctor) return null;
                  return (
                    <>
                      <div
                        key={doctor?.id}
                        className="group relative bg-white border rounded-xl p-5 transition hover:shadow-md hover:border-gray-300"
                      >

                        <h3 className="text-lg font-semibold text-gray-900 pr-28">
                          {doctor?.email}
                        </h3>

                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <span>
                            {doctor?.firstName}{" "}
                            {doctor?.lastName}
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 border border-gray-300 text-gray-700">
                            {doctor?.specialty || "---"}
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 border border-gray-300 text-gray-700">
                            {doctor?.city || "---"}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

export default DoctorProfile;
