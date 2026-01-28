'use client';

import { useState, useCallback } from 'react';
import type { EmailDocument, SectionBlock } from '@/types';
import { generateEmailHtml } from '../utils/htmlGenerator';

interface ExportResult {
  html: string;
  size: number;
  blockCount: number;
}

interface ExportButtonProps {
  document: EmailDocument | null;
  className?: string;
  onExport?: (result: ExportResult) => void;
}

/**
 * Export Button Component
 *
 * Provides HTML export functionality with preview modal option.
 */
export function ExportButton({ document, className = '', onExport }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportedHtml, setExportedHtml] = useState<string | null>(null);

  const handleExport = useCallback(() => {
    if (!document) return;

    setIsExporting(true);

    try {
      const html = generateEmailHtml(document);
      const result: ExportResult = {
        html,
        size: new Blob([html]).size,
        blockCount: countBlocks(document.sections),
      };

      setExportedHtml(html);
      onExport?.(result);
    } finally {
      setIsExporting(false);
    }
  }, [document, onExport]);

  const handleDownload = useCallback(() => {
    if (!exportedHtml || !document) return;

    const blob = new Blob([exportedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = `${document.name || 'email'}.html`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [exportedHtml, document]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!exportedHtml) return;

    try {
      await navigator.clipboard.writeText(exportedHtml);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [exportedHtml]);

  const handlePreview = useCallback(() => {
    if (!document) return;

    const html = generateEmailHtml(document);
    setExportedHtml(html);
    setShowPreview(true);
  }, [document]);

  const closePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const isDisabled = !document || document.sections.length === 0;

  return (
    <>
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleExport}
          disabled={isDisabled || isExporting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isExporting ? 'Exporting...' : 'Export HTML'}
        </button>

        <button
          type="button"
          onClick={handlePreview}
          disabled={isDisabled}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Preview
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && exportedHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">HTML Preview</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Copy HTML
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={closePreview}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Preview */}
            <div className="flex-1 overflow-auto p-6 bg-gray-100">
              <div className="bg-white shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
                <iframe
                  srcDoc={exportedHtml}
                  title="Email Preview"
                  className="w-full h-[500px] border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            {/* Modal Footer - Raw HTML */}
            <div className="px-6 py-4 border-t border-gray-200">
              <details className="group">
                <summary className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900">
                  View Raw HTML ({formatBytes(new Blob([exportedHtml]).size)})
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 text-gray-100 text-xs rounded-md overflow-auto max-h-48">
                  <code>{exportedHtml}</code>
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Count total blocks in sections
 */
function countBlocks(sections: SectionBlock[]): number {
  let count = 0;

  function countRecursive(blocks: SectionBlock[]): void {
    for (const block of blocks) {
      count++;
      if ('children' in block && block.children) {
        for (const child of block.children) {
          count++;
          if ('columns' in child) {
            const columnsBlock = child as { columns: Array<{ children: unknown[] }> };
            for (const col of columnsBlock.columns) {
              count += col.children.length;
            }
          }
        }
      }
    }
  }

  countRecursive(sections);
  return count;
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
