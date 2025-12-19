import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;