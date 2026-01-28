'use client';

/**
 * 自動保存フック
 * ドキュメントの変更を検知し、debounce後にlocalStorageへ保存
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { EmailDocument } from '@/types';
import { saveDocument, loadDocument, getLastSavedTime } from '@/utils/storage';

/** 保存状態 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** 自動保存フックのオプション */
export interface UseAutoSaveOptions {
  /** debounce時間（ミリ秒）デフォルト: 1000 */
  debounceMs?: number;
  /** 自動保存を有効にするか デフォルト: true */
  enabled?: boolean;
  /** 保存成功時のコールバック */
  onSaveSuccess?: (document: EmailDocument) => void;
  /** 保存失敗時のコールバック */
  onSaveError?: (error: string) => void;
}

/** 自動保存フックの戻り値 */
export interface UseAutoSaveReturn {
  /** 現在の保存状態 */
  status: SaveStatus;
  /** 最終保存日時 */
  lastSaved: Date | null;
  /** エラーメッセージ */
  error: string | null;
  /** 手動保存を実行 */
  saveNow: () => void;
  /** 保存済みドキュメントを復元 */
  restore: () => EmailDocument | null;
}

/**
 * 自動保存フック
 */
export function useAutoSave(
  document: EmailDocument | null,
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn {
  const {
    debounceMs = 1000,
    enabled = true,
    onSaveSuccess,
    onSaveError,
  } = options;

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(() => getLastSavedTime());
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const documentRef = useRef<EmailDocument | null>(document);

  // ドキュメントの参照を更新
  useEffect(() => {
    documentRef.current = document;
  }, [document]);

  // 保存処理
  const performSave = useCallback(() => {
    const doc = documentRef.current;
    if (!doc) {
      return;
    }

    setStatus('saving');
    setError(null);

    const result = saveDocument(doc);

    if (result.success) {
      const savedTime = new Date();
      setStatus('saved');
      setLastSaved(savedTime);
      onSaveSuccess?.(doc);

      // 2秒後にidleに戻す
      setTimeout(() => {
        setStatus((current) => (current === 'saved' ? 'idle' : current));
      }, 2000);
    } else {
      setStatus('error');
      setError(result.error);
      onSaveError?.(result.error ?? 'Unknown error');
    }
  }, [onSaveSuccess, onSaveError]);

  // 手動保存
  const saveNow = useCallback(() => {
    // 既存のdebounceをキャンセル
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    performSave();
  }, [performSave]);

  // 復元
  const restore = useCallback((): EmailDocument | null => {
    const result = loadDocument();
    if (result.success && result.data) {
      setLastSaved(getLastSavedTime());
      return result.data;
    }
    if (result.error) {
      setError(result.error);
    }
    return null;
  }, []);

  // ドキュメント変更時の自動保存
  useEffect(() => {
    if (!enabled || !document) {
      return;
    }

    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // debounce後に保存
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [document, enabled, debounceMs, performSave]);

  // 初回マウント時に最終保存日時を取得
  useEffect(() => {
    setLastSaved(getLastSavedTime());
  }, []);

  return {
    status,
    lastSaved,
    error,
    saveNow,
    restore,
  };
}
