/**
 * localStorage ユーティリティ
 * メールエディタのドキュメント保存・復元
 */

import type { EmailDocument } from '@/types';

/** ストレージキー */
const STORAGE_KEY = 'email-editor-document';

/** 最終保存日時のキー */
const LAST_SAVED_KEY = 'email-editor-last-saved';

/**
 * ストレージ操作の結果
 */
export interface StorageResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/**
 * ドキュメントをlocalStorageに保存
 */
export function saveDocument(document: EmailDocument): StorageResult<EmailDocument> {
  try {
    const serialized = JSON.stringify(document);
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(LAST_SAVED_KEY, new Date().toISOString());
    return {
      success: true,
      data: document,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: null,
      error: `Failed to save document: ${message}`,
    };
  }
}

/**
 * localStorageからドキュメントを復元
 */
export function loadDocument(): StorageResult<EmailDocument> {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return {
        success: true,
        data: null,
        error: null,
      };
    }
    const document = JSON.parse(serialized) as EmailDocument;
    return {
      success: true,
      data: document,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: null,
      error: `Failed to load document: ${message}`,
    };
  }
}

/**
 * localStorageからドキュメントを削除
 */
export function clearDocument(): StorageResult<null> {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SAVED_KEY);
    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: null,
      error: `Failed to clear document: ${message}`,
    };
  }
}

/**
 * 最終保存日時を取得
 */
export function getLastSavedTime(): Date | null {
  try {
    const timestamp = localStorage.getItem(LAST_SAVED_KEY);
    if (!timestamp) {
      return null;
    }
    return new Date(timestamp);
  } catch {
    return null;
  }
}

/**
 * ドキュメントが存在するか確認
 */
export function hasStoredDocument(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
