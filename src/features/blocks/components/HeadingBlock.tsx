import type { HeadingBlockProps, HeadingLevel } from '@/types/block';
import type { JSX } from 'react';

interface Props {
  props: HeadingBlockProps;
  isSelected?: boolean;
  onClick?: () => void;
}

const HEADING_TAGS: Record<HeadingLevel, keyof JSX.IntrinsicElements> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

export function HeadingBlock({ props, isSelected, onClick }: Props) {
  const {
    content,
    level,
    fontSize,
    fontFamily,
    textColor,
    textAlign,
    padding,
  } = props;

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
  const HeadingTag = HEADING_TAGS[level];

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        padding: paddingStyle,
      }}
    >
      <HeadingTag
        style={{
          fontSize: `${fontSize}px`,
          fontFamily,
          color: textColor,
          textAlign,
          margin: 0,
        }}
      >
        {content}
      </HeadingTag>
    </div>
  );
}
