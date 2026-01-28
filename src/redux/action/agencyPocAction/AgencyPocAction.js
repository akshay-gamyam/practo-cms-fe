import {
  AGENCY_POC_MY_ASSESSMENT,
  AGENCY_POC_SCRIPTS,
  AGENCY_POC_VIDEOS,
  CREATE_STAGE2_VIDEO,
  GET_ALL_UPLOADED_VIDEOS_ID,
  GET_ASSIGNEE_LIST,
  GET_SELECTED_VIDEO_DATA_BY_ID,
  GET_TOPICS_LIST,
  SUBMIT_AGENCY_VIDEO,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import { LIMIT } from "../../../utils/constants";
import {
  fetchAgencyPocStart,
  fetchAgencyPocSuccess,
  fetchAgencyPocFailure,
  fetchViewAgencyPocStart,
  fetchViewAgencyPocSuccess,
  fetchViewAgencyPocFailure,
  fetchScriptStart,
  fetchScriptSuccess,
  fetchScriptFailure,
  createScriptStart,
  createScriptSuccess,
  createScriptFailure,
  updateScriptStart,
  updateScriptSuccess,
  updateScriptFailure,
  submitScriptStart,
  submitScriptSuccess,
  submitScriptFailure,
  fetchScriptsStart,
  fetchScriptsSuccess,
  fetchScriptsFailure,
  // deleteScriptStart,
  // deleteScriptSuccess,
  // deleteScriptFailure,
  submitVideoStart,
  submitVideoSuccess,
  submitVideoFailure,
  fetchVideosStart,
  fetchVideosSuccess,
  fetchVideosFailure,
  fetchVideoStart,
  fetchVideoSuccess,
  fetchVideoFailure,
  uploadVideoStart,
  uploadVideoSuccess,
  uploadVideoFailure,
  getVideoUploadUrlStart,
  getVideoUploadUrlSuccess,
  getVideoUploadUrlFailure,
  getThumbnailUploadUrlStart,
  getThumbnailUploadUrlSuccess,
  getThumbnailUploadUrlFailure,
  fetchallVideosIdStart,
  fetchallVideosIdSuccess,
  fetchallVideosIdFailure,
  fetchVideoSelectedIdDataStart,
  fetchVideoSelectedIdDataSuccess,
  fetchVideoSelectedIdDataFailure,
  fetchAssigneeListStart,
  fetchAssigneeListSuccess,
  fetchAssigneeListFailure,
} from "../../reducer/agencyPocReducer/AgencyPocReducer";

let isFetchingAgencyPoc = false;
let isViewFetchingAgencyPocInDetailed = false;
let isFetchingScript = false;
let isFetchAssigneeList = false;
let isFetchingAllScripts = false;
let isFetchingAllVideos = false;
let isSubmittingVideo = false;
let isFetchingAllVideosID = false;

// ................ Get agency POC list ....................

export const fetchAgencyPocList =
  (page = 1, limit = LIMIT) =>
  async (dispatch) => {
    if (isFetchingAgencyPoc) return;
    isFetchingAgencyPoc = true;
    dispatch(fetchAgencyPocStart());

    try {
      const { data } = await api.get(AGENCY_POC_MY_ASSESSMENT, {
        params: { page, limit },
      });

      dispatch(
        fetchAgencyPocSuccess({
          agencyPoc: data.topics,
          page: data.page,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        }),
      );

      return data;
    } catch (error) {
      dispatch(
        fetchAgencyPocFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch agency POCs",
        ),
      );
      throw error;
    } finally {
      isFetchingAgencyPoc = false;
    }
  };

// .................... fetch single agency topic in detailed ...............

export const fetchDetailedAgencyPocById = (topicId) => async (dispatch) => {
  if (isViewFetchingAgencyPocInDetailed) return;
  isViewFetchingAgencyPocInDetailed = true;
  dispatch(fetchViewAgencyPocStart());

  try {
    const response = await api.get(`${GET_TOPICS_LIST}/${topicId}`);
    console.log("response", response);
    const { topic } = response.data;

    console.log("topic", topic);
    dispatch(fetchViewAgencyPocSuccess({ topic }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user details";
    dispatch(fetchViewAgencyPocFailure(errorMessage));
    throw error;
  } finally {
    isViewFetchingAgencyPocInDetailed = false;
  }
};

// .................... fetch script by ID (View Script) ...............

export const fetchScriptById = (scriptId) => async (dispatch) => {
  if (isFetchingScript) return;
  isFetchingScript = true;
  dispatch(fetchScriptStart());

  try {
    const response = await api.get(`${AGENCY_POC_SCRIPTS}/${scriptId}`);
    const { script } = response.data;

    dispatch(fetchScriptSuccess({ script }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch script";
    dispatch(fetchScriptFailure(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    isFetchingScript = false;
  }
};

// .................... create new script (Write Script - Save as Draft) ...............

export const createScript = (topicId, content) => async (dispatch) => {
  dispatch(createScriptStart());

  try {
    const response = await api.post(AGENCY_POC_SCRIPTS, {
      topicId,
      content,
    });

    const { script } = response.data;

    dispatch(createScriptSuccess({ script, topicId }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create script";
    dispatch(createScriptFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// .................... update script (Continue Draft / Fix Script) ...............

export const updateScript = (scriptId, content) => async (dispatch) => {
  dispatch(updateScriptStart());

  try {
    const response = await api.patch(`${AGENCY_POC_SCRIPTS}/${scriptId}`, {
      content,
    });

    const { script } = response.data;

    dispatch(updateScriptSuccess({ script }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update script";
    dispatch(updateScriptFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// .................... submit script for review ...............

export const submitScriptForReview = (scriptId) => async (dispatch) => {
  dispatch(submitScriptStart());

  try {
    const response = await api.post(`${AGENCY_POC_SCRIPTS}/${scriptId}/submit`);

    const { script } = response.data;

    dispatch(submitScriptSuccess({ script }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to submit script for review";
    dispatch(submitScriptFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// .................... fetch all scripts ...............
export const fetchAllScripts =
  ({ page, size } = {}) =>
  async (dispatch) => {
    if (isFetchingAllScripts) return;
    isFetchingAllScripts = true;
    dispatch(fetchScriptsStart());

    try {
      const response = await api.get(AGENCY_POC_SCRIPTS, {
        params: { page, size },
      });

      dispatch(
        fetchScriptsSuccess({
          scripts: response.data.scripts,
          totalPages: response.data.totalPages,
          totalCount: response.data.total,
          currentPage: response.data.page,
        }),
      );

      return { success: true };
    } catch (error) {
      dispatch(
        fetchScriptsFailure(
          error.response?.data?.message || "Failed to fetch scripts",
        ),
      );
    } finally {
      isFetchingAllScripts = false;
    }
  };

// ......................... fetch all uploaded videos by id .................

export const fetchAllVideosID = () => async (dispatch) => {
  if (isFetchingAllVideosID) return;
  isFetchingAllVideosID = true;
  dispatch(fetchallVideosIdStart());

  try {
    const response = await api.get(GET_ALL_UPLOADED_VIDEOS_ID);
    const { uploadedVideoIds } = response.data;

    dispatch(fetchallVideosIdSuccess({ uploadedVideoIds }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch scripts";
    dispatch(fetchallVideosIdFailure(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    isFetchingAllVideosID = false;
  }
};

// ..................... fetch video data by id ..................

export const fetchVideoDataByID = (videoId) => async (dispatch) => {
  if (isFetchingAllVideosID) return;
  isFetchingAllVideosID = true;
  dispatch(fetchVideoSelectedIdDataStart());

  try {
    const response = await api.get(`${GET_SELECTED_VIDEO_DATA_BY_ID(videoId)}`);
    const { video } = response.data;

    dispatch(fetchVideoSelectedIdDataSuccess({ video }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch scripts";
    dispatch(fetchVideoSelectedIdDataFailure(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    isFetchingAllVideosID = false;
  }
};

// .................... fetch all videos ...............

export const fetchAllVideos =
  (filters = {}) =>
  async (dispatch) => {
    if (isFetchingAllVideos) return;
    isFetchingAllVideos = true;
    dispatch(fetchVideosStart());

    try {
      // const response = await api.get(AGENCY_POC_VIDEOS);
      const params = {};
      if (filters.stage) params.stage = filters.stage;
      if (filters.status) params.status = filters.status;

      const response = await api.get(AGENCY_POC_VIDEOS, { params });
      const { videos } = response.data;

      dispatch(fetchVideosSuccess({ videos }));

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch videos";
      dispatch(fetchVideosFailure(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      isFetchingAllVideos = false;
    }
  };

// .................... Helper function to upload file to S3 using PUT ...............
const uploadFileToS3 = (presignedUrl, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
};

// .................... Step 3: Upload file to S3 (PUT) - No Redux needed, just returns success/failure ...............
export const uploadToS3 = (presignedUrl, file, onProgress) => {
  return uploadFileToS3(presignedUrl, file, onProgress);
};

// .................... get video upload URL ...............
export const getVideoUploadUrl = (fileName, fileType) => async (dispatch) => {
  dispatch(getVideoUploadUrlStart());

  try {
    const response = await api.post(`${AGENCY_POC_VIDEOS}/upload-url`, {
      fileName,
      fileType,
    });

    const { uploadUrl, fileUrl } = response.data;

    dispatch(getVideoUploadUrlSuccess({ uploadUrl, fileUrl }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to get video upload URL";

    dispatch(getVideoUploadUrlFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// .................... get thumbnail upload URL ...............

export const getThumbnailUploadUrl =
  (fileName, fileType) => async (dispatch) => {
    dispatch(getThumbnailUploadUrlStart());

    try {
      const response = await api.post(
        `${AGENCY_POC_VIDEOS}/thumbnail-upload-url`,
        {
          fileName,
          fileType,
        },
      );

      const { uploadUrl, fileUrl } = response.data;

      dispatch(getThumbnailUploadUrlSuccess({ uploadUrl, fileUrl }));

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get thumbnail upload URL";

      dispatch(getThumbnailUploadUrlFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };


export const uploadVideoComplete =
  (videoFile, thumbnailFile, formData, onProgress) => async (dispatch) => {
    try {
      let videoFileUrl = null;
      let thumbnailFileUrl = null;

      const isEditMode = formData.videoId && (!videoFile || !thumbnailFile);

      if (videoFile) {
        // Step 1: Get presigned URL for video (POST)
        if (onProgress) {
          onProgress({
            video: 0,
            thumbnail: 0,
            status: "Getting upload URL for video...",
          });
        }

        const videoUrlResult = await dispatch(
          getVideoUploadUrl(videoFile.name, videoFile.type),
        );

        if (!videoUrlResult.success) {
          throw new Error(videoUrlResult.error);
        }

        const { uploadUrl: videoUploadUrl, fileUrl } = videoUrlResult.data;
        videoFileUrl = fileUrl;

        // Step 2: Upload video to S3 (PUT)
        if (onProgress) {
          onProgress({
            video: 0,
            thumbnail: 0,
            status: "Uploading video...",
          });
        }

        await uploadFileToS3(videoUploadUrl, videoFile, (percent) => {
          if (onProgress) {
            onProgress({
              video: percent,
              thumbnail: 0,
              status: "Uploading video...",
            });
          }
        });
      }

      // Only upload thumbnail if a new file is provided
      if (thumbnailFile) {
        // Step 3: Get presigned URL for thumbnail (POST)
        if (onProgress) {
          onProgress({
            video: videoFile ? 100 : 0,
            thumbnail: 0,
            status: "Getting upload URL for thumbnail...",
          });
        }

        const thumbnailUrlResult = await dispatch(
          getThumbnailUploadUrl(thumbnailFile.name, thumbnailFile.type),
        );

        if (!thumbnailUrlResult.success) {
          throw new Error(thumbnailUrlResult.error);
        }

        const { uploadUrl: thumbnailUploadUrl, fileUrl } =
          thumbnailUrlResult.data;
        thumbnailFileUrl = fileUrl;

        // Step 4: Upload thumbnail to S3 (PUT)
        if (onProgress) {
          onProgress({
            video: videoFile ? 100 : 0,
            thumbnail: 0,
            status: "Uploading thumbnail...",
          });
        }

        await uploadFileToS3(thumbnailUploadUrl, thumbnailFile, (percent) => {
          if (onProgress) {
            onProgress({
              video: videoFile ? 100 : 0,
              thumbnail: percent,
              status: "Uploading thumbnail...",
            });
          }
        });
      }

      // Step 5: Create or update video record in database
      if (onProgress) {
        onProgress({
          video: 100,
          thumbnail: 100,
          status: isEditMode
            ? "Updating video information..."
            : "Saving video information...",
        });
      }

      const videoData = {
        topicId: formData.topicId,
        scriptId: formData.scriptId,
        title: formData.title,
        description: formData.description,
        videoUrl: videoFileUrl,
        thumbnailUrl: thumbnailFileUrl,
        duration: parseInt(formData.duration),
        doctorName: formData.doctorName,
        specialty: formData.specialty,
        language: formData.language,
        ctaType: formData.ctaType,
        tags: formData.tags,
      };

      if (videoFileUrl) {
        videoData.videoUrl = videoFileUrl;
      }
      if (thumbnailFileUrl) {
        videoData.thumbnailUrl = thumbnailFileUrl;
      }
      // if (formData.assignedReviewerId) {
      //   videoData.assignedReviewerId = formData.assignedReviewerId;
      // }

      let result;
      if (isEditMode) {
        result = await dispatch(updateVideoRecord(formData.videoId, videoData));
      } else {
        result = await dispatch(createVideoRecord(videoData));
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      if (onProgress) {
        onProgress({
          video: 100,
          thumbnail: 100,
          status: isEditMode ? "Update complete!" : "Upload complete!",
        });
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMessage = error.message || "Failed to upload video";
      return { success: false, error: errorMessage };
    }
  };

// .................... update video record ...............
export const updateVideoRecord = (videoId, videoData) => async (dispatch) => {
  dispatch(uploadVideoStart());

  try {
    const { status, ...dataWithoutStatus } = videoData;
    const response = await api.patch(
      `${AGENCY_POC_VIDEOS}/${videoId}`,
      dataWithoutStatus,
    );
    const { video } = response.data;
    dispatch(uploadVideoSuccess({ video }));
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update video record";
    dispatch(uploadVideoFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// .................... create video record ...............
export const createVideoRecord = (videoData) => async (dispatch) => {
  dispatch(uploadVideoStart());

  try {
    const response = await api.post(AGENCY_POC_VIDEOS, videoData);

    const { video } = response.data;

    dispatch(uploadVideoSuccess({ video }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create video record";

    dispatch(uploadVideoFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// .................... fetch video by ID ...............
export const fetchVideoById = (videoId) => async (dispatch) => {
  dispatch(fetchVideoStart());

  try {
    const response = await api.get(`${AGENCY_POC_VIDEOS}/${videoId}`);
    const { video } = response.data;

    dispatch(fetchVideoSuccess({ video }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch video";
    dispatch(fetchVideoFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// ...................... Submit the video ................

export const submitVideo =
  (videoId, assignedReviewerId = null) =>
  async (dispatch) => {
    if (isSubmittingVideo) return;
    isSubmittingVideo = true;

    dispatch(submitVideoStart());

    try {
      const requestBody = assignedReviewerId ? { assignedReviewerId } : {};

      const response = await api.post(
        SUBMIT_AGENCY_VIDEO(videoId),
        requestBody,
      );
      // const response = await api.post(SUBMIT_AGENCY_VIDEO(videoId));
      const { video } = response.data;

      dispatch(submitVideoSuccess({ video }));

      return { success: true, data: video };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit video";

      dispatch(submitVideoFailure(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      isSubmittingVideo = false;
    }
  };

// ................. get all assignee list ................

export const fetchAssigneeList = (video_id) => async (dispatch) => {
  if (isFetchAssigneeList) return;
  isFetchAssigneeList = true;
  dispatch(fetchAssigneeListStart());

  try {
    const response = await api.get(GET_ASSIGNEE_LIST(video_id));
    const { reviewers } = response.data;

    dispatch(fetchAssigneeListSuccess({ reviewers }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch scripts";
    dispatch(fetchAssigneeListFailure(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    isFetchAssigneeList = false;
  }
};





export const createStage2Video = (masterVideoId, videoData, onProgress) => async (dispatch) => {
  dispatch(uploadVideoStart());

  try {
    let videoFileUrl = null;
    let thumbnailFileUrl = null;

    // Upload video if provided
    if (videoData.videoFile) {
      if (onProgress) {
        onProgress({
          video: 0,
          thumbnail: 0,
          status: "Getting upload URL for video...",
        });
      }

      const videoUrlResult = await dispatch(
        getVideoUploadUrl(videoData.videoFile.name, videoData.videoFile.type)
      );

      if (!videoUrlResult.success) {
        throw new Error(videoUrlResult.error);
      }

      const { uploadUrl: videoUploadUrl, fileUrl } = videoUrlResult.data;
      videoFileUrl = fileUrl;

      if (onProgress) {
        onProgress({
          video: 0,
          thumbnail: 0,
          status: "Uploading video...",
        });
      }

      await uploadFileToS3(videoUploadUrl, videoData.videoFile, (percent) => {
        if (onProgress) {
          onProgress({
            video: percent,
            thumbnail: 0,
            status: "Uploading video...",
          });
        }
      });
    }

    // Upload thumbnail if provided
    if (videoData.thumbnailFile) {
      if (onProgress) {
        onProgress({
          video: videoData.videoFile ? 100 : 0,
          thumbnail: 0,
          status: "Getting upload URL for thumbnail...",
        });
      }

      const thumbnailUrlResult = await dispatch(
        getThumbnailUploadUrl(videoData.thumbnailFile.name, videoData.thumbnailFile.type)
      );

      if (!thumbnailUrlResult.success) {
        throw new Error(thumbnailUrlResult.error);
      }

      const { uploadUrl: thumbnailUploadUrl, fileUrl } = thumbnailUrlResult.data;
      thumbnailFileUrl = fileUrl;

      if (onProgress) {
        onProgress({
          video: videoData.videoFile ? 100 : 0,
          thumbnail: 0,
          status: "Uploading thumbnail...",
        });
      }

      await uploadFileToS3(thumbnailUploadUrl, videoData.thumbnailFile, (percent) => {
        if (onProgress) {
          onProgress({
            video: videoData.videoFile ? 100 : 0,
            thumbnail: percent,
            status: "Uploading thumbnail...",
          });
        }
      });
    }

    // Create Stage 2 video record
    if (onProgress) {
      onProgress({
        video: 100,
        thumbnail: 100,
        status: "Creating language adaptation...",
      });
    }

    const requestBody = {
      // videoUrl: videoFileUrl,
      language: videoData.language,
      videoUrl: videoFileUrl || videoData.videoUrl,
      thumbnailUrl: thumbnailFileUrl || videoData.thumbnailUrl,
    };

    if (thumbnailFileUrl) {
      requestBody.thumbnailUrl = thumbnailFileUrl;
    }

    const response = await api.post(CREATE_STAGE2_VIDEO(masterVideoId), requestBody);
    const { video } = response.data;

    dispatch(uploadVideoSuccess({ video }));

    if (onProgress) {
      onProgress({
        video: 100,
        thumbnail: 100,
        status: "Language adaptation created successfully!",
      });
    }

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create Stage 2 video";
    dispatch(uploadVideoFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};


// // .................... delete script ...............
// export const deleteScript = (scriptId) => async (dispatch) => {
//   dispatch(deleteScriptStart());

//   try {
//     await api.delete(`${AGENCY_POC_SCRIPTS}/${scriptId}`);

//     dispatch(deleteScriptSuccess({ scriptId }));

//     return { success: true };
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to delete script";
//     dispatch(deleteScriptFailure(errorMessage));
//     return { success: false, error: errorMessage };
//   }
// };
