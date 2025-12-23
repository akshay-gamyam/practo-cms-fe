import React from "react";
import { IoClose } from "react-icons/io5";

const CustomModal = ({ isOpen, onClose, title, children ,  maxWidth = "max-w-lg",}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className={`bg-white w-full ${maxWidth} rounded-2xl shadow-lg relative`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 p-[2px] hover:bg-gray-300 rounded-xl bg-gray-200 hover:text-gray-800"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;