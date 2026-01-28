/**
 * Document Store - ドキュメント状態管理
 *
 * Zustandを使用したメールドキュメントの状態管理ストア
 * dnd-kit、PropertyPanelとの連携に使用
 */

import { create } from 'zustand';
import type { EmailDocument } from '@/types/document';
import type { Block, SectionBlock } from '@/types/block';
import { isSectionBlock } from '@/types/block';

// ============================================================
// Store Interface
// ============================================================

interface DocumentStore {
  /** 現在のドキュメント */
  document: EmailDocument | null;
  /** 選択中のブロックID */
  selectedBlockId: string | null;
  /** 未保存の変更があるか */
  isDirty: boolean;

  // Actions
  /** ドキュメントを設定 */
  setDocument: (doc: EmailDocument) => void;
  /** ブロックを追加 */
  addBlock: (block: Block, targetSectionId?: string) => void;
  /** ブロックを更新 */
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  /** ブロックを削除 */
  removeBlock: (blockId: string) => void;
  /** ブロックを選択 */
  selectBlock: (blockId: string | null) => void;
  /** ブロックを並べ替え */
  reorderBlocks: (sectionId: string, oldIndex: number, newIndex: number) => void;
  /** dirtyフラグを設定 */
  setDirty: (dirty: boolean) => void;
  /** グローバルスタイルを更新 */
  updateGlobalStyles: (updates: Partial<EmailDocument['globalStyles']>) => void;
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * セクション内のブロックを再帰的に検索して更新
 */
function updateBlockInSection(
  section: SectionBlock,
  blockId: string,
  updates: Partial<Block>
): SectionBlock {
  const newChildren = section.children.map((child) => {
    if (child.id === blockId) {
      return { ...child, ...updates } as Block;
    }
    if (isSectionBlock(child)) {
      return updateBlockInSection(child, blockId, updates);
    }
    return child;
  });

  return { ...section, children: newChildren };
}

/**
 * セクション内のブロックを再帰的に検索して削除
 */
function removeBlockFromSection(
  section: SectionBlock,
  blockId: string
): SectionBlock {
  const newChildren = section.children
    .filter((child) => child.id !== blockId)
    .map((child) => {
      if (isSectionBlock(child)) {
        return removeBlockFromSection(child, blockId);
      }
      return child;
    });

  return { ...section, children: newChildren };
}

/**
 * セクション内のブロックIDを検索
 */
function findBlockInSections(
  sections: SectionBlock[],
  blockId: string
): boolean {
  for (const section of sections) {
    if (section.id === blockId) return true;
    for (const child of section.children) {
      if (child.id === blockId) return true;
      if (isSectionBlock(child) && findBlockInSections([child], blockId)) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================
// Store Implementation
// ============================================================

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  document: null,
  selectedBlockId: null,
  isDirty: false,

  setDocument: (doc) => {
    set({
      document: structuredClone(doc),
      isDirty: false,
      selectedBlockId: null,
    });
  },

  addBlock: (block, targetSectionId) => {
    const { document } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    if (targetSectionId) {
      // 指定されたセクションに追加
      const sectionIndex = newDocument.sections.findIndex(
        (s) => s.id === targetSectionId
      );
      if (sectionIndex !== -1) {
        newDocument.sections[sectionIndex].children.push(block);
      }
    } else if (isSectionBlock(block)) {
      // セクションブロックならルートに追加
      newDocument.sections.push(block);
    } else if (newDocument.sections.length > 0) {
      // 最後のセクションに追加
      newDocument.sections[newDocument.sections.length - 1].children.push(block);
    }

    set({
      document: newDocument,
      isDirty: true,
    });
  },

  updateBlock: (blockId, updates) => {
    const { document } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    // セクション自体の更新
    const sectionIndex = newDocument.sections.findIndex((s) => s.id === blockId);
    if (sectionIndex !== -1) {
      newDocument.sections[sectionIndex] = {
        ...newDocument.sections[sectionIndex],
        ...updates,
      } as SectionBlock;
    } else {
      // セクション内のブロックを更新
      newDocument.sections = newDocument.sections.map((section) =>
        updateBlockInSection(section, blockId, updates)
      );
    }

    set({
      document: newDocument,
      isDirty: true,
    });
  },

  removeBlock: (blockId) => {
    const { document, selectedBlockId } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    // セクション自体の削除
    const sectionIndex = newDocument.sections.findIndex((s) => s.id === blockId);
    if (sectionIndex !== -1) {
      newDocument.sections.splice(sectionIndex, 1);
    } else {
      // セクション内のブロックを削除
      newDocument.sections = newDocument.sections.map((section) =>
        removeBlockFromSection(section, blockId)
      );
    }

    set({
      document: newDocument,
      isDirty: true,
      // 削除されたブロックが選択中なら選択解除
      selectedBlockId: selectedBlockId === blockId ? null : selectedBlockId,
    });
  },

  selectBlock: (blockId) => {
    const { document } = get();

    // blockIdがnullなら選択解除
    if (blockId === null) {
      set({ selectedBlockId: null });
      return;
    }

    // ドキュメントがない場合は何もしない
    if (!document) return;

    // ブロックが存在するか確認
    if (findBlockInSections(document.sections, blockId)) {
      set({ selectedBlockId: blockId });
    }
  },

  reorderBlocks: (sectionId, oldIndex, newIndex) => {
    const { document } = get();
    if (!document) return;
    if (oldIndex === newIndex) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    const sectionIndex = newDocument.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;

    const section = newDocument.sections[sectionIndex];
    const [movedBlock] = section.children.splice(oldIndex, 1);
    section.children.splice(newIndex, 0, movedBlock);

    set({
      document: newDocument,
      isDirty: true,
    });
  },

  setDirty: (dirty) => {
    set({ isDirty: dirty });
  },

  updateGlobalStyles: (updates) => {
    const { document } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();
    newDocument.globalStyles = {
      ...newDocument.globalStyles,
      ...updates,
    };

    set({
      document: newDocument,
      isDirty: true,
    });
  },
}));
