'use client';

import type { MouseEvent } from 'react';

interface BlockToolbarProps {
  onDuplicate: () => void;
  onDelete: () => void;
}

export function BlockToolbar({ onDuplicate, onDelete }: BlockToolbarProps) {
  const handleDuplicate = (e: MouseEvent) => {
    e.stopPropagation();
    onDuplicate();
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="absolute -top-8 right-0 flex gap-1 bg-white border border-gray-200 rounded-md shadow-sm p-1 z-10">
      <button
        type="button"
        onClick={handleDuplicate}
        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Duplicate block"
        aria-label="Duplicate block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Delete block"
        aria-label="Delete block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  );
}
