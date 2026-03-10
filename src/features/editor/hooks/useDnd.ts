'use client';

import { useState, useCallback } from 'react';
import { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useTranslations } from '@/components/providers/LocaleProvider';
import { useDocumentStore } from '@/stores/documentStore';
import { useHistoryStore } from '@/stores/historyStore';
import type { Block, SectionBlock } from '@/types/block';
import {
  defaultTextBlockProps,
  defaultImageBlockProps,
  defaultButtonBlockProps,
  defaultDividerBlockProps,
  defaultSectionBlockProps,
  defaultColumnsBlockProps,
  defaultSpacerBlockProps,
  defaultHeadingBlockProps,
  defaultHtmlBlockProps,
  defaultSocialBlockProps,
  defaultMenuBlockProps,
  defaultVideoBlockProps,
  defaultTimerBlockProps,
} from '@/types/defaults';

// 翻訳済みデフォルト値の型
interface LocalizedDefaults {
  textContent: string;
  buttonText: string;
  imageAlt: string;
}

interface UseDndReturn {
  activeId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
}

/**
 * ユニークIDを生成
 */
function generateId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * ブロックタイプに応じたデフォルトブロックを作成
 */
function createDefaultBlock(blockType: string, localizedDefaults?: LocalizedDefaults): Block | null {
  const id = generateId();

  switch (blockType) {
    case 'text':
      return {
        id,
        type: 'text',
        props: {
          ...defaultTextBlockProps,
          ...(localizedDefaults?.textContent && { content: localizedDefaults.textContent }),
        },
      };

    case 'image':
      return {
        id,
        type: 'image',
        props: {
          ...defaultImageBlockProps,
          ...(localizedDefaults?.imageAlt && { alt: localizedDefaults.imageAlt }),
        },
      };

    case 'button':
      return {
        id,
        type: 'button',
        props: {
          ...defaultButtonBlockProps,
          ...(localizedDefaults?.buttonText && { text: localizedDefaults.buttonText }),
        },
      };

    case 'divider':
      return {
        id,
        type: 'divider',
        props: { ...defaultDividerBlockProps },
      };

    case 'section':
      return {
        id,
        type: 'section',
        props: { ...defaultSectionBlockProps },
        children: [],
      } as SectionBlock;

    case 'columns':
      return {
        id,
        type: 'columns',
        props: { ...defaultColumnsBlockProps },
        columns: [
          { id: generateId(), children: [] },
          { id: generateId(), children: [] },
        ],
      };

    case 'spacer':
      return {
        id,
        type: 'spacer',
        props: { ...defaultSpacerBlockProps },
      };

    case 'heading':
      return {
        id,
        type: 'heading',
        props: { ...defaultHeadingBlockProps },
      };

    case 'html':
      return {
        id,
        type: 'html',
        props: { ...defaultHtmlBlockProps },
      };

    case 'social':
      return {
        id,
        type: 'social',
        props: { ...defaultSocialBlockProps },
      };

    case 'menu':
      return {
        id,
        type: 'menu',
        props: { ...defaultMenuBlockProps },
      };

    case 'video':
      return {
        id,
        type: 'video',
        props: { ...defaultVideoBlockProps },
      };

    case 'timer':
      return {
        id,
        type: 'timer',
        props: { ...defaultTimerBlockProps },
      };

    default:
      return null;
  }
}

export function useDnd(): UseDndReturn {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { document, addBlock, reorderBlocks, addBlockToColumn } = useDocumentStore();
  const pushState = useHistoryStore((state) => state.pushState);
  const t = useTranslations('Defaults');

  // 翻訳されたデフォルト値
  const localizedDefaults: LocalizedDefaults = {
    textContent: t('textContent'),
    buttonText: t('buttonText'),
    imageAlt: t('imageAlt'),
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) {
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;
    const overId = over.id;

    // サイドバーまたはプロパティパネルにドロップした場合はキャンセル
    if (overId === 'sidebar' || overId === 'property-panel') {
      return;
    }

    // Canvas-block to canvas-block: Reorder within section
    if (activeData?.type === 'canvas-block' && overData?.type === 'canvas-block') {
      const activeBlockId = activeData.blockId as string;
      const overBlockId = overData.blockId as string;

      if (activeBlockId === overBlockId || !document) return;

      // セクション内のブロックを並び替え
      for (const section of document.sections) {
        const oldIndex = section.children.findIndex((b) => b.id === activeBlockId);
        const newIndex = section.children.findIndex((b) => b.id === overBlockId);

        if (oldIndex !== -1 && newIndex !== -1) {
          // Undo/Redo用に現在の状態を保存
          pushState(document, 'Reorder blocks');
          reorderBlocks(section.id, oldIndex, newIndex);
          return;
        }
      }
      return;
    }

    // Block dropped from sidebar to column
    if (activeData?.type === 'sidebar-block' && String(overId).startsWith('column-')) {
      const blockType = activeData.blockType as string;
      const match = String(overId).match(/^column-(.+)-(\d+)$/);

      if (match) {
        const [, parentBlockId, columnIndexStr] = match;
        const columnIndex = parseInt(columnIndexStr, 10);

        // セクションブロックは列内に追加できない
        if (blockType === 'section') {
          return;
        }

        const newBlock = createDefaultBlock(blockType, localizedDefaults);
        if (!newBlock || !document) return;

        // Undo/Redo用に現在の状態を保存
        pushState(document, 'Add block to column');

        // 列内へブロックを追加
        addBlockToColumn(parentBlockId, columnIndex, newBlock);
        return;
      }
    }

    // Block dropped from sidebar to canvas
    if (activeData?.type === 'sidebar-block' && overId === 'canvas') {
      const blockType = activeData.blockType as string;

      // セクションブロックの場合
      if (blockType === 'section') {
        const newSection = createDefaultBlock('section', localizedDefaults);
        if (newSection) {
          // Undo/Redo用に現在の状態を保存
          if (document) {
            pushState(document, 'Add section');
          }
          addBlock(newSection);
        }
        return;
      }

      // 非セクションブロックの場合
      const newBlock = createDefaultBlock(blockType, localizedDefaults);
      if (!newBlock) return;

      // ドキュメントにセクションがない場合は自動でセクションを作成
      if (!document || document.sections.length === 0) {
        const newSection = createDefaultBlock('section', localizedDefaults) as SectionBlock;
        if (newSection) {
          newSection.children = [newBlock];
          // Undo/Redo用に現在の状態を保存（空ドキュメントでもpushState）
          if (document) {
            pushState(document, 'Add block');
          }
          addBlock(newSection);
        }
      } else {
        // Undo/Redo用に現在の状態を保存
        pushState(document, 'Add block');
        // 既存の最後のセクションに追加
        addBlock(newBlock);
      }
    }
  }, [document, addBlock, reorderBlocks, addBlockToColumn, pushState, localizedDefaults]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
