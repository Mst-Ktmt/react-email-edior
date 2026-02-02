'use client';

import { ReactNode, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableBlockProps {
  id: string;
  children: ReactNode;
  data?: Record<string, unknown>;
}

export function DraggableBlock({ id, children, data }: DraggableBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50 z-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle - only this element triggers drag */}
      <div
        {...listeners}
        {...attributes}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-1 cursor-grab active:cursor-grabbing transition-opacity ${
          isHovered || isDragging ? 'opacity-100' : 'opacity-0'
        }`}
        title="ドラッグして移動"
      >
        <div className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-500">
          <GripVertical size={16} />
        </div>
      </div>
      {/* Block content - normal pointer events */}
      {children}
    </div>
  );
}
