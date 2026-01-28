'use client';

import { usePreviewMode } from '@/hooks/usePreviewMode';

interface PreviewToggleProps {
  className?: string;
}

export function PreviewToggle({ className = '' }: PreviewToggleProps) {
  const { previewMode, setPreviewMode, isDesktop, isMobile } = usePreviewMode();

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 ${className}`}
    >
      <button
        type="button"
        onClick={() => setPreviewMode('desktop')}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          isDesktop
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Desktop preview"
        aria-pressed={isDesktop}
      >
        <DesktopIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Desktop</span>
      </button>
      <button
        type="button"
        onClick={() => setPreviewMode('mobile')}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          isMobile
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Mobile preview"
        aria-pressed={isMobile}
      >
        <MobileIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Mobile</span>
      </button>
    </div>
  );
}

function DesktopIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function MobileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}
