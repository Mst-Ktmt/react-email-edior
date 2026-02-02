import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.getSelection
const mockSelection = {
  toString: () => '',
  removeAllRanges: vi.fn(),
  addRange: vi.fn(),
  getRangeAt: vi.fn(() => ({
    selectNodeContents: vi.fn(),
    collapse: vi.fn(),
  })),
  rangeCount: 0,
};

Object.defineProperty(window, 'getSelection', {
  value: () => mockSelection,
  writable: true,
});

// Mock document.execCommand (deprecated but used by contentEditable)
Object.defineProperty(document, 'execCommand', {
  value: vi.fn(() => true),
  writable: true,
});

Object.defineProperty(document, 'queryCommandState', {
  value: vi.fn(() => false),
  writable: true,
});

Object.defineProperty(document, 'queryCommandValue', {
  value: vi.fn(() => ''),
  writable: true,
});

// Mock createRange
const originalCreateRange = document.createRange.bind(document);
document.createRange = () => {
  const range = originalCreateRange();
  return range;
};
