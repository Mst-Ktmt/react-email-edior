'use client';

import { useState, useCallback, type MouseEvent } from 'react';
import type { DividerBlockProps } from '@/types/block';
import { BlockToolbar } from './BlockToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  props: DividerBlockProps;
  blockId?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DividerBlock({ props, blockId, isSelected, onClick }: Props) {
  const { color, thickness, style, padding, marginBottom = 0 } = props;
  const [isHovered, setIsHovered] = useState(false);

  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDuplicate = useCallback(() => {
    if (!blockId) return;
    const duplicatedBlock = {
      id: `divider-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'divider' as const,
      props: { ...props },
    };
    addBlock(duplicatedBlock);
  }, [blockId, props, addBlock]);

  const handleDelete = useCallback(() => {
    if (!blockId) return;
    removeBlock(blockId);
  }, [blockId, removeBlock]);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isHovered && !isSelected ? 'ring-2 ring-blue-300' : ''}`}
      style={{ padding: paddingStyle, marginBottom: `${marginBottom}px` }}
      data-block-id={blockId}
    >
      {isHovered && blockId && (
        <BlockToolbar onDuplicate={handleDuplicate} onDelete={handleDelete} />
      )}
      <hr
        style={{
          borderTop: `${thickness}px ${style} ${color}`,
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          margin: 0,
        }}
      />
    </div>
  );
}
