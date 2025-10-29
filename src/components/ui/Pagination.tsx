"use client";

import React from "react";

interface PaginationProps {
  totalItems: number;
  pageSize?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const range = (start: number, end: number): number[] => {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
};

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize = 10,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const pages =
    totalPages <= 7
      ? range(1, totalPages)
      : currentPage <= 4
      ? [...range(1, 5), -1, totalPages]
      : currentPage >= totalPages - 3
      ? [1, -1, ...range(totalPages - 4, totalPages)]
      : [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];

  return (
    <nav
      className="flex items-center justify-center space-x-1"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pages.map((p, idx) =>
        p === -1 ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-sm rounded-md ${
              p === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
