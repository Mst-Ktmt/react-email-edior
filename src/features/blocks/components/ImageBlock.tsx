'use client';

import { useState, useCallback, type MouseEvent } from 'react';
import type { ImageBlockProps } from '@/types/block';
import { BlockToolbar } from './BlockToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  props: ImageBlockProps;
  blockId?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ImageBlock({ props, blockId, isSelected, onClick }: Props) {
  const { src, alt, width, linkUrl, align, padding, borderRadius, marginBottom = 0 } = props;
  const [isHovered, setIsHovered] = useState(false);

  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

  const alignmentClass =
    align === 'center'
      ? 'mx-auto'
      : align === 'right'
        ? 'ml-auto'
        : '';

  const imageWidth = typeof width === 'number' ? `${width}px` : width;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDuplicate = useCallback(() => {
    if (!blockId) return;
    const duplicatedBlock = {
      id: `image-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'image' as const,
      props: { ...props },
    };
    addBlock(duplicatedBlock);
  }, [blockId, props, addBlock]);

  const handleDelete = useCallback(() => {
    if (!blockId) return;
    removeBlock(blockId);
  }, [blockId, removeBlock]);

  const imageElement = src ? (
    <img
      src={src}
      alt={alt}
      style={{
        width: imageWidth,
        borderRadius: `${borderRadius}px`,
      }}
      className={`max-w-full h-auto ${alignmentClass}`}
    />
  ) : (
    <div
      style={{
        width: imageWidth,
        borderRadius: `${borderRadius}px`,
        aspectRatio: '16 / 9',
      }}
      className={`bg-gray-200 flex items-center justify-center text-gray-400 text-sm ${alignmentClass}`}
    >
      画像を設定してください
    </div>
  );

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
      {linkUrl ? (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
    </div>
  );
}
