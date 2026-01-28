'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from '@/components/providers/LocaleProvider';

// ========================================
// Types
// ========================================

interface ShortcutItem {
  keys: string[];
  descriptionKey: string;
}

// ========================================
// Shortcut Definitions
// ========================================

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['⌘/Ctrl', 'Z'], descriptionKey: 'undo' },
  { keys: ['⌘/Ctrl', 'Shift', 'Z'], descriptionKey: 'redo' },
  { keys: ['⌘/Ctrl', 'Y'], descriptionKey: 'redoAlt' },
  { keys: ['Delete', '/Backspace'], descriptionKey: 'deleteBlock' },
  { keys: ['?'], descriptionKey: 'showHelp' },
  { keys: ['Esc'], descriptionKey: 'closeHelp' },
];

// ========================================
// Component
// ========================================

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('KeyboardShortcuts');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // '?' キーでヘルプを開く（Shift + / も対応）
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      // 入力フィールドにフォーカスがある場合は無視
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      setIsOpen(true);
    }

    // Escでヘルプを閉じる
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {t('title')}
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <ul className="space-y-3">
            {SHORTCUTS.map((shortcut, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-600">
                  {t(shortcut.descriptionKey)}
                </span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <kbd
                      key={keyIndex}
                      className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {t('pressEscToClose')}
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// Help Button Component
// ========================================

interface HelpButtonProps {
  className?: string;
}

export function KeyboardShortcutsHelpButton({ className = '' }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('KeyboardShortcuts');

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
        title={t('title')}
        aria-label={t('title')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <KeyboardShortcutsModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

// ========================================
// Modal Component (for button usage)
// ========================================

interface ModalProps {
  onClose: () => void;
}

function KeyboardShortcutsModal({ onClose }: ModalProps) {
  const t = useTranslations('KeyboardShortcuts');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {t('title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <ul className="space-y-3">
            {SHORTCUTS.map((shortcut, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-600">
                  {t(shortcut.descriptionKey)}
                </span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <kbd
                      key={keyIndex}
                      className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {t('pressEscToClose')}
          </p>
        </div>
      </div>
    </div>
  );
}
