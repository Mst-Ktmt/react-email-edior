'use client';

import { useState } from 'react';

export interface EmojiPickerProps {
  value?: string;
  onChange: (emoji: string) => void;
}

// プリセット絵文字リスト
const PRESET_EMOJIS = [
  '→', '←', '↓', '↑',
  '✓', '✕', '★', '♥',
  '📧', '📞', '🛒', '💳',
  '⬇', '⬆', '▶', '◀',
  '🎯', '🔥', '💡', '⚡',
  '📌', '🔔', '🎁', '🏆',
];

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [customEmoji, setCustomEmoji] = useState(value || '');

  return (
    <div className="space-y-3">
      {/* Preset Grid */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Preset Emojis
        </label>
        <div className="grid grid-cols-8 gap-2">
          {PRESET_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange(emoji)}
              className={`
                p-2 text-lg border rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${value === emoji ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}
              `}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">
          Custom Emoji/Unicode
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customEmoji}
            onChange={(e) => setCustomEmoji(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter emoji or unicode..."
          />
          <button
            type="button"
            onClick={() => {
              if (customEmoji.trim()) {
                onChange(customEmoji.trim());
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
