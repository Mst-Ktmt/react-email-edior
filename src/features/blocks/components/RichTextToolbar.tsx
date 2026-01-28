'use client';

import { useState, useEffect, useCallback } from 'react';

interface RichTextToolbarProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  superscript: boolean;
  subscript: boolean;
}

// よく使う絵文字リスト
const EMOJI_LIST = ['😀', '😊', '👍', '❤️', '🎉', '✨', '🔥', '💡', '📧', '✅'];

export function RichTextToolbar({ containerRef }: RichTextToolbarProps) {
  const [hasSelection, setHasSelection] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    superscript: false,
    subscript: false,
  });

  // 選択状態とフォーマット状態を更新
  const updateState = useCallback(() => {
    const selection = window.getSelection();
    const hasText = selection && selection.toString().length > 0;
    setHasSelection(!!hasText);

    // 現在のフォーマット状態を取得
    setFormatState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      superscript: document.queryCommandState('superscript'),
      subscript: document.queryCommandState('subscript'),
    });
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', updateState);
    return () => {
      document.removeEventListener('selectionchange', updateState);
    };
  }, [updateState]);

  const execCommand = (command: string, value?: string) => {
    // フォーカスを維持
    containerRef.current?.focus();
    document.execCommand(command, false, value);
    updateState();
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleStrikeThrough = () => execCommand('strikeThrough');
  const handleSuperscript = () => execCommand('superscript');
  const handleSubscript = () => execCommand('subscript');

  const handleEmojiClick = (emoji: string) => {
    containerRef.current?.focus();
    document.execCommand('insertText', false, emoji);
    setShowEmojiPicker(false);
    updateState();
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;

    const url = prompt('Enter URL:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const buttonClass = (isActive: boolean, disabled: boolean) =>
    `px-2 py-1 text-sm font-medium rounded transition-colors ${
      disabled
        ? 'text-gray-300 cursor-not-allowed'
        : isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <div
      className="absolute -top-10 left-0 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-lg px-2 py-1 z-50"
      onMouseDown={(e) => e.preventDefault()} // フォーカス喪失を防ぐ
    >
      <button
        type="button"
        onClick={handleBold}
        disabled={!hasSelection}
        className={buttonClass(formatState.bold, !hasSelection)}
        title="Bold (Ctrl+B)"
        data-testid="toolbar-bold"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        type="button"
        onClick={handleItalic}
        disabled={!hasSelection}
        className={buttonClass(formatState.italic, !hasSelection)}
        title="Italic (Ctrl+I)"
        data-testid="toolbar-italic"
      >
        <span className="italic">I</span>
      </button>
      <button
        type="button"
        onClick={handleUnderline}
        disabled={!hasSelection}
        className={buttonClass(formatState.underline, !hasSelection)}
        title="Underline (Ctrl+U)"
        data-testid="toolbar-underline"
      >
        <span className="underline">U</span>
      </button>
      <button
        type="button"
        onClick={handleStrikeThrough}
        disabled={!hasSelection}
        className={buttonClass(formatState.strikeThrough, !hasSelection)}
        title="Strikethrough"
        data-testid="toolbar-strikethrough"
      >
        <span className="line-through">S</span>
      </button>
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={handleLink}
        disabled={!hasSelection}
        className={buttonClass(false, !hasSelection)}
        title="Insert Link"
        data-testid="toolbar-link"
      >
        🔗
      </button>
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={handleSuperscript}
        disabled={!hasSelection}
        className={buttonClass(formatState.superscript, !hasSelection)}
        title="Superscript"
        data-testid="toolbar-superscript"
      >
        <span className="text-xs">x<sup>2</sup></span>
      </button>
      <button
        type="button"
        onClick={handleSubscript}
        disabled={!hasSelection}
        className={buttonClass(formatState.subscript, !hasSelection)}
        title="Subscript"
        data-testid="toolbar-subscript"
      >
        <span className="text-xs">x<sub>2</sub></span>
      </button>
      <div className="w-px h-5 bg-gray-300 mx-1" />
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={buttonClass(showEmojiPicker, false)}
          title="Insert Emoji"
          data-testid="toolbar-emoji"
        >
          😀
        </button>
        {showEmojiPicker && (
          <div
            className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-50"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-5 gap-1">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                  data-testid={`emoji-${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
