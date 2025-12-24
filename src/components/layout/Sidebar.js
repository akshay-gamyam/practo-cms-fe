import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MENU_ITEMS, ROLE_VARIABLES_MAP } from "../../utils/helper";
import { revertAll } from "../../redux/reducer/revertStateReducer/RevertStateReducer";
import { persistor } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { BiLogOut } from "react-icons/bi";
import { ROUTES } from "../../routes/RouterConstant";
import { ROLE_ACCESS } from "../../utils/roleAccess";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const allowedRoutes = ROLE_ACCESS[user?.role] || [];

  const filteredMenuItems = MENU_ITEMS.filter((item) =>
    allowedRoutes.includes(item.path)
  );

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const isRouteActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    return "A";
  };

  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.firstName && user?.lastName)
      return `${user.firstName} ${user.lastName}`;
    return "Admin User";
  };

  const getUserRole = () => {
    if (user?.role) {
      return user.role
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ");
    }
    return "Super Admin";
  };

  const handleLogout = async () => {
    try {
      dispatch(revertAll());
      await persistor.purge();
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={`h-screen bg-[#111827] text-gray-300 flex flex-col transition-all duration-300 border-r border-gray-800 flex-shrink-0
      ${open ? "w-64" : "w-20"}`}
    >
      <div className="px-5 py-6 border-b border-gray-800 flex justify-between items-center">
        {open && (
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold">
              <span className="text-[#3b82f6]">Practo</span>{" "}
              <span className="text-[#60a5fa]">HUB CMS</span>
            </h1>
            <p className="text-sm text-gray-400">Content Management</p>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="hover:text-white transition-colors"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <FaChevronLeft size={22} /> : <FaChevronRight size={22} />}
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-3 flex-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const active = isRouteActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex w-full items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                ${ active ? "bg-[#1f2937] text-white" : "text-gray-300 hover:bg-[#1f2937] hover:text-white"}`
              }
              aria-current={active ? "page" : undefined}
            >
              <div className="min-w-[24px] flex justify-center">
                {item.icon}
              </div>

              <span
                className={`text-[15px] font-medium whitespace-nowrap transition-all duration-200 
                ${
                  open
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-3 w-0 overflow-hidden"
                }`}
              >
                {user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR &&
                item.label === "My Topics"
                  ? "Doctor Notes"
                  : item.label}
                {/* {item.label} */}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 mb-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-gray-300 hover:bg-red-900/20 hover:text-red-400 border border-transparent hover:border-red-800"
        >
          <div className="min-w-[24px] flex justify-center">
            <BiLogOut size={24} />
          </div>

          <span
            className={`text-[15px] font-medium whitespace-nowrap transition-all duration-200 
            ${
              open
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-3 w-0 overflow-hidden"
            }`}
          >
            Logout
          </span>
        </button>
      </div>

      <div className="mt-auto px-5 py-5 border-t border-gray-800">
        <button
          onClick={() => handleNavigate(ROUTES.USER_PROFILE)}
          className="flex items-center gap-3 w-full hover:bg-[#1f2937] p-2 rounded-lg transition-all"
        >
          <div className="h-12 w-12 rounded-full bg-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0">
            {getInitials()}
          </div>

          {open && (
            <div className="flex-1 min-w-0 text-left">
              <p className="font-medium text-white truncate">{getUserName()}</p>
              <p className="text-sm text-gray-400 truncate">{getUserRole()}</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;