'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolbarButton } from './ToolbarButton';

interface EmojiCategory {
  name: string;
  icon: string;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: 'Smileys',
    icon: '😀',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋'],
  },
  {
    name: 'Gestures',
    icon: '👍',
    emojis: ['👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🤙', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '✌️'],
  },
  {
    name: 'Hearts',
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
  },
  {
    name: 'Objects',
    icon: '📧',
    emojis: ['📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '📝', '💼', '📁', '📂', '📅', '📆', '📇', '📈', '📉'],
  },
  {
    name: 'Symbols',
    icon: '✅',
    emojis: ['✅', '❌', '❓', '❗', '⭐', '🌟', '💡', '🔥', '✨', '🎉', '🎊', '🎁', '🏆', '🥇', '🎯', '💯', '🔔', '📌', '🔗', '⚡'],
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        isActive={isOpen}
        title="Insert Emoji"
        data-testid="toolbar-emoji"
      >
        😀
      </ToolbarButton>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-64"
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Category Tabs */}
          <div className="flex border-b border-gray-200">
            {EMOJI_CATEGORIES.map((category, index) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(index)}
                className={`flex-1 py-2 text-center text-lg hover:bg-gray-50 ${
                  activeCategory === index ? 'bg-blue-50 border-b-2 border-blue-500' : ''
                }`}
                title={category.name}
                data-testid={`emoji-category-${category.name.toLowerCase()}`}
              >
                {category.icon}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-2 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-5 gap-1">
              {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded text-xl"
                  data-testid={`emoji-${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
