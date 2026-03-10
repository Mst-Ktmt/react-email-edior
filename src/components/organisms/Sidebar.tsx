'use client';

import {
  Type,
  Image,
  MousePointerClick,
  Minus,
  BoxSelect,
  Columns,
  MoveVertical,
  Heading,
  Code,
  Share2,
  Menu,
  Play,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { DraggableBlock } from '@/features/editor/components/DraggableBlock';
import { useTranslations } from '@/components/providers/LocaleProvider';

interface SidebarProps {
  className?: string;
}

const BLOCK_TYPES: { id: string; icon: LucideIcon }[] = [
  { id: 'text', icon: Type },
  { id: 'image', icon: Image },
  { id: 'button', icon: MousePointerClick },
  { id: 'divider', icon: Minus },
  { id: 'columns', icon: Columns },
  { id: 'spacer', icon: MoveVertical },
  { id: 'heading', icon: Heading },
  { id: 'html', icon: Code },
  { id: 'social', icon: Share2 },
  { id: 'menu', icon: Menu },
  { id: 'video', icon: Play },
  { id: 'timer', icon: Timer },
];

export function Sidebar({ className = '' }: SidebarProps) {
  const t = useTranslations('Sidebar');
  const { setNodeRef } = useDroppable({
    id: 'sidebar',
  });

  return (
    <aside
      ref={setNodeRef}
      className={`w-[260px] flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto ${className}`}
    >
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
          {t('title')}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {BLOCK_TYPES.map((block) => (
            <DraggableBlock
              key={block.id}
              id={`sidebar-${block.id}`}
              data={{ type: 'sidebar-block', blockType: block.id }}
            >
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all">
                <block.icon className="w-6 h-6 mb-1 text-gray-600" />
                <span className="text-xs text-gray-600">{t(block.id)}</span>
              </div>
            </DraggableBlock>
          ))}
        </div>
      </div>
    </aside>
  );
}
