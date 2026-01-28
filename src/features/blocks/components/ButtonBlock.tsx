'use client';

import { useState, useCallback, type MouseEvent } from 'react';
import type { ButtonBlockProps } from '@/types/block';
import { BlockToolbar } from './BlockToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  props: ButtonBlockProps;
  blockId?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ButtonBlock({ props, blockId, isSelected, onClick }: Props) {
  const {
    text,
    linkUrl,
    backgroundColor,
    textColor,
    fontSize,
    padding,
    borderRadius,
    align,
    width,
    marginBottom = 0,
  } = props;
  const [isHovered, setIsHovered] = useState(false);

  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

  const containerAlignClass =
    align === 'center'
      ? 'justify-center'
      : align === 'right'
        ? 'justify-end'
        : 'justify-start';

  const buttonWidth =
    width === 'full'
      ? '100%'
      : width === 'auto'
        ? 'auto'
        : `${width}px`;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDuplicate = useCallback(() => {
    if (!blockId) return;
    const duplicatedBlock = {
      id: `button-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'button' as const,
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
      className={`relative flex cursor-pointer transition-all ${containerAlignClass} ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isHovered && !isSelected ? 'ring-2 ring-blue-300' : ''}`}
      style={{ marginBottom: `${marginBottom}px` }}
      data-block-id={blockId}
    >
      {isHovered && blockId && (
        <BlockToolbar onDuplicate={handleDuplicate} onDelete={handleDelete} />
      )}
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: paddingStyle,
          backgroundColor,
          color: textColor,
          fontSize: `${fontSize}px`,
          borderRadius: `${borderRadius}px`,
          width: buttonWidth,
          display: 'inline-block',
          textAlign: 'center',
          textDecoration: 'none',
        }}
        className="hover:opacity-90 transition-opacity"
      >
        {text}
      </a>
    </div>
  );
}
