'use client';

import { DroppableCanvas } from '@/features/editor/components/DroppableCanvas';
import { DraggableBlock } from '@/features/editor/components/DraggableBlock';
import { usePreviewMode } from '@/hooks/usePreviewMode';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import { useTranslations } from '@/components/providers/LocaleProvider';
import type { Block, SectionBlock as SectionBlockType, ColumnsBlock as ColumnsBlockType } from '@/types/block';

// Block Components
import {
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SectionBlock,
  ColumnsBlock,
  SpacerBlock,
  HeadingBlock,
  HtmlBlock,
  SocialBlock,
  MenuBlock,
} from '@/features/blocks/components';

interface CanvasProps {
  className?: string;
}

/**
 * ブロックタイプに応じたコンポーネントをレンダリング
 */
function BlockRenderer({
  block,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlockContent,
  isPreviewMode = false,
}: {
  block: Block;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onUpdateBlockContent: (blockId: string, content: string, currentProps: Record<string, unknown>) => void;
  isPreviewMode?: boolean;
}): React.ReactNode {
  // プレビューモード時は選択状態を無効化
  const isSelected = isPreviewMode ? false : block.id === selectedBlockId;
  const handleClick = isPreviewMode ? undefined : () => onSelectBlock(block.id);

  switch (block.type) {
    case 'text':
      return (
        <TextBlock
          props={block.props}
          blockId={block.id}
          isSelected={isSelected}
          onClick={handleClick}
          onUpdateContent={(content) => onUpdateBlockContent(block.id, content, block.props as unknown as Record<string, unknown>)}
        />
      );

    case 'image':
      return (
        <ImageBlock
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );

    case 'button':
      return (
        <ButtonBlock
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );

    case 'divider':
      return (
        <DividerBlock
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );

    case 'spacer':
      return (
        <SpacerBlock
          id={block.id}
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );

    case 'section': {
      const sectionBlock = block as SectionBlockType;
      return (
        <SectionBlock
          id={block.id}
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        >
          <div className="flex flex-col gap-2">
            {sectionBlock.children.map((child) =>
              isPreviewMode ? (
                <BlockRenderer
                  key={child.id}
                  block={child}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={onSelectBlock}
                  onUpdateBlockContent={onUpdateBlockContent}
                  isPreviewMode={isPreviewMode}
                />
              ) : (
                <DraggableBlock
                  key={child.id}
                  id={child.id}
                  data={{ type: 'canvas-block', blockId: child.id }}
                >
                  <BlockRenderer
                    block={child}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={onSelectBlock}
                    onUpdateBlockContent={onUpdateBlockContent}
                    isPreviewMode={isPreviewMode}
                  />
                </DraggableBlock>
              )
            )}
          </div>
        </SectionBlock>
      );
    }

    case 'columns': {
      const columnsBlock = block as ColumnsBlockType;
      const columnChildren = columnsBlock.columns.map((column, index) => ({
        columnIndex: index,
        children: (
          <div className="flex flex-col gap-2">
            {column.children.map((child) =>
              isPreviewMode ? (
                <BlockRenderer
                  key={child.id}
                  block={child}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={onSelectBlock}
                  onUpdateBlockContent={onUpdateBlockContent}
                  isPreviewMode={isPreviewMode}
                />
              ) : (
                <DraggableBlock
                  key={child.id}
                  id={child.id}
                  data={{ type: 'canvas-block', blockId: child.id }}
                >
                  <BlockRenderer
                    block={child}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={onSelectBlock}
                    onUpdateBlockContent={onUpdateBlockContent}
                    isPreviewMode={isPreviewMode}
                  />
                </DraggableBlock>
              )
            )}
          </div>
        ),
      }));

      return (
        <ColumnsBlock
          id={block.id}
          props={block.props}
          columnChildren={columnChildren}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );
    }

    case 'heading':
      return (
        <HeadingBlock
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );

    case 'html':
      return (
        <HtmlBlock
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );

    case 'social':
      return (
        <SocialBlock
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );

    case 'menu':
      return (
        <MenuBlock
          props={block.props}
          isSelected={isSelected}
          onClick={handleClick}
        />
      );

    default:
      return null;
  }
}

/**
 * ドキュメントにブロックがあるかどうかをチェック
 * セクションが存在し、かつ少なくとも1つのセクションに子ブロックがある場合にtrueを返す
 */
function hasBlocksInDocument(document: { sections: SectionBlockType[] } | null): boolean {
  if (!document || document.sections.length === 0) {
    return false;
  }
  // いずれかのセクションに子ブロックがあればtrue
  return document.sections.some((section) => section.children.length > 0);
}

export function Canvas({ className = '' }: CanvasProps) {
  const { canvasWidth, isMobile } = usePreviewMode();
  const { document, selectedBlockId, selectBlock, updateBlock } = useDocumentStore();
  const isShowPreview = useUIStore((state) => state.isShowPreview);
  const t = useTranslations('Canvas');

  // ブロックの有無を判定
  const hasBlocks = hasBlocksInDocument(document);

  const handleSelectBlock = (blockId: string) => {
    selectBlock(blockId);
  };

  const handleUpdateBlockContent = (blockId: string, content: string, currentProps: Record<string, unknown>) => {
    updateBlock(blockId, { props: { ...currentProps, content } } as Partial<Block>);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // クリックがキャンバス直接（ブロック以外）の場合、選択解除
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  return (
    <main className={`flex-1 overflow-auto bg-gray-100 ${className}`}>
      <div className="flex justify-center py-8">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isMobile ? 'rounded-[2rem] border-8 border-gray-800 p-2' : ''
          }`}
        >
          {isShowPreview ? (
            /* プレビューモード：ドラッグ無効、選択枠非表示 */
            <div
              style={{ width: `${canvasWidth}px` }}
              className="min-h-[400px] bg-white shadow-lg transition-all duration-300"
            >
              <div className="min-h-[400px]">
                {document?.sections.map((section) => (
                  <BlockRenderer
                    key={section.id}
                    block={section}
                    selectedBlockId={null}
                    onSelectBlock={() => {}}
                    onUpdateBlockContent={() => {}}
                    isPreviewMode={true}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* 編集モード：通常のドラッグ&ドロップ */
            <DroppableCanvas
              id="canvas"
              style={{ width: `${canvasWidth}px` }}
              className="min-h-[400px] bg-white shadow-lg transition-all duration-300"
            >
              {({ isOver }) => (
                <div onClick={handleCanvasClick} className="min-h-[400px] flex flex-col gap-2 p-2">
                  {document?.sections.map((section) => (
                    <DraggableBlock
                      key={section.id}
                      id={section.id}
                      data={{ type: 'canvas-block', blockId: section.id }}
                    >
                      <BlockRenderer
                        block={section}
                        selectedBlockId={selectedBlockId}
                        onSelectBlock={handleSelectBlock}
                        onUpdateBlockContent={handleUpdateBlockContent}
                        isPreviewMode={false}
                      />
                    </DraggableBlock>
                  ))}

                  {!hasBlocks && (
                    <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400 text-sm">
                      {isOver ? t('dropHere') : t('dragBlocksHere')}
                    </div>
                  )}
                </div>
              )}
            </DroppableCanvas>
          )}
        </div>
      </div>
    </main>
  );
}
