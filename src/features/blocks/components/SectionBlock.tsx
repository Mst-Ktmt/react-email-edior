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

  return (
    <div
      data-block-id={id}
      data-block-type="section"
      className={`
        relative mx-auto w-full
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        transition-shadow duration-150
      `}
      style={{
        backgroundColor,
        padding: paddingStyle,
        borderRadius: `${borderRadius}px`,
        borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
        borderStyle: borderWidth > 0 ? 'solid' : undefined,
        borderColor: borderWidth > 0 ? borderColor : undefined,
        maxWidth: `${maxWidth}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
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
