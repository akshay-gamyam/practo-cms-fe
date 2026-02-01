import React from "react";
import CustomModal from "./CustomModal";

const TextViewModal = ({ isOpen, onClose, title, content, contentType = "default" }) => {
  const getContentStyles = () => {
    switch (contentType) {
      case "rejection":
        return "text-red-700 bg-red-50 border border-red-200 rounded-lg p-4";
      case "description":
        return "text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4";
      default:
        return "text-gray-700";
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-2xl">
      <div className={getContentStyles()}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </CustomModal>
  );
};

export default TextViewModal;