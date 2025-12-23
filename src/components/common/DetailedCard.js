import React from "react";
import Tooltip from "./tooltip/Tooltip";

const DetailedCard = ({
  title,
  description,
  status,
  createdBy,
  createdAt,
  counts,
  onClick,
  className = "",
}) => {
  const statusClasses =
    status === "ASSIGNED"
      ? "bg-blue-100 text-blue-600 border border-blue-200"
      : status === "ACTIVE"
      ? "bg-green-100 text-green-600 border border-green-200"
      : status === "INACTIVE"
      ? "bg-gray-100 text-gray-600 border border-gray-200"
      : "bg-red-100 text-red-600 border border-red-200";

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl border border-gray-200 shadow-sm
        p-4 sm:p-5 md:p-6 transition-shadow hover:shadow-md
        ${onClick ? "cursor-pointer" : ""}
        ${className}`}
    >
      {status && (
        <span
          className={`absolute top-3 right-3 sm:top-4 sm:right-4
            inline-flex px-3 py-[2px] rounded-full text-xs font-medium whitespace-nowrap
            ${statusClasses}`}
        >
          {status.replace("_", " ")}
        </span>
      )}

      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-24 sm:pr-28 leading-snug break-words line-clamp-2">
          {title}
        </h3>
      )}

      {description && (
        <Tooltip content={ <div dangerouslySetInnerHTML={{ __html: description }} /> } position="bottom" maxWidth="max-w-sm">
          <p  dangerouslySetInnerHTML={{ __html: description }} className="mt-1 text-sm text-gray-500 line-clamp-2 break-words cursor-help leading-relaxed richtext-content" />             
        </Tooltip>
      )}

      <div className="w-full h-px bg-gray-200 my-4" />

      {(createdBy || createdAt) && (
        <p className="text-xs text-gray-500 mb-3 flex flex-wrap gap-x-1 gap-y-1">
          {createdBy && (
            <>
              Created by{" "}
              <span className="font-medium text-gray-700">
                {createdBy?.firstName} {createdBy?.lastName}
              </span>
            </>
          )}

          {createdAt && (
            <>
              <span className="mx-1">•</span>
              {new Date(createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </>
          )}
        </p>
      )}

      {/* {counts && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {counts?.scripts != null && (
            <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs text-gray-700 whitespace-nowrap">
              📄 Scripts <span className="font-semibold">{counts.scripts}</span>
            </span>
          )}

          {counts?.videos != null && (
            <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs text-gray-700 whitespace-nowrap">
              🎥 Videos <span className="font-semibold">{counts.videos}</span>
            </span>
          )}

          {counts?.doctorPointers != null && (
            <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs text-gray-700 whitespace-nowrap">
              👨‍⚕️ Doctors{" "}
              <span className="font-semibold">{counts.doctorPointers}</span>
            </span>
          )}
        </div>
      )} */}
    </div>
  );
};

export default DetailedCard;
