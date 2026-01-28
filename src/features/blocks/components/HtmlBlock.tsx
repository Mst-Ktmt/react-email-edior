import type { HtmlBlockProps } from '@/types/block';

interface Props {
  props: HtmlBlockProps;
  isSelected?: boolean;
  onClick?: () => void;
}

export function HtmlBlock({ props, isSelected, onClick }: Props) {
  const { htmlContent, padding } = props;

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

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
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
