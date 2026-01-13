import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload, FiX, FiImage, FiAlertCircle } from "react-icons/fi";
import { BsUpload } from "react-icons/bs";
import { uploadVideoComplete } from "../../../../redux/action/agencyPocAction/AgencyPocAction";
import { fetchContentLibrarySpecialityList } from "../../../../redux/action/contentLibraryAction/ContentLibraryAction";

const VideoUploadModal = ({ open, onClose, script, onUploadSuccess }) => {
  const dispatch = useDispatch();

  const {
    isUploadVideoLoading,
    isGetVideoUploadUrlLoading,
    isGetThumbnailUploadUrlLoading,
  } = useSelector((state) => state.agencyPoc);

  const { contentLibrarySpeciality } = useSelector(
    (state) => state.content_library
  );

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    doctorName: "",
    specialty: "",
    language: "English",
    city: "",
    ctaType: "CONSULT",
    duration: 0,
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

  // Determine if any upload operation is in progress
  const uploading =
    isUploadVideoLoading ||
    isGetVideoUploadUrlLoading ||
    isGetThumbnailUploadUrlLoading;

  const handleInputChange = (e) => {
    const { name, value } = e;
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

      // Get video duration
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        setFormData((prev) => ({
          ...prev,
          duration: Math.floor(video.duration),
        }));
      };
      video.src = URL.createObjectURL(file);
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

  const handleSubmit = async () => {
    // Validation
    if (!videoFile || !thumbnailFile) {
      setError("Please select both video and thumbnail files");
      return;
    }

    if (!formData.title) {
      setError("Please enter a video title");
      return;
    }

    setError(null);

    try {
      // Call the complete upload action
      const result = await dispatch(
        uploadVideoComplete(
          videoFile,
          thumbnailFile,
          {
            ...formData,
            topicId: script.topicId,
            scriptId: script?.id,
          },
          (progress) => {
            setUploadProgress(progress);
          }
        )
      );

      if (result.success) {
        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }

        // Close modal after a short delay
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload video. Please try again.");
    }
  };

  const specialtyOptions = Array.isArray(contentLibrarySpeciality?.specialties)
    ? contentLibrarySpeciality.specialties
    : [];

  useEffect(() => {
    dispatch(fetchContentLibrarySpecialityList());
  }, [dispatch]);

  const handleClose = () => {
    if (uploading) return;

    // Clean up
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);

    // Reset state
    setFormData({
      title: "",
      description: "",
      doctorName: "",
      specialty: "",
      language: "English",
      city: "",
      ctaType: "CONSULT",
      duration: 0,
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
              Upload Video
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {script?.topic?.title ||
                script?.title ||
                "Upload video for this script"}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <FiAlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
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

          {/* Video Upload */}
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
                // <label className="cursor-pointer">
                //   <FiVideo className="mx-auto text-gray-400 mb-2" size={48} />
                //   <p className="text-sm text-gray-600 mb-1">
                //     Click to upload video or drag and drop
                //   </p>
                //   <p className="text-xs text-gray-500">MP4, WebM (max 500MB)</p>
                //   <input
                //     type="file"
                //     accept="video/*"
                //     onChange={handleVideoSelect}
                //     disabled={uploading}
                //     className="hidden"
                //   />
                // </label>

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
                    className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed "
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
              Thumbnail <span className="text-red-500">*</span>
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
                // <label className="cursor-pointer">
                //   <FiImage className="mx-auto text-gray-400 mb-2" size={48} />
                //   <p className="text-sm text-gray-600 mb-1">
                //     Click to upload thumbnail or drag and drop
                //   </p>
                //   <p className="text-xs text-gray-500">JPG, PNG (max 5MB)</p>
                //   <input
                //     type="file"
                //     accept="image/*"
                //     onChange={handleThumbnailSelect}
                //     disabled={uploading}
                //     className="hidden"
                //   />
                // </label>
                <div
                  className={` flex flex-col items-center justify-center gap-3 text-center rounded-2xl  border-gray-300 px-6 py-8 transition hover:border-blue-500 ${
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
                    className=" mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Doctor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
                placeholder="Dr. John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Specialty <span className="text-red-500">*</span>
              </label>
              {/* <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
                placeholder="Cardiology"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              /> */}

              <select
                name="specialty"
                value={formData.specialty}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Specialty</option>

                {specialtyOptions.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* <CustomSelect
                options={specialtyOptions}
                value={formData.specialty}
                onChange={handleSpecialtyChange}
                placeholder="All Specialties"
                renderValue={(option) => (
                  <span className="text-gray-700 text-sm sm:text-base">
                    {option?.label || "All Specialties"}
                  </span>
                )}
              /> */}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
                placeholder="Chennai"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                CTA Type <span className="text-red-500">*</span>
              </label>
              <select
                name="ctaType"
                value={formData.ctaType}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="BOOK_CONSULT">Book Consult</option>
                <option value="QUIZ">Quiz</option>
                <option value="HEALTH_VAULT">Health Vault</option>
                <option value="LEARN_MORE">Learn More</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Duration (seconds)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange(e.target)}
                disabled
                placeholder="240"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
                placeholder="Enter video title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
                placeholder="Enter video description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                // name="title"
                // value={formData.title}
                // onChange={(e) => handleInputChange(e.target)}
                // disabled={uploading}
                placeholder="diabetes, heath wellness"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
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
              onClick={handleSubmit}
              disabled={uploading || !videoFile || !thumbnailFile}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 transition-all hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload size={16} />
                  Upload Video
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;
