import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LinkInputModal } from './LinkInputModal';

describe('LinkInputModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <LinkInputModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByTestId('link-input-modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('link-input-modal')).toBeInTheDocument();
    expect(screen.getByTestId('link-input-url')).toBeInTheDocument();
    expect(screen.getByText('リンクを挿入')).toBeInTheDocument();
  });

  it('focuses input when modal opens', async () => {
    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('link-input-url')).toHaveFocus();
    }, { timeout: 100 });
  });

  it('allows typing URL in the input field', async () => {
    const user = userEvent.setup();

    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const input = screen.getByTestId('link-input-url');

    // Clear default value and type new URL
    await user.clear(input);
    await user.type(input, 'https://example.com');

    expect(input).toHaveValue('https://example.com');
  });

  it('calls onSubmit with URL when Enter is pressed', async () => {
    const user = userEvent.setup();

    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const input = screen.getByTestId('link-input-url');

    await user.clear(input);
    await user.type(input, 'https://example.com{enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith('https://example.com');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();

    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const input = screen.getByTestId('link-input-url');
    await user.type(input, '{escape}');

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Click on the backdrop (the outer container)
    const backdrop = screen.getByTestId('link-input-modal').parentElement;
    fireEvent.click(backdrop!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not close when modal content is clicked', () => {
    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByTestId('link-input-modal'));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('uses initialUrl as default value', () => {
    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialUrl="https://initial.com"
      />
    );

    expect(screen.getByTestId('link-input-url')).toHaveValue('https://initial.com');
  });

  it('disables submit button when URL is empty or default', () => {
    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByText('挿入').closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('calls onSubmit when submit button is clicked with valid URL', async () => {
    const user = userEvent.setup();

    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const input = screen.getByTestId('link-input-url');
    await user.clear(input);
    await user.type(input, 'https://example.com');

    const submitButton = screen.getByText('挿入').closest('button');
    fireEvent.click(submitButton!);

    expect(mockOnSubmit).toHaveBeenCalledWith('https://example.com');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <LinkInputModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText('キャンセル'));

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
