import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  topics: [],
  doctors: [],
  doctorAssignments: [],
  selectedTopics: null,
  topicStatistics: null,
  isTopicsListLoading: false,
  isTopicsViewLoading: false,
  isTopicsCreateLoading: false,
  isTopicStatsLoading: false,
  isDoctorAssignmentLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  error: null,
};

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // .................. fetch topics listing ....................
    fetchTopicsStart(state) {
      state.isTopicsListLoading = true;
    },
    fetchTopicsSuccess(state, action) {
      state.isTopicsListLoading = false;
      state.topics = action.payload.topics || [];
      state.currentPage = action.payload.page || 1;
      state.totalPages = action.payload.totalPages || 1;
      state.totalCount = action.payload.totalCount || 0;
      state.error = null;
    },
    fetchTopicsFailure(state, action) {
      state.isTopicsListLoading = false;
      state.error = action.payload;
    },

    // .................. fetch doctor Assignments listing ....................
    fetchDoctorAssignmentStart(state) {
      state.isDoctorAssignmentLoading = true;
    },
    fetchDoctorAssignmentSuccess(state, action) {
      state.isDoctorAssignmentLoading = false;
      state.doctorAssignments = action.payload.topics || [];
      state.error = null;
    },
    fetchDoctorAssignmentFailure(state, action) {
      state.isDoctorAssignmentLoading = false;
      state.error = action.payload;
    },

    // .................. fetch doctors list ....................
    fetchDoctorsStart(state) {
      state.isTopicsListLoading = true;
    },
    fetchDoctorsSuccess(state, action) {
      state.isTopicsListLoading = false;
      state.doctors = action.payload.doctors || [];
      state.error = null;
    },
    fetchDoctorsFailure(state, action) {
      state.isTopicsListLoading = false;
      state.error = action.payload;
    },

    // ................. create new topic ........................
    createTopicsStart(state) {
      state.isCreateLoading = true;
    },
    createTopicsSuccess(state, action) {
      state.isCreateLoading = false;
      state.topics.unshift(action.payload.topics);
      state.error = null;
    },
    createTopicsFailure(state, action) {
      state.isCreateLoading = false;
      state.error = action.payload;
    },

    // ................. fetch single topic ........................
    fetchViewTopicsStart(state) {
      state.isTopicsViewLoading = true;
    },
    fetchViewTopicsSuccess(state, action) {
      state.isTopicsViewLoading = false;
      state.selectedTopics = action.payload.topic;
      state.error = null;
    },
    fetchViewTopicsFailure(state, action) {
      state.isTopicsViewLoading = false;
      state.error = action.payload;
    },

    // ................. fetch topic statistics ........................
    fetchTopicStatisticsStart(state) {
      state.isTopicStatsLoading = true;
    },

    fetchTopicStatisticsSuccess(state, action) {
      state.isTopicStatsLoading = false;
      state.topicStatistics = action.payload.stats;
      state.error = null;
    },

    fetchTopicStatisticsFailure(state, action) {
      state.isTopicStatsLoading = false;
      state.error = action.payload;
    },

    // ................. clear selected topic ........................
    clearSelectedTopics(state) {
      state.selectedTopics = null;
    },
  },
});

export const {
  fetchTopicsStart,
  fetchTopicsSuccess,
  fetchTopicsFailure,
  fetchDoctorsStart,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  createTopicsStart,
  createTopicsSuccess,
  createTopicsFailure,
  fetchViewTopicsStart,
  fetchViewTopicsSuccess,
  fetchViewTopicsFailure,
  fetchTopicStatisticsStart,
  fetchTopicStatisticsSuccess,
  fetchTopicStatisticsFailure,
  fetchDoctorAssignmentStart,
  fetchDoctorAssignmentSuccess,
  fetchDoctorAssignmentFailure,
  clearSelectedTopics,
} = topicsSlice.actions;

export default topicsSlice.reducer;
