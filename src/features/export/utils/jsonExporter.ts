/**
 * JSON Exporter
 *
 * Exports EmailDocument to JSON format with download functionality.
 */

import type { EmailDocument, JsonExportResult } from '@/types/document';

/**
 * Export options for JSON export
 */
interface JsonExportOptions {
  /** Pretty print with indentation (default: true) */
  prettyPrint?: boolean;
  /** Indentation spaces (default: 2) */
  indentSpaces?: number;
  /** Include metadata in export (default: true) */
  includeMetadata?: boolean;
}

const DEFAULT_OPTIONS: Required<JsonExportOptions> = {
  prettyPrint: true,
  indentSpaces: 2,
  includeMetadata: true,
};

/**
 * Export document to JSON string
 */
export function exportToJson(
  document: EmailDocument,
  options: JsonExportOptions = {}
): JsonExportResult {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const exportData = mergedOptions.includeMetadata
    ? {
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0',
        document,
      }
    : document;

  const json = mergedOptions.prettyPrint
    ? JSON.stringify(exportData, null, mergedOptions.indentSpaces)
    : JSON.stringify(exportData);

  return {
    json,
    document,
  };
}

/**
 * Generate filename for JSON export
 */
export function generateJsonFilename(document: EmailDocument): string {
  const sanitizedName = document.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const timestamp = new Date().toISOString().split('T')[0];

  return `${sanitizedName || 'email-template'}-${timestamp}.json`;
}

/**
 * Download document as JSON file
 */
export function downloadJson(
  document: EmailDocument,
  options: JsonExportOptions = {}
): void {
  const { json } = exportToJson(document, options);
  const filename = generateJsonFilename(document);

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = window.document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Copy JSON to clipboard
 */
export async function copyJsonToClipboard(
  document: EmailDocument,
  options: JsonExportOptions = {}
): Promise<void> {
  const { json } = exportToJson(document, options);
  await navigator.clipboard.writeText(json);
}
