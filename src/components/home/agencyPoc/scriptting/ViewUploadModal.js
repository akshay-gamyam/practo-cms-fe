import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUpload,
  FiX,
  FiImage,
  FiAlertCircle,
  FiSend,
  FiSave,
} from "react-icons/fi";
import { BsUpload } from "react-icons/bs";
import {
  uploadVideoComplete,
  submitVideo,
} from "../../../../redux/action/agencyPocAction/AgencyPocAction";
import {
  fetchAssigneeList,
  fetchContentLibrarySpecialityList,
} from "../../../../redux/action/contentLibraryAction/ContentLibraryAction";

const VideoUploadModal = ({
  open,
  onClose,
  script,
  existingVideoData,
  onUploadSuccess,
  isNewUpload,
}) => {
  const dispatch = useDispatch();

  const {
    isUploadVideoLoading,
    isGetVideoUploadUrlLoading,
    isGetThumbnailUploadUrlLoading,
  } = useSelector((state) => state.agencyPoc);

  const { contentLibrarySpeciality, assigneeReviewer } = useSelector(
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
    // city: "",
    ctaType: "CONSULT",
    duration: 0,
    assignedReviewerId: "",
    tags: "",
  });

  console.log("formData", formData)

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
  const isEditMode = !!existingVideoData;

  // Determine if any upload operation is in progress
  const uploading =
    isUploadVideoLoading ||
    isGetVideoUploadUrlLoading ||
    isGetThumbnailUploadUrlLoading;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isNewUpload || !existingVideoData || !existingVideoData.id) {
      setFormData({
        title: "",
        description: "",
        doctorName: "",
        specialty: "",
        language: "English",
        // city: "",
        ctaType: "CONSULT",
        duration: 0,
        assignedReviewerId: "",
        tags: "",
      });
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(null);
      setThumbnailPreview(null);
      setError(null);
      return;
    }

    try {
      setFormData({
        title: existingVideoData.title || "",
        description: existingVideoData.description || "",
        doctorName: existingVideoData.doctorName || "",
        specialty: existingVideoData.specialty || "",
        language: existingVideoData.language || "English",
        // city: existingVideoData.city || "",
        ctaType: existingVideoData.ctaType || "CONSULT",
        duration: existingVideoData.duration || 0,
        assignedReviewerId: existingVideoData.assignedReviewerId || "",
        tags: existingVideoData.tags || "",
      });

      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(existingVideoData.videoUrl || null);
      setThumbnailPreview(existingVideoData.thumbnailUrl || null);
    } catch (err) {
      console.error("Error prefilling form:", err);
      setError("Failed to load video data");
    }
  }, [existingVideoData, open, isNewUpload]);

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

  const handleSubmit = async (saveAsDraft = false) => {
    // Validation
    if (!isEditMode) {
      // New upload requires both files
      if (!videoFile || !thumbnailFile) {
        setError("Please select both video and thumbnail files");
        return;
      }
    } else {
      // Edit mode: if re-uploading, need both files
      if ((videoFile && !thumbnailFile) || (!videoFile && thumbnailFile)) {
        setError(
          "Please select both video and thumbnail files when re-uploading"
        );
        return;
      }
    }
    if (!formData.title || !formData.title.trim()) {
      setError("Please enter a video title");
      return;
    }
    if (!formData.doctorName || !formData.specialty ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!saveAsDraft) {
      if (!formData.assignedReviewerId || !formData.assignedReviewerId.trim()) {
        setError("Please select a reviewer to assign before submitting");
        return;
      }
    }

    setError(null);
    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        doctorName: formData.doctorName.trim(),
        specialty: formData.specialty,
        language: formData.language,
        // city: formData.city.trim(),
        ctaType: formData.ctaType,
        duration: formData.duration,
        topicId: script.topicId,
        scriptId: script?.id,
      };

      if (formData.assignedReviewerId && formData.assignedReviewerId.trim()) {
        submitData.assignedReviewerId = formData.assignedReviewerId;
      }

      // Add tags if they exist and are not empty
      if (formData.tags && formData.tags.trim()) {
        submitData.tags = formData.tags.trim();
      }
      // If editing, include video ID
      if (isEditMode && existingVideoData?.id) {
        submitData.videoId = existingVideoData.id;
      }
      const hasFileChanges = !!(videoFile || thumbnailFile);
      const videoId = isEditMode ? existingVideoData?.id : null;
      if (saveAsDraft) {
        const result = await dispatch(
          uploadVideoComplete(
            videoFile,
            thumbnailFile,
            submitData,
            (progress) => {
              setUploadProgress(progress);
            }
          )
        );
        if (result.success) {
          if (onUploadSuccess) {
            onUploadSuccess(result.data);
          }
          setTimeout(() => {
            handleClose();
          }, 1500);
        } else {
          setError(result.error);
        }
        return;
      }
      if (isEditMode && hasFileChanges) {
        const updateResult = await dispatch(
          uploadVideoComplete(
            videoFile,
            thumbnailFile,
            submitData,
            (progress) => {
              setUploadProgress(progress);
            }
          )
        );
        if (!updateResult.success) {
          setError(updateResult.error);
          return;
        }
        // Step 2: Get the updated video ID
        const updatedVideoId = updateResult.data?.video?.id || videoId;
        if (!updatedVideoId) {
          setError("Failed to get video ID after update");
          return;
        }
        // Step 3: Submit for review
        const submitResult = await dispatch(submitVideo(updatedVideoId));
        if (submitResult.success) {
          if (onUploadSuccess) {
            onUploadSuccess(submitResult.data);
          }
          setTimeout(() => {
            handleClose();
          }, 1500);
        } else {
          setError(submitResult.error);
        }
      } else if (isEditMode && !hasFileChanges) {
        if (!videoId) {
          setError("Video ID is required to submit");
          return;
        }
        const updateResult = await dispatch(
          uploadVideoComplete(null, null, submitData, (progress) => {
            setUploadProgress(progress);
          })
        );
        if (!updateResult.success) {
          setError(updateResult.error);
          return;
        }
        const submitResult = await dispatch(submitVideo(videoId));
        if (submitResult.success) {
          if (onUploadSuccess) {
            onUploadSuccess(submitResult.data);
          }
          setTimeout(() => {
            handleClose();
          }, 1500);
        } else {
          setError(submitResult.error);
        }
      } else {
        const createResult = await dispatch(
          uploadVideoComplete(
            videoFile,
            thumbnailFile,
            submitData,
            (progress) => {
              setUploadProgress(progress);
            }
          )
        );
        if (!createResult.success) {
          setError(createResult.error);
          return;
        }
        const newVideoId = createResult.data?.video?.id;
        if (!newVideoId) {
          setError("Failed to get video ID after creation");
          return;
        }
        const submitResult = await dispatch(submitVideo(newVideoId));
        if (submitResult.success) {
          if (onUploadSuccess) {
            onUploadSuccess(submitResult.data);
          }
          setTimeout(() => {
            handleClose();
          }, 1500);
        } else {
          setError(submitResult.error);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload video. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(fetchAssigneeList());
  }, [dispatch]);

  const specialtyOptions = Array.isArray(contentLibrarySpeciality?.specialties)
    ? contentLibrarySpeciality.specialties
    : [];

  useEffect(() => {
    dispatch(fetchContentLibrarySpecialityList());
  }, [dispatch]);

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
      title: "",
      description: "",
      doctorName: "",
      specialty: "",
      language: "English",
      // city: "",
      ctaType: "CONSULT",
      duration: 0,
      assignedReviewerId: "",
      tags: "",
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

  const showBothButtons =
    script.status === "LOCKED" && !script.videoUploaded && !isEditMode;
  const showSubmitOnly =
    script.status === "LOCKED" && (script.videoUploaded || isEditMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {/* Upload Video */}
              {isEditMode ? "Submit Video for Review" : "Upload Video"}
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

        <div className="p-6 space-y-6">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Video File{" "}
              {!isEditMode && <span className="text-red-500">*</span>}
              {isEditMode && (
                <span className="text-sm text-gray-500 ml-2">
                  (Optional - upload to replace)
                </span>
              )}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {videoPreview ? (
                <div className="space-y-3">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-64 rounded-lg mx-auto"
                  />
                  {!isEditMode && (
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
                        setVideoPreview(
                          isEditMode && existingVideoData?.videoUrl
                            ? existingVideoData.videoUrl
                            : null
                        );
                      }}
                      disabled={uploading}
                      className="text-sm hover:shadow-lg text-black bg-red-100 hover:text-red-800 disabled:opacity-50 border hover:border-red-800 border-red-300 p-2 rounded-xl"
                    >
                      {isEditMode ? "Cancel Replace" : "Remove Video"}
                    </button>
                  )}
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail <span className="text-red-500">*</span>
              {isEditMode && (
                <span className="text-sm text-gray-500 ml-2">
                  (Optional - upload to replace)
                </span>
              )}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
              {thumbnailPreview ? (
                <div className="space-y-3">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full max-h-48 object-contain rounded-lg mx-auto"
                  />
                  {!isEditMode && (
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
                        // setThumbnailPreview(null);
                        setThumbnailPreview(
                          isEditMode && existingVideoData?.thumbnailUrl
                            ? existingVideoData.thumbnailUrl
                            : null
                        );
                      }}
                      disabled={uploading}
                      className="text-sm hover:shadow-lg text-black bg-red-100 hover:text-red-800 disabled:opacity-50 border hover:border-red-800 border-red-300 p-2 rounded-xl"
                    >
                      {isEditMode ? "Cancel Replace" : "Remove Thumbnail"}
                    </button>
                  )}
                </div>
              ) : (
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

            {/* <div className="space-y-2">
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
            </div> */}

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
                <option value="CONSULT">Book Consult</option>
                <option value="QUIZ">Quiz</option>
                <option value="VAULT">Health Vault</option>
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

            {showSubmitOnly && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Assign To: <span className="text-red-500">*</span>
                </label>
                <select
                  name="assignTo"
                  value={formData.assignedReviewerId}
                  onChange={(e) => handleInputChange(e.target)}
                  disabled={uploading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select Assignee</option>
                  {assigneeReviewer.map((option) => (
                    <option key={option?.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                name="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange(e.target)}
                disabled={uploading}
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
            {showBothButtons && (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={
                    uploading || !videoFile || !thumbnailFile || !formData.title
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

                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  // disabled={
                  //   uploading || !videoFile || !thumbnailFile || !formData.title
                  // }
                  disabled={
                    uploading ||
                    !videoFile ||
                    !thumbnailFile ||
                    !formData.title.trim() ||
                    !formData.doctorName.trim() ||
                    !formData.specialty ||
                    // !formData.city.trim() ||
                    !formData.assignedReviewerId.trim() 
                  }
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 transition-all hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Submit for Review
                    </>
                  )}
                </button>
              </>
            )}

            {showSubmitOnly && (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                // disabled={uploading || !formData.title}

                disabled={
                  uploading ||
                  !videoFile ||
                  !thumbnailFile ||
                  !formData.title.trim() ||
                  !formData.doctorName.trim() ||
                  !formData.specialty ||
                  // !formData.city.trim() ||
                  !formData.assignedReviewerId.trim()
                }
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 transition-all hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    Submit for Review
                  </>
                )}
              </button>
            )}

            {!showBothButtons && !showSubmitOnly && (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={
                  uploading || !videoFile || !thumbnailFile || !formData.title
                }
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;
