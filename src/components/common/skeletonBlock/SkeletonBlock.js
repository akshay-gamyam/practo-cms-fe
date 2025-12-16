import React from "react";

const SkeletonBlock = ({
  lines = 3,
  lineHeight = "h-4",
  title = true,
  titleWidth = "w-3/4",
  lineWidths = [],
  showCard = false,
  cardHeight = "h-28",
  avatar = false,
  avatarSize = "h-10 w-10",
  className = "",
}) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {title && (
        <div className={`bg-gray-200 rounded ${titleWidth} h-7`} />
      )}

      {avatar ? (
        <div className="flex gap-4 items-start">
          <div className={`bg-gray-200 rounded-full ${avatarSize}`} />

          <div className="flex-1 space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={`bg-gray-200 rounded ${lineHeight} ${
                  lineWidths[index] || "w-full"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`bg-gray-200 rounded ${lineHeight} ${
              lineWidths[index] || "w-full"
            }`}
          />
        ))
      )}

      {showCard && (
        <div className={`bg-gray-200 rounded ${cardHeight}`} />
      )}
    </div>
  );
};

export default SkeletonBlock;