'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';

interface LinkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
}

export function LinkInputModal({ isOpen, onClose, onSubmit, initialUrl = 'https://' }: LinkInputModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      // より長いディレイでフォーカス競合を回避
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialUrl]);

  const handleSubmit = () => {
    if (url && url !== 'https://') {
      onSubmit(url);
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl p-6 w-[400px] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
        data-testid="link-input-modal"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          リンクを挿入
        </h2>

        <div className="mb-4">
          <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-2">
            URL
          </label>
          <input
            ref={inputRef}
            id="link-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            data-testid="link-input-url"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            キャンセル
            <span className="ml-2 text-xs text-gray-400 border border-gray-300 rounded px-1">ESC</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!url || url === 'https://'}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            挿入
            <span className="ml-2 text-xs opacity-75">↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}
