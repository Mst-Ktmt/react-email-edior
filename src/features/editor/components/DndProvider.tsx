'use client';

import { ReactNode, useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useDnd } from '../hooks/useDnd';

interface DndProviderProps {
  children: ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { activeId, handleDragStart, handleDragEnd, handleDragCancel } = useDnd();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // SSR時はchildrenのみ返す（Hydration mismatch対策）
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay>
        {activeId ? (
          <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-lg opacity-80">
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
