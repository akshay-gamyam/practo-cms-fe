import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="inline-flex items-center gap-1 rounded-xl border bg-white px-2 py-2 shadow-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
                     text-gray-700 hover:bg-gray-100
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaChevronLeft size={16} />
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
                     text-gray-700 hover:bg-gray-100
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <FaChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;