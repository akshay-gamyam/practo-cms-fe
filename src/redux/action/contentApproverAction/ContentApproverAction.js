// import {
//   CONTENT_APPROVER_SCRIPTS,
//   CONTENT_APPROVER_APPROVE,
//   CONTENT_APPROVER_REJECT,
//   CONTENT_APPROVER_CLAIM,
// } from "../../../api/apiEndPoints";
// import api from "../../../api/interceptor";
// import {
//   fetchScriptsStart,
//   fetchScriptsSuccess,
//   fetchScriptsFailure,
//   claimScriptStart,
//   claimScriptSuccess,
//   claimScriptFailure,
//   approveScriptStart,
//   approveScriptSuccess,
//   approveScriptFailure,
//   rejectScriptStart,
//   rejectScriptSuccess,
//   rejectScriptFailure,
// } from "../../reducer/contentApproverReducer/ContentApproverReducer";

// let isFetchingScripts = false;
// let isClaimingScript = false;
// let isApprovingScript = false;
// let isRejectingScript = false;

// // ........................ fetch scripts queue .........................
// export const fetchContentApproverScripts = (params = {}) => async (dispatch) => {
//   if (isFetchingScripts) return;
//   isFetchingScripts = true;
//   dispatch(fetchScriptsStart());

//   try {
//     const response = await api.get(CONTENT_APPROVER_SCRIPTS, { params });
//     console.log("Scripts queue response:", response);
    
//     const { scripts, page, totalPages, totalCount } = response.data;

//     dispatch(fetchScriptsSuccess({ 
//       scripts: scripts || [], 
//       page: page || 1, 
//       totalPages: totalPages || 1, 
//       totalCount: totalCount || 0 
//     }));

//     return response.data;
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to fetch scripts queue";
//     dispatch(fetchScriptsFailure(errorMessage));
//     throw error;
//   } finally {
//     isFetchingScripts = false;
//   }
// };

// // ........................ claim/lock script .........................
// export const claimScript = (scriptId) => async (dispatch) => {
//   if (isClaimingScript) return;
//   isClaimingScript = true;
//   dispatch(claimScriptStart());

//   try {
//     const response = await api.post(CONTENT_APPROVER_CLAIM(scriptId));
//     console.log("Claim script response:", response);
    
//     const { claimedBy } = response.data;

//     dispatch(claimScriptSuccess({ 
//       scriptId, 
//       claimedBy: claimedBy || 'Current User' 
//     }));

//     return response.data;
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to claim script";
//     dispatch(claimScriptFailure(errorMessage));
//     throw error;
//   } finally {
//     isClaimingScript = false;
//   }
// };

// // ........................ approve script with comment .........................
// export const approveScript = (scriptId, comment) => async (dispatch) => {
//   if (isApprovingScript) return;
//   isApprovingScript = true;
//   dispatch(approveScriptStart());

//   try {
//     const response = await api.post(CONTENT_APPROVER_APPROVE(scriptId), {
//       action: 'approve',
//       comment: comment || ''
//     });
//     console.log("Approve script response:", response);
    
//     const { approvedBy } = response.data;

//     dispatch(approveScriptSuccess({ 
//       scriptId, 
//       approvedBy: approvedBy || 'Current User',
//       comment 
//     }));

//     return response.data;
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to approve script";
//     dispatch(approveScriptFailure(errorMessage));
//     throw error;
//   } finally {
//     isApprovingScript = false;
//   }
// };

// // ........................ reject script with comment .........................
// export const rejectScript = (scriptId, comment, reason) => async (dispatch) => {
//   if (isRejectingScript) return;
//   isRejectingScript = true;
//   dispatch(rejectScriptStart());

//   try {
//     const response = await api.post(CONTENT_APPROVER_REJECT(scriptId), {
//       comment: comment || '',
//       reason: reason || comment
//     });
//     console.log("Reject script response:", response);
    
//     const { rejectedBy } = response.data;

//     dispatch(rejectScriptSuccess({ 
//       scriptId, 
//       rejectedBy: rejectedBy || 'Current User',
//       comment,
//       reason: reason || comment
//     }));

//     return response.data;
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to reject script";
//     dispatch(rejectScriptFailure(errorMessage));
//     throw error;
//   } finally {
//     isRejectingScript = false;
//   }
// };







import {
  CONTENT_APPROVER_SCRIPTS,
  CONTENT_APPROVER_APPROVE,
  CONTENT_APPROVER_REJECT,
  CONTENT_APPROVER_CLAIM,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import {
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
} from "../../reducer/contentApproverReducer/ContentApproverReducer";

let isFetchingScripts = false;
let isClaimingScript = false;
let isApprovingScript = false;
let isRejectingScript = false;

// ........................ fetch scripts queue .........................
export const fetchContentApproverScripts = () => async (dispatch) => {
  if (isFetchingScripts) return;
  isFetchingScripts = true;
  dispatch(fetchScriptsStart());

  try {
    const response = await api.get(CONTENT_APPROVER_SCRIPTS);
    console.log("Scripts queue response:", response);
    
    const { scripts, page, totalPages, totalCount } = response.data;

    dispatch(fetchScriptsSuccess({ 
      scripts: scripts || [], 
      page: page || 1, 
      totalPages: totalPages || 1, 
      totalCount: totalCount || 0 
    }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch scripts queue";
    dispatch(fetchScriptsFailure(errorMessage));
    throw error;
  } finally {
    isFetchingScripts = false;
  }
};

// ........................ claim/lock script .........................
export const claimScript = (scriptId) => async (dispatch) => {
  if (isClaimingScript) return;
  isClaimingScript = true;
  dispatch(claimScriptStart());

  try {
    const response = await api.post(CONTENT_APPROVER_CLAIM(scriptId));
    console.log("Claim script response:", response);
    
    const { claimedBy } = response.data;

    dispatch(claimScriptSuccess({ 
      scriptId, 
      claimedBy: claimedBy || 'Current User' 
    }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to claim script";
    dispatch(claimScriptFailure(errorMessage));
    throw error;
  } finally {
    isClaimingScript = false;
  }
};

// ........................ approve script with comment .........................
export const approveScript = (scriptId, comment) => async (dispatch) => {
  if (isApprovingScript) return;
  isApprovingScript = true;
  dispatch(approveScriptStart());

  try {
    const response = await api.post(CONTENT_APPROVER_APPROVE(scriptId), {
      action: 'approve',
      comment: comment || ''
    });
    console.log("Approve script response:", response);
    
    const { approvedBy } = response.data;

    dispatch(approveScriptSuccess({ 
      scriptId, 
      approvedBy: approvedBy || 'Current User',
      comment 
    }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to approve script";
    dispatch(approveScriptFailure(errorMessage));
    throw error;
  } finally {
    isApprovingScript = false;
  }
};

// ........................ reject script with comment .........................
export const rejectScript = (scriptId, comment) => async (dispatch) => {
  if (isRejectingScript) return;
  isRejectingScript = true;
  dispatch(rejectScriptStart());

  try {
    const response = await api.post(CONTENT_APPROVER_REJECT(scriptId), {
      comment: comment || ''
    });
    console.log("Reject script response:", response);
    
    const { rejectedBy } = response.data;

    dispatch(rejectScriptSuccess({ 
      scriptId, 
      rejectedBy: rejectedBy || 'Current User',
      comment,
      reason: comment
    }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to reject script";
    dispatch(rejectScriptFailure(errorMessage));
    throw error;
  } finally {
    isRejectingScript = false;
  }
};