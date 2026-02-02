'use client';

import { useState, useRef, useEffect, useCallback, type MouseEvent, type KeyboardEvent } from 'react';
import type { ButtonBlockProps } from '@/types/block';
import { BlockToolbar } from './BlockToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  props: ButtonBlockProps;
  blockId?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onUpdateText?: (text: string) => void;
}

export function ButtonBlock({ props, blockId, isSelected, onClick, onUpdateText }: Props) {
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

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // 編集モード開始時にフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // textが外部から変更された場合に同期
  useEffect(() => {
    if (!isEditing) {
      setEditText(text);
    }
  }, [text, isEditing]);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // リンク遷移を防ぐ
    onClick?.();
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onUpdateText) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      const newText = editText.trim() || text; // 空文字は元に戻す
      if (newText !== text && onUpdateText) {
        onUpdateText(newText);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditText(text); // 元に戻す
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
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

  const buttonStyle = {
    padding: paddingStyle,
    backgroundColor,
    color: textColor,
    fontSize: `${fontSize}px`,
    borderRadius: `${borderRadius}px`,
    width: buttonWidth,
    display: 'inline-block',
    textAlign: 'center' as const,
    textDecoration: 'none',
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
      {isEditing ? (
        <div style={buttonStyle}>
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-center w-full"
            style={{
              color: textColor,
              fontSize: `${fontSize}px`,
            }}
          />
        </div>
      ) : (
        <a
          href={linkUrl}
          onClick={(e) => e.preventDefault()} // 編集中はリンク無効
          style={buttonStyle}
          className="hover:opacity-90 transition-opacity"
        >
          {text}
        </a>
      )}
    </div>
  );
}
