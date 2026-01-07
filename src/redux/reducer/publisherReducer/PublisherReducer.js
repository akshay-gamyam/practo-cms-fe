import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../revertStateReducer/RevertStateReducer";

const initialState = {
  notifications: [],
  total: 0,
  unreadCount: 0,
  isNotificationLoading: false,
  isUnreadCountLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    // .................. fetch notification listing ....................
    fetchNotificationStart(state) {
      state.isNotificationLoading = true;
    },
    fetchNotificationSuccess(state, action) {
      state.isNotificationLoading = false;
      state.notifications = action.payload.notifications || [];
      state.total = action.payload.total || 0;
      state.unreadCount = action.payload.unreadCount ?? state.unreadCount;
    },
    fetchNotificationFailure(state, action) {
      state.isNotificationLoading = false;
      state.error = action.payload;
    },

    // .................. read message ...................
    markNotificationReadSuccess(state, action) {
      const id = action.payload;
      state.notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },

    // .................. mark all as read ................
    markAllReadSuccess(state) {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date(),
      }));
      state.unreadCount = 0;
    },

    // ..................... unrerad count ................
    fetchUnreadCountStart(state) {
      state.isUnreadCountLoading = true;
    },
    fetchUnreadCountSuccess(state, action) {
      state.isUnreadCountLoading = false;
      state.unreadCount = action.payload;
    },
    fetchUnreadCountFailure(state) {
      state.isUnreadCountLoading = false;
    },
  },
});

export const {
  fetchNotificationStart,
  fetchNotificationSuccess,
  fetchNotificationFailure,
  markNotificationReadSuccess,
  markAllReadSuccess,
  fetchUnreadCountStart,
  fetchUnreadCountSuccess,
  fetchUnreadCountFailure,
} = notificationSlice.actions;

export default notificationSlice.reducer;
