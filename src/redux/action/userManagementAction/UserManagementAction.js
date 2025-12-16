import { UPDATE_USER_ROLE, UPDATE_USER_STATUS, USER_MANAGEMENT_LIST } from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserStart,
  createUserSuccess,
  createUserFailure,
  fetchViewUserStart,
  fetchViewUserSuccess,
  fetchViewUserFailure,
  updateUserRoleStart,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  updateUserStatusStart,
  updateUserStatusSuccess,
  updateUserStatusFailure,
} from "../../reducer/userManagementReducer/UserManagementReducer";

let isFetchingUsers = false;
let isCreatingUser = false;
let isViewFetchingUser = false;
let isUpdatingRole = false;
let isUpdatingStatus = false;

// .................... Fetch All User Management listing ...........................

export const fetchUserManagementList = () => async (dispatch) => {
  if (isFetchingUsers) return;
  isFetchingUsers = true;
  dispatch(fetchUsersStart());

  try {
    const response = await api.get(`${USER_MANAGEMENT_LIST}`);

    const { users } = response.data;
    dispatch(fetchUsersSuccess({ users }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch users";
    dispatch(fetchUsersFailure(errorMessage));
    throw error;
  } finally {
    isFetchingUsers = false;
  }
};

// ...................... Create new User action .....................

export const createUser = (userData) => async (dispatch) => {
  if (isCreatingUser) return;
  isCreatingUser = true;
  dispatch(createUserStart());

  try {
    const response = await api.post(`${USER_MANAGEMENT_LIST}`, userData);

    const { user } = response.data;
    dispatch(createUserSuccess({ user }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to create user";
    dispatch(createUserFailure(errorMessage));
    throw error;
  } finally {
    isCreatingUser = false;
  }
};

// .................... Fetch Single User by ID ...........................

export const fetchUserById = (userId) => async (dispatch) => {
  if (isViewFetchingUser) return;
  isViewFetchingUser = true;
  dispatch(fetchViewUserStart());

  try {
    const response = await api.get(`${USER_MANAGEMENT_LIST}/${userId}`);

    const { user } = response.data;
    dispatch(fetchViewUserSuccess({ user }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user details";
    dispatch(fetchViewUserFailure(errorMessage));
    throw error;
  } finally {
    isViewFetchingUser = false;
  }
};

// .................... Update User Role ...........................

export const updateUserRole = (userId, role) => async (dispatch) => {
  if (isUpdatingRole) return;
  isUpdatingRole = true;
  dispatch(updateUserRoleStart());

  try {
    const response = await api.post(`${UPDATE_USER_ROLE}`, { userId, role });

    dispatch(updateUserRoleSuccess({ userId, role }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update user role";
    dispatch(updateUserRoleFailure(errorMessage));
    throw error;
  } finally {
    isUpdatingRole = false;
  }
};

// .................... Update User Status ...........................

export const updateUserStatus = (userId, status) => async (dispatch) => {
  if (isUpdatingStatus) return;
  isUpdatingStatus = true;
  dispatch(updateUserStatusStart());

  try {
    const response = await api.post(`${UPDATE_USER_STATUS}`, {
      userId,
      status,
    });

    dispatch(updateUserStatusSuccess({ userId, status }));

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update user status";
    dispatch(updateUserStatusFailure(errorMessage));
    throw error;
  } finally {
    isUpdatingStatus = false;
  }
};
