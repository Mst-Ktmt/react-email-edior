'use client';

import { useState, useRef, useEffect, useCallback, useMemo, type MouseEvent, type KeyboardEvent } from 'react';
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
    text = 'クリック',
    linkUrl = '#',
    backgroundColor = '#007bff',
    textColor = '#ffffff',
    fontSize = 16,
    padding = { top: 12, right: 24, bottom: 12, left: 24 },
    borderRadius = 4,
    align = 'center',
    width = 'auto',
    marginBottom = 0,
    // 新機能プロパティ
    hoverStyle,
    boxShadow,
    opacity,
    icon,
    backgroundGradient,
    minWidth,
    maxWidth,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  const paddingStyle = useMemo(
    () => `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    [padding.top, padding.right, padding.bottom, padding.left]
  );

  const containerAlignClass = useMemo(
    () =>
      align === 'center'
        ? 'justify-center'
        : align === 'right'
          ? 'justify-end'
          : 'justify-start',
    [align]
  );

  const buttonWidth = useMemo(
    () =>
      width === 'full'
        ? '100%'
        : width === 'auto'
          ? 'auto'
          : `${width}px`,
    [width]
  );

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

  // Box Shadow CSS生成
  const boxShadowCss = useMemo(
    () =>
      boxShadow
        ? `${boxShadow.inset ? 'inset ' : ''}${boxShadow.x}px ${boxShadow.y}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color}`
        : undefined,
    [boxShadow]
  );

  // Background CSS（グラデーションまたは単色）
  const backgroundCss = useMemo(
    () =>
      backgroundGradient
        ? backgroundGradient.type === 'linear'
          ? `linear-gradient(${backgroundGradient.angle || 90}deg, ${backgroundGradient.colors.map((c) => `${c.color} ${c.position}%`).join(', ')})`
          : `radial-gradient(circle, ${backgroundGradient.colors.map((c) => `${c.color} ${c.position}%`).join(', ')})`
        : undefined,
    [backgroundGradient]
  );

  // ボタンコンテンツ（テキスト + アイコン）
  const buttonContent = useMemo(() => {
    // アイコンがない場合は単純にテキストを返す
    if (!icon) {
      return text;
    }

    const iconElement = (() => {
      if (icon.type === 'emoji' || icon.type === 'unicode') {
        return (
          <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            {icon.content}
          </span>
        );
      }

      // SVG
      const svgSize = icon.size || 16;
      return (
        <span
          style={{ display: 'inline-block', verticalAlign: 'middle' }}
          dangerouslySetInnerHTML={{
            __html: `<svg width="${svgSize}" height="${svgSize}" fill="${icon.color || textColor}" viewBox="0 0 24 24">${icon.content}</svg>`,
          }}
        />
      );
    })();

    const textSpan = <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{text}</span>;

    if (!iconElement) return textSpan;

    const spacing = <span style={{ display: 'inline-block', width: `${icon.spacing || 0}px` }} />;

    if (icon.position === 'left') {
      return (
        <>
          {iconElement}
          {spacing}
          {textSpan}
        </>
      );
    }

    return (
      <>
        {textSpan}
        {spacing}
        {iconElement}
      </>
    );
  }, [text, icon, textColor]);

  const buttonStyle = useMemo(() => {
    const style: React.CSSProperties = {
      padding: paddingStyle,
      color: textColor,
      fontSize: `${fontSize}px`,
      borderRadius: `${borderRadius}px`,
      width: buttonWidth,
      display: 'inline-block',
      textAlign: 'center' as const,
      textDecoration: 'none',
      opacity: opacity !== undefined ? opacity : 1,
      transition: 'all 0.2s ease',
    };

    // グラデーション背景または単色背景
    if (backgroundCss) {
      style.background = backgroundCss;
    } else {
      style.backgroundColor = backgroundColor;
    }

    // オプショナルなスタイル
    if (minWidth) style.minWidth = `${minWidth}px`;
    if (maxWidth) style.maxWidth = `${maxWidth}px`;
    if (boxShadowCss) style.boxShadow = boxShadowCss;

    return style;
  }, [
    paddingStyle,
    backgroundGradient,
    backgroundColor,
    backgroundCss,
    textColor,
    fontSize,
    borderRadius,
    buttonWidth,
    minWidth,
    maxWidth,
    boxShadowCss,
    opacity,
  ]);

  // ホバー時のスタイル
  const hoverStyleCss = useMemo(() => {
    return hoverStyle
      ? {
          backgroundColor: hoverStyle.backgroundColor,
          color: hoverStyle.textColor,
          opacity: hoverStyle.opacity,
        }
      : undefined;
  }, [hoverStyle]);

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
          style={{
            ...buttonStyle,
            ...(isHovered && hoverStyleCss ? hoverStyleCss : {}),
          }}
        >
          {buttonContent}
        </a>
      )}
    </div>
  );
}
