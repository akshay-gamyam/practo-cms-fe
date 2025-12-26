import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  users: [],
  totalPages: 1,
  totalCount: 0,
  currentPage: 1,
  selectedUser: null,
  isListLoading: false,
  isViewLoading: false,
  isCreateLoading: false,
  isUpdateLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // .................. fetch user management listing ....................
    fetchUsersStart(state) {
      state.isListLoading = true;
    },
    fetchUsersSuccess(state, action) {
      state.isListLoading = false;
      state.users = action.payload.users || [];
      state.totalPages = action.payload.totalPages ?? 1;
      state.totalCount = action.payload.totalCount ?? 0;
      state.currentPage = action.payload.page ?? 1;
      state.error = null;
    },
    fetchUsersFailure(state, action) {
      state.isListLoading = false;
      state.error = action.payload;
    },

    // ................. create new user ........................
    createUserStart(state) {
      state.isCreateLoading = true;
    },
    createUserSuccess(state, action) {
      state.isCreateLoading = false;
      state.users.unshift(action.payload.user);
      state.error = null;
    },
    createUserFailure(state, action) {
      state.isCreateLoading = false;
      state.error = action.payload;
    },

    // ................. fetch single user ........................
    fetchViewUserStart(state) {
      state.isViewLoading = true;
    },
    fetchViewUserSuccess(state, action) {
      state.isViewLoading = false;
      state.selectedUser = action.payload.user;
      state.error = null;
    },
    fetchViewUserFailure(state, action) {
      state.isViewLoading = false;
      state.error = action.payload;
    },

    // ................. update user role ........................
    updateUserRoleStart(state) {
      state.isUpdateLoading = true;
    },
    updateUserRoleSuccess(state, action) {
      state.isUpdateLoading = false;
      const { userId, role } = action.payload;
      const index = state.users.findIndex((user) => user.id === userId);
      if (index !== -1) {
        state.users[index].role = role;
      }
      if (state.selectedUser?.id === userId) {
        state.selectedUser.role = role;
      }
      state.error = null;
    },
    updateUserRoleFailure(state, action) {
      state.isUpdateLoading = false;
      state.error = action.payload;
    },

    // ................. update user status ........................
    updateUserStatusStart(state) {
      state.isUpdateLoading = true;
    },
    updateUserStatusSuccess(state, action) {
      state.isUpdateLoading = false;
      const { userId, status } = action.payload;
      const index = state.users.findIndex((user) => user.id === userId);
      if (index !== -1) {
        state.users[index].status = status;
      }
      if (state.selectedUser?.id === userId) {
        state.selectedUser.status = status;
      }
      state.error = null;
    },
    updateUserStatusFailure(state, action) {
      state.isUpdateLoading = false;
      state.error = action.payload;
    },

    // ................. clear selected user ........................
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
});

export const {
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
  clearSelectedUser,
} = userSlice.actions;

export default userSlice.reducer;
