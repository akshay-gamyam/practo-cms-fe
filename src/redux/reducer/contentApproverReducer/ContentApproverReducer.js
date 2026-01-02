import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  contentApproverScripts: [],
  contentApproverVideos: [],
  myClaimsScripts: [],
  approvedScripts: [],
  rejectedScripts: [],
  myClaimsVideos: [],
  approvedVideos: [],
  rejectedVideos: [],
  selectedScript: null,
  selectedVideo: null,
  isScriptsListLoading: false,
  isScriptActionLoading: false,
  isVideosListLoading: false,
  isVideosActionLoading: false,
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
      const { scripts, page, totalPages, totalCount, tabType } = action.payload;

      // Store data in appropriate state based on tab
      if (tabType === "my-claims") {
        state.myClaimsScripts = scripts || [];
      } else if (tabType === "approved") {
        state.approvedScripts = scripts || [];
      } else if (tabType === "rejected") {
        state.rejectedScripts = scripts || [];
      } else {
        // 'all' tab
        state.contentApproverScripts = scripts || [];
      }

      state.currentPage = page || 1;
      state.totalPages = totalPages || 1;
      state.totalCount = totalCount || 0;
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

      // Update in contentApproverScripts (All tab)
      const scriptInAll = state.contentApproverScripts.find(
        (s) => s.id === scriptId
      );
      if (scriptInAll) {
        scriptInAll.lockedById = claimedBy;
        scriptInAll.lockedAt = new Date().toISOString();
      }

      // Update in myClaimsScripts if exists
      const scriptInClaims = state.myClaimsScripts.find(
        (s) => s.id === scriptId
      );
      if (scriptInClaims) {
        scriptInClaims.lockedById = claimedBy;
        scriptInClaims.lockedAt = new Date().toISOString();
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

      // Update in all script arrays
      const updateScript = (script) => {
        if (script.id === scriptId) {
          script.status = "APPROVED";
          script.approvedBy = approvedBy;
          script.lockedById = approvedBy;
          if (comment) {
            script.comments = [
              ...(script.comments || []),
              {
                text: comment,
                date: new Date().toISOString(),
                type: "approve",
              },
            ];
          }
        }
      };

      state.contentApproverScripts.forEach(updateScript);
      state.myClaimsScripts.forEach(updateScript);
      state.approvedScripts.forEach(updateScript);

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

      // Update in all script arrays
      const updateScript = (script) => {
        if (script.id === scriptId) {
          script.status = "REJECTED";
          script.rejectedBy = rejectedBy;
          script.reason = reason || comment;
          script.lockedById = rejectedBy;
          if (comment) {
            script.comments = [
              ...(script.comments || []),
              {
                text: comment,
                date: new Date().toISOString(),
                type: "reject",
              },
            ];
          }
        }
      };

      state.contentApproverScripts.forEach(updateScript);
      state.myClaimsScripts.forEach(updateScript);
      state.rejectedScripts.forEach(updateScript);

      state.error = null;
    },
    rejectScriptFailure(state, action) {
      state.isScriptActionLoading = false;
      state.error = action.payload;
    },

    // // .................. fetch Videos queue ....................
    // fetchVideosStart(state) {
    //   state.isVideosListLoading = true;
    //   state.error = null;
    // },
    // fetchVideosSuccess(state, action) {
    //   state.isVideosListLoading = false;
    //   const { video, page, totalPages, totalCount, tabType } = action.payload;

    //   if (tabType === "my-claims") {
    //     state.myClaimsVideos = video || [];
    //   } else if (tabType === "approved") {
    //     state.approvedVideos = video || [];
    //   } else if (tabType === "rejected") {
    //     state.rejectedVideos = video || [];
    //   } else {
    //     state.contentApproverVideos = video || [];
    //   }

    //   state.currentPage = page || 1;
    //   state.totalPages = totalPages || 1;
    //   state.totalCount = totalCount || 0;
    //   state.error = null;
    // },
    // fetchVideosFailure(state, action) {
    //   state.isVideosListLoading = false;
    //   state.error = action.payload;
    // },

    // // ................. claim/lock Videos ........................
    // claimVideoStart(state) {
    //   state.isVideosActionLoading = true;
    //   state.error = null;
    // },
    // claimVideoSuccess(state, action) {
    //   state.isVideosActionLoading = false;
    //   const { videoId, claimedBy } = action.payload;

    //   const videoInAll = state.contentApproverVideos.find(
    //     (s) => s.id === videoId
    //   );
    //   if (videoInAll) {
    //     videoInAll.lockedById = claimedBy;
    //     videoInAll.lockedAt = new Date().toISOString();
    //   }

    //   const videoInClaims = state.myClaimsVideos.find((s) => s.id === videoId);
    //   if (videoInClaims) {
    //     videoInClaims.lockedById = claimedBy;
    //     videoInClaims.lockedAt = new Date().toISOString();
    //   }

    //   state.error = null;
    // },
    // claimVideoFailure(state, action) {
    //   state.isVideosActionLoading = false;
    //   state.error = action.payload;
    // },

    // // ................. approve Videos ........................
    // approveVideoStart(state) {
    //   state.isVideosActionLoading = true;
    //   state.error = null;
    // },
    // approveVideoSuccess(state, action) {
    //   state.isVideosActionLoading = false;
    //   const { videotId, approvedBy, comment } = action.payload;

    //   const updateVideo = (video) => {
    //     if (video.id === videotId) {
    //       video.status = "APPROVED";
    //       video.approvedBy = approvedBy;
    //       video.lockedById = approvedBy;
    //       if (comment) {
    //         video.comments = [
    //           ...(video.comments || []),
    //           {
    //             text: comment,
    //             date: new Date().toISOString(),
    //             type: "approve",
    //           },
    //         ];
    //       }
    //     }
    //   };

    //   state.contentApproverVideos.forEach(updateVideo);
    //   state.myClaimsVideos.forEach(updateVideo);
    //   state.approvedVideos.forEach(updateVideo);

    //   state.error = null;
    // },
    // approveVideoFailure(state, action) {
    //   state.isVideosActionLoading = false;
    //   state.error = action.payload;
    // },

    // // ................. reject Videos ........................
    // rejectVideoStart(state) {
    //   state.isVideosActionLoading = true;
    //   state.error = null;
    // },
    // rejectVideoSuccess(state, action) {
    //   state.isVideosActionLoading = false;
    //   const { videoId, rejectedBy, comment, reason } = action.payload;

    //   const updateVideo = (video) => {
    //     if (video.id === videoId) {
    //       video.status = "REJECTED";
    //       video.rejectedBy = rejectedBy;
    //       video.reason = reason || comment;
    //       video.lockedById = rejectedBy;
    //       if (comment) {
    //         video.comments = [
    //           ...(video.comments || []),
    //           {
    //             text: comment,
    //             date: new Date().toISOString(),
    //             type: "reject",
    //           },
    //         ];
    //       }
    //     }
    //   };

    //   state.contentApproverVideos.forEach(updateVideo);
    //   state.myClaimsVideos.forEach(updateVideo);
    //   state.rejectedVideos.forEach(updateVideo);

    //   state.error = null;
    // },
    // rejectVideoFailure(state, action) {
    //   state.isVideosActionLoading = false;
    //   state.error = action.payload;
    // },




    // .................. fetch Videos queue ....................
fetchVideosStart(state) {
  state.isVideosListLoading = true;
  state.error = null;
},
fetchVideosSuccess(state, action) {
  state.isVideosListLoading = false;
  const { videos, page, totalPages, totalCount, tabType } = action.payload;

  if (tabType === "my-claims") {
    state.myClaimsVideos = videos || [];
  } else if (tabType === "approved") {
    state.approvedVideos = videos || [];
  } else if (tabType === "rejected") {
    state.rejectedVideos = videos || [];
  } else {
    state.contentApproverVideos = videos || [];
  }

  state.currentPage = page || 1;
  state.totalPages = totalPages || 1;
  state.totalCount = totalCount || 0;
  state.error = null;
},
fetchVideosFailure(state, action) {
  state.isVideosListLoading = false;
  state.error = action.payload;
},

// ................. claim/lock Videos ........................
claimVideoStart(state) {
  state.isVideosActionLoading = true;
  state.error = null;
},
claimVideoSuccess(state, action) {
  state.isVideosActionLoading = false;
  const { videoId, claimedBy } = action.payload;

  const videoInAll = state.contentApproverVideos.find(
    (s) => s.id === videoId
  );
  if (videoInAll) {
    videoInAll.lockedById = claimedBy;
    videoInAll.lockedAt = new Date().toISOString();
  }

  const videoInClaims = state.myClaimsVideos.find((s) => s.id === videoId);
  if (videoInClaims) {
    videoInClaims.lockedById = claimedBy;
    videoInClaims.lockedAt = new Date().toISOString();
  }

  state.error = null;
},
claimVideoFailure(state, action) {
  state.isVideosActionLoading = false;
  state.error = action.payload;
},

// ................. approve Videos ........................
approveVideoStart(state) {
  state.isVideosActionLoading = true;
  state.error = null;
},
approveVideoSuccess(state, action) {
  state.isVideosActionLoading = false;
  const { videoId, approvedBy, comment } = action.payload;

  const updateVideo = (video) => {
    if (video.id === videoId) {
      video.status = "APPROVED";
      video.approvedBy = approvedBy;
      video.lockedById = approvedBy;
      if (comment) {
        video.comments = [
          ...(video.comments || []),
          {
            text: comment,
            date: new Date().toISOString(),
            type: "approve",
          },
        ];
      }
    }
  };

  state.contentApproverVideos.forEach(updateVideo);
  state.myClaimsVideos.forEach(updateVideo);
  state.approvedVideos.forEach(updateVideo);

  state.error = null;
},
approveVideoFailure(state, action) {
  state.isVideosActionLoading = false;
  state.error = action.payload;
},

// ................. reject Videos ........................
rejectVideoStart(state) {
  state.isVideosActionLoading = true;
  state.error = null;
},
rejectVideoSuccess(state, action) {
  state.isVideosActionLoading = false;
  const { videoId, rejectedBy, comment, reason } = action.payload;

  const updateVideo = (video) => {
    if (video.id === videoId) {
      video.status = "REJECTED";
      video.rejectedBy = rejectedBy;
      video.reason = reason || comment;
      video.lockedById = rejectedBy;
      if (comment) {
        video.comments = [
          ...(video.comments || []),
          {
            text: comment,
            date: new Date().toISOString(),
            type: "reject",
          },
        ];
      }
    }
  };

  state.contentApproverVideos.forEach(updateVideo);
  state.myClaimsVideos.forEach(updateVideo);
  state.rejectedVideos.forEach(updateVideo);

  state.error = null;
},
rejectVideoFailure(state, action) {
  state.isVideosActionLoading = false;
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

    // ................. set selected script ........................
    setSelectedVideo(state, action) {
      state.selectedVideo = action.payload;
    },

    // ................. clear selected script ........................
    clearSelectedVideo(state) {
      state.selectedVideo = null;
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

  setSelectedScript,
  clearSelectedScript,
  setSelectedVideo,
  clearSelectedVideo,
  clearError,
} = contentApproverSlice.actions;

export default contentApproverSlice.reducer;
