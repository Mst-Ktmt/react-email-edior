'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ToolbarButton } from './ToolbarButton';

const COLOR_PRESETS = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#FF0000',
  '#FF6600',
  '#FFCC00',
  '#33CC00',
  '#0066FF',
  '#6633FF',
  '#CC00CC',
  '#FFFFFF',
];

interface ColorPalettePopoverProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
  title?: string;
  icon: ReactNode;
  testId?: string;
}

const isValidHex = (hex: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(hex);

export function ColorPalettePopover({
  currentColor,
  onColorChange,
  disabled = false,
  title = 'Color',
  icon,
  testId,
}: ColorPalettePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(currentColor);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(currentColor);
  }, [currentColor]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    setIsOpen(false);
  };

  const handleHexSubmit = () => {
    const normalized = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
    if (isValidHex(normalized)) {
      onColorChange(normalized.toUpperCase());
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleHexSubmit();
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        isActive={isOpen}
        title={title}
        data-testid={testId}
      >
        <span className="flex flex-col items-center">
          {icon}
          <span
            className="w-4 h-1 rounded-sm mt-0.5"
            style={{ backgroundColor: currentColor }}
          />
        </span>
      </ToolbarButton>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-50 w-40"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-4 gap-1 mb-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-6 h-6 rounded border ${
                  currentColor.toUpperCase() === color.toUpperCase()
                    ? 'ring-2 ring-blue-500'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
                data-testid={`color-${color}`}
              />
            ))}
          </div>

          <div className="border-t border-gray-200 pt-2">
            <label className="text-xs text-gray-500 mb-1 block">HEX</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="#000000"
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                data-testid="hex-input"
              />
              <button
                type="button"
                onClick={handleHexSubmit}
                disabled={!isValidHex(hexInput.startsWith('#') ? hexInput : `#${hexInput}`)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                data-testid="hex-submit"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
