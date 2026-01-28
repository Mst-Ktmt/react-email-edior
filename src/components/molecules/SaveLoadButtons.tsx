/**
 * SaveLoadButtons - Save Design / Load Design ボタン
 *
 * デザインの保存・読み込み機能を提供
 * - JSONファイルとしてダウンロード
 * - ローカルストレージに保存
 * - JSONファイルからアップロード
 * - ローカルストレージから復元
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { EmailDocument } from '@/types';
import {
  downloadDesign,
  saveToLocalStorage,
  loadFromFile,
  loadFromLocalStorage,
  hasStoredDesign,
  getStoredDesignInfo,
} from '@/utils/saveLoad';

interface SaveLoadButtonsProps {
  document: EmailDocument | null;
  onLoad: (document: EmailDocument) => void;
  disabled?: boolean;
}

export function SaveLoadButtons({ document, onLoad, disabled = false }: SaveLoadButtonsProps) {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [storedInfo, setStoredInfo] = useState<{ savedAt: Date; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSaveDisabled = disabled || !document;

  // ストレージ情報を更新
  useEffect(() => {
    setStoredInfo(getStoredDesignInfo());
  }, [isSaveOpen, isLoadOpen]);

  // JSON ダウンロード
  const handleDownload = useCallback(() => {
    if (!document) return;
    downloadDesign(document);
    setIsSaveOpen(false);
  }, [document]);

  // ローカルストレージに保存
  const handleSaveToStorage = useCallback(() => {
    if (!document) return;
    const result = saveToLocalStorage(document);
    if (result.success) {
      setSaveSuccess(true);
      setStoredInfo(getStoredDesignInfo());
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaveOpen(false);
      }, 1500);
    }
  }, [document]);

  // ファイルから読み込み
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadError(null);
    const result = await loadFromFile(file);

    if (result.success && result.data) {
      onLoad(result.data);
      setIsLoadOpen(false);
    } else {
      setLoadError(result.error ?? 'Failed to load file');
    }

    // リセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onLoad]);

  // ローカルストレージから復元
  const handleLoadFromStorage = useCallback(() => {
    setLoadError(null);
    const result = loadFromLocalStorage();

    if (result.success && result.data) {
      onLoad(result.data);
      setIsLoadOpen(false);
    } else if (result.error) {
      setLoadError(result.error);
    } else {
      setLoadError('No saved design found');
    }
  }, [onLoad]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatSavedAt = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Save Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsSaveOpen(!isSaveOpen);
            setIsLoadOpen(false);
          }}
          disabled={isSaveDisabled}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            ${isSaveDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }
          `}
        >
          <SaveIcon className="w-4 h-4" />
          Save
        </button>

        {/* Save Dropdown */}
        {isSaveOpen && !isSaveDisabled && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsSaveOpen(false)} />
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
              <div className="py-1">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <DownloadIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Download JSON</div>
                    <div className="text-xs text-gray-500">Save to file</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleSaveToStorage}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <StorageIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {saveSuccess ? 'Saved!' : 'Save to Browser'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {storedInfo
                        ? `Last: ${formatSavedAt(storedInfo.savedAt)}`
                        : 'Auto-restore on reload'
                      }
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Load Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsLoadOpen(!isLoadOpen);
            setIsSaveOpen(false);
            setLoadError(null);
          }}
          disabled={disabled}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            ${disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <LoadIcon className="w-4 h-4" />
          Load
        </button>

        {/* Load Dropdown */}
        {isLoadOpen && !disabled && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsLoadOpen(false)} />
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
              <div className="py-1">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <UploadIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Upload JSON</div>
                    <div className="text-xs text-gray-500">Load from file</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleLoadFromStorage}
                  disabled={!hasStoredDesign()}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                    hasStoredDesign()
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <StorageIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Restore from Browser</div>
                    <div className="text-xs text-gray-500">
                      {storedInfo
                        ? `"${storedInfo.name}" - ${formatSavedAt(storedInfo.savedAt)}`
                        : 'No saved design'
                      }
                    </div>
                  </div>
                </button>

                {/* Error Message */}
                {loadError && (
                  <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-gray-100">
                    {loadError}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Icons
// ============================================================

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}

function LoadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function StorageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}

export default SaveLoadButtons;
