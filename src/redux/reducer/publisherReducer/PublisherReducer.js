import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  queueVideos: [],
  queueTotal: 0,
  
  publishedVideos: [],
  publishedTotal: 0,
  publishedPage: 1,
  publishedTotalPages: 1,
  
  myClaimedVideos: [],
  
  isQueueLoading: false,
  isPublishedLoading: false,
  isVideoActionLoading: false,
  
  error: null,
};

const publisherSlice = createSlice({
  name: "publisher",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {


    //...................Fetch Queue Videos (Ready to Publish) ...................
    fetchQueueVideosStart(state) {
      state.isQueueLoading = true;
      state.error = null;
    },
    fetchQueueVideosSuccess(state, action) {
      state.isQueueLoading = false;
      state.queueVideos = action.payload.available || [];
      state.queueTotal = action.payload.total || 0;
      state.myClaimedVideos = action.payload.myReviews || [];
    },
    fetchQueueVideosFailure(state, action) {
      state.isQueueLoading = false;
      state.error = action.payload;
    },

    //................... Fetch Published Videos ...................
    fetchPublishedVideosStart(state) {
      state.isPublishedLoading = true;
      state.error = null;
    },
    fetchPublishedVideosSuccess(state, action) {
      state.isPublishedLoading = false;
      state.publishedVideos = action.payload.videos || [];
      state.publishedTotal = action.payload.totalCount || 0;
      state.publishedPage = action.payload.page || 1;
      state.publishedTotalPages = action.payload.totalPages || 1;
    },
    fetchPublishedVideosFailure(state, action) {
      state.isPublishedLoading = false;
      state.error = action.payload;
    },

    // ................... Claim Video...................
    claimVideoStart(state) {
      state.isVideoActionLoading = true;
      state.error = null;
    },
    claimVideoSuccess(state, action) {
      state.isVideoActionLoading = false;
      const videoId = action.payload.videoId;
      const videoIndex = state.queueVideos.findIndex(v => v.id === videoId);
      if (videoIndex !== -1) {
        state.queueVideos[videoIndex].lockedById = action.payload.userId;
        state.queueVideos[videoIndex].lockedAt = new Date().toISOString();
      }
    },
    claimVideoFailure(state, action) {
      state.isVideoActionLoading = false;
      state.error = action.payload;
    },

    // ................... Publish Video ...................
    publishVideoStart(state) {
      state.isVideoActionLoading = true;
      state.error = null;
    },
    publishVideoSuccess(state, action) {
      state.isVideoActionLoading = false;
      const videoId = action.payload.videoId;
      state.queueVideos = state.queueVideos.filter(v => v.id !== videoId);
      state.queueTotal = Math.max(0, state.queueTotal - 1);
    },
    publishVideoFailure(state, action) {
      state.isVideoActionLoading = false;
      state.error = action.payload;
    },

    // ................... Clear Error...................
    clearPublisherError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchQueueVideosStart,
  fetchQueueVideosSuccess,
  fetchQueueVideosFailure,
  fetchPublishedVideosStart,
  fetchPublishedVideosSuccess,
  fetchPublishedVideosFailure,
  claimVideoStart,
  claimVideoSuccess,
  claimVideoFailure,
  publishVideoStart,
  publishVideoSuccess,
  publishVideoFailure,
  clearPublisherError,
} = publisherSlice.actions;

export default publisherSlice.reducer;