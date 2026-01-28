/**
 * ユーティリティのエントリーポイント
 */

export {
  saveDocument,
  loadDocument,
  clearDocument,
  getLastSavedTime,
  hasStoredDocument,
} from './storage';
export type { StorageResult } from './storage';
