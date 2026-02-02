'use client';

import { useState, useRef, useEffect, useCallback, type MouseEvent, type KeyboardEvent, type FocusEvent } from 'react';
import type { TextBlockProps } from '@/types/block';
import { BlockToolbar } from './BlockToolbar';
import { RichTextToolbar } from './RichTextToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface Props {
  props: TextBlockProps;
  blockId?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onUpdateContent?: (content: string) => void;
}

export function TextBlock({ props, blockId, isSelected, onClick, onUpdateContent }: Props) {
  const {
    content,
    fontSize,
    fontFamily,
    textColor,
    textAlign,
    lineHeight,
    padding,
    backgroundColor,
    marginBottom = 0,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addBlock = useDocumentStore((state) => state.addBlock);
  const removeBlock = useDocumentStore((state) => state.removeBlock);

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

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

  // クリーンアップ: コンポーネントアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    // 編集中はクリックハンドラを無視（テキスト選択を妨げないため）
    if (isEditing) return;

    // リンクがクリックされた場合はデフォルト動作を許可
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      return; // リンクのデフォルト動作を許可
    }

    // ダブルクリック判定のため、シングルクリック処理を遅延
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      onClick?.();
      clickTimeoutRef.current = null;
    }, 200); // ダブルクリック判定時間
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.stopPropagation();
    // シングルクリックのタイマーをキャンセル
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    if (onUpdateContent) {
      setIsEditing(true);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!isEditing) return;

    // リンクモーダルが開いている場合は何もしない（フォーカス競合防止）
    if (isLinkModalOpen) return;

    // フォーカスがコンテナ内に移動する場合は編集を継続
    // （ツールバーボタンクリック時など）
    const relatedTarget = e.relatedTarget as Node | null;
    if (relatedTarget && containerRef.current?.contains(relatedTarget)) {
      // フォーカスを戻す
      setTimeout(() => editableRef.current?.focus(), 0);
      return;
    }

    // 編集終了
    finishEditing();
  };

  const handleLinkModalOpenChange = useCallback((isOpen: boolean) => {
    setIsLinkModalOpen(isOpen);
  }, []);

  const finishEditing = () => {
    setIsEditing(false);
    const newContent = editableRef.current?.innerHTML || editContent;
    if (newContent !== content && onUpdateContent) {
      onUpdateContent(newContent);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // IME変換中は何もしない
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditContent(content); // 元に戻す
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      // 現在のカーソル位置がリスト内かチェック
      const selection = window.getSelection();
      const listItem = selection?.anchorNode?.parentElement?.closest('li');

      if (listItem) {
        // リスト項目が空の場合、リストを終了
        const text = listItem.textContent?.trim() || '';
        if (text === '') {
          e.preventDefault();
          // リストから抜ける処理
          document.execCommand('outdent');
        }
        // 空でない場合はブラウザデフォルト（次のリスト項目追加）
        return;
      }

      // リスト外では改行を許可（ブラウザデフォルトの動作）
      // 編集は終了しない
    }
  };

  const handleDuplicate = useCallback(() => {
    if (!blockId) return;
    const duplicatedBlock = {
      id: `text-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'text' as const,
      props: { ...props },
    };
    addBlock(duplicatedBlock);
  }, [blockId, props, addBlock]);

  const handleDelete = useCallback(() => {
    if (!blockId) return;
    removeBlock(blockId);
  }, [blockId, removeBlock]);

  const textStyle = {
    fontSize: `${fontSize}px`,
    fontFamily,
    color: textColor,
    textAlign,
    lineHeight,
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        // 編集中はホバー状態を維持（選択中にマウスが外れても再レンダリングを防ぐ）
        if (!isEditing) {
          setIsHovered(false);
        }
      }}
      className={`relative transition-all ${
        isEditing ? 'cursor-text' : 'cursor-pointer'
      } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
        isHovered && !isSelected ? 'ring-2 ring-blue-300' : ''
      }`}
      style={{
        padding: paddingStyle,
        backgroundColor,
        marginBottom: `${marginBottom}px`,
      }}
      data-block-id={blockId}
    >
      {isHovered && blockId && !isEditing && (
        <BlockToolbar onDuplicate={handleDuplicate} onDelete={handleDelete} />
      )}
      {isEditing ? (
        <>
          <RichTextToolbar containerRef={editableRef} onLinkModalOpenChange={handleLinkModalOpenChange} />
          <style>{`
            .editing-content ol,
            .editing-content ul {
              position: relative;
              padding-left: 1.5rem;
              margin-left: 2.5rem;
            }
            .editing-content ol {
              border-left: 3px solid #374151;
            }
            .editing-content ol::before {
              content: "番号";
              position: absolute;
              left: -2.5rem;
              top: 0;
              font-size: 11px;
              font-weight: bold;
              color: #374151;
              background: #f3f4f6;
              padding: 2px 4px;
              border-radius: 2px;
            }
            .editing-content ul {
              border-left: 3px dashed #374151;
            }
            .editing-content ul::before {
              content: "箇条";
              position: absolute;
              left: -2.5rem;
              top: 0;
              font-size: 11px;
              font-weight: bold;
              color: #374151;
              background: #f3f4f6;
              padding: 2px 4px;
              border-radius: 2px;
            }
          `}</style>
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            className="editing-content"
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{
              ...textStyle,
              outline: 'none',
              minHeight: '1em',
              cursor: 'text',
              userSelect: 'text',
            }}
            dangerouslySetInnerHTML={{ __html: editContent }}
          />
        </>
      ) : (
        <div
          style={textStyle}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
