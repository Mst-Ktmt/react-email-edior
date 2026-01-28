'use client';

import { useState, useCallback, type MouseEvent, type ReactNode } from 'react';
import { BlockToolbar } from './BlockToolbar';
import { useDocumentStore } from '@/stores/documentStore';
import type { Block } from '@/types/block';

interface BlockWrapperProps {
  block: Block;
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function BlockWrapper({
  block,
  isSelected,
  onClick,
  children,
  className = '',
  style,
}: BlockWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onClick?.();
    },
    [onClick]
  );

  const handleDuplicate = useCallback(() => {
    // ブロックを複製（新しいIDを生成）
    const duplicatedBlock: Block = {
      ...structuredClone(block),
      id: `${block.type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    addBlock(duplicatedBlock);
  }, [block, addBlock]);

  const handleDelete = useCallback(() => {
    removeBlock(block.id);
  }, [block.id, removeBlock]);

  return (
    <div
      className={`relative cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isHovered && !isSelected ? 'ring-2 ring-blue-300' : ''} ${className}`}
      style={style}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {isHovered && (
        <BlockToolbar onDuplicate={handleDuplicate} onDelete={handleDelete} />
      )}
      {children}
    </div>
  );
}
