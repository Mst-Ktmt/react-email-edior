/**
 * Save/Load Design Utilities
 * デザインの保存・読み込みロジック
 */

import type { EmailDocument } from '@/types';

// ============================================================
// Types
// ============================================================

/** 保存形式のバージョン */
export const SAVE_FORMAT_VERSION = '1.0';

/** ローカルストレージのキー */
const STORAGE_KEY = 'email-editor-design';

/** 保存されるデザインデータの形式 */
export interface SavedDesign {
  version: string;
  savedAt: string;
  document: EmailDocument;
}

/** 操作結果 */
export interface SaveLoadResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// ============================================================
// Save Functions
// ============================================================

/**
 * デザインデータを作成
 */
export function createSavedDesign(document: EmailDocument): SavedDesign {
  return {
    version: SAVE_FORMAT_VERSION,
    savedAt: new Date().toISOString(),
    document,
  };
}

/**
 * JSONファイルとしてダウンロード
 */
export function downloadDesign(document: EmailDocument): void {
  const savedDesign = createSavedDesign(document);
  const json = JSON.stringify(savedDesign, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = globalThis.document.createElement('a');
  link.href = url;
  link.download = `${document.name || 'email-design'}_${formatDateForFilename(new Date())}.json`;
  globalThis.document.body.appendChild(link);
  link.click();
  globalThis.document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * ローカルストレージに保存
 */
export function saveToLocalStorage(document: EmailDocument): SaveLoadResult<SavedDesign> {
  try {
    const savedDesign = createSavedDesign(document);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesign));
    return {
      success: true,
      data: savedDesign,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: null,
      error: `Failed to save: ${message}`,
    };
  }
}

// ============================================================
// Load Functions
// ============================================================

/**
 * JSONファイルからデザインを読み込み
 */
export async function loadFromFile(file: File): Promise<SaveLoadResult<EmailDocument>> {
  try {
    const text = await file.text();
    return parseDesignJson(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: null,
      error: `Failed to read file: ${message}`,
    };
  }
}

/**
 * ローカルストレージからデザインを復元
 */
export function loadFromLocalStorage(): SaveLoadResult<EmailDocument> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        success: true,
        data: null,
        error: null,
      };
    }
    return parseDesignJson(stored);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: null,
      error: `Failed to load: ${message}`,
    };
  }
}

/**
 * ローカルストレージにデザインがあるか確認
 */
export function hasStoredDesign(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * ローカルストレージの保存情報を取得
 */
export function getStoredDesignInfo(): { savedAt: Date; name: string } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as SavedDesign;
    return {
      savedAt: new Date(parsed.savedAt),
      name: parsed.document.name,
    };
  } catch {
    return null;
  }
}

/**
 * ローカルストレージのデザインを削除
 */
export function clearStoredDesign(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ============================================================
// Internal Helpers
// ============================================================

/**
 * JSONをパースしてデザインを取得
 */
function parseDesignJson(json: string): SaveLoadResult<EmailDocument> {
  try {
    const parsed = JSON.parse(json);

    // SavedDesign形式かどうかをチェック
    if (parsed.version && parsed.document) {
      // 新形式（version付き）
      const savedDesign = parsed as SavedDesign;
      if (!validateDocument(savedDesign.document)) {
        return {
          success: false,
          data: null,
          error: 'Invalid document structure',
        };
      }
      return {
        success: true,
        data: savedDesign.document,
        error: null,
      };
    }

    // 旧形式（EmailDocument直接）
    if (parsed.id && parsed.sections) {
      if (!validateDocument(parsed)) {
        return {
          success: false,
          data: null,
          error: 'Invalid document structure',
        };
      }
      return {
        success: true,
        data: parsed as EmailDocument,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: 'Unknown JSON format',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: null,
      error: `Invalid JSON: ${message}`,
    };
  }
}

/**
 * ドキュメントの基本検証
 */
function validateDocument(doc: unknown): doc is EmailDocument {
  if (!doc || typeof doc !== 'object') return false;
  const d = doc as Record<string, unknown>;
  return (
    typeof d.id === 'string' &&
    typeof d.name === 'string' &&
    Array.isArray(d.sections) &&
    d.globalStyles !== undefined
  );
}

/**
 * ファイル名用の日時フォーマット
 */
function formatDateForFilename(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}`;
}
