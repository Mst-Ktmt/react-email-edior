import type { MenuBlockProps } from '@/types/block';

interface Props {
  props: MenuBlockProps;
  isSelected?: boolean;
  onClick?: () => void;
}

export function MenuBlock({ props, isSelected, onClick }: Props) {
  const {
    items,
    fontSize,
    fontFamily,
    textColor,
    separator,
    align,
    padding,
  } = props;

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

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
      <nav className={`flex flex-wrap items-center ${justifyClass}`}>
        {items.map((item, index) => (
          <span key={`${item.label}-${index}`} className="inline-flex items-center">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily,
                color: textColor,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {item.label}
            </a>
            {index < items.length - 1 && (
              <span
                className="mx-2"
                style={{
                  color: textColor,
                  fontSize: `${fontSize}px`,
                }}
              >
                {separator}
              </span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
