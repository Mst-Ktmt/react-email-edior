/**
 * History Store - Undo/Redo管理
 *
 * Zustandを使用したUndo/Redo履歴管理ストア
 */

import { create } from 'zustand';
import type { EmailDocument, HistoryEntry } from '@/types';

// ============================================================
// Constants
// ============================================================

/** 履歴の最大保持数 */
const MAX_HISTORY_SIZE = 50;

// ============================================================
// Store Interface
// ============================================================

interface HistoryStore {
  /** 過去の状態スタック */
  past: HistoryEntry[];
  /** 未来の状態スタック（Undo後にRedo可能） */
  future: HistoryEntry[];

  // Computed
  /** Undoが可能か */
  canUndo: boolean;
  /** Redoが可能か */
  canRedo: boolean;

  // Actions
  /** 新しい状態を記録 */
  pushState: (document: EmailDocument, description: string) => void;
  /** 1つ前の状態に戻る（現在の状態を返す） */
  undo: (currentDocument: EmailDocument) => EmailDocument | null;
  /** 1つ先の状態に進む（現在の状態を返す） */
  redo: (currentDocument: EmailDocument) => EmailDocument | null;
  /** 履歴をクリア */
  clear: () => void;
}

// ============================================================
// Store Implementation
// ============================================================

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  pushState: (document, description) => {
    const entry: HistoryEntry = {
      document: structuredClone(document),
      timestamp: new Date().toISOString(),
      description,
    };

    set((state) => {
      const newPast = [...state.past, entry];
      // 最大サイズを超えたら古いものを削除
      if (newPast.length > MAX_HISTORY_SIZE) {
        newPast.shift();
      }

      return {
        past: newPast,
        future: [], // 新しい操作をしたらfutureはクリア
        canUndo: newPast.length > 0,
        canRedo: false,
      };
    });
  },

  undo: (currentDocument) => {
    const { past, future } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    // 現在の状態をfutureに追加
    const currentEntry: HistoryEntry = {
      document: structuredClone(currentDocument),
      timestamp: new Date().toISOString(),
      description: 'Undo',
    };

    set({
      past: newPast,
      future: [currentEntry, ...future],
      canUndo: newPast.length > 0,
      canRedo: true,
    });

    return structuredClone(previous.document);
  },

  redo: (currentDocument) => {
    const { past, future } = get();
    if (future.length === 0) return null;

    const next = future[0];
    const newFuture = future.slice(1);

    // 現在の状態をpastに追加
    const currentEntry: HistoryEntry = {
      document: structuredClone(currentDocument),
      timestamp: new Date().toISOString(),
      description: 'Redo',
    };

    set({
      past: [...past, currentEntry],
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });

    return structuredClone(next.document);
  },

  clear: () => {
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    });
  },
}));
