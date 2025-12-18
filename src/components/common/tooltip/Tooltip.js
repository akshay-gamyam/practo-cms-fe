import React from "react";

const Tooltip = ({
  content,
  children,
  position = "top",
  maxWidth = "max-w-xs",
}) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block group">
      {children}

      {content && (
        <div
          className={`
            pointer-events-none absolute z-50
            ${positionClasses[position]}
            ${maxWidth}
            rounded-lg border border-gray-200
            bg-gray-900 text-white text-xs
            px-3 py-2 shadow-lg
            opacity-0 scale-95
            group-hover:opacity-100 group-hover:scale-100
            transition-all duration-150
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;