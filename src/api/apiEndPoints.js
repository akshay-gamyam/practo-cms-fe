export const AUTH_LOGIN= "/api/auth/login";
export const LOGIN_WITH_GOOGLE= "/api/auth/oauth/google";
export const GET_CURRENT_USER_DETAILED_ACCESS = "/api/auth/me";
export const REFRESH_TOKEN = "/api/auth/refresh";


export const USER_MANAGEMENT_LIST = "/api/users";
export const GET_USER = "/api/users/:id";
export const UPDATE_USER = "/api/users/:id";
export const DELETE_USER = "/api/users/:id";
export const UPDATE_USER_STATUS = "/api/users/update-status";
export const UPDATE_USER_ROLE = "/api/users/update-role";


export const GET_TOPICS_LIST ="/api/topics";
// export const GET_TOPIC_BY_ID = "/api/topics/:id";
export const GET_TOPIC_STATISTICS = "/api/topics/stats";
export const GET_DOCTOR_LIST = "/api/users/doctors"
export const GET_DOCTOR_ASSIGNMENTS = "/api/topics/my-assignments"