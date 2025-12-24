import { IoDocumentTextOutline, IoHome } from "react-icons/io5";
import { ROUTES } from "../routes/RouterConstant";
import { FiUpload } from "react-icons/fi";
import { FaClipboardList, FaRegChartBar, FaSpinner, FaUserMd } from "react-icons/fa";
import { PiUsers } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import { MdOutlineMedicalInformation, MdOutlineTopic } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

// Google OAuth Client ID
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export const MENU_ITEMS = [
  { label: "Dashboard", icon: <IoHome size={20} />, path: ROUTES.DASHBOARD },
  {
    label: "Content Library",
    icon: <IoDocumentTextOutline size={20} />,
    path: ROUTES.CONTENT_LIBRARY,
  },
  { label: "Upload", icon: <FiUpload size={20} />, path: ROUTES.UPLOAD },
  { label: "Assigned Topics", icon: <MdOutlineTopic size={20} />, path: ROUTES.MY_TOPICS },
  { label: "Doctor Notes", icon: <MdOutlineMedicalInformation size={20} />, path: ROUTES.MY_DOCTOR_NOTES },
  { label: "Medical Topics", icon: <MdOutlineMedicalInformation size={20} />, path: ROUTES.MEDICAL_TOPICS },
  {
    label: "Review Queue",
    icon: <FaRegChartBar size={20} />,
    path: ROUTES.REVIEW_QUEUE,
  },
  { label: "Users", icon: <PiUsers size={20} />, path: ROUTES.USERS },
  { label: "Settings", icon: <CiSettings size={20} />, path: ROUTES.SETTINGS },
  { label: "Notifications", icon: <IoIosNotifications size={20} />, path: ROUTES.NOCIFICATIONS },
];

export const ROLE_DISPLAY_NAME = {
    MEDICAL_REVIEWER: "Medical Affairs",
  };


// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("access_token");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken()
  return !!token;
  // return token && token.trim() !== "";
};

// Get current user from localStorage
export const getCurrentUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Get user permissions from localStorage
export const getUserPermissions = () => {
  try {
    const permissionsStr = localStorage.getItem("permissions");
    return permissionsStr ? JSON.parse(permissionsStr) : [];
  } catch (error) {
    console.error("Error parsing permissions from localStorage:", error);
    return [];
  }
};

// Check if user has specific permission
export const hasPermission = (permission) => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (permissionList) => {
  const permissions = getUserPermissions();
  return permissionList.some((perm) => permissions.includes(perm));
};

// Check if user has all specified permissions
export const hasAllPermissions = (permissionList) => {
  const permissions = getUserPermissions();
  return permissionList.every((perm) => permissions.includes(perm));
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUserFromStorage();
  return user?.role || null;
};

// Check if user has specific role
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roleList) => {
  const userRole = getUserRole();
  return roleList.includes(userRole);
};

// Clear all auth data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("permissions");
};

// Store auth data in localStorage
export const storeAuthData = ({ token, user, permissions }) => {
  if (token) localStorage.setItem("access_token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (permissions)
    localStorage.setItem("permissions", JSON.stringify(permissions));
};

// Format user's full name
export const getUserFullName = () => {
  const user = getCurrentUserFromStorage();
  if (!user) return "";
  return user.name || `${user.firstName} ${user.lastName}`.trim();
};

// Get user initials for avatar
export const getUserInitials = () => {
  const user = getCurrentUserFromStorage();
  if (!user) return "";

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// ................type of role based list .................
export const rolesList = [
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Medical affairs", value: "MEDICAL_AFFAIRS" },
  { label: "Brand Reviewer", value: "BRAND_REVIEWER" },
  { label: "Doctor", value: "DOCTOR" },
  { label: "Agency POC", value: "AGENCY_POC" },
  { label: "Content Approver", value: "CONTENT_APPROVER" },
  // { label: "Publisher", value: "PUBLISHER" },
  // { label: "Viewer", value: "VIEWER" },
];


// ..................... change color according to status ......................

export const statusList = [
  { label: "Active", value: "ACTIVE", color: "green" },
  { label: "Inactive", value: "INACTIVE", color: "gray" },
  { label: "Suspended", value: "SUSPENDED", color: "red" },
];


// ......................... topics status style ...................
export const statusStyles = {
  ASSIGNED: "bg-blue-100 text-blue-700",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
  FINAL_REVIEW: "bg-purple-100 text-purple-700",
  PUBLISHED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};


export const buildStats = (stats) => [
  {
    title: "Total Topics",
    value: stats?.total ?? 0,
    icon: FaClipboardList,
  },
  {
    title: "Assigned Topics",
    value: stats?.byStatus?.ASSIGNED ?? 0,
    icon: FaUserMd,
  },
  {
    title: "In Progress",
    value: stats?.byStatus?.IN_PROGRESS ?? 0,
    icon: FaSpinner,
  }
];


export  const passwordFields = [
    {
      field: "current",
      label: "Current Password",
      name: "currentpassword",
      placeholder: "Enter current password"
    },
    {
      field: "new",
      label: "New Password",
      name: "newPassword",
      placeholder: "Enter new password"
    },
    {
      field: "confirm",
      label: "Confirm New Password",
      name: "confirmPassword",
      placeholder: "Confirm new password"
    }
  ];


export const ROLE_VARIABLES_MAP = {
  MEDICAL_REVIEWER: "MEDICAL_AFFAIRS",
  BRAND_REVIEWER: "BRAND_REVIEWER",
  CONTENT_APPROVER: "CONTENT_APPROVER",
  PUBLISHER: "PUBLISHER",
  DOCTOR_CREATOR: "DOCTOR",
  AGENCY_POC: "AGENCY_POC",
  SUPER_ADMIN: "SUPER_ADMIN",
};