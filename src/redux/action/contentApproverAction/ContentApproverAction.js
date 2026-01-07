import {
  CONTENT_APPROVER_SCRIPTS,
  CONTENT_APPROVER_APPROVE,
  CONTENT_APPROVER_REJECT,
  CONTENT_APPROVER_CLAIM,
  MEDICAL_AFFAIRS_APPROVE,
  CONTENT_APPROVER_GET_ALL_SCRIPTS,
  CONTENT_APPROVER_VIDEOS,
  CONTENT_APPROVER_GET_ALL_VIDEOS,
  CONTENT_APPROVER_APPROVE_VIDEO,
  MEDICAL_AFFAIRS_APPROVE_VIDEO,
  CONTENT_APPROVER_REJECT_VIDEO,
  CONTENT_APPROVER_CLAIM_VIDEO,
  GET_ALL_SCRIPT_VERSION,
  SEPRATE_CONTENT_APPROVER_VIDEOS,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import {
  fetchScriptsStart,
  fetchScriptsSuccess,
  fetchScriptsFailure,
  claimScriptStart,
  claimScriptSuccess,
  claimScriptFailure,
  approveScriptStart,
  approveScriptSuccess,
  approveScriptFailure,
  rejectScriptStart,
  rejectScriptSuccess,
  rejectScriptFailure,
  fetchVideosStart,
  fetchVideosSuccess,
  fetchVideosFailure,
  claimVideoStart,
  claimVideoSuccess,
  claimVideoFailure,
  approveVideoStart,
  approveVideoSuccess,
  approveVideoFailure,
  rejectVideoStart,
  rejectVideoSuccess,
  rejectVideoFailure,
  fetchScriptVersionStart,
  fetchScriptVersionSuccess,
  fetchScriptVersionFailure,
} from "../../reducer/contentApproverReducer/ContentApproverReducer";
import { ROLE_VARIABLES_MAP } from "../../../utils/helper";

let isFetchingScripts = false;
let isClaimingScript = false;
let isApprovingScriptVersion = false;
let isRejectingScript = false;
let isFetchingVideos = false;
let isClaimingVideos = false;
let isApprovingVideos = false;
let isRejectingVideos = false;

// ........................ fetch scripts queue .........................
export const fetchContentApproverScripts =
  (params = {}) =>
  async (dispatch) => {
    if (isFetchingScripts) return;
    isFetchingScripts = true;
    dispatch(fetchScriptsStart());

    try {
      let url = CONTENT_APPROVER_SCRIPTS;
      let tabType = "all";
      let scriptsData = [];

      if (params.decision === "APPROVED" || params.decision === "REJECTED") {
        const queryParams = new URLSearchParams();
        queryParams.append("decision", params.decision);

        if (params.search) {
          queryParams.append("search", params.search);
        }
        if (params.page) {
          queryParams.append("page", params.page);
        }
        if (params.limit) {
          queryParams.append("limit", params.limit);
        }

        const queryString = queryParams.toString();
        url = `${CONTENT_APPROVER_GET_ALL_SCRIPTS}${
          queryString ? `?${queryString}` : ""
        }`;

        tabType = params.decision === "APPROVED" ? "approved" : "rejected";
      }

      const response = await api.get(url);

      if (params.decision) {
        const reviews = response.data.reviews || [];

        scriptsData = reviews.map((review) => ({
          ...review.script,
          reviewId: review.id,
          reviewerId: review.reviewerId,
          reviewerType: review.reviewerType,
          decision: review.decision,
          reviewComments: review.comments,
          reviewedAt: review.reviewedAt,
          reviewer: review.reviewer,
        }));
      } else {
        const available = response.data.available || [];
        const myReviews = response.data.myReviews || [];

        scriptsData = available;

        if (myReviews.length > 0) {
          dispatch(
            fetchScriptsSuccess({
              scripts: myReviews,
              page: 1,
              totalPages: 1,
              totalCount: myReviews.length,
              tabType: "my-claims",
            })
          );
        }
      }

      if (!Array.isArray(scriptsData)) {
        scriptsData = [];
      }

      const page = response.data.page || params.page || 1;
      const totalPages = response.data.totalPages || 1;
      const totalCount =
        response.data.total || response.data.totalCount || scriptsData.length;

      dispatch(
        fetchScriptsSuccess({
          scripts: scriptsData,
          page: page,
          totalPages: totalPages,
          totalCount: totalCount,
          tabType: tabType,
        })
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch scripts queue";
      dispatch(fetchScriptsFailure(errorMessage));
      throw error;
    } finally {
      isFetchingScripts = false;
    }
  };

// ........................ claim/lock script .........................
export const claimScript = (scriptId) => async (dispatch) => {
  if (isClaimingScript) return;
  isClaimingScript = true;
  dispatch(claimScriptStart());

  try {
    const response = await api.post(CONTENT_APPROVER_CLAIM(scriptId));

    const { claimedBy } = response.data;

    dispatch(
      claimScriptSuccess({
        scriptId,
        claimedBy: claimedBy || "Current User",
      })
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to claim script";
    dispatch(claimScriptFailure(errorMessage));
    throw error;
  } finally {
    isClaimingScript = false;
  }
};

// ........................ approve script with comment .........................
export const approveScript =
  (scriptId, comments = "") =>
  async (dispatch, getState) => {
    dispatch(approveScriptStart());

    try {
      const {
        auth: { user },
      } = getState();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const endpoint =
        user.role === ROLE_VARIABLES_MAP.CONTENT_APPROVER
          ? CONTENT_APPROVER_APPROVE(scriptId)
          : MEDICAL_AFFAIRS_APPROVE(scriptId);

      const response = await api.post(endpoint, {
        comments,
      });

      dispatch(
        approveScriptSuccess({
          scriptId,
          approvedBy: response.data?.approvedBy || user.name,
          comment: comments,
        })
      );

      return response.data;
    } catch (error) {
      dispatch(
        approveScriptFailure(error?.response?.data?.message || error.message)
      );
      throw error;
    }
  };

// ......................... approve in content approver .............................

export const contentApproverScript =
  (scriptId, comments = "") =>
  async (dispatch) => {
    dispatch(approveScriptStart());

    try {
      const response = await api.post(SEPRATE_CONTENT_APPROVER_VIDEOS);

      dispatch(
        approveScriptSuccess({
          scriptId,
          approvedBy: response.data?.approvedBy,
          comment: comments,
        })
      );

      return response.data;
    } catch (error) {
      dispatch(
        approveScriptFailure(error?.response?.data?.message || error.message)
      );
      throw error;
    }
  };

// ........................ reject script with comment .........................
export const rejectScript = (scriptId, comment) => async (dispatch) => {
  if (isRejectingScript) return;
  isRejectingScript = true;
  dispatch(rejectScriptStart());

  try {
    const response = await api.post(CONTENT_APPROVER_REJECT(scriptId), {
      comments: comment || "",
    });

    const { rejectedBy } = response.data;

    dispatch(
      rejectScriptSuccess({
        scriptId,
        rejectedBy: rejectedBy || "Current User",
        comment,
        reason: comment,
      })
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to reject script";
    dispatch(rejectScriptFailure(errorMessage));
    throw error;
  } finally {
    isRejectingScript = false;
  }
};

// ........................ fetch scripts queue .........................
export const fetchContentApproverVideos =
  (params = {}) =>
  async (dispatch) => {
    if (isFetchingVideos) return;
    isFetchingVideos = true;
    dispatch(fetchVideosStart());

    try {
      let url = CONTENT_APPROVER_VIDEOS;
      let tabType = "all";
      let videosData = [];

      if (params.decision === "APPROVED" || params.decision === "REJECTED") {
        const queryParams = new URLSearchParams();
        queryParams.append("decision", params.decision);

        if (params.search) {
          queryParams.append("search", params.search);
        }
        if (params.page) {
          queryParams.append("page", params.page);
        }
        if (params.limit) {
          queryParams.append("limit", params.limit);
        }

        const queryString = queryParams.toString();
        url = `${CONTENT_APPROVER_GET_ALL_VIDEOS}${
          queryString ? `?${queryString}` : ""
        }`;

        tabType = params.decision === "APPROVED" ? "approved" : "rejected";
      }

      const response = await api.get(url);

      if (params.decision) {
        const reviews = response.data.reviews || [];

        videosData = reviews.map((review) => ({
          ...review.video,
          reviewId: review.id,
          reviewerId: review.reviewerId,
          reviewerType: review.reviewerType,
          decision: review.decision,
          reviewComments: review.comments,
          reviewedAt: review.reviewedAt,
          reviewer: review.reviewer,
        }));
      } else {
        const available = response.data.available || [];
        const myReviews = response.data.myReviews || [];

        videosData = available;

        if (myReviews.length > 0) {
          dispatch(
            fetchVideosSuccess({
              videos: myReviews,
              page: 1,
              totalPages: 1,
              totalCount: myReviews.length,
              tabType: "my-claims",
            })
          );
        }
      }

      if (!Array.isArray(videosData)) {
        videosData = [];
      }

      const page = response.data.page || params.page || 1;
      const totalPages = response.data.totalPages || 1;
      const totalCount =
        response.data.total || response.data.totalCount || videosData.length;

      dispatch(
        fetchVideosSuccess({
          videos: videosData,
          page: page,
          totalPages: totalPages,
          totalCount: totalCount,
          tabType: tabType,
        })
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch scripts queue";
      dispatch(fetchVideosFailure(errorMessage));
      throw error;
    } finally {
      isFetchingVideos = false;
    }
  };

// ........................ claim/lock script .........................
export const claimVideos = (videoId) => async (dispatch) => {
  if (isClaimingVideos) return;
  isClaimingVideos = true;
  dispatch(claimVideoStart());

  try {
    const response = await api.post(CONTENT_APPROVER_CLAIM_VIDEO(videoId));

    const { claimedBy } = response.data;

    dispatch(
      claimVideoSuccess({
        videoId,
        claimedBy: claimedBy || "Current User",
      })
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to claim script";
    dispatch(claimVideoFailure(errorMessage));
    throw error;
  } finally {
    isClaimingVideos = false;
  }
};

// ........................ approve script with comment .........................
export const approveVideos =
  (videoId, comments = "") =>
  async (dispatch, getState) => {
    if (isApprovingVideos) return;
    isApprovingVideos = true;

    dispatch(approveVideoStart());

    try {
      const {
        auth: { user },
      } = getState();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const endpoint =
        user.role === ROLE_VARIABLES_MAP.CONTENT_APPROVER
          ? CONTENT_APPROVER_APPROVE_VIDEO(videoId)
          : MEDICAL_AFFAIRS_APPROVE_VIDEO(videoId);

      const response = await api.post(endpoint, {
        comments,
      });

      dispatch(
        approveVideoSuccess({
          videoId,
          approvedBy: response.data?.approvedBy || user.name,
          comment: comments,
        })
      );

      return response.data;
    } catch (error) {
      dispatch(
        approveVideoFailure(error?.response?.data?.message || error.message)
      );
      throw error;
    } finally {
      isApprovingVideos = false;
    }
  };

// ........................ reject script with comment .........................
export const rejectVideos = (videoId, comment) => async (dispatch) => {
  if (isRejectingVideos) return;
  isRejectingVideos = true;
  dispatch(rejectVideoStart());

  try {
    const response = await api.post(CONTENT_APPROVER_REJECT_VIDEO(videoId), {
      comments: comment || "",
    });

    const { rejectedBy } = response.data;

    dispatch(
      rejectVideoSuccess({
        videoId,
        rejectedBy: rejectedBy || "Current User",
        comment,
        reason: comment,
      })
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to reject script";
    dispatch(rejectVideoFailure(errorMessage));
    throw error;
  } finally {
    isRejectingVideos = false;
  }
};

// ........................ get all version data comments .........................

export const fetchAllVersion = (topicId) => async (dispatch) => {
  if (isApprovingScriptVersion) return;
  isApprovingScriptVersion = true;
  dispatch(fetchScriptVersionStart());

  try {
    const response = await api.get(`${GET_ALL_SCRIPT_VERSION}/${topicId}`);
    console.log("response script", response);
    const { topic } = response.data;

    console.log("topic", topic);
    dispatch(fetchScriptVersionSuccess({ topic }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user details";
    dispatch(fetchScriptVersionFailure(errorMessage));
    throw error;
  } finally {
    isApprovingScriptVersion = false;
  }
};
