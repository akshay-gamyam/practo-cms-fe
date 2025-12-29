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
  isUpdatePocLoading: false,
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

    // ................. update user role ........................
    updateAgencyPocScriptStart(state) {
      state.isUpdatePocLoading = true;
    },
    updateAgencyPocScriptSuccess(state, action) {
      state.isUpdatePocLoading = false;
      const { userId, role } = action.payload;
      const index = state.agencyPoc.findIndex((user) => user.id === userId);
      if (index !== -1) {
        state.agencyPoc[index].role = role;
      }
      if (state.selectedUser?.id === userId) {
        state.selectedUser.role = role;
      }
      state.error = null;
    },
    updateAgencyPocScriptFailure(state, action) {
      state.isUpdatePocLoading = false;
      state.error = action.payload;
    },

    // ................. clear selected user ........................
    clearSelectedPoc(state) {
      state.selectedAgencyPoc = null;
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
  updateAgencyPocScriptStart,
  updateAgencyPocScriptSuccess,
  updateAgencyPocScriptFailure,
  clearSelectedPoc,
} = agencyPocSlice.actions;

export default agencyPocSlice.reducer;
