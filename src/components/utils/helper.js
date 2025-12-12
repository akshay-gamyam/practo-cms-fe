import { IoDocumentTextOutline, IoHome } from "react-icons/io5";
import { ROUTES } from "../../routes/RouterConstant";
import { FiUpload } from "react-icons/fi";
import { FaRegChartBar } from "react-icons/fa";
import { PiUsers } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";


export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return token && token.trim() !== "";
};


export const MENU_ITEMS = [
  { label: "Dashboard", icon: <IoHome size={20} />, path: ROUTES.DASHBOARD },
  {
    label: "Content Library",
    icon: <IoDocumentTextOutline size={20} />,
    path: ROUTES.CONTENT_LIBRARY,
  },
  { label: "Upload", icon: <FiUpload size={20} />, path: ROUTES.UPLOAD },
  {
    label: "Review Queue",
    icon: <FaRegChartBar size={20} />,
    path: ROUTES.REVIEW_QUEUE,
  },
  { label: "Users", icon: <PiUsers size={20} />, path: ROUTES.USERS },
  { label: "Settings", icon: <CiSettings size={20} />, path: ROUTES.SETTINGS },
];