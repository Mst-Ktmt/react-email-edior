/**
 * useHistory Hook - Undo/Redoキーボードショートカット
 *
 * Ctrl+Z / Cmd+Z: Undo
 * Ctrl+Shift+Z / Cmd+Shift+Z: Redo
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useHistoryStore } from '@/stores/historyStore';
import type { EmailDocument } from '@/types';

interface UseHistoryOptions {
  /** 現在のドキュメント */
  document: EmailDocument | null;
  /** ドキュメントを更新するコールバック */
  onDocumentChange: (document: EmailDocument) => void;
  /** キーボードショートカットを有効にするか */
  enableKeyboardShortcuts?: boolean;
}

interface UseHistoryReturn {
  /** Undoが可能か */
  canUndo: boolean;
  /** Redoが可能か */
  canRedo: boolean;
  /** Undo実行 */
  undo: () => void;
  /** Redo実行 */
  redo: () => void;
  /** 状態を履歴に保存 */
  saveState: (description: string) => void;
  /** 履歴をクリア */
  clearHistory: () => void;
}

export function useHistory({
  document,
  onDocumentChange,
  enableKeyboardShortcuts = true,
}: UseHistoryOptions): UseHistoryReturn {
  const {
    canUndo,
    canRedo,
    pushState,
    undo: storeUndo,
    redo: storeRedo,
    clear,
  } = useHistoryStore();

  // 状態を履歴に保存
  const saveState = useCallback(
    (description: string) => {
      if (document) {
        pushState(document, description);
      }
    },
    [document, pushState]
  );

  // Undo実行
  const undo = useCallback(() => {
    if (!document || !canUndo) return;
    const previousDocument = storeUndo(document);
    if (previousDocument) {
      onDocumentChange(previousDocument);
    }
  }, [document, canUndo, storeUndo, onDocumentChange]);

  // Redo実行
  const redo = useCallback(() => {
    if (!document || !canRedo) return;
    const nextDocument = storeRedo(document);
    if (nextDocument) {
      onDocumentChange(nextDocument);
    }
  }, [document, canRedo, storeRedo, onDocumentChange]);

  // 履歴クリア
  const clearHistory = useCallback(() => {
    clear();
  }, [clear]);

  // キーボードショートカット
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      if (!modifierKey) return;

      // Undo: Ctrl+Z / Cmd+Z
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z
      if (e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }

      // Redo: Ctrl+Y (Windows alternative)
      if (e.key === 'y' && !isMac) {
        e.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, undo, redo]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    saveState,
    clearHistory,
  };
}
