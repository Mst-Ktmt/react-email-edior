import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TextBlock } from './TextBlock';
import type { TextBlockProps } from '@/types/block';

// Mock the stores
vi.mock('@/stores/documentStore', () => ({
  useDocumentStore: vi.fn((selector) => {
    const state = {
      addBlock: vi.fn(),
      removeBlock: vi.fn(),
    };
    return selector(state);
  }),
}));

const defaultProps: TextBlockProps = {
  content: '<p>ここにテキストを入力</p>',
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  textColor: '#333333',
  textAlign: 'left',
  lineHeight: 1.5,
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  backgroundColor: '#ffffff',
  marginBottom: 0,
};

// Helper to get the container element
const getContainer = () => document.querySelector('[data-block-id="test-block"]') as HTMLElement;

describe('TextBlock', () => {
  const mockOnClick = vi.fn();
  const mockOnUpdateContent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text content correctly', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    expect(screen.getByText('ここにテキストを入力')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    vi.useFakeTimers();
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    fireEvent.click(container);

    // onClick is delayed by 200ms to allow double-click detection
    expect(mockOnClick).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('enters editing mode on double-click', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    fireEvent.doubleClick(container);

    // In editing mode, contentEditable should be present
    const editableElement = document.querySelector('[contenteditable="true"]');
    expect(editableElement).toBeInTheDocument();
  });

  it('shows RichTextToolbar when in editing mode', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    fireEvent.doubleClick(container);

    // Check for toolbar buttons
    expect(screen.getByTestId('toolbar-bold')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-italic')).toBeInTheDocument();
    expect(screen.getByTestId('toolbar-underline')).toBeInTheDocument();
  });

  it('does not call onClick when in editing mode', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    // Enter editing mode
    const container = getContainer();
    fireEvent.doubleClick(container);

    mockOnClick.mockClear();

    // Click on the editable area
    const editableElement = document.querySelector('[contenteditable="true"]');
    if (editableElement) {
      fireEvent.click(editableElement);
    }

    // onClick should NOT be called when in editing mode
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has cursor: text style when in editing mode', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    fireEvent.doubleClick(container);

    const editableElement = document.querySelector('[contenteditable="true"]');
    expect(editableElement).toHaveStyle({ cursor: 'text' });
  });

  it('has userSelect: text style when in editing mode', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    fireEvent.doubleClick(container);

    const editableElement = document.querySelector('[contenteditable="true"]');
    expect(editableElement).toHaveStyle({ userSelect: 'text' });
  });

  it('exits editing mode on blur', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    fireEvent.doubleClick(container);

    const editableElement = document.querySelector('[contenteditable="true"]');
    expect(editableElement).toBeInTheDocument();

    // Trigger blur with relatedTarget outside the container
    fireEvent.blur(editableElement!, { relatedTarget: document.body });

    // Should exit editing mode - no more contentEditable
    const editableAfterBlur = document.querySelector('[contenteditable="true"]');
    expect(editableAfterBlur).not.toBeInTheDocument();
  });

  it('exits editing mode on Escape key', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    fireEvent.doubleClick(container);

    const editableElement = document.querySelector('[contenteditable="true"]');
    expect(editableElement).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(editableElement!, { key: 'Escape' });

    // Should exit editing mode
    const editableAfterEscape = document.querySelector('[contenteditable="true"]');
    expect(editableAfterEscape).not.toBeInTheDocument();
  });

  it('saves content on Enter key (without Shift)', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    fireEvent.doubleClick(container);

    const editableElement = document.querySelector('[contenteditable="true"]');

    // Press Enter
    fireEvent.keyDown(editableElement!, { key: 'Enter' });

    // Should exit editing mode and potentially save
    const editableAfterEnter = document.querySelector('[contenteditable="true"]');
    expect(editableAfterEnter).not.toBeInTheDocument();
  });

  it('shows selection ring when selected', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        isSelected={true}
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();
    expect(container).toHaveClass('ring-2', 'ring-blue-500');
  });

  it('hides BlockToolbar when in editing mode', () => {
    render(
      <TextBlock
        props={defaultProps}
        blockId="test-block"
        onClick={mockOnClick}
        onUpdateContent={mockOnUpdateContent}
      />
    );

    const container = getContainer();

    // Hover to show toolbar
    fireEvent.mouseEnter(container);

    // Enter editing mode
    fireEvent.doubleClick(container);

    // BlockToolbar should be hidden in editing mode
    // (RichTextToolbar should be visible instead)
    const blockToolbar = screen.queryByRole('button', { name: /delete/i });
    expect(blockToolbar).not.toBeInTheDocument();
  });
});
