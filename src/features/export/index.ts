/**
 * Email Export Feature
 *
 * Provides HTML and JSON export/import functionality for the email editor.
 * Generates email-client compatible HTML with inline CSS and table layouts.
 */

// Components
export { ExportButton } from './components/ExportButton';
export { JsonExportButton } from './components/JsonExportButton';
export { JsonImportButton } from './components/JsonImportButton';

// Utilities
export { generateEmailHtml, generateBlockHtml } from './utils/htmlGenerator';
export {
  generateInlineStyles,
  mergeStyles,
  generateButtonStyles,
  generateResponsiveWrapperStyles,
  generateTableResetStyles,
  EMAIL_SAFE_FONTS,
  EMAIL_RESET_STYLES,
  BLOCK_PRESETS,
} from './utils/cssInliner';

export type { StyleMap } from './utils/cssInliner';

// JSON Export/Import
export {
  exportToJson,
  generateJsonFilename,
  downloadJson,
  copyJsonToClipboard,
} from './utils/jsonExporter';

export {
  importFromJson,
  importFromFile,
} from './utils/jsonImporter';

export type {
  JsonImportResult,
  ValidationError,
  ValidationErrorCode,
} from './utils/jsonImporter';
