/**
 * UndoRedoButtons - Undo/Redoボタンコンポーネント
 *
 * ツールバー用のUndo/Redoボタン
 */

'use client';

interface UndoRedoButtonsProps {
  /** Undoが可能か */
  canUndo: boolean;
  /** Redoが可能か */
  canRedo: boolean;
  /** Undo実行コールバック */
  onUndo: () => void;
  /** Redo実行コールバック */
  onRedo: () => void;
}

export function UndoRedoButtons({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: UndoRedoButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Undo Button */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
        className={`
          flex h-8 w-8 items-center justify-center rounded
          transition-colors duration-150
          ${
            canUndo
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'cursor-not-allowed text-gray-300'
          }
        `}
      >
        <UndoIcon />
      </button>

      {/* Redo Button */}
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo"
        className={`
          flex h-8 w-8 items-center justify-center rounded
          transition-colors duration-150
          ${
            canRedo
              ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              : 'cursor-not-allowed text-gray-300'
          }
        `}
      >
        <RedoIcon />
      </button>
    </div>
  );
}

// ============================================================
// Icons (inline SVG for no external dependencies)
// ============================================================

function UndoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </svg>
  );
}

export default UndoRedoButtons;
