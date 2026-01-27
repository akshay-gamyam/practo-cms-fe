import React, { useRef, useEffect } from "react";
import CustomModal from "../../../common/Modal/CustomModal";

const ContentPreviewModal = ({ isOpen, onClose, video }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  if (!video) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={video.title || video.topic?.title || "Video Preview"}
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border rounded-xl shadow-sm p-5 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {video.title || video.topic?.title}
            </h3>
            <p className="text-sm mt-1 text-gray-600">{video.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold">
              {video.doctorName?.charAt(0) || "D"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {video.doctorName ||
                  `${video.uploadedBy?.firstName} ${video.uploadedBy?.lastName}`}
              </p>
              <p className="text-xs text-gray-500">Content Doctor</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {video.specialty && (
              <span className="px-3 py-1 text-xs rounded-full bg-cyan-100 text-cyan-700">
                {video.specialty}
              </span>
            )}
            {video.language && (
              <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                {video.language}
              </span>
            )}
            {video.city && (
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                {video.city}
              </span>
            )}
          </div>

          {video.stage && (
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                video.stage === "LANGUAGE_ADAPTATION"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {video.stage === "LANGUAGE_ADAPTATION" ? "Stage 2" : "Stage 1"}
            </span>
          )}

          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Duration</p>
              <p className="font-medium">
                {Math.floor(video.duration / 60)}:
                {(video.duration % 60).toString().padStart(2, "0")} mins
              </p>
            </div>

            <div>
              <p className="text-gray-400">Version</p>
              <p className="font-medium">v{video.version}</p>
            </div>

            <div>
              <p className="text-gray-400">CTA</p>
              <p className="font-medium">{video.ctaType}</p>
            </div>

            <div>
              <p className="text-gray-400">Created</p>
              <p className="font-medium">
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {video.stage && (
            <div>
              <p className="text-gray-400">Stage</p>
              <p className="font-medium">
                {video.stage === "LANGUAGE_ADAPTATION" ? "Stage 2" : "Stage 1"}
              </p>
            </div>
          )}

          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
              ${
                video.status === "PUBLISHED"
                  ? "bg-green-100 text-green-700"
                  : video.status === "LOCKED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
              }`}
          >
            {video.status}
          </span>
        </div>

        <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden">
          {video.videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-[420px] object-contain bg-black"
              controls
              controlsList="nodownload"
            >
              <source src={video.videoUrl} type="video/mp4" />
              <source src={video.videoUrl} type="video/webm" />
            </video>
          ) : (
            <div className="flex items-center justify-center h-[420px] text-white">
              Video not available
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default ContentPreviewModal;
