'use client';

import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useTranslations } from '@/components/providers/LocaleProvider';

interface DroppableCanvasRenderProps {
  isOver: boolean;
}

interface DroppableCanvasProps {
  id: string;
  children?: ReactNode | ((props: DroppableCanvasRenderProps) => ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

export function DroppableCanvas({ id, children, className = '', style }: DroppableCanvasProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const t = useTranslations('Canvas');

  const renderedChildren = typeof children === 'function' ? children({ isOver }) : children;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        transition-colors duration-200
        ${isOver ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''}
        ${className}
      `}
    >
      {renderedChildren}
      {!renderedChildren && (
        <div className="flex items-center justify-center h-full min-h-[200px] text-gray-400">
          {isOver ? t('dropHereShort') : t('dragBlocksHereShort')}
        </div>
      )}
    </div>
  );
}
