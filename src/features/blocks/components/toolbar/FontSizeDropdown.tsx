'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolbarButton } from './ToolbarButton';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];

interface FontSizeDropdownProps {
  onSizeChange: (size: string) => void;
  disabled?: boolean;
}

export function FontSizeDropdown({ onSizeChange, disabled = false }: FontSizeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSize, setCurrentSize] = useState('16px');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSizeSelect = (size: string) => {
    setCurrentSize(size);
    onSizeChange(size);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        isActive={isOpen}
        title="Font Size"
        data-testid="toolbar-fontsize"
        className="min-w-[44px]"
      >
        <span className="flex items-center gap-0.5">
          <span className="text-xs">{parseInt(currentSize)}</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </ToolbarButton>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 min-w-[60px]"
          onMouseDown={(e) => e.preventDefault()}
        >
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeSelect(size)}
              className={`w-full px-3 py-1 text-left text-sm hover:bg-gray-100 ${
                currentSize === size ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
              data-testid={`fontsize-${size}`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Selection APIを使用してフォントサイズを適用
 * execCommandの制限を回避するためのヘルパー関数
 */
export function applyFontSize(size: string): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.toString().length === 0) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.fontSize = size;
  span.appendChild(range.extractContents());
  range.insertNode(span);

  // 選択を維持
  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  selection.addRange(newRange);
}
