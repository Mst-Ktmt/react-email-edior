/**
 * Document Store - ドキュメント状態管理
 *
 * Zustandを使用したメールドキュメントの状態管理ストア
 * dnd-kit、PropertyPanelとの連携に使用
 */

import { create } from 'zustand';
import type { EmailDocument } from '@/types/document';
import type { Block, SectionBlock, ColumnsBlock as ColumnsBlockType, LeafBlock } from '@/types/block';
import { isSectionBlock, isColumnsBlock } from '@/types/block';

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
  /** 列内へブロックを追加 */
  addBlockToColumn: (parentBlockId: string, columnIndex: number, block: Block) => void;
  /** 指定位置にブロックを挿入 */
  insertBlockAt: (parentId: string, targetBlockId: string, position: 'before' | 'after', block: Block, columnIndex?: number) => void;
  /** 指定位置にセクションを挿入 */
  insertSectionAt: (targetSectionId: string, position: 'before' | 'after', section: SectionBlock) => void;
  /** セクションを指定位置に移動 */
  moveSectionToPosition: (activeSectionId: string, targetSectionId: string, position: 'before' | 'after') => void;
  /** ブロックを指定位置に移動 */
  moveBlockToPosition: (activeBlockId: string, parentId: string, targetBlockId: string, position: 'before' | 'after', columnIndex?: number) => void;
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
    // ColumnsBlock内のブロックを更新
    if (isColumnsBlock(child)) {
      const newColumns = child.columns.map((column) => ({
        ...column,
        children: column.children.map((columnChild) =>
          columnChild.id === blockId
            ? ({ ...columnChild, ...updates } as typeof columnChild)
            : columnChild
        ),
      }));
      return { ...child, columns: newColumns };
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
      // ColumnsBlock内のブロックを削除
      if (isColumnsBlock(child)) {
        const newColumns = child.columns.map((column) => ({
          ...column,
          children: column.children.filter((columnChild) => columnChild.id !== blockId),
        }));
        return { ...child, columns: newColumns };
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
      // ColumnsBlock内のブロックを検索
      if (isColumnsBlock(child)) {
        for (const column of child.columns) {
          for (const columnChild of column.children) {
            if (columnChild.id === blockId) return true;
          }
        }
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

  addBlockToColumn: (parentBlockId, columnIndex, block) => {
    const { document } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    // 再帰的にColumnsBlockを検索して更新
    const findAndUpdateBlock = (currentBlock: Block): Block => {
      if (currentBlock.id === parentBlockId && isColumnsBlock(currentBlock)) {
        const updatedColumns = [...currentBlock.columns];
        if (updatedColumns[columnIndex]) {
          updatedColumns[columnIndex] = {
            ...updatedColumns[columnIndex],
            children: [...updatedColumns[columnIndex].children, block as LeafBlock],
          };
        }
        return { ...currentBlock, columns: updatedColumns };
      }

      // SectionBlockの場合、子要素を再帰的に探索
      if (isSectionBlock(currentBlock)) {
        const updatedChildren = currentBlock.children.map((child) =>
          findAndUpdateBlock(child)
        );
        return { ...currentBlock, children: updatedChildren };
      }

      return currentBlock;
    };

    newDocument.sections = newDocument.sections.map((section) =>
      findAndUpdateBlock(section) as SectionBlock
    );

    set({
      document: newDocument,
      isDirty: true,
      selectedBlockId: block.id,
    });
  },

  insertBlockAt: (parentId, targetBlockId, position, block, columnIndex) => {
    const { document } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    // セクション内に挿入
    if (columnIndex === undefined) {
      const findAndInsert = (section: SectionBlock): SectionBlock => {
        if (section.id === parentId) {
          const targetIndex = section.children.findIndex((child) => child.id === targetBlockId);
          if (targetIndex !== -1) {
            const newChildren = [...section.children];
            const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
            newChildren.splice(insertIndex, 0, block);
            return { ...section, children: newChildren };
          }
        }

        // 再帰的に探索
        const newChildren = section.children.map((child) => {
          if (isSectionBlock(child)) {
            return findAndInsert(child);
          }
          return child;
        });

        return { ...section, children: newChildren };
      };

      newDocument.sections = newDocument.sections.map((section) =>
        findAndInsert(section)
      );
    } else {
      // 列内に挿入
      const findAndInsertInColumn = (currentBlock: Block): Block => {
        if (currentBlock.id === parentId && isColumnsBlock(currentBlock)) {
          const updatedColumns = [...currentBlock.columns];
          if (updatedColumns[columnIndex]) {
            const targetIndex = updatedColumns[columnIndex].children.findIndex(
              (child) => child.id === targetBlockId
            );
            if (targetIndex !== -1) {
              const newChildren = [...updatedColumns[columnIndex].children];
              const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
              newChildren.splice(insertIndex, 0, block as LeafBlock);
              updatedColumns[columnIndex] = {
                ...updatedColumns[columnIndex],
                children: newChildren,
              };
            }
          }
          return { ...currentBlock, columns: updatedColumns };
        }

        // SectionBlockの場合、子要素を再帰的に探索
        if (isSectionBlock(currentBlock)) {
          const updatedChildren = currentBlock.children.map((child) =>
            findAndInsertInColumn(child)
          );
          return { ...currentBlock, children: updatedChildren };
        }

        return currentBlock;
      };

      newDocument.sections = newDocument.sections.map((section) =>
        findAndInsertInColumn(section) as SectionBlock
      );
    }

    set({
      document: newDocument,
      isDirty: true,
      selectedBlockId: block.id,
    });
  },

  insertSectionAt: (targetSectionId, position, section) => {
    const { document } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    const targetIndex = newDocument.sections.findIndex((s) => s.id === targetSectionId);
    if (targetIndex !== -1) {
      const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
      newDocument.sections.splice(insertIndex, 0, section);
    }

    set({
      document: newDocument,
      isDirty: true,
      selectedBlockId: section.id,
    });
  },

  moveSectionToPosition: (activeSectionId: string, targetSectionId: string, position: 'before' | 'after') => {
    const { document } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    // アクティブなセクションを見つけて削除
    const activeIndex = newDocument.sections.findIndex((s) => s.id === activeSectionId);
    if (activeIndex === -1) return;

    const [movedSection] = newDocument.sections.splice(activeIndex, 1);

    // ターゲット位置を再計算（削除後のインデックスを考慮）
    const targetIndex = newDocument.sections.findIndex((s) => s.id === targetSectionId);
    if (targetIndex === -1) return;

    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
    newDocument.sections.splice(insertIndex, 0, movedSection);

    set({
      document: newDocument,
      isDirty: true,
      selectedBlockId: activeSectionId,
    });
  },

  moveBlockToPosition: (activeBlockId: string, parentId: string, targetBlockId: string, position: 'before' | 'after', columnIndex?: number) => {
    const { document } = get();
    if (!document) return;

    const newDocument = structuredClone(document);
    newDocument.updatedAt = new Date().toISOString();

    // アクティブなブロックを見つけて削除
    let movedBlock: Block | null = null;

    const removeBlock = (section: SectionBlock): SectionBlock => {
      // セクション直下のブロックをチェック
      const blockIndex = section.children.findIndex((child) => child.id === activeBlockId);
      if (blockIndex !== -1) {
        [movedBlock] = section.children.splice(blockIndex, 1);
        return section;
      }

      // ColumnsBlock内のブロックをチェック
      const newChildren = section.children.map((child) => {
        if (isColumnsBlock(child)) {
          const newColumns = child.columns.map((column) => {
            const colBlockIndex = column.children.findIndex((colChild) => colChild.id === activeBlockId);
            if (colBlockIndex !== -1) {
              [movedBlock] = column.children.splice(colBlockIndex, 1) as [Block];
            }
            return column;
          });
          return { ...child, columns: newColumns };
        }
        return child;
      });

      return { ...section, children: newChildren };
    };

    newDocument.sections = newDocument.sections.map((section) => removeBlock(section));

    if (!movedBlock) return;

    // ターゲット位置に挿入
    if (columnIndex === undefined) {
      // セクション内に挿入
      const findAndInsert = (section: SectionBlock): SectionBlock => {
        if (section.id === parentId) {
          const targetIndex = section.children.findIndex((child) => child.id === targetBlockId);
          if (targetIndex !== -1) {
            const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
            section.children.splice(insertIndex, 0, movedBlock!);
          }
        }
        return section;
      };

      newDocument.sections = newDocument.sections.map((section) => findAndInsert(section));
    } else {
      // 列内に挿入
      const findAndInsertInColumn = (currentBlock: Block): Block => {
        if (currentBlock.id === parentId && isColumnsBlock(currentBlock)) {
          const updatedColumns = [...currentBlock.columns];
          if (updatedColumns[columnIndex]) {
            const targetIndex = updatedColumns[columnIndex].children.findIndex(
              (child) => child.id === targetBlockId
            );
            if (targetIndex !== -1) {
              const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
              updatedColumns[columnIndex].children.splice(insertIndex, 0, movedBlock as LeafBlock);
            }
          }
          return { ...currentBlock, columns: updatedColumns };
        }

        if (isSectionBlock(currentBlock)) {
          const updatedChildren = currentBlock.children.map((child) => findAndInsertInColumn(child));
          return { ...currentBlock, children: updatedChildren };
        }

        return currentBlock;
      };

      newDocument.sections = newDocument.sections.map((section) =>
        findAndInsertInColumn(section) as SectionBlock
      );
    }

    set({
      document: newDocument,
      isDirty: true,
      selectedBlockId: activeBlockId,
    });
  },
}));
