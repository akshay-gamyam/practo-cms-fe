import {
  AGENCY_POC_MY_ASSESSMENT,
  AGENCY_POC_SCRIPTS,
  AGENCY_POC_VIDEOS,
  GET_TOPICS_LIST,
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
  deleteScriptStart,
  deleteScriptSuccess,
  deleteScriptFailure,

  fetchVideosStart,
  fetchVideosSuccess,
  fetchVideosFailure,
  fetchVideoStart,
  fetchVideoSuccess,
  fetchVideoFailure,
  uploadVideoStart,
  uploadVideoSuccess,
  uploadVideoFailure,
} from "../../reducer/agencyPocReducer/AgencyPocReducer";

let isFetchingAgencyPoc = false;
let isViewFetchingAgencyPocInDetailed = false;
let isFetchingScript = false;
let isFetchingAllScripts = false;
let isFetchingAllVideos = false;

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
        })
      );

      return data;
    } catch (error) {
      dispatch(
        fetchAgencyPocFailure(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch agency POCs"
        )
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
export const fetchAllScripts = () => async (dispatch) => {
  if (isFetchingAllScripts) return;
  isFetchingAllScripts = true;
  dispatch(fetchScriptsStart());

  try {
    const response = await api.get(AGENCY_POC_SCRIPTS);
    const { scripts } = response.data;

    dispatch(fetchScriptsSuccess({ scripts }));

    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch scripts";
    dispatch(fetchScriptsFailure(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    isFetchingAllScripts = false;
  }
};



// .................... fetch all videos ...............

export const fetchAllVideos = () => async (dispatch) => {
  if (isFetchingAllVideos) return;
  isFetchingAllVideos = true;
  dispatch(fetchVideosStart());

  try {
    const response = await api.get(AGENCY_POC_VIDEOS);
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

// .................... fetch video by ID ...............
// export const fetchVideoById = (videoId) => async (dispatch) => {
//   dispatch(fetchVideoStart());

//   try {
//     const response = await api.get(`${AGENCY_POC_VIDEOS}/${videoId}`);
//     const { video } = response.data;

//     dispatch(fetchVideoSuccess({ video }));

//     return { success: true, data: response.data };
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to fetch video";
//     dispatch(fetchVideoFailure(errorMessage));
//     return { success: false, error: errorMessage };
//   }
// };


// .................... upload video ...............

// export const uploadVideo = (scriptId, videoFile, formData) => async (dispatch) => {
//   dispatch(uploadVideoStart());

//   try {
//     const uploadData = new FormData();
//     uploadData.append('video', videoFile);
//     uploadData.append('scriptId', scriptId);
    
//     // Append any additional form data
//     if (formData) {
//       Object.keys(formData).forEach(key => {
//         uploadData.append(key, formData[key]);
//       });
//     }

//     const response = await api.post(AGENCY_POC_VIDEOS, uploadData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     const { video } = response.data;

//     dispatch(uploadVideoSuccess({ video }));

//     return { success: true, data: response.data };
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to upload video";
//     dispatch(uploadVideoFailure(errorMessage));
//     return { success: false, error: errorMessage };
//   }
// };


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