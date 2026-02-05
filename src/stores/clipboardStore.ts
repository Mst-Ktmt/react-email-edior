/**
 * Clipboard Store - クリップボード状態管理
 *
 * ブロックのコピー&ペースト機能を提供
 */

import { create } from 'zustand';
import type { Block } from '@/types/block';

// ============================================================
// Store Interface
// ============================================================

interface ClipboardStore {
  /** コピーされたブロック（ディープコピー） */
  copiedBlock: Block | null;

  // Actions
  /** ブロックをコピー */
  copyBlock: (block: Block) => void;
  /** クリップボードをクリア */
  clear: () => void;
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * ブロックに新しいIDを割り当てる（再帰的）
 */
function assignNewIds(block: Block): Block {
  const newId = `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const clonedBlock = { ...block, id: newId };

  if (block.type === 'section') {
    return {
      ...clonedBlock,
      children: block.children.map((child) => assignNewIds(child)),
    } as Block;
  }

  if (block.type === 'columns') {
    return {
      ...clonedBlock,
      columns: block.columns.map((column) => ({
        ...column,
        id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        children: column.children.map((child) => assignNewIds(child)),
      })),
    } as Block;
  }

  return clonedBlock;
}

// ============================================================
// Store Implementation
// ============================================================

export const useClipboardStore = create<ClipboardStore>((set) => ({
  copiedBlock: null,

  copyBlock: (block) => {
    // ディープコピーして新しいIDを割り当て
    const clonedBlock = assignNewIds(structuredClone(block));
    set({ copiedBlock: clonedBlock });
  },

  clear: () => {
    set({ copiedBlock: null });
  },
}));
