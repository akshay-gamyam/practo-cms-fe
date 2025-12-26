import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex justify-end items-center py-4 p-8">
      <div className=" inline-flex items-center gap-2 rounded-2xl bg-white px-2 py-2 shadow-md border">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className=" flex items-center gap-2 px-4 py-2 text-md rounded-xl text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed">
          <FaChevronLeft />
          Prev
        </button>

        {getPages().map((page, idx) =>
          page === "..." ? (
            <span
              key={idx}
              className="px-2 text-lg text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={` min-w-[34px] h-[34px] flex items-center justify-center rounded-xl text-lg font-medium
                transition ${ page === currentPage ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {page}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 text-md rounded-xl text-gray-700 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed">
          Next
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;