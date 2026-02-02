'use client';

import { useState, useCallback, type MouseEvent } from 'react';
import type { VideoBlockProps } from '@/types/block';
import { BlockToolbar } from './BlockToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  props: VideoBlockProps;
  blockId?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function VideoBlock({ props, blockId, isSelected, onClick }: Props) {
  const {
    videoUrl,
    thumbnailSrc,
    alt,
    width,
    align,
    padding,
    borderRadius,
    playButtonColor,
  } = props;
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
      id: `video-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'video' as const,
      props: { ...props },
    };
    addBlock(duplicatedBlock);
  }, [blockId, props, addBlock]);

  const handleDelete = useCallback(() => {
    if (!blockId) return;
    removeBlock(blockId);
  }, [blockId, removeBlock]);

  const handleVideoClick = (e: MouseEvent) => {
    // エディタ内ではリンクを開かない（プレビューモードでのみ開く）
    e.preventDefault();
  };

  const thumbnailElement = thumbnailSrc ? (
    <div className="relative" style={{ width: imageWidth }}>
      <img
        src={thumbnailSrc}
        alt={alt}
        style={{
          width: '100%',
          borderRadius: `${borderRadius}px`,
        }}
        className="max-w-full h-auto block"
      />
      {/* Play Button Overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <div
          className="w-16 h-16 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          style={{ backgroundColor: `${playButtonColor}CC` }}
        >
          <svg
            className="w-8 h-8 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        width: imageWidth,
        borderRadius: `${borderRadius}px`,
        aspectRatio: '16 / 9',
      }}
      className={`bg-gray-200 flex items-center justify-center text-gray-400 text-sm relative ${alignmentClass}`}
    >
      <div className="text-center">
        <svg
          className="w-12 h-12 mx-auto mb-2 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>サムネイルを設定してください</span>
      </div>
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
      style={{ padding: paddingStyle }}
      data-block-id={blockId}
    >
      {isHovered && blockId && (
        <BlockToolbar onDuplicate={handleDuplicate} onDelete={handleDelete} />
      )}
      <div className={`flex ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleVideoClick}
            className="block"
          >
            {thumbnailElement}
          </a>
        ) : (
          thumbnailElement
        )}
      </div>
    </div>
  );
}
