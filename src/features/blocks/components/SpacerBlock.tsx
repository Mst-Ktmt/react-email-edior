'use client';

import { useState, useCallback, type MouseEvent } from 'react';
import type { SpacerBlockProps } from '@/types/block';
import { defaultSpacerBlockProps } from '@/types/defaults';
import { BlockToolbar } from './BlockToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  id: string;
  props: SpacerBlockProps;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * SpacerBlock - Vertical spacing block
 *
 * Features:
 * - Configurable height
 * - Visual indicator in edit mode
 * - Transparent in preview/export
 */
export function SpacerBlock({
  id,
  props,
  isSelected = false,
  onClick,
}: Props) {
  const { height, marginBottom = 0 } = { ...defaultSpacerBlockProps, ...props };
  const [isHovered, setIsHovered] = useState(false);

  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDuplicate = useCallback(() => {
    if (!id) return;
    const duplicatedBlock = {
      id: `spacer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'spacer' as const,
      props: { ...props },
    };
    addBlock(duplicatedBlock);
  }, [id, props, addBlock]);

  const handleDelete = useCallback(() => {
    if (!id) return;
    removeBlock(id);
  }, [id, removeBlock]);

  return (
    <div
      data-block-id={id}
      data-block-type="spacer"
      className={`
        relative w-full
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isHovered && !isSelected ? 'ring-2 ring-blue-300' : ''}
        transition-shadow duration-150
        group
      `}
      style={{ height: `${height}px`, marginBottom: `${marginBottom}px` }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && id && (
        <BlockToolbar onDuplicate={handleDuplicate} onDelete={handleDelete} />
      )}
      {/* Visual indicator for edit mode */}
      <div
        className={`
          absolute inset-0
          flex items-center justify-center
          border-2 border-dashed
          ${isSelected ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 bg-gray-50/30'}
          group-hover:border-gray-300 group-hover:bg-gray-50/50
          transition-colors duration-150
        `}
      >
        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          {height}px
        </span>
      </div>
    </div>
  );
}

export default SpacerBlock;
