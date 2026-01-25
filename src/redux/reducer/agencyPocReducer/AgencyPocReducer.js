import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  agencyPoc: [],
  scripts: [],
  videos: [],
  allVideosId: [],
  totalPages: 1,
  totalCount: 0,
  currentPage: 1,
  selectedAgencyPoc: null,
  selectedScript: null,
  selectedVideo: null,

  assigneeList: {
    assigneeReviewer: [],
  },

  selectedVideoIdData: null,
  // Upload state
  videoUploadUrl: null,
  videoFileUrl: null,
  thumbnailUploadUrl: null,
  thumbnailFileUrl: null,

  isPocListLoading: false,
  isViewPocLoading: false,
  isScriptLoading: false,
  isScriptListLoading: false,
  isCreateScriptLoading: false,
  isUpdateScriptLoading: false,
  isSubmitScriptLoading: false,
  isDeleteScriptLoading: false,
  isVideoListLoading: false,
  isVideoLoading: false,
  isUploadVideoLoading: false,
  isDeleteVideoLoading: false,
  isGetVideoUploadUrlLoading: false,
  isGetThumbnailUploadUrlLoading: false,
  isSubmitVideoLoading: false,
  error: null,
};

const agencyPocSlice = createSlice({
  name: "agencyPoc",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // .................. fetch agency POC listing ....................
    fetchAgencyPocStart(state) {
      state.isPocListLoading = true;
      state.error = null;
    },
    fetchAgencyPocSuccess(state, action) {
      state.isPocListLoading = false;
      state.agencyPoc = action.payload.agencyPoc;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.page;
      state.error = null;
    },
    fetchAgencyPocFailure(state, action) {
      state.isPocListLoading = false;
      state.error = action.payload;
    },

    // ................. fetch all scripts ........................

    fetchallVideosIdStart(state) {
      state.isScriptListLoading = true;
      state.error = null;
    },
    fetchallVideosIdSuccess(state, action) {
      state.isScriptListLoading = false;
      state.allVideosId = action.payload.uploadedVideoIds;
      state.error = null;
    },
    fetchallVideosIdFailure(state, action) {
      state.isScriptListLoading = false;
      state.error = action.payload;
    },

    // ................. fetch single agency topic in detailed ........................
    fetchViewAgencyPocStart(state) {
      state.isViewPocLoading = true;
      state.error = null;
    },
    fetchViewAgencyPocSuccess(state, action) {
      state.isViewPocLoading = false;
      state.selectedAgencyPoc = action.payload.topic;
      state.error = null;
    },
    fetchViewAgencyPocFailure(state, action) {
      state.isViewPocLoading = false;
      state.error = action.payload;
    },

    // ................. fetch script by ID ........................
    fetchScriptStart(state) {
      state.isScriptLoading = true;
      state.error = null;
    },
    fetchScriptSuccess(state, action) {
      state.isScriptLoading = false;
      state.selectedScript = action.payload.script;
      state.error = null;
    },
    fetchScriptFailure(state, action) {
      state.isScriptLoading = false;
      state.error = action.payload;
    },

    // ................. create script ........................
    createScriptStart(state) {
      state.isCreateScriptLoading = true;
      state.error = null;
    },
    createScriptSuccess(state, action) {
      state.isCreateScriptLoading = false;
      state.selectedScript = action.payload.script;
      const topicIndex = state.agencyPoc.findIndex(
        (topic) => topic.id === action.payload.topicId
      );
      if (topicIndex !== -1) {
        if (!state.agencyPoc[topicIndex].scripts) {
          state.agencyPoc[topicIndex].scripts = [];
        }
        state.agencyPoc[topicIndex].scripts.push(action.payload.script);
      }
      state.error = null;
    },
    createScriptFailure(state, action) {
      state.isCreateScriptLoading = false;
      state.error = action.payload;
    },

    // ................. update script (continue draft/fix script) ........................
    updateScriptStart(state) {
      state.isUpdateScriptLoading = true;
      state.error = null;
    },
    updateScriptSuccess(state, action) {
      state.isUpdateScriptLoading = false;
      state.selectedScript = action.payload.script;
      const topicIndex = state.agencyPoc.findIndex((topic) =>
        topic.scripts?.some((script) => script.id === action.payload.script.id)
      );
      if (topicIndex !== -1) {
        const scriptIndex = state.agencyPoc[topicIndex].scripts.findIndex(
          (script) => script.id === action.payload.script.id
        );
        if (scriptIndex !== -1) {
          state.agencyPoc[topicIndex].scripts[scriptIndex] =
            action.payload.script;
        }
      }
      state.error = null;
    },
    updateScriptFailure(state, action) {
      state.isUpdateScriptLoading = false;
      state.error = action.payload;
    },

    // ................. submit script for review ........................
    submitScriptStart(state) {
      state.isSubmitScriptLoading = true;
      state.error = null;
    },
    submitScriptSuccess(state, action) {
      state.isSubmitScriptLoading = false;
      state.selectedScript = action.payload.script;
      const topicIndex = state.agencyPoc.findIndex((topic) =>
        topic.scripts?.some((script) => script.id === action.payload.script.id)
      );
      if (topicIndex !== -1) {
        const scriptIndex = state.agencyPoc[topicIndex].scripts.findIndex(
          (script) => script.id === action.payload.script.id
        );
        if (scriptIndex !== -1) {
          state.agencyPoc[topicIndex].scripts[scriptIndex] =
            action.payload.script;
        }
      }
      state.error = null;
    },
    submitScriptFailure(state, action) {
      state.isSubmitScriptLoading = false;
      state.error = action.payload;
    },

    // ................. fetch all scripts ........................
    fetchScriptsStart(state) {
      state.isScriptListLoading = true;
      state.error = null;
    },
    fetchScriptsSuccess(state, action) {
      // state.isScriptListLoading = false;
      // state.scripts = action.payload.scripts;
      // state.error = null;
      state.isScriptListLoading = false;
      state.scripts = action.payload.scripts;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.currentPage;
      state.error = null;
    },
    fetchScriptsFailure(state, action) {
      state.isScriptListLoading = false;
      state.error = action.payload;
    },

    // ................. delete script ........................
    deleteScriptStart(state) {
      state.isDeleteScriptLoading = true;
      state.error = null;
    },
    deleteScriptSuccess(state, action) {
      state.isDeleteScriptLoading = false;
      state.scripts = state.scripts.filter(
        (script) => script.id !== action.payload.scriptId
      );
      state.agencyPoc = state.agencyPoc.map((topic) => ({
        ...topic,
        scripts: topic.scripts?.filter(
          (script) => script.id !== action.payload.scriptId
        ),
      }));
      state.error = null;
    },
    deleteScriptFailure(state, action) {
      state.isDeleteScriptLoading = false;
      state.error = action.payload;
    },

    // ................. fetch all videos ........................
    fetchVideosStart(state) {
      state.isVideoListLoading = true;
      state.error = null;
    },
    fetchVideosSuccess(state, action) {
      state.isVideoListLoading = false;
      state.videos = action.payload.videos;
      state.error = null;
    },
    fetchVideosFailure(state, action) {
      state.isVideoListLoading = false;
      state.error = action.payload;
    },

    // ................. fetch video by ID ........................
    fetchVideoStart(state) {
      state.isVideoLoading = true;
      state.error = null;
    },
    fetchVideoSuccess(state, action) {
      state.isVideoLoading = false;
      state.selectedVideo = action.payload.video;
      state.error = null;
    },
    fetchVideoFailure(state, action) {
      state.isVideoLoading = false;
      state.error = action.payload;
    },

    // ................. fetch video by ID ........................
    fetchVideoSelectedIdDataStart(state) {
      state.isVideoLoading = true;
      state.error = null;
    },
    fetchVideoSelectedIdDataSuccess(state, action) {
      state.isVideoLoading = false;
      state.selectedVideoIdData = action.payload.video;
      state.error = null;
    },
    fetchVideoSelectedIdDataFailure(state, action) {
      state.isVideoLoading = false;
      state.error = action.payload;
    },

    clearSelectedVideoData(state) {
      state.selectedVideoIdData = null;
      state.isVideoLoading = false;
      state.error = null;
    },

    // ................. upload video ........................
    uploadVideoStart(state) {
      state.isUploadVideoLoading = true;
      state.error = null;
    },
    uploadVideoSuccess(state, action) {
      state.isUploadVideoLoading = false;
      state.videos.push(action.payload.video);
      // Clear upload URLs after successful upload
      state.videoUploadUrl = null;
      state.videoFileUrl = null;
      state.thumbnailUploadUrl = null;
      state.thumbnailFileUrl = null;
      state.error = null;
    },
    uploadVideoFailure(state, action) {
      state.isUploadVideoLoading = false;
      state.error = action.payload;
    },

    // ................. get video upload URL ........................
    getVideoUploadUrlStart(state) {
      state.isGetVideoUploadUrlLoading = true;
      state.error = null;
    },
    getVideoUploadUrlSuccess(state, action) {
      state.isGetVideoUploadUrlLoading = false;
      state.videoUploadUrl = action.payload.uploadUrl;
      state.videoFileUrl = action.payload.fileUrl;
      state.error = null;
    },
    getVideoUploadUrlFailure(state, action) {
      state.isGetVideoUploadUrlLoading = false;
      state.error = action.payload;
    },

    // ................. get thumbnail upload URL ........................
    getThumbnailUploadUrlStart(state) {
      state.isGetThumbnailUploadUrlLoading = true;
      state.error = null;
    },
    getThumbnailUploadUrlSuccess(state, action) {
      state.isGetThumbnailUploadUrlLoading = false;
      state.thumbnailUploadUrl = action.payload.uploadUrl;
      state.thumbnailFileUrl = action.payload.fileUrl;
      state.error = null;
    },
    getThumbnailUploadUrlFailure(state, action) {
      state.isGetThumbnailUploadUrlLoading = false;
      state.error = action.payload;
    },

    // ...............submit the video .......................

    submitVideoStart(state) {
      state.isSubmitVideoLoading = true;
      state.error = null;
    },

    submitVideoSuccess(state, action) {
      state.isSubmitVideoLoading = false;

      const updatedVideo = action.payload.video;

      const index = state.videos.findIndex((v) => v.id === updatedVideo.id);
      if (index !== -1) {
        state.videos[index] = updatedVideo;
      }

      if (state.selectedVideo?.id === updatedVideo.id) {
        state.selectedVideo = updatedVideo;
      }

      state.error = null;
    },

    submitVideoFailure(state, action) {
      state.isSubmitVideoLoading = false;
      state.error = action.payload;
    },

    // ................. clear upload state ........................
    clearUploadState(state) {
      state.videoUploadUrl = null;
      state.videoFileUrl = null;
      state.thumbnailUploadUrl = null;
      state.thumbnailFileUrl = null;
      state.isUploadVideoLoading = false;
      state.error = null;
    },

    // ................. fetch Content Library Speciality list ........................
    fetchAssigneeListStart(state) {
      state.isContentLibrarySpecialtyLoading = true;
      state.error = null;
    },
    fetchAssigneeListSuccess(state, action) {
      state.isContentLibrarySpecialtyLoading = false;
      state.assigneeList = {
        assigneeReviewer: action.payload.reviewers || [],
      };
      state.error = null;
    },
    fetchAssigneeListFailure(state, action) {
      state.isContentLibrarySpecialtyLoading = false;
      state.error = action.payload;
      state.assigneeList = {
        assigneeReviewer: [],
      };
    },

    // ................. clear selected POC ........................
    clearSelectedPoc(state) {
      state.selectedAgencyPoc = null;
    },

    // ................. clear selected script ........................
    clearSelectedScript(state) {
      state.selectedScript = null;
    },
  },
});

export const {
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

  fetchallVideosIdStart,
  fetchallVideosIdSuccess,
  fetchallVideosIdFailure,
  fetchVideoSelectedIdDataStart,
  fetchVideoSelectedIdDataSuccess,
  fetchVideoSelectedIdDataFailure,

  uploadVideoStart,
  uploadVideoSuccess,
  uploadVideoFailure,
  getVideoUploadUrlStart,
  getVideoUploadUrlSuccess,
  getVideoUploadUrlFailure,
  getThumbnailUploadUrlStart,
  getThumbnailUploadUrlSuccess,
  getThumbnailUploadUrlFailure,
  clearUploadState,

  submitVideoStart,
  submitVideoSuccess,
  submitVideoFailure,

  fetchAssigneeListStart,
  fetchAssigneeListSuccess,
  fetchAssigneeListFailure,

  clearSelectedPoc,
  clearSelectedScript,
  clearSelectedVideoData,
} = agencyPocSlice.actions;

export default agencyPocSlice.reducer;
