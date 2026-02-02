'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ToolbarButton,
  ToolbarDivider,
  ColorPalettePopover,
  FontSizeDropdown,
  applyFontSize,
  EmojiPicker,
  LinkInputModal,
} from './toolbar';

interface RichTextToolbarProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onLinkModalOpenChange?: (isOpen: boolean) => void;
}

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  superscript: boolean;
  subscript: boolean;
  orderedList: boolean;
  unorderedList: boolean;
}

export function RichTextToolbar({ containerRef, onLinkModalOpenChange }: RichTextToolbarProps) {
  const [hasSelection, setHasSelection] = useState(false);
  const [currentTextColor, setCurrentTextColor] = useState('#000000');
  const [currentBgColor, setCurrentBgColor] = useState('#FFFF00');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    superscript: false,
    subscript: false,
    orderedList: false,
    unorderedList: false,
  });

  const updateState = useCallback(() => {
    const selection = window.getSelection();
    const hasText = selection && selection.toString().length > 0;
    setHasSelection(!!hasText);

    setFormatState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      superscript: document.queryCommandState('superscript'),
      subscript: document.queryCommandState('subscript'),
      orderedList: document.queryCommandState('insertOrderedList'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
    });

    const color = document.queryCommandValue('foreColor');
    if (color) {
      const hexColor = rgbToHex(color);
      if (hexColor) {
        setCurrentTextColor(hexColor);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', updateState);
    document.addEventListener('mouseup', updateState);
    return () => {
      document.removeEventListener('selectionchange', updateState);
      document.removeEventListener('mouseup', updateState);
    };
  }, [updateState]);

  const execCommand = (command: string, value?: string) => {
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

  const handleTextColorChange = (color: string) => {
    execCommand('foreColor', color);
    setCurrentTextColor(color);
  };

  const handleHighlightChange = (color: string) => {
    containerRef.current?.focus();
    const success = document.execCommand('hiliteColor', false, color);
    if (!success) {
      document.execCommand('backColor', false, color);
    }
    setCurrentBgColor(color);
    updateState();
  };

  const handleFontSizeChange = (size: string) => {
    containerRef.current?.focus();
    applyFontSize(size);
    updateState();
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;

    // 選択範囲を保存してからモーダルを開く
    if (selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    }
    setShowLinkModal(true);
    onLinkModalOpenChange?.(true);
  };

  const handleLinkSubmit = (url: string) => {
    if (!savedRange) return;

    // 保存した選択範囲を復元
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(savedRange);

    containerRef.current?.focus();

    // リンクを作成
    document.execCommand('createLink', false, url);

    // 作成したリンクに target="_blank" と rel="noopener noreferrer" を追加
    const links = containerRef.current?.querySelectorAll('a');
    links?.forEach((link) => {
      if (link.href === url && !link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    setSavedRange(null);
    updateState();
  };

  const handleUnorderedList = () => execCommand('insertUnorderedList');
  const handleOrderedList = () => execCommand('insertOrderedList');
  const handleRemoveFormat = () => execCommand('removeFormat');

  const handleEmojiSelect = (emoji: string) => {
    containerRef.current?.focus();
    document.execCommand('insertText', false, emoji);
    updateState();
  };

  return (
    <>
    <LinkInputModal
      isOpen={showLinkModal}
      onClose={() => {
        setShowLinkModal(false);
        setSavedRange(null);
        onLinkModalOpenChange?.(false);
      }}
      onSubmit={handleLinkSubmit}
    />
    <div
      className="absolute -top-10 left-0 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-lg px-2 py-1 z-50"
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Basic formatting */}
      <ToolbarButton
        onClick={handleBold}
        disabled={!hasSelection}
        isActive={formatState.bold}
        title="Bold (Ctrl+B)"
        data-testid="toolbar-bold"
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={handleItalic}
        disabled={!hasSelection}
        isActive={formatState.italic}
        title="Italic (Ctrl+I)"
        data-testid="toolbar-italic"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={handleUnderline}
        disabled={!hasSelection}
        isActive={formatState.underline}
        title="Underline (Ctrl+U)"
        data-testid="toolbar-underline"
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={handleStrikeThrough}
        disabled={!hasSelection}
        isActive={formatState.strikeThrough}
        title="Strikethrough"
        data-testid="toolbar-strikethrough"
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Color controls */}
      <ColorPalettePopover
        currentColor={currentTextColor}
        onColorChange={handleTextColorChange}
        disabled={!hasSelection}
        title="Text Color"
        icon={<span className="font-bold text-sm">A</span>}
        testId="toolbar-text-color"
      />
      <ColorPalettePopover
        currentColor={currentBgColor}
        onColorChange={handleHighlightChange}
        disabled={!hasSelection}
        title="Highlight"
        icon={<span className="text-sm">🖍</span>}
        testId="toolbar-highlight"
      />

      <ToolbarDivider />

      {/* Font size */}
      <FontSizeDropdown onSizeChange={handleFontSizeChange} disabled={!hasSelection} />

      <ToolbarDivider />

      {/* Link */}
      <ToolbarButton
        onClick={handleLink}
        disabled={!hasSelection}
        title="Insert Link"
        data-testid="toolbar-link"
      >
        🔗
      </ToolbarButton>

      {/* Lists */}
      <ToolbarButton
        onClick={handleUnorderedList}
        isActive={formatState.unorderedList}
        title="Bullet List"
        data-testid="toolbar-unordered-list"
      >
        •
      </ToolbarButton>
      <ToolbarButton
        onClick={handleOrderedList}
        isActive={formatState.orderedList}
        title="Numbered List"
        data-testid="toolbar-ordered-list"
      >
        1.
      </ToolbarButton>

      <ToolbarDivider />

      {/* Superscript / Subscript */}
      <ToolbarButton
        onClick={handleSuperscript}
        disabled={!hasSelection}
        isActive={formatState.superscript}
        title="Superscript"
        data-testid="toolbar-superscript"
      >
        <span className="text-xs">
          x<sup>2</sup>
        </span>
      </ToolbarButton>
      <ToolbarButton
        onClick={handleSubscript}
        disabled={!hasSelection}
        isActive={formatState.subscript}
        title="Subscript"
        data-testid="toolbar-subscript"
      >
        <span className="text-xs">
          x<sub>2</sub>
        </span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Emoji */}
      <EmojiPicker onEmojiSelect={handleEmojiSelect} />

      {/* Remove format */}
      <ToolbarButton
        onClick={handleRemoveFormat}
        disabled={!hasSelection}
        title="Clear Formatting"
        data-testid="toolbar-remove-format"
      >
        ⊘
      </ToolbarButton>
    </div>
    </>
  );
}

function rgbToHex(color: string): string | null {
  if (color.startsWith('#')) {
    return color.toUpperCase();
  }

  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }

  return null;
}
