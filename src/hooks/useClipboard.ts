/**
 * useClipboard Hook - コピー&ペーストキーボードショートカット
 *
 * Ctrl+C / Cmd+C: コピー
 * Ctrl+V / Cmd+V: ペースト
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useClipboardStore } from '@/stores/clipboardStore';
import { useDocumentStore, useHistoryStore } from '@/stores';
import type { Block, SectionBlock } from '@/types/block';
import { isSectionBlock } from '@/types/block';

interface UseClipboardOptions {
  /** キーボードショートカットを有効にするか */
  enableKeyboardShortcuts?: boolean;
}

interface UseClipboardReturn {
  /** コピーされたブロックがあるか */
  hasCopiedBlock: boolean;
  /** コピー実行 */
  copy: () => void;
  /** ペースト実行 */
  paste: () => void;
}

/**
 * セクション配列からブロックを検索
 */
function findBlockById(sections: SectionBlock[], blockId: string): Block | null {
  for (const section of sections) {
    if (section.id === blockId) return section;
    for (const child of section.children) {
      if (child.id === blockId) return child;
      if (isSectionBlock(child)) {
        const found = findBlockById([child], blockId);
        if (found) return found;
      }
    }
  }
  return null;
}

/**
 * ブロックが属するセクションIDを取得
 */
function findParentSectionId(sections: SectionBlock[], blockId: string): string | null {
  for (const section of sections) {
    if (section.id === blockId) return null; // セクション自体の場合
    for (const child of section.children) {
      if (child.id === blockId) return section.id;
      if (isSectionBlock(child)) {
        const parentId = findParentSectionId([child], blockId);
        if (parentId) return parentId;
      }
    }
  }
  return null;
}

export function useClipboard({
  enableKeyboardShortcuts = true,
}: UseClipboardOptions = {}): UseClipboardReturn {
  const { copiedBlock, copyBlock } = useClipboardStore();
  const document = useDocumentStore((state) => state.document);
  const selectedBlockId = useDocumentStore((state) => state.selectedBlockId);
  const addBlock = useDocumentStore((state) => state.addBlock);
  const pushState = useHistoryStore((state) => state.pushState);

  // コピー実行
  const copy = useCallback(() => {
    if (!document || !selectedBlockId) return;

    const block = findBlockById(document.sections, selectedBlockId);
    if (block) {
      copyBlock(block);
    }
  }, [document, selectedBlockId, copyBlock]);

  // ペースト実行
  const paste = useCallback(() => {
    if (!document || !copiedBlock) return;

    // 履歴に保存
    pushState(document, 'Paste block');

    // 新しいIDを割り当てたコピーを取得
    const newBlock = structuredClone(copiedBlock);
    // 新しいユニークIDを割り当て
    const assignNewId = (block: Block): Block => {
      const newId = `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      if (block.type === 'section') {
        return {
          ...block,
          id: newId,
          children: block.children.map(assignNewId),
        } as Block;
      }
      if (block.type === 'columns') {
        return {
          ...block,
          id: newId,
          columns: block.columns.map((col) => ({
            ...col,
            id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            children: col.children.map(assignNewId),
          })),
        } as Block;
      }
      return { ...block, id: newId };
    };

    const blockToAdd = assignNewId(newBlock);

    // 選択中のブロックがあればそのセクションに追加、なければ最後のセクションに追加
    if (selectedBlockId) {
      const parentSectionId = findParentSectionId(document.sections, selectedBlockId);
      if (parentSectionId) {
        addBlock(blockToAdd, parentSectionId);
      } else if (isSectionBlock(blockToAdd)) {
        // セクションブロックの場合はルートに追加
        addBlock(blockToAdd);
      } else if (document.sections.length > 0) {
        // 選択がセクション自体の場合、そのセクションに追加
        addBlock(blockToAdd, selectedBlockId);
      }
    } else if (document.sections.length > 0) {
      // 選択なしの場合は最後のセクションに追加
      const lastSection = document.sections[document.sections.length - 1];
      addBlock(blockToAdd, lastSection.id);
    }
  }, [document, copiedBlock, selectedBlockId, addBlock, pushState]);

  // キーボードショートカット
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 入力フィールドにフォーカスがある場合は無視
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      if (!modifierKey) return;

      // Copy: Ctrl+C / Cmd+C
      if (e.key === 'c' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        copy();
        return;
      }

      // Paste: Ctrl+V / Cmd+V
      if (e.key === 'v' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        paste();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, copy, paste]);

  return {
    hasCopiedBlock: copiedBlock !== null,
    copy,
    paste,
  };
}
