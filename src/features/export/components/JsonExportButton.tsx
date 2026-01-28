'use client';

import { useState } from 'react';
import type { EmailDocument } from '@/types/document';
import {
  downloadJson,
  copyJsonToClipboard,
  exportToJson,
} from '../utils/jsonExporter';

interface Props {
  document: EmailDocument | null;
  disabled?: boolean;
  className?: string;
}

type ExportMode = 'download' | 'clipboard' | 'preview';

/**
 * JSON Export Button Component
 *
 * Provides options to:
 * - Download as JSON file
 * - Copy to clipboard
 * - Preview JSON
 */
export function JsonExportButton({ document, disabled = false, className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewJson, setPreviewJson] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const isDisabled = disabled || !document;

  const handleExport = async (mode: ExportMode) => {
    if (!document) return;

    switch (mode) {
      case 'download':
        downloadJson(document);
        setIsOpen(false);
        break;

      case 'clipboard':
        try {
          await copyJsonToClipboard(document);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch {
          console.error('Failed to copy to clipboard');
        }
        break;

      case 'preview':
        const { json } = exportToJson(document);
        setPreviewJson(json);
        break;
    }
  };

  const closePreview = () => {
    setPreviewJson(null);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md
          text-sm font-medium transition-colors
          ${
            isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        <JsonIcon className="w-4 h-4" />
        Export JSON
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isDisabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                type="button"
                onClick={() => handleExport('download')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Download File
              </button>
              <button
                type="button"
                onClick={() => handleExport('clipboard')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <ClipboardIcon className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                type="button"
                onClick={() => handleExport('preview')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <EyeIcon className="w-4 h-4" />
                Preview JSON
              </button>
            </div>
          </div>
        </>
      )}

      {/* Preview Modal */}
      {previewJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">JSON Preview</h3>
              <button
                type="button"
                onClick={closePreview}
                className="p-1 rounded hover:bg-gray-100"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {previewJson}
              </pre>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button
                type="button"
                onClick={() => handleExport('clipboard')}
                className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-50"
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (document) downloadJson(document);
                  closePreview();
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function JsonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default JsonExportButton;
