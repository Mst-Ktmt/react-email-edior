'use client';

import { useState, useRef, useEffect, useCallback, type MouseEvent, type KeyboardEvent, type JSX } from 'react';
import type { HeadingBlockProps, HeadingLevel } from '@/types/block';
import { BlockToolbar } from './BlockToolbar';
import { RichTextToolbar } from './RichTextToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  props: HeadingBlockProps;
  blockId?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onUpdateContent?: (content: string) => void;
}

const HEADING_TAGS: Record<HeadingLevel, keyof JSX.IntrinsicElements> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

export function HeadingBlock({ props, blockId, isSelected, onClick, onUpdateContent }: Props) {
  const {
    content,
    level,
    fontSize,
    fontFamily,
    textColor,
    textAlign,
    padding,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isHovered, setIsHovered] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
  const HeadingTag = HEADING_TAGS[level];

  // 編集モード開始時にフォーカス
  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      // カーソルを末尾に移動
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  // contentが外部から変更された場合に同期
  useEffect(() => {
    if (!isEditing) {
      setEditContent(content);
    }
  }, [content, isEditing]);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onUpdateContent) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      const newContent = editableRef.current?.innerHTML || editContent;
      if (newContent !== content && onUpdateContent) {
        onUpdateContent(newContent);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditContent(content); // 元に戻す
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  const handleDuplicate = useCallback(() => {
    if (!blockId) return;
    const duplicatedBlock = {
      id: `heading-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'heading' as const,
      props: { ...props },
    };
    addBlock(duplicatedBlock);
  }, [blockId, props, addBlock]);

  const handleDelete = useCallback(() => {
    if (!blockId) return;
    removeBlock(blockId);
  }, [blockId, removeBlock]);

  const headingStyle = {
    fontSize: `${fontSize}px`,
    fontFamily,
    fontWeight: props.fontWeight ?? '700',
    color: textColor,
    textAlign,
    lineHeight: props.lineHeight ?? 1.2,
    letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined,
    margin: 0,
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isHovered && !isSelected ? 'ring-2 ring-blue-300' : ''}`}
      style={{
        padding: paddingStyle,
        backgroundColor: props.backgroundColor || 'transparent',
        marginBottom: `${props.marginBottom ?? 0}px`,
      }}
      data-block-id={blockId}
    >
      {isHovered && blockId && (
        <BlockToolbar onDuplicate={handleDuplicate} onDelete={handleDelete} />
      )}
      {isEditing ? (
        <>
          <RichTextToolbar containerRef={editableRef} />
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              ...headingStyle,
              outline: 'none',
              minHeight: '1em',
            }}
            dangerouslySetInnerHTML={{ __html: editContent }}
          />
        </>
      ) : (
        <HeadingTag style={headingStyle}>
          {content}
        </HeadingTag>
      )}
    </div>
  );
}
