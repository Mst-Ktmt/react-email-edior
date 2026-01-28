'use client';

/**
 * 保存状態インジケータ
 * 保存中・保存済み・エラーの状態を表示
 */

import type { SaveStatus } from '@/hooks/useAutoSave';

/** SaveIndicatorのプロパティ */
export interface SaveIndicatorProps {
  /** 保存状態 */
  status: SaveStatus;
  /** 最終保存日時 */
  lastSaved: Date | null;
  /** エラーメッセージ */
  error?: string | null;
  /** 手動保存ボタンをクリックした時のコールバック */
  onSaveClick?: () => void;
  /** クラス名 */
  className?: string;
}

/**
 * 相対時間をフォーマット
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 10) {
    return 'たった今';
  }
  if (diffSec < 60) {
    return `${diffSec}秒前`;
  }
  if (diffMin < 60) {
    return `${diffMin}分前`;
  }
  if (diffHour < 24) {
    return `${diffHour}時間前`;
  }
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * ステータスに応じたアイコンとテキストを取得
 */
function getStatusContent(status: SaveStatus): { icon: string; text: string; color: string } {
  switch (status) {
    case 'saving':
      return {
        icon: '⏳',
        text: '保存中...',
        color: 'text-blue-600',
      };
    case 'saved':
      return {
        icon: '✓',
        text: '保存済み',
        color: 'text-green-600',
      };
    case 'error':
      return {
        icon: '✗',
        text: '保存エラー',
        color: 'text-red-600',
      };
    case 'idle':
    default:
      return {
        icon: '○',
        text: '',
        color: 'text-gray-400',
      };
  }
}

/**
 * 保存状態インジケータコンポーネント
 */
export function SaveIndicator({
  status,
  lastSaved,
  error,
  onSaveClick,
  className = '',
}: SaveIndicatorProps) {
  const { icon, text, color } = getStatusContent(status);

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {/* ステータスアイコン */}
      <span className={`${color} ${status === 'saving' ? 'animate-pulse' : ''}`}>
        {icon}
      </span>

      {/* ステータステキスト or 最終保存日時 */}
      <span className={color}>
        {status === 'idle' && lastSaved
          ? `${formatRelativeTime(lastSaved)}に保存`
          : text}
      </span>

      {/* エラー表示 */}
      {status === 'error' && error && (
        <span className="text-red-500 text-xs" title={error}>
          ({error.slice(0, 20)}...)
        </span>
      )}

      {/* 手動保存ボタン */}
      {onSaveClick && (
        <button
          type="button"
          onClick={onSaveClick}
          disabled={status === 'saving'}
          className={`
            px-2 py-1 text-xs rounded border
            ${status === 'saving'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }
          `}
        >
          保存
        </button>
      )}
    </div>
  );
}
