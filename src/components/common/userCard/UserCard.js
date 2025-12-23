import React from "react";
import { ROLE_VARIABLES_MAP } from "../../../utils/helper";

const UserCard = ({ user, onViewProfile, onEditUser }) => {

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
          {`${user?.firstName?.[0] || ""}${
            user?.lastName?.[0] || ""
          }`.toUpperCase() || user?.profile_image}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-gray-500 text-sm truncate">{user.email}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-4 py-1 rounded-full text-xs  bg-blue-100 text-blue-700 border border-blue-200">
              {user.role}
            </span>
            {user?.role === ROLE_VARIABLES_MAP?.DOCTOR_CREATOR ? <span className="px-4 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {user.specialty || "---"}
            </span> :"" }
          </div>

          <div className="w-full h-px bg-gray-200 my-4" />

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-gray-500 text-sm">CreatedAt</p>
                <p className="text-sm font-semibold text-gray-600">
                  {new Date(user?.createdAt).toLocaleDateString("en-IN", {day: "2-digit",month: "short",year: "numeric"})}
                </p>
              </div>

              <button
                onClick={() => onViewProfile(user?.id)}
                className="mt-4 w-full text-sm py-2 rounded-xl hover:text-white border border-gray-300 text-gray-900 font-medium hover:bg-teal-500 transition"
              >
                View Profile
              </button>
            </div>

            <div className="flex flex-col justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">Status</p>
                <span
                  className={`inline-flex px-3 py-[2px] rounded-full text-xs font-medium ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-500 border border-green-200"
                      : user.status === "INACTIVE"
                      ? "bg-gray-100 text-gray-500 border border-gray-200"
                      : "bg-red-100 text-red-500 border border-red-200"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <button onClick={() => onEditUser(user?.id)} className="mt-4 w-full text-sm py-2 rounded-xl border border-gray-300 text-gray-900 font-medium hover:text-white hover:bg-teal-500 transition">
                Edit Role
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
