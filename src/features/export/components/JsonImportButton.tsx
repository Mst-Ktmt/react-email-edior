'use client';

import { useRef, useState } from 'react';
import type { EmailDocument } from '@/types/document';
import { importFromFile, importFromJson, ValidationError } from '../utils/jsonImporter';

interface Props {
  onImport: (document: EmailDocument) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * JSON Import Button Component
 *
 * Provides options to:
 * - Upload JSON file
 * - Paste JSON from clipboard
 */
export function JsonImportButton({ onImport, disabled = false, className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPasteMode, setIsPasteMode] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);

    const result = await importFromFile(file);

    if (result.success && result.document) {
      onImport(result.document);
      setIsOpen(false);
      resetState();
    } else {
      setErrors(result.errors);
    }

    setIsProcessing(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteImport = () => {
    if (!pasteContent.trim()) {
      setErrors([{ path: '', message: 'Please paste JSON content', code: 'INVALID_JSON' }]);
      return;
    }

    setIsProcessing(true);
    setErrors([]);

    const result = importFromJson(pasteContent);

    if (result.success && result.document) {
      onImport(result.document);
      setIsOpen(false);
      resetState();
    } else {
      setErrors(result.errors);
    }

    setIsProcessing(false);
  };

  const resetState = () => {
    setPasteContent('');
    setErrors([]);
    setIsPasteMode(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Main Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md
          text-sm font-medium transition-colors
          ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <UploadIcon className="w-4 h-4" />
        Import JSON
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && !isPasteMode && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              resetState();
            }}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                type="button"
                onClick={openFileDialog}
                disabled={isProcessing}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FileIcon className="w-4 h-4" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setIsPasteMode(true)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <PasteIcon className="w-4 h-4" />
                Paste JSON
              </button>
            </div>
          </div>
        </>
      )}

      {/* Paste Modal */}
      {isPasteMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Paste JSON</h3>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  resetState();
                }}
                className="p-1 rounded hover:bg-gray-100"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder="Paste your JSON here..."
                className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Validation Errors:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                    {errors.slice(0, 5).map((error, index) => (
                      <li key={index}>
                        {error.path ? `${error.path}: ` : ''}
                        {error.message}
                      </li>
                    ))}
                    {errors.length > 5 && (
                      <li>...and {errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  resetState();
                }}
                className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePasteImport}
                disabled={isProcessing || !pasteContent.trim()}
                className={`
                  px-4 py-2 text-sm text-white rounded-md
                  ${
                    isProcessing || !pasteContent.trim()
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                {isProcessing ? 'Processing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function PasteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
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

export default JsonImportButton;
