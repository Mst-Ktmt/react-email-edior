import type { SocialBlockProps } from '@/types/block';
import { SocialIcon } from '@/components/atoms/SocialIcon';

interface Props {
  props: SocialBlockProps;
  isSelected?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
}

export function SocialBlock({ props, isSelected, onClick, isMobile = false }: Props) {
  const { links, iconSize, iconColor, iconStyle = 'circle-light', gap, align, padding, hideOnDesktop, hideOnMobile } = props;

  // レスポンシブ表示設定を考慮
  const shouldHide = (isMobile && hideOnMobile) || (!isMobile && hideOnDesktop);
  if (shouldHide) {
    return null;
  }

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

  const enabledLinks = links.filter((link) => link.enabled);

  const justifyClass =
    align === 'center'
      ? 'justify-center'
      : align === 'right'
        ? 'justify-end'
        : 'justify-start';

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
      <div className={`flex flex-wrap ${justifyClass}`} style={{ gap: `${gap}px` }}>
        {enabledLinks.map((link, index) => (
          <a
            key={`${link.platform}-${index}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <SocialIcon
              platform={link.platform}
              iconStyle={iconStyle}
              size={iconSize}
              color={iconColor}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
