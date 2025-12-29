import {
  AGENCY_POC_MY_ASSESSMENT,
  AGENCY_POC_SCRIPTS,
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
} from "../../reducer/agencyPocReducer/AgencyPocReducer";

let isFetchingAgencyPoc = false;
let isViewFetchingAgencyPocInDetailed = false;
let isFetchingScript = false;

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

// .................... create new script (Write Script) ...............

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
