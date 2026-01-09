import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  contentLibrary: {
    videos: [],
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
  contentLibraryStatus: {
    statuses: [],
  },
  contentLibrarySpeciality: {
    specialties: [],
  },
  selectedContentLibrary: null,
  isContentLibraryListLoading: false,
  isContentLibraryStatusLoading: false,
  isContentLibrarySpecialtyLoading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  },
  error: null,
};

const contentLibrarySlice = createSlice({
  name: "content_library",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // ................. fetch Content Library list ........................
    fetchContentLibraryListStart(state) {
      state.isContentLibraryListLoading = true;
      state.error = null;
    },
    fetchContentLibraryListSuccess(state, action) {
      state.isContentLibraryListLoading = false;
      
      state.contentLibrary = {
        videos: action.payload.videos || [],
        currentPage: action.payload.currentPage || 1,
        totalPages: action.payload.totalPages || 1,
        total: action.payload.total || 0,
      };
      
      state.pagination = {
        currentPage: action.payload.currentPage || 1,
        totalPages: action.payload.totalPages || 1,
        totalCount: action.payload.total || 0,
      };
      
      state.error = null;
    },
    fetchContentLibraryListFailure(state, action) {
      state.isContentLibraryListLoading = false;
      state.error = action.payload;
      state.contentLibrary = {
        videos: [],
        currentPage: 1,
        totalPages: 1,
        total: 0,
      };
    },

    // ................. fetch Content Library Status list ........................
    fetchContentLibraryStatusStart(state) {
      state.isContentLibraryStatusLoading = true;
      state.error = null;
    },
    fetchContentLibraryStatusSuccess(state, action) {
      state.isContentLibraryStatusLoading = false;
      state.contentLibraryStatus = {
        statuses: action.payload.statuses || [],
      };
      state.error = null;
    },
    fetchContentLibraryStatusFailure(state, action) {
      state.isContentLibraryStatusLoading = false;
      state.error = action.payload;
      state.contentLibraryStatus = {
        statuses: [],
      };
    },

    // ................. fetch Content Library Speciality list ........................
    fetchContentLibrarySpecialtyStart(state) {
      state.isContentLibrarySpecialtyLoading = true;
      state.error = null;
    },
    fetchContentLibrarySpecialtySuccess(state, action) {
      state.isContentLibrarySpecialtyLoading = false;
      state.contentLibrarySpeciality = {
        specialties: action.payload.specialties || [],
      };
      state.error = null;
    },
    fetchContentLibrarySpecialtyFailure(state, action) {
      state.isContentLibrarySpecialtyLoading = false;
      state.error = action.payload;
      state.contentLibrarySpeciality = {
        specialties: [],
      };
    },

    // ................. select Content Library item ........................
    selectContentLibrary(state, action) {
      state.selectedContentLibrary = action.payload;
    },

    // ................. clear selected Content Library ........................
    clearSelectedContentLibrary(state) {
      state.selectedContentLibrary = null;
    },
  },
});

export const {
  fetchContentLibraryListStart,
  fetchContentLibraryListSuccess,
  fetchContentLibraryListFailure,
  fetchContentLibraryStatusStart,
  fetchContentLibraryStatusSuccess,
  fetchContentLibraryStatusFailure,
  fetchContentLibrarySpecialtyStart,
  fetchContentLibrarySpecialtySuccess,
  fetchContentLibrarySpecialtyFailure,
  selectContentLibrary,
  clearSelectedContentLibrary,
} = contentLibrarySlice.actions;

export default contentLibrarySlice.reducer;