import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import Pagination from "../../common/pagination/Pagination";
import { fetchDoctorPointers } from "../../../redux/action/doctorAction/DoctorAction";
import "../../common/richTextEditor/viewRichTextEditor.css";
import useDebounce from "../../common/hooks/useDebounce";
import { LIMIT } from "../../../utils/constants";

const MyDoctorNotes = ({ topicId }) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const {
    doctorPointer = [],
    isDoctorPointerListLoading,
    pagination = { page: 1, totalPages: 1 },
    error,
  } = useSelector((state) => state.doctor_pointers);

  useEffect(() => {
    dispatch(
      fetchDoctorPointers({
        page,
        limit: LIMIT,
        ...(debouncedSearch && { search: debouncedSearch }),
        topicId,
      })
    );
  }, [dispatch, page, debouncedSearch, topicId]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Doctor Notes
              </h1>
              <p className="text-gray-500 mt-1 text-sm max-w-xl">
                Clinical notes and medical guidance provided by consultants
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search notes, topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Medical Notes
              </h2>
            </div>

            {isDoctorPointerListLoading && (
              <div className="min-h-[60vh] flex items-center justify-center">
                <SkeletonBlock />
              </div>
            )}

            {!isDoctorPointerListLoading && doctorPointer.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-gray-500 text-sm">
                  No medical notes found for this topic.
                </p>
              </div>
            )}
            {!isDoctorPointerListLoading && doctorPointer.length > 0 && (
              <div className="p-4 sm:p-6 space-y-6">
                {doctorPointer.map((item) => (
                  <div
                    key={item?.id}
                    className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-gray-50 border-b flex justify-between">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {item?.topic?.title || "Medical Topic"}
                      </h3>
                      <h3 className="text-lg sm:text-md font-semibold text-gray-900">
                        {item?.doctor
                          ? `${item.doctor.firstName} ${item.doctor.lastName}`
                          : "Doctor"}
                      </h3>
                    </div>

                    <div className="px-5 py-5 space-y-4">
                      {item?.topic?.description && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: item.topic.description,
                            }}
                            className="text-sm text-blue-900 leading-relaxed richtext-content"
                          />
                        </div>
                      )}

                      {item?.notes && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Doctor’s Notes
                          </h4>

                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <p
                              dangerouslySetInnerHTML={{ __html: item.notes }}
                              className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed richtext-content"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-5 py-3 bg-gray-50 border-t flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Created on{" "}
                        {item?.createdAt &&
                          new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {pagination?.totalPages > 1 && (
        <div className="px-6 py-4 border-t bg-gray-50">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default MyDoctorNotes;
