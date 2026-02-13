'use client';

import { ReactNode, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableBlockProps {
  id: string;
  children: ReactNode;
  data?: Record<string, unknown>;
  handleOnly?: boolean; // true: ハンドルのみでドラッグ, false: 全体でドラッグ
}

export function DraggableBlock({ id, children, data, handleOnly = false }: DraggableBlockProps) {
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

  if (handleOnly) {
    // Canvas内のブロック: ドラッグハンドルのみでドラッグ可能
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative group ${isDragging ? 'opacity-50 z-50' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drag Handle - only this triggers drag */}
        <div
          {...listeners}
          {...attributes}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-6 cursor-grab active:cursor-grabbing transition-opacity ${
            isHovered || isDragging ? 'opacity-100' : 'opacity-0'
          }`}
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

  // Sidebarのブロック: 全体がドラッグ可能
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative group cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 z-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle Icon - visual hint */}
      <div
        className={`absolute top-1 right-1 transition-opacity pointer-events-none ${
          isHovered || isDragging ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="p-0.5 bg-white/80 rounded text-gray-400">
          <GripVertical size={12} />
        </div>
      </div>
      {/* Block content */}
      {children}
    </div>
  );
}
