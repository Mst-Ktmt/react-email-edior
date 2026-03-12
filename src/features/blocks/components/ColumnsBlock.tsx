'use client';

import { ReactNode } from 'react';
import type { ColumnsBlockProps, ColumnCount, Spacing } from '@/types/block';
import { defaultColumnsBlockProps } from '@/types/defaults';
import { DroppableCanvas } from '@/features/editor/components/DroppableCanvas';

/**
 * Format padding from Spacing object to CSS string
 */
function formatPadding(padding: Spacing | undefined): string {
  if (!padding) return '0';
  return `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
}

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
  isPreviewMode?: boolean;
  isMobile?: boolean;
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
  isPreviewMode = false,
  isMobile = false,
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
      style={{
        backgroundColor: props.backgroundColor ?? 'transparent',
        padding: formatPadding(props.padding),
        border: (props.borderWidth ?? 0) > 0
          ? `${props.borderWidth}px ${props.borderStyle ?? 'solid'} ${props.borderColor ?? '#cccccc'}`
          : undefined,
        borderRadius: (props.borderRadius ?? 0) > 0
          ? `${props.borderRadius}px`
          : undefined,
      }}
    >
      <div
        className={`
          flex w-full ${alignItemsClass}
          ${stackOnMobile && isMobile ? 'flex-col' : 'flex-row'}
        `}
        style={{ gap: `${gap}px` }}
      >
        {Array.from({ length: columnCount }).map((_, index) => {
          const columnContent = columnChildren.find(
            (c) => c.columnIndex === index
          )?.children;

          return (
            <DroppableCanvas
              key={index}
              id={`column-${id}-${index}`}
              className="relative min-h-[60px]"
              style={{
                flexBasis: `calc(${normalizedWidths[index]}% - ${gap * (columnCount - 1) / columnCount}px)`,
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              {({ isOver }) => (
                <div
                  data-column-index={index}
                  className={`
                    h-full min-h-[60px] relative
                    ${!isPreviewMode ? 'border border-dashed transition-colors duration-200' : ''}
                    ${!isPreviewMode && isOver
                      ? 'bg-blue-50 border-blue-400 border-2'
                      : !isPreviewMode
                      ? 'border-gray-300 hover:bg-gray-50'
                      : ''
                    }
                  `}
                >
                  {!isPreviewMode && (
                    <div
                      className="absolute top-1 left-2 text-xs text-gray-400 font-medium z-10 cursor-pointer hover:text-blue-600 px-1 py-0.5 rounded hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                      }}
                    >
                      Column {index + 1} ({normalizedWidths[index]}%)
                    </div>
                  )}
                  {columnContent ? (
                    <div className={!isPreviewMode ? 'pt-6' : ''}>
                      {columnContent}
                    </div>
                  ) : (
                    <div
                      className="flex h-full min-h-[60px] items-center justify-center text-sm text-gray-400 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                      }}
                    >
                      Column {index + 1}
                    </div>
                  )}
                </div>
              )}
            </DroppableCanvas>
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
