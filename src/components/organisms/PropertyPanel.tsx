'use client';

import { useMemo, useRef, useState } from 'react';
import type {
  Block,
  SectionBlock,
  TextBlockProps,
  ImageBlockProps,
  ButtonBlockProps,
  DividerBlockProps,
  SpacerBlockProps,
  HeadingBlockProps,
  HtmlBlockProps,
  SocialBlockProps,
  MenuBlockProps,
  VideoBlockProps,
  TimerBlockProps,
  ColumnsBlockProps,
  SectionBlockProps,
  GlobalStyles,
} from '@/types';
import { isSectionBlock } from '@/types/block';
import { useDocumentStore, useHistoryStore } from '@/stores';
import { useTranslations } from '@/components/providers/LocaleProvider';
import {
  TextEditor,
  ImageEditor,
  ButtonEditor,
  DividerEditor,
  SpacerEditor,
  HeadingEditor,
  HtmlEditor,
  SocialEditor,
  MenuEditor,
  VideoEditor,
  TimerEditor,
  ColumnsEditor,
  SectionEditor,
  BodySettingsEditor,
} from '../molecules/editors';

// ========================================
// Tab Types
// ========================================

type TabType = 'blocks' | 'body';


// ========================================
// Helper Functions
// ========================================

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

// ========================================
// PropertyPanel
// ========================================

interface PropertyPanelProps {
  className?: string;
}

export function PropertyPanel({ className = '' }: PropertyPanelProps) {
  const t = useTranslations('PropertyPanel');
  const [activeTab, setActiveTab] = useState<TabType>('blocks');
  const document = useDocumentStore((state) => state.document);
  const selectedBlockId = useDocumentStore((state) => state.selectedBlockId);
  const updateBlock = useDocumentStore((state) => state.updateBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);
  const updateGlobalStyles = useDocumentStore((state) => state.updateGlobalStyles);
  const pushState = useHistoryStore((state) => state.pushState);

  // プロパティ変更時のdebounce用（最初の変更のみ履歴保存）
  const hasUnsavedChanges = useRef(false);

  const selectedBlock = useMemo(() => {
    if (!document || !selectedBlockId) return null;
    return findBlockById(document.sections, selectedBlockId);
  }, [document, selectedBlockId]);

  const handlePropsChange = (newProps: Record<string, unknown>) => {
    if (selectedBlock && document) {
      // 最初の変更時のみ履歴に保存（連続変更はスキップ）
      if (!hasUnsavedChanges.current) {
        pushState(document, 'Update block properties');
        hasUnsavedChanges.current = true;
        // 500ms後にリセット（次の独立した変更を保存可能に）
        setTimeout(() => {
          hasUnsavedChanges.current = false;
        }, 500);
      }
      updateBlock(selectedBlock.id, {
        props: { ...selectedBlock.props, ...newProps },
      } as Partial<Block>);
    }
  };

  const handleDeleteBlock = () => {
    if (selectedBlockId && document) {
      // 削除前に必ず履歴保存
      pushState(document, 'Delete block');
      removeBlock(selectedBlockId);
    }
  };

  const handleGlobalStylesChange = (updates: Partial<GlobalStyles>) => {
    if (document) {
      // 最初の変更時のみ履歴に保存
      if (!hasUnsavedChanges.current) {
        pushState(document, 'Update global styles');
        hasUnsavedChanges.current = true;
        setTimeout(() => {
          hasUnsavedChanges.current = false;
        }, 500);
      }
      updateGlobalStyles(updates);
    }
  };

  const renderEditor = () => {
    if (!selectedBlock) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          {t('selectBlock')}
        </div>
      );
    }

    switch (selectedBlock.type) {
      case 'text':
        return (
          <TextEditor
            props={selectedBlock.props as unknown as TextBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'image':
        return (
          <ImageEditor
            props={selectedBlock.props as unknown as ImageBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'button':
        return (
          <ButtonEditor
            props={selectedBlock.props as unknown as ButtonBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'divider':
        return (
          <DividerEditor
            props={selectedBlock.props as unknown as DividerBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'spacer':
        return (
          <SpacerEditor
            props={selectedBlock.props as unknown as SpacerBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'heading':
        return (
          <HeadingEditor
            props={selectedBlock.props as unknown as HeadingBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'html':
        return (
          <HtmlEditor
            props={selectedBlock.props as unknown as HtmlBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'social':
        return (
          <SocialEditor
            props={selectedBlock.props as unknown as SocialBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'menu':
        return (
          <MenuEditor
            props={selectedBlock.props as unknown as MenuBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'columns':
        return (
          <ColumnsEditor
            props={selectedBlock.props as unknown as ColumnsBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'section':
        return (
          <SectionEditor
            props={selectedBlock.props as unknown as SectionBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'video':
        return (
          <VideoEditor
            props={selectedBlock.props as unknown as VideoBlockProps}
            onChange={handlePropsChange}
          />
        );
      case 'timer':
        return (
          <TimerEditor
            props={selectedBlock.props as unknown as TimerBlockProps}
            onChange={handlePropsChange}
          />
        );
      default:
        return (
          <div className="p-4 text-gray-500 text-sm">
            {t('noEditor')}
          </div>
        );
    }
  };

  return (
    <aside
      className={`w-[300px] flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto ${className}`}
    >
      {/* Tab Header */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab('blocks')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'blocks'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('tabBlocks')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('body')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'body'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('tabBody')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'blocks' ? (
        <>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {t('title')}
                </h2>
                {selectedBlock && (
                  <p className="mt-1 text-xs text-gray-400 capitalize">
                    {selectedBlock.type} Block
                  </p>
                )}
              </div>
              {selectedBlock && (
                <button
                  type="button"
                  onClick={handleDeleteBlock}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  data-testid="delete-block-button"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          <div className="h-[calc(100%-120px)]">{renderEditor()}</div>
        </>
      ) : (
        <div className="overflow-y-auto h-[calc(100%-48px)]">
          {document ? (
            <BodySettingsEditor
              globalStyles={document.globalStyles}
              onChange={handleGlobalStylesChange}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              {t('noDocument')}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
