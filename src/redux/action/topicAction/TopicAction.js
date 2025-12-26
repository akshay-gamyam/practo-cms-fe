import {
  DOCTOR_ASSIGNMENT_LIST,
  GET_DOCTOR_LIST,
  GET_TOPIC_STATISTICS,
  GET_TOPICS_LIST,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import { LIMIT } from "../../../utils/constants";
import {
  fetchTopicsStart,
  fetchTopicsSuccess,
  fetchTopicsFailure,
  createTopicsStart,
  createTopicsSuccess,
  createTopicsFailure,
  fetchViewTopicsStart,
  fetchViewTopicsSuccess,
  fetchViewTopicsFailure,
  fetchDoctorsStart,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  fetchTopicStatisticsStart,
  fetchTopicStatisticsSuccess,
  fetchTopicStatisticsFailure,
  fetchDoctorAssignmentStart,
  fetchDoctorAssignmentSuccess,
  fetchDoctorAssignmentFailure,
} from "../../reducer/topicsReducer/TopicsReducer";

let isFetchingTopics = false;
let isFetchingDoctorAssignment = false;
let isCreatingTopic = false;
let isViewFetchingTopic = false;
let isFetchingDoctors = false;
let isFetchingTopicStat = false;

// .................... get Topics list ......................

export const fetchUplodedTopcsList = (page = 1, limit = LIMIT, offset) => async (dispatch) => {
    if (isFetchingTopics) return;
    isFetchingTopics = true;
    dispatch(fetchTopicsStart());

    try {
      const response = await api.get(`${GET_TOPICS_LIST}?page=${page}&limit=${limit}`);

    const { topics, page: currentPage, totalPages, totalCount } = response.data;
      dispatch(fetchTopicsSuccess({ topics,  page: currentPage, totalPages, totalCount, }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch users";
      dispatch(fetchTopicsFailure(errorMessage));
      throw error;
    } finally {
      isFetchingTopics = false;
    }
  };

// .................... get Doctor Assignment list ......................

export const fetchDoctorAssignmentList = (page = 1, limit = LIMIT,) => async (dispatch) => {
  if (isFetchingDoctorAssignment) return;
  isFetchingDoctorAssignment = true;
  dispatch(fetchDoctorAssignmentStart());
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  try {
    let response;

    if (user?.role === "SUPER_ADMIN") {
      response = await api.get(`${GET_TOPICS_LIST}?page=${page}&limit=${limit}`);
    } else {
      response = await api.get(`${DOCTOR_ASSIGNMENT_LIST}?page=${page}&limit=${limit}`);
    }
    const { topics, page: currentPage, totalPages, total  } = response.data;
    dispatch(fetchDoctorAssignmentSuccess({ topics, page: currentPage, totalPages, totalCount: total, }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch users";
    dispatch(fetchDoctorAssignmentFailure(errorMessage));
    throw error;
  } finally {
    isFetchingDoctorAssignment = false;
  }
};

// .................... get doctors list ......................

export const fetchDoctorsList = () => async (dispatch) => {
  if (isFetchingDoctors) return;
  isFetchingDoctors = true;
  dispatch(fetchDoctorsStart());

  try {
    const response = await api.get(`${GET_DOCTOR_LIST}`);

    const { doctors } = response.data;
    dispatch(fetchDoctorsSuccess({ doctors }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch users";
    dispatch(fetchDoctorsFailure(errorMessage));
    throw error;
  } finally {
    isFetchingDoctors = false;
  }
};

// .................... create Topic ......................

export const createTopics = (topicData) => async (dispatch) => {
  if (isCreatingTopic) return;
  isCreatingTopic = true;
  dispatch(createTopicsStart());

  try {
    const response = await api.post(`${GET_TOPICS_LIST}`, topicData);

    const { topics } = response.data;
    dispatch(createTopicsSuccess({ topics }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to create user";
    dispatch(createTopicsFailure(errorMessage));
    throw error;
  } finally {
    isCreatingTopic = false;
  }
};

// .................... fetch detailed Topic by id ......................

export const fetchDetailedTopicById = (topicId) => async (dispatch) => {
  if (isViewFetchingTopic) return;
  isViewFetchingTopic = true;
  dispatch(fetchViewTopicsStart());

  try {
    const response = await api.get(`${GET_TOPICS_LIST}/${topicId}`);
    console.log("response", response);
    const { topic } = response.data;

    console.log("topic", topic);
    dispatch(fetchViewTopicsSuccess({ topic }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user details";
    dispatch(fetchViewTopicsFailure(errorMessage));
    throw error;
  } finally {
    isViewFetchingTopic = false;
  }
};

// .................... get topic statistics ......................

export const fetchTopicStatistics = () => async (dispatch) => {
  if (isFetchingTopicStat) return;
  isFetchingTopicStat = true;
  dispatch(fetchTopicStatisticsStart());

  try {
    const response = await api.get(`${GET_TOPIC_STATISTICS}`);
    const { stats } = response?.data;
    dispatch(fetchTopicStatisticsSuccess({ stats }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch users";
    dispatch(fetchTopicStatisticsFailure(errorMessage));
    throw error;
  } finally {
    isFetchingTopicStat = false;
  }
};
