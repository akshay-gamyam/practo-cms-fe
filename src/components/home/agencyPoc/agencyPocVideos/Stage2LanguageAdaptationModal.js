import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiImage, FiAlertCircle, FiSave, FiSend } from "react-icons/fi";
import { BsUpload } from "react-icons/bs";
import {
  createStage2Video,
  fetchAllVideos,
  submitVideo,
  fetchAssigneeList,
} from "../../../../redux/action/agencyPocAction/AgencyPocAction";
import CustomModal from "../../../common/Modal/CustomModal";
import { fetchContentLibrarySpecialityList } from "../../../../redux/action/contentLibraryAction/ContentLibraryAction";

const Stage2LanguageAdaptationModal = ({
  open,
  onClose,
  masterVideo,
  onSuccess,
  activeStage,
  isResubmit = false,
}) => {
  const dispatch = useDispatch();

  const fieldEditable =
    activeStage === "stage1" &&
    masterVideo?.latestRejection !== null &&
    masterVideo?.stage === "INITIAL_UPLOAD" &&
    masterVideo?.status === "DRAFT";

  const {
    isUploadVideoLoading,
    isGetVideoUploadUrlLoading,
    isGetThumbnailUploadUrlLoading,
    isSubmitVideoLoading,
    assigneeList,
  } = useSelector((state) => state.agencyPoc);
  const { contentLibrarySpeciality } = useSelector(
    (state) => state.content_library,
  );
  const assigneeOptions = Array.isArray(assigneeList?.assigneeReviewer)
    ? assigneeList.assigneeReviewer
    : [];

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // const [formData, setFormData] = useState({
  //   language: "",
  // });

  const [formData, setFormData] = useState({
    language: "",
    title: "",
    ctaType: "",
    doctorName: "",
    specialty: "",
    description: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [createdVideoId, setCreatedVideoId] = useState(null);

  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    thumbnail: 0,
    status: "",
  });
  const [error, setError] = useState(null);

  const specialtyOptions = Array.isArray(contentLibrarySpeciality?.specialties)
    ? contentLibrarySpeciality.specialties
    : [];

  useEffect(() => {
    if (fieldEditable) {
      dispatch(fetchContentLibrarySpecialityList());
    }
  }, [dispatch, fieldEditable]);

  const uploading =
    isUploadVideoLoading ||
    isGetVideoUploadUrlLoading ||
    isGetThumbnailUploadUrlLoading;

  useEffect(() => {
    if (!open) {
      return;
    }

    // setFormData({
    //   language: isResubmit ? masterVideo?.language || "" : "",
    // });

    setFormData({
      language: isResubmit ? masterVideo?.language || "" : "",
      title: masterVideo?.title || "",
      ctaType: masterVideo?.ctaType || "",
      doctorName: masterVideo?.doctorName || "",
      specialty: masterVideo?.specialty || "",
      description: masterVideo?.description || "",
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview(masterVideo?.videoUrl || null);
    setThumbnailPreview(masterVideo?.thumbnailUrl || null);
    setSelectedAssignee("");
    setCreatedVideoId(null);

    setError(null);
    setUploadProgress({ video: 0, thumbnail: 0, status: "" });
  }, [open, masterVideo, isResubmit]);

  useEffect(() => {
    if (open && masterVideo?.id) {
      dispatch(fetchAssigneeList(masterVideo.id));
    }
  }, [open, masterVideo?.id, dispatch]);

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
            // videoFile: videoFile || null,
            // thumbnailFile: thumbnailFile || null,
            videoFile: videoFile,
            videoUrl: videoFile ? null : masterVideo?.videoUrl,
            thumbnailFile: thumbnailFile,
            thumbnailUrl: thumbnailFile ? null : masterVideo?.thumbnailUrl,
            language: formData.language,
          },
          (progress) => {
            setUploadProgress(progress);
          },
        ),
      );

      if (result.success) {
        if (result.data?.id) {
          setCreatedVideoId(result.data.id);
        }
        if (onSuccess) {
          onSuccess(result.data);
        }
        setTimeout(() => {
          handleClose();
          dispatch(
            fetchAllVideos({
              stage:
                activeStage === "stage2"
                  ? "LANGUAGE_ADAPTATION"
                  : "INITIAL_UPLOAD",
            }),
          );
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Create Stage 2 video error:", err);
      setError(
        err.message ||
          "Failed to create language adaptation. Please try again.",
      );
    }
  };

  const handleSubmitForReview = async () => {
    const language = isResubmit ? masterVideo?.language : formData.language;

    if (!language) {
      setError("Please select a language");
      return;
    }

    if (fieldEditable) {
      if (!formData.title || !formData.title.trim()) {
        setError("Please enter a video title");
        return;
      }
      if (!formData.doctorName || !formData.specialty) {
        setError("Please fill in all required fields");
        return;
      }
    }

    if (!selectedAssignee) {
      setError("Please select an assignee before submitting");
      return;
    }

    setError(null);
    try {
      let videoId = createdVideoId;

      if (isResubmit && masterVideo?.id) {
        videoId = masterVideo.id;

        if (videoFile || thumbnailFile) {
          const updateData = {
            videoId: videoId,
            language: language,
          };

          if (videoFile) {
            updateData.videoFile = videoFile;
            updateData.videoUrl = null;
          } else {
            updateData.videoUrl = masterVideo?.videoUrl;
          }

          if (thumbnailFile) {
            updateData.thumbnailFile = thumbnailFile;
            updateData.thumbnailUrl = null;
          } else {
            updateData.thumbnailUrl = masterVideo?.thumbnailUrl;
          }

          if (fieldEditable) {
            updateData.title = formData.title.trim();
            updateData.ctaType = formData.ctaType;
            updateData.doctorName = formData.doctorName.trim();
            updateData.specialty = formData.specialty;
            updateData.description = formData.description.trim();
          }

          const updateResult = await dispatch(
            createStage2Video(masterVideo.id, updateData, (progress) => {
              setUploadProgress(progress);
            }),
          );

          if (!updateResult.success) {
            setError(updateResult.error);
            return;
          }

          videoId = updateResult.data?.video?.id || videoId;
        }
      } else if (!videoId) {
        const videoData = {
          videoFile: videoFile,
          videoUrl: videoFile ? null : masterVideo?.videoUrl,
          thumbnailFile: thumbnailFile,
          thumbnailUrl: thumbnailFile ? null : masterVideo?.thumbnailUrl,
          language: language,
        };

        // Add editable fields for stage1 when fieldEditable is true
        if (fieldEditable) {
          videoData.title = formData.title.trim();
          videoData.ctaType = formData.ctaType;
          videoData.doctorName = formData.doctorName.trim();
          videoData.specialty = formData.specialty;
          videoData.description = formData.description.trim();
        }

        const result = await dispatch(
          createStage2Video(masterVideo.id, videoData, (progress) => {
            setUploadProgress(progress);
          }),
        );

        if (!result.success) {
          setError(result.error);
          return;
        }

        videoId = result.data?.video?.id;
        setCreatedVideoId(videoId);
      }

      const submitResult = await dispatch(
        submitVideo(videoId, selectedAssignee),
      );

      if (submitResult?.success) {
        if (onSuccess) {
          onSuccess(submitResult.data);
        }
        setTimeout(() => {
          handleClose();
          dispatch(
            fetchAllVideos({
              stage:
                activeStage === "stage2"
                  ? "LANGUAGE_ADAPTATION"
                  : "INITIAL_UPLOAD",
            }),
          );
        }, 1500);
      } else {
        setError(submitResult?.error || "Failed to submit video for review");
      }
    } catch (err) {
      console.error("Submit video error:", err);
      setError(err.message || "Failed to submit video. Please try again.");
    }
  };

  const handleClose = () => {
    // if (uploading) return;
    if (uploading || isSubmitVideoLoading) return;

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
      title: "",
      ctaType: "",
      doctorName: "",
      specialty: "",
      description: "",
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview(null);
    setThumbnailPreview(null);
    setSelectedAssignee("");
    setCreatedVideoId(null);
    setUploadProgress({ video: 0, thumbnail: 0, status: "" });
    setError(null);

    onClose();
  };

  const shouldShowComponent =
    activeStage === "stage2"
      ? masterVideo?.stage === "LANGUAGE_ADAPTATION" &&
        masterVideo?.status === "DRAFT"
      : null;

  return (
    <CustomModal
      isOpen={open}
      onClose={handleClose}
      title="Create Language Adaptation"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <FiAlertCircle
              className="text-red-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* {uploading && ( */}
        {(uploading || isSubmitVideoLoading) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              <p className="text-sm font-medium text-blue-900">
                {/* {uploadProgress.status || "Processing..."} */}
                {isSubmitVideoLoading
                  ? "Submitting for review..."
                  : uploadProgress.status || "Processing..."}
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
            {masterVideo && (
              <span className="text-sm text-gray-500 ml-2">
                (Optional - upload to replace)
              </span>
            )}
            {!masterVideo && <span className="text-red-500">*</span>}
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
                  // disabled={uploading}
                  disabled={uploading || isSubmitVideoLoading}
                  className="text-sm hover:shadow-lg text-black bg-red-100 hover:text-red-800 disabled:opacity-50 border hover:border-red-800 border-red-300 p-2 rounded-xl"
                >
                  Remove Video
                </button>
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center gap-4 text-center ${
                  uploading || isSubmitVideoLoading
                    ? "opacity-70 pointer-events-none"
                    : ""
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-400">
                  {uploading || isSubmitVideoLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <BsUpload size={32} className="text-white" />
                  )}
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {uploading || isSubmitVideoLoading
                      ? "Uploading video…"
                      : "Drop your video file here"}
                  </p>
                  {!uploading && !isSubmitVideoLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      or click to browse
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={uploading || isSubmitVideoLoading}
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
                  disabled={uploading || isSubmitVideoLoading}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail <span className="text-gray-500 text-xs">(Optional)</span>
            {masterVideo && (
              <span className="text-sm text-gray-500 ml-2">
                (Optional - upload to replace)
              </span>
            )}
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
                className={`flex flex-col items-center justify-center gap-3 text-center rounded-2xl border-gray-300 px-6 py-4 transition hover:border-blue-500 ${
                  uploading || isSubmitVideoLoading
                    ? "opacity-70 pointer-events-none"
                    : ""
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-400">
                  {uploading || isSubmitVideoLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  ) : (
                    <FiImage size={28} className="text-white" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                </div>

                <button
                  type="button"
                  onClick={openThumbnailPicker}
                  disabled={uploading || isSubmitVideoLoading}
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
                  disabled={uploading || isSubmitVideoLoading}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">

              <label className="block text-sm font-medium text-gray-700">
                Title {fieldEditable && <span className="text-red-500">*</span>}
              </label>
              {fieldEditable ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={uploading || isSubmitVideoLoading}
                  placeholder="Enter video title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              ) : (
                <input
                  type="text"
                  value={masterVideo?.title || "N/A"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                CTA Type{" "}
                {fieldEditable && <span className="text-red-500">*</span>}
              </label>
              {fieldEditable ? (
                <select
                  name="ctaType"
                  value={formData.ctaType}
                  onChange={handleInputChange}
                  disabled={uploading || isSubmitVideoLoading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select CTA Type</option>
                  <option value="CONSULT">Book Consult</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="VAULT">Health Vault</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={masterVideo?.ctaType || "N/A"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              )}
            </div>

            <div className="space-y-2">

              <label className="block text-sm font-medium text-gray-700">
                Doctor Name{" "}
                {fieldEditable && <span className="text-red-500">*</span>}
              </label>
              {fieldEditable ? (
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  disabled={uploading || isSubmitVideoLoading}
                  placeholder="Dr. John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              ) : (
                <input
                  type="text"
                  value={masterVideo?.doctorName || "N/A"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Specialty{" "}
                {fieldEditable && <span className="text-red-500">*</span>}
              </label>
              {fieldEditable ? (
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  disabled={uploading || isSubmitVideoLoading}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select Specialty</option>
                  {specialtyOptions.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={masterVideo?.specialty || "N/A"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              )}
            </div>

            {masterVideo?.latestRejection === null && masterVideo?.status === "PUBLISHED" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Master Language
                  </label>
                  <input
                    type="text"
                    value={masterVideo?.language || "N/A"}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>
              )}

            {activeStage === "stage1" && (
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
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description{" "}
            {fieldEditable && <span className="text-red-500">*</span>}
          </label>
          {fieldEditable ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={uploading || isSubmitVideoLoading}
              placeholder="Enter video description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          ) : (
            <textarea
              type="text"
              value={masterVideo?.description || "N/A"}
              disabled
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          )}
        </div>

        {(shouldShowComponent || fieldEditable) && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Assign Reviewer{" "}
              {isResubmit ? (
                <span className="text-red-500">*</span>
              ) : (
                <span className="text-gray-500 text-xs">
                  (Optional - for direct submission)
                </span>
              )}
            </label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              disabled={uploading || isSubmitVideoLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Assignee</option>
              {assigneeOptions.map((reviewer) => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.label}
                </option>
              ))}
            </select>
            {selectedAssignee && (
              <p className="text-xs text-blue-600">
                Video will be submitted directly for review to the selected
                assignee
              </p>
            )}
            {isResubmit && !selectedAssignee && (
              <p className="text-xs text-red-600">
                Please select a reviewer to resubmit the video
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading || isSubmitVideoLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {!isResubmit && (
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={uploading || !formData.language || isSubmitVideoLoading}
              className="flex items-center text-white gap-2 bg-teal-500 px-6 py-2 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Save as Draft
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmitForReview}
            disabled={
              uploading ||
              isSubmitVideoLoading ||
              (!isResubmit && !formData.language) ||
              (isResubmit && !masterVideo?.language) ||
              (activeStage === "stage2" ? !selectedAssignee : null)
            }
            className={`${isResubmit ? "flex items-center text-white gap-2 bg-gradient-to-r from-blue-600 to-teal-400 px-6 py-2 text-sm font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed" : null}`}
          >
            {isSubmitVideoLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                {isResubmit ? <FiSend size={16} /> : null}
                {isResubmit ? "Submit" : null}
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default Stage2LanguageAdaptationModal;
