'use client';

import { ReactNode } from 'react';
import type { SectionBlockProps, Spacing } from '@/types/block';
import { defaultSectionBlockProps } from '@/types/defaults';

interface Props {
  id: string;
  props: SectionBlockProps;
  children?: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * SectionBlock - Root container block for email sections
 *
 * Features:
 * - Background color customization
 * - Padding control
 * - Border styling
 * - Max width constraint (centered)
 *
 * Nesting constraint: Section cannot be nested inside another Section
 */
export function SectionBlock({
  id,
  props,
  children,
  isSelected = false,
  onClick,
}: Props) {
  const {
    backgroundColor,
    padding,
    borderRadius,
    borderWidth,
    borderColor,
    maxWidth,
  } = { ...defaultSectionBlockProps, ...props };

  const paddingStyle = spacingToCss(padding);

  // カスタム境界線がない場合、デフォルトの点線を表示
  const hasCustomBorder = borderWidth > 0;

  return (
    <div
      data-block-id={id}
      data-block-type="section"
      className={`
        relative mx-auto w-full
        ${!hasCustomBorder ? 'border-2 border-dashed border-gray-200 hover:border-gray-300' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        transition-all duration-150
      `}
      style={{
        backgroundColor,
        padding: paddingStyle,
        borderRadius: `${borderRadius}px`,
        borderWidth: hasCustomBorder ? `${borderWidth}px` : undefined,
        borderStyle: hasCustomBorder ? 'solid' : undefined,
        borderColor: hasCustomBorder ? borderColor : undefined,
        maxWidth: `${maxWidth}px`,
      }}
      onClick={(e) => {
        // 子要素がクリックされた場合は何もしない
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          onClick?.();
        }
      }}
    >
      {/* Section Label */}
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 text-xs font-medium text-gray-400 bg-gray-100 rounded
        ${isSelected ? 'text-blue-600 bg-blue-50' : ''}
      `}>
        Section
      </div>

      {children || (
        <div className="flex min-h-[100px] items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
          Drop blocks here
        </div>
      )}
    </div>
  );
}

/**
 * Convert Spacing object to CSS padding string
 */
function spacingToCss(spacing: Spacing): string {
  return `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`;
}

export default SectionBlock;
