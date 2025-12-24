import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotificationList,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchNotificationUnreadCount,
} from "../../../redux/action/notificationAction/NotificationAction";
import SkeletonBlock from "../../common/skeletonBlock/SkeletonBlock";

const Notifications = () => {
  const dispatch = useDispatch();

  const { notifications, isNotificationLoading } = useSelector(
    (state) => state.notification
  );
  const unreadCount = useSelector((state) => state.notification.unreadCount);

  useEffect(() => {
    dispatch(fetchNotificationList());
    dispatch(fetchNotificationUnreadCount());

    const interval = setInterval(() => {
      dispatch(fetchNotificationUnreadCount());
    }, 30000000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    await dispatch(markNotificationAsRead(id));
    dispatch(fetchNotificationUnreadCount());
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
    dispatch(fetchNotificationUnreadCount());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-500 mt-1">
            Stay updated with system and content activities
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                All Notifications
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                You have {unreadCount} unread notifications
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 self-start sm:self-center"
              >
                Mark all as read
              </button>
            )}
          </div>
          {isNotificationLoading && <SkeletonBlock />}
        </div>

        <div className="space-y-3">
          {isNotificationLoading ? (
            <SkeletonBlock />
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No notifications available
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                className={`flex items-start gap-4 rounded-xl border px-6 py-5 cursor-pointer transition
                ${
                  !n.isRead
                    ? "bg-blue-50 border-blue-200 hover:bg-blue-100/50"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }
              `}
              >
                <div className="pt-1">
                  {!n.isRead && (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 block" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span className="shrink-0 text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;