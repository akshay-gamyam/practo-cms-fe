import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  contentApproverScripts: [],
  contentApproverVideos: [],
  selectedScript: null,
  isScriptsListLoading: false,
  isScriptActionLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  error: null,
};

const contentApproverSlice = createSlice({
  name: "contentApprover",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // .................. fetch scripts queue ....................
    fetchScriptsStart(state) {
      state.isScriptsListLoading = true;
      state.error = null;
    },
    fetchScriptsSuccess(state, action) {
      state.isScriptsListLoading = false;
      state.contentApproverScripts = action.payload.scripts || [];
      state.currentPage = action.payload.page || 1;
      state.totalPages = action.payload.totalPages || 1;
      state.totalCount = action.payload.totalCount || 0;
      state.error = null;
    },
    fetchScriptsFailure(state, action) {
      state.isScriptsListLoading = false;
      state.error = action.payload;
    },

    // ................. claim/lock script ........................
    claimScriptStart(state) {
      state.isScriptActionLoading = true;
      state.error = null;
    },
    claimScriptSuccess(state, action) {
      state.isScriptActionLoading = false;
      const { scriptId, claimedBy } = action.payload;
      const script = state.contentApproverScripts.find(s => s.id === scriptId);
      if (script) {
        script.lockedById = claimedBy;
        script.lockedAt = new Date().toISOString();
      }
      state.error = null;
    },
    claimScriptFailure(state, action) {
      state.isScriptActionLoading = false;
      state.error = action.payload;
    },

    // ................. approve script ........................
    approveScriptStart(state) {
      state.isScriptActionLoading = true;
      state.error = null;
    },
    approveScriptSuccess(state, action) {
      state.isScriptActionLoading = false;
      const { scriptId, approvedBy, comment } = action.payload;
      const script = state.contentApproverScripts.find(s => s.id === scriptId);
      if (script) {
        script.status = 'APPROVED';
        script.approvedBy = approvedBy;
        script.lockedById = approvedBy;
        if (comment) {
          script.comments = [...(script.comments || []), {
            text: comment,
            date: new Date().toISOString(),
            type: 'approve'
          }];
        }
      }
      state.error = null;
    },
    approveScriptFailure(state, action) {
      state.isScriptActionLoading = false;
      state.error = action.payload;
    },

    // ................. reject script ........................
    rejectScriptStart(state) {
      state.isScriptActionLoading = true;
      state.error = null;
    },
  rejectScriptSuccess(state, action) {
      state.isScriptActionLoading = false;
      const { scriptId, rejectedBy, comment, reason } = action.payload;
      const script = state.contentApproverScripts.find(s => s.id === scriptId);
      if (script) {
        script.status = 'REJECTED';
        script.rejectedBy = rejectedBy;
        script.reason = reason || comment;
        script.lockedById = rejectedBy;
        if (comment) {
          script.comments = [...(script.comments || []), {
            text: comment,
            date: new Date().toISOString(),
            type: 'reject'
          }];
        }
      }
      state.error = null;
    },
    rejectScriptFailure(state, action) {
      state.isScriptActionLoading = false;
      state.error = action.payload;
    },

    // ................. set selected script ........................
    setSelectedScript(state, action) {
      state.selectedScript = action.payload;
    },

    // ................. clear selected script ........................
    clearSelectedScript(state) {
      state.selectedScript = null;
    },

    // ................. clear error ........................
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
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
  
  setSelectedScript,
  clearSelectedScript,
  clearError,
} = contentApproverSlice.actions;

export default contentApproverSlice.reducer;