'use client';

import { ReactNode } from 'react';
import type { ColumnsBlockProps, ColumnCount } from '@/types/block';
import { defaultColumnsBlockProps } from '@/types/defaults';

interface ColumnChildren {
  columnIndex: number;
  children: ReactNode;
}

interface Props {
  id: string;
  props: ColumnsBlockProps;
  columnChildren?: ColumnChildren[];
  isSelected?: boolean;
  onClick?: () => void;
  onColumnClick?: (columnIndex: number) => void;
}

/**
 * ColumnsBlock - Multi-column layout block
 *
 * Features:
 * - 1-4 columns support
 * - Custom column width ratios
 * - Configurable gap between columns
 * - Vertical alignment options
 * - Stack on mobile option
 *
 * Nesting constraint: Columns cannot be nested inside another Columns block
 */
export function ColumnsBlock({
  id,
  props,
  columnChildren = [],
  isSelected = false,
  onClick,
  onColumnClick,
}: Props) {
  const { columnCount, gap, columnWidths, verticalAlign, stackOnMobile } = {
    ...defaultColumnsBlockProps,
    ...props,
  };

  // Ensure columnWidths array matches columnCount
  const normalizedWidths = normalizeColumnWidths(columnWidths, columnCount);

  const alignItemsClass = {
    top: 'items-start',
    middle: 'items-center',
    bottom: 'items-end',
  }[verticalAlign];

  return (
    <div
      data-block-id={id}
      data-block-type="columns"
      className={`
        relative w-full
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        transition-shadow duration-150
      `}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <div
        className={`
          flex w-full ${alignItemsClass}
          ${stackOnMobile ? 'flex-col md:flex-row' : 'flex-row'}
        `}
        style={{ gap: `${gap}px` }}
      >
        {Array.from({ length: columnCount }).map((_, index) => {
          const columnContent = columnChildren.find(
            (c) => c.columnIndex === index
          )?.children;

          return (
            <div
              key={index}
              data-column-index={index}
              className={`
                relative min-h-[60px]
                ${stackOnMobile ? 'w-full md:w-auto' : ''}
              `}
              style={{
                flex: stackOnMobile
                  ? undefined
                  : `0 0 ${normalizedWidths[index]}%`,
                width: stackOnMobile ? '100%' : `${normalizedWidths[index]}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onColumnClick?.(index);
              }}
            >
              {columnContent || (
                <div className="flex h-full min-h-[60px] items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
                  Column {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Normalize column widths to match column count
 * Ensures widths sum to 100%
 */
function normalizeColumnWidths(widths: number[], count: 1 | 2 | 3 | 4): number[] {
  // If widths array matches count, validate and return
  if (widths.length === count) {
    const sum = widths.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) < 0.01) {
      return widths;
    }
    // Normalize to sum to 100
    return widths.map((w) => (w / sum) * 100);
  }

  // Default equal widths
  const equalWidth = 100 / count;
  return Array.from({ length: count }, () => equalWidth);
}

export default ColumnsBlock;
