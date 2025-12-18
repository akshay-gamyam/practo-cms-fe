import {
  AUTH_LOGIN,
  CHANGE_PASSWORD,
  GET_CURRENT_USER_DETAILED_ACCESS,
  LOGIN_WITH_GOOGLE,
  REFRESH_TOKEN,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import { clearAuthData, storeAuthData } from "../../../utils/helper";
import {
  fetchLoginUserFailure,
  fetchLoginUserStart,
  fetchLoginUserSuccess,
  fetchLoginSocialStart,
  fetchLoginSocialSuccess,
  fetchLoginSocialFailure,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
  resetPasswordChangeState,
} from "../../reducer/authReducer/AuthReducer";

let isPostLoginUser = false;
let isPostSocialLogin = false;
let isgetCurrentUser = false;
let isChangingPassword = false;

// .................... Email/Password Login ...........................

export const loginUser = (email, password) => async (dispatch) => {
  if (isPostLoginUser) return;
  isPostLoginUser = true;
  dispatch(fetchLoginUserStart());

  try {
    const response = await api.post(`${AUTH_LOGIN}`, { email, password });

    const { token, user, permissions } = response.data;
    storeAuthData({ token, user, permissions });
    dispatch(fetchLoginUserSuccess({ user, permissions }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";
    dispatch(fetchLoginUserFailure(errorMessage));
    throw error;
  } finally {
    isPostLoginUser = false;
  }
};

// .................... Google OAuth Login .......................

export const loginWithGoogle = (googleToken) => async (dispatch) => {
  if (isPostSocialLogin) return;
  isPostSocialLogin = true;
  dispatch(fetchLoginSocialStart());

  try {
    const response = await api.post(`${LOGIN_WITH_GOOGLE}`, {
      token: googleToken,
    });

    const { token, user, permissions } = response.data;
    storeAuthData({ token, user, permissions });
    dispatch(fetchLoginSocialSuccess({ user, permissions }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Google login failed";
    dispatch(fetchLoginSocialFailure(errorMessage));
    throw error;
  } finally {
    isPostSocialLogin = false;
  }
};

// ................. Get Current User (Session Restore) ........................

export const getCurrentUser = () => async (dispatch) => {
  if (isgetCurrentUser) return;
  isgetCurrentUser = true;
  dispatch(fetchLoginUserStart());

  try {
    const response = await api.get(`${GET_CURRENT_USER_DETAILED_ACCESS}`);

    const { user, permissions } = response.data;
    storeAuthData({ user, permissions });
    dispatch(fetchLoginUserSuccess({ user, permissions }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Session restore failed";
    dispatch(fetchLoginUserFailure(errorMessage));
    clearAuthData();
    throw error;
  } finally {
    isgetCurrentUser = false;
  }
};

// ....................... Refresh Token ............................

export const refreshToken = () => async (dispatch) => {
  try {
    const response = await api.post(`${REFRESH_TOKEN}`);

    const { token } = response.data;
    storeAuthData({ token });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Token refresh failed";
    console.error("Token refresh failed:", errorMessage);
    throw error;
  }
};

// .......................... Change Password ........................

export const changePassword = (passwordData) => async (dispatch) => {
  if (isChangingPassword) return;
  isChangingPassword = true;

  dispatch(changePasswordStart());

  try {
    const response = await api.post(CHANGE_PASSWORD, {
      currentpassword: passwordData.currentpassword,
      newPassword: passwordData.newPassword,
    });

    dispatch(changePasswordSuccess(response.data));
    setTimeout(() => {
      dispatch(resetPasswordChangeState());
    }, 5000);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to change password";

    dispatch(changePasswordFailure(errorMessage));
    throw error;
  } finally {
    isChangingPassword = false;
  }
};
