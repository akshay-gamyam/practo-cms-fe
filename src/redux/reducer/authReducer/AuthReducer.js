import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  user: null,
  permissions: [],
  passwordChange: false,
  isLoading: false,
  error: null,
  socialLoginPending: false,
  isAuthenticated: false,
  passwordChangeLoading: false,
  passwordChangeError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // ........... login state ...............

    fetchLoginUserStart(state) {
      state.isLoading = true;
    },
    fetchLoginUserSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user || null;
      state.permissions = action.payload.permissions || [];
      state.error = null;
    },
    fetchLoginUserFailure(state, action) {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    // ........... login via google state ...............

    fetchLoginSocialStart(state) {
      state.isLoading = true;
      state.socialLoginPending = true;
    },
    fetchLoginSocialSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.socialLoginPending = false;
      state.user = action.payload.user || null;
      state.permissions = action.payload.permissions || [];
      state.error = null;
    },
    fetchLoginSocialFailure(state, action) {
      state.isLoading = false;
      state.socialLoginPending = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    changePasswordStart(state) {
      state.passwordChangeLoading = true;
    },
    changePasswordSuccess(state, action) {
      state.passwordChangeLoading = false;
      state.passwordChange = true;
      state.passwordChangeError = null;
    },
    changePasswordFailure(state, action) {
      state.passwordChangeLoading = false;
      state.passwordChange = false;
      state.passwordChangeError = action.payload;
    },
    resetPasswordChangeState(state) {
      state.passwordChangeLoading = false;
      state.passwordChangeError = null;
      state.passwordChange = false;
    },
  },
});

export const {
  fetchLoginUserStart,
  fetchLoginUserSuccess,
  fetchLoginUserFailure,
  fetchLoginSocialStart,
  fetchLoginSocialSuccess,
  fetchLoginSocialFailure,
  setSocialLoginPending,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
  resetPasswordChangeState,
} = authSlice.actions;

export default authSlice.reducer;