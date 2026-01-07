import {
  GET_NOTIFICATION_LIST,
} from "../../../api/apiEndPoints";
import api from "../../../api/interceptor";
import {
  fetchNotificationStart,
  fetchNotificationSuccess,
  fetchNotificationFailure,
} from "../../reducer/notificationReducer/NotificationReducer";

let isFetchingNotification = false;

// ,....................... get notification listing ..................

export const fetchNotificationList =
  ({ unreadOnly = false, limit = 50, offset = 0 } = {}) =>
  async (dispatch) => {
    if (isFetchingNotification) return;

    isFetchingNotification = true;
    dispatch(fetchNotificationStart());

    try {
      const response = await api.get(GET_NOTIFICATION_LIST, {
        params: { unreadOnly, limit, offset },
      });

      const { notifications, total, unreadCount } = response.data.data;

      dispatch(fetchNotificationSuccess({ notifications, total, unreadCount }));
    } catch (error) {
      dispatch(
        fetchNotificationFailure(
          error.response?.data?.message || "Failed to fetch notifications"
        )
      );
    } finally {
      isFetchingNotification = false;
    }
  };