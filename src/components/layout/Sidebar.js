import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MENU_ITEMS } from "../utils/helper";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
        {MENU_ITEMS.map((item) => {
          const active = isRouteActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex w-full items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  active
                    ? "bg-[#1f2937] text-white"
                    : "text-gray-300 hover:bg-[#1f2937] hover:text-white"
                }`}
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
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-5 py-5 border-t border-gray-800 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-teal-400 flex items-center justify-center text-white font-bold flex-shrink-0">
          A
        </div>

        {open && (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">Admin User</p>
            <p className="text-sm text-gray-400 truncate">Medical Reviewer</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
