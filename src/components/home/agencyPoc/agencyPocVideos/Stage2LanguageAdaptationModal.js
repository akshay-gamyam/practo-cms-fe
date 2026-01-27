import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiX,
  FiImage,
  FiAlertCircle,
  FiSave,
} from "react-icons/fi";
import { BsUpload } from "react-icons/bs";
import {
  createStage2Video,
} from "../../../../redux/action/agencyPocAction/AgencyPocAction";

const Stage2LanguageAdaptationModal = ({
  open,
  onClose,
  masterVideo,
  onSuccess,
}) => {
  const dispatch = useDispatch();

  const {
    isUploadVideoLoading,
    isGetVideoUploadUrlLoading,
    isGetThumbnailUploadUrlLoading,
  } = useSelector((state) => state.agencyPoc);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const [formData, setFormData] = useState({
    language: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    thumbnail: 0,
    status: "",
  });
  const [error, setError] = useState(null);

  const uploading =
    isUploadVideoLoading ||
    isGetVideoUploadUrlLoading ||
    isGetThumbnailUploadUrlLoading;

  useEffect(() => {
    if (!open) {
      return;
    }

    // Reset form when modal opens
    setFormData({
      language: "",
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview(null);
    setThumbnailPreview(null);
    setError(null);
    setUploadProgress({ video: 0, thumbnail: 0, status: "" });
  }, [open]);

  const openFilePicker = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const openThumbnailPicker = () => {
    if (!uploading) {
      thumbnailInputRef.current?.click();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSaveAsDraft = async () => {
    // Validation
    if (!videoFile) {
      setError("Please select a video file");
      return;
    }
    if (!formData.language) {
      setError("Please select a language");
      return;
    }

    setError(null);
    try {
      const result = await dispatch(
        createStage2Video(
          masterVideo.id,
          {
            videoFile,
            thumbnailFile,
            language: formData.language,
          },
          (progress) => {
            setUploadProgress(progress);
          }
        )
      );

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.data);
        }
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Create Stage 2 video error:", err);
      setError(err.message || "Failed to create language adaptation. Please try again.");
    }
  };

  const handleClose = () => {
    if (uploading) return;

    try {
      if (videoPreview && videoFile && videoFile instanceof File) {
        URL.revokeObjectURL(videoPreview);
      }
      if (thumbnailPreview && thumbnailFile && thumbnailFile instanceof File) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    } catch (err) {
      console.error("Error revoking URLs:", err);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }

    setFormData({
      language: "",
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview(null);
    setThumbnailPreview(null);
    setUploadProgress({ video: 0, thumbnail: 0, status: "" });
    setError(null);

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Language Adaptation
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {masterVideo?.title || "Create Stage 2 video from published Stage 1 video"}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Master Video Info (Read-only) */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Master Video Information (Read-only)</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Title:</span>
                <span className="ml-2 font-medium text-gray-900">{masterVideo?.title || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Doctor:</span>
                <span className="ml-2 font-medium text-gray-900">{masterVideo?.doctorName || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Specialty:</span>
                <span className="ml-2 font-medium text-gray-900">{masterVideo?.specialty || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Master Language:</span>
                <span className="ml-2 font-medium text-gray-900">{masterVideo?.language || "N/A"}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <FiAlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                <p className="text-sm font-medium text-blue-900">
                  {uploadProgress.status || "Processing..."}
                </p>
              </div>

              {uploadProgress.video > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-blue-700">
                    <span>Video Upload</span>
                    <span>{uploadProgress.video}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.video}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadProgress.thumbnail > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-blue-700">
                    <span>Thumbnail Upload</span>
                    <span>{uploadProgress.thumbnail}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.thumbnail}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              disabled={uploading}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Kannada">Kannada</option>
              <option value="Malayalam">Malayalam</option>
            </select>
          </div>

          {/* Video File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Video File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {videoPreview ? (
                <div className="space-y-3">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-64 rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        videoFile &&
                        videoPreview &&
                        videoFile instanceof File
                      ) {
                        URL.revokeObjectURL(videoPreview);
                      }
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    disabled={uploading}
                    className="text-sm hover:shadow-lg text-black bg-red-100 hover:text-red-800 disabled:opacity-50 border hover:border-red-800 border-red-300 p-2 rounded-xl"
                  >
                    Remove Video
                  </button>
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center gap-4 text-center ${
                    uploading ? "opacity-70 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-400">
                    {uploading ? (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <BsUpload size={32} className="text-white" />
                    )}
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {uploading
                        ? "Uploading video…"
                        : "Drop your video file here"}
                    </p>
                    {!uploading && (
                      <p className="text-sm text-gray-500 mt-1">
                        or click to browse
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={uploading}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select File
                  </button>

                  <p className="text-sm text-gray-500">
                    Supported: MP4, MOV (Max 200MB)
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={handleVideoSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {thumbnailPreview ? (
                <div className="space-y-3">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full max-h-48 object-contain rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        thumbnailFile &&
                        thumbnailPreview &&
                        thumbnailFile instanceof File
                      ) {
                        URL.revokeObjectURL(thumbnailPreview);
                      }
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                    disabled={uploading}
                    className="text-sm hover:shadow-lg text-black bg-red-100 hover:text-red-800 disabled:opacity-50 border hover:border-red-800 border-red-300 p-2 rounded-xl"
                  >
                    Remove Thumbnail
                  </button>
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center gap-3 text-center rounded-2xl border-gray-300 px-6 py-8 transition hover:border-blue-500 ${
                    uploading ? "opacity-70 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-400">
                    {uploading ? (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    ) : (
                      <FiImage size={28} className="text-white" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload thumbnail
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      or drag and drop
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openThumbnailPicker}
                    disabled={uploading}
                    className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select Image
                  </button>

                  <p className="text-xs text-gray-500">JPG, PNG (Max 5MB)</p>

                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleThumbnailSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={
                uploading || !videoFile || !formData.language
              }
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Save as Draft
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stage2LanguageAdaptationModal;