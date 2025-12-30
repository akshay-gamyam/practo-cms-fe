import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  agencyPoc: [],
  scripts: [],
  videos: [],
  totalPages: 1,
  totalCount: 0,
  currentPage: 1,
  selectedAgencyPoc: null,
  selectedScript: null,
  selectedVideo: null,
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
      state.isScriptListLoading = false;
      state.scripts = action.payload.scripts;
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

       // ................. upload video ........................
    uploadVideoStart(state) {
      state.isUploadVideoLoading = true;
      state.error = null;
    },
    uploadVideoSuccess(state, action) {
      state.isUploadVideoLoading = false;
      state.videos.push(action.payload.video);
      state.error = null;
    },
    uploadVideoFailure(state, action) {
      state.isUploadVideoLoading = false;
      state.error = action.payload;
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
  uploadVideoStart,
  uploadVideoSuccess,
  uploadVideoFailure,
  
  clearSelectedPoc,
  clearSelectedScript,
} = agencyPocSlice.actions;

export default agencyPocSlice.reducer;
