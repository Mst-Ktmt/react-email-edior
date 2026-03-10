'use client';

import { useDroppable } from '@dnd-kit/core';

interface DropIndicatorProps {
  id: string;
}

/**
 * DropIndicator - ブロック間のドロップゾーンインジケーター
 *
 * ドラッグ中に挿入可能な位置に青い線を表示
 */
export function DropIndicator({ id }: DropIndicatorProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-1 -my-0.5 transition-all duration-150 ${
        isOver ? 'bg-blue-500 scale-y-150' : 'bg-transparent'
      }`}
    />
  );
}
