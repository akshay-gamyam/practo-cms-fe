export const AUTH_LOGIN= "/api/auth/login";
export const LOGIN_WITH_GOOGLE= "/api/auth/oauth/google";
export const GET_CURRENT_USER_DETAILED_ACCESS = "/api/auth/me";
export const REFRESH_TOKEN = "/api/auth/refresh";
export const CHANGE_PASSWORD = "/api/auth/change-password";


export const USER_MANAGEMENT_LIST = "/api/users";
export const DELETE_USER = "/api/users/:id";
export const UPDATE_USER_STATUS = "/api/users/update-status";
export const UPDATE_USER_ROLE = "/api/users/update-role";


export const GET_TOPICS_LIST ="/api/topics";
// export const GET_TOPIC_BY_ID = "/api/topics/:id";
export const DOCTOR_ASSIGNMENT_LIST = "/api/topics/my-assignments";
export const GET_TOPIC_STATISTICS = "/api/topics/stats";
export const GET_DOCTOR_LIST = "/api/users/doctors"


export const CREATE_DOCTOR_POINTER = "/api/doctor-pointers";
export const GET_DOCTOR_POINTERS_BY_ID = "/api/doctor-pointers";


export const GET_NOTIFICATION_LIST ="/api/notifications";
export const GET_NOTIFICATION_UNREAD_COUNT ="/api/notifications/unread-count";
export const MARK_ALL_NOTIFICATION_AS_READ = "/api/notifications/read-all";
export const MARK_NOTIFICATION_AS_READ = (id) => `/api/notifications/${id}/read`;

export const AGENCY_POC_MY_ASSESSMENT = "/api/topics/my-assignments";
export const AGENCY_POC_SCRIPTS = "/api/scripts";
export const AGENCY_POC_VIDEOS = "/api/videos";

export const CONTENT_APPROVER_SCRIPTS = "/api/scripts/queue";
export const CONTENT_APPROVER_GET_ALL_SCRIPTS= "/api/scripts/my-reviews";
export const CONTENT_APPROVER_APPROVE = (script_id) => `/api/scripts/${script_id}/lock`;
export const MEDICAL_AFFAIRS_APPROVE = (script_id) => `/api/scripts/${script_id}/approve`;
export const CONTENT_APPROVER_REJECT = (script_id) => `/api/scripts/${script_id}/reject`;
export const CONTENT_APPROVER_REJECT_NEW = (script_id) => `/api/scripts/${script_id}`;
export const CONTENT_APPROVER_CLAIM = (script_id) => `/api/scripts/${script_id}/claim`;



export const CONTENT_APPROVER_VIDEOS = "/api/videos/queue";
export const CONTENT_APPROVER_GET_ALL_VIDEOS= "/api/videos/my-reviews";
export const CONTENT_APPROVER_APPROVE_VIDEO = (script_id) => `/api/videos/${script_id}/lock`;
export const MEDICAL_AFFAIRS_APPROVE_VIDEO = (script_id) => `/api/videos/${script_id}/approve`;
export const CONTENT_APPROVER_REJECT_VIDEO = (script_id) => `/api/videos/${script_id}/reject`;
export const CONTENT_APPROVER_CLAIM_VIDEO = (script_id) => `/api/videos/${script_id}/claim`;
export const GET_ALL_SCRIPT_VERSION = "/api/scripts/my-reviews/topic";
export const SEPRATE_CONTENT_APPROVER_VIDEOS = "/api/scripts/my-locks";