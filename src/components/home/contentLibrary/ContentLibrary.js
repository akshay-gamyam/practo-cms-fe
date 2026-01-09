import React, { useEffect, useState } from "react";
import { IoSearch, IoFilter, IoPlay, IoEye } from "react-icons/io5";
import CustomSelect from "../../common/customSelect/CustomSelect";
import Pagination from "../../common/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContentLibraryList,
  fetchContentLibrarySpecialityList,
  fetchContentLibraryStatusList,
} from "../../../redux/action/contentLibraryAction/ContentLibraryAction";
import { LIMIT } from "../../../utils/constants";
import {
  formatDate,
  formatDuration,
  getStatusColor,
} from "../../../utils/helper";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";
import ContentPreviewModal from "../contentApprover/contentApproverVideos/ContentPreviewModal";

const ContentLibrary = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [specialty, setSpecialty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const {
    contentLibraryStatus,
    contentLibrarySpeciality,
    contentLibrary,
    isContentLibraryListLoading,
    pagination,
  } = useSelector((state) => state.content_library);

  useEffect(() => {
    dispatch(fetchContentLibraryStatusList());
    dispatch(fetchContentLibrarySpecialityList());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: LIMIT,
    };

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }
    if (status && status !== "all") {
      params.status = status;
    }
    if (specialty && specialty !== "all") {
      params.specialty = specialty;
    }

    dispatch(fetchContentLibraryList(params));
  }, [dispatch, searchTerm, status, specialty, currentPage]);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    ...(contentLibraryStatus?.statuses || []),
  ];

  const specialtyOptions = [
    { value: "all", label: "All Specialties" },
    ...(contentLibrarySpeciality?.specialties || []),
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleSpecialtyChange = (value) => {
    setSpecialty(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviewClick = (video) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVideo(null);
  };

  const videos = contentLibrary?.videos || [];
  const totalVideos = pagination?.totalCount || videos.length;
  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Content Library
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage and review all content
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Filters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative w-full">
            <IoSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 transition-colors"
            />
          </div>

          <CustomSelect
            value={status}
            options={statusOptions}
            onChange={handleStatusChange}
            placeholder="All Statuses"
            renderValue={(option) => (
              <span className="text-gray-700 text-sm sm:text-base">
                {option?.label || "All Statuses"}
              </span>
            )}
          />

          <CustomSelect
            value={specialty}
            options={specialtyOptions}
            onChange={handleSpecialtyChange}
            placeholder="All Specialties"
            renderValue={(option) => (
              <span className="text-gray-700 text-sm sm:text-base">
                {option?.label || "All Specialties"}
              </span>
            )}
          />

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 text-sm font-medium px-4 py-1.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <IoFilter size={16} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            All Content ({totalVideos})
          </h2>
        </div>

        {isContentLibraryListLoading ? (
          <div className="p-8 text-center text-gray-500">
            <SkeletonBlock />
          </div>
        ) : videos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No content found</div>
        ) : (
          <>
            <div className="lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-80">
                      Title
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Doctor
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Specialty
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Duration
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Uploaded
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {videos.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 max-w-xs relative group">
                        <div className="font-medium text-gray-900 truncate">
                          {item.title}
                        </div>
                        <div className="absolute left-6 mt-1 z-50 hidden group-hover:block max-w-md rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg whitespace-normal">
                          {item.title}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                        {item.doctorName || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                        {item.specialty || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status?.replace(/_/g, " ") || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                        {formatDuration(item.duration)}
                      </td>

                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            // onClick={() => window.open(item.videoUrl, "_blank")}
                            onClick={() => handlePreviewClick(item)}
                            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                          >
                            <IoPlay size={16} />
                            Preview
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
                            <IoEye size={16} />
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      <ContentPreviewModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        video={selectedVideo}
      />
    </div>
  );
};

export default ContentLibrary;
