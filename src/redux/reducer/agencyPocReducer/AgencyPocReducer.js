import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  agencyPoc: [],
  totalPages: 1,
  totalCount: 0,
  currentPage: 1,
  selectedAgencyPoc: null,
  isPocListLoading: false,
  isViewPocLoading: false,
  isScriptLoading: false,
  isCreateScriptLoading: false,
  isUpdateScriptLoading: false,
  error: null,
};

const agencyPocSlice = createSlice({
  name: "agencyPoc",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // .................. fetch user management listing ....................
    fetchAgencyPocStart(state) {
      state.isPocListLoading = true;
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
          state.agencyPoc[topicIndex].scripts[scriptIndex] = action.payload.script;
        }
      }
      state.error = null;
    },
    updateScriptFailure(state, action) {
      state.isUpdateScriptLoading = false;
      state.error = action.payload;
    },

    // ................. clear selected user ........................
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
   clearSelectedScript,
  clearSelectedPoc,
} = agencyPocSlice.actions;

export default agencyPocSlice.reducer;
