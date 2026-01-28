/**
 * ブロックプロパティのデフォルト値
 */

import type {
  TextBlockProps,
  ImageBlockProps,
  ButtonBlockProps,
  DividerBlockProps,
  SectionBlockProps,
  ColumnsBlockProps,
  SpacerBlockProps,
  HeadingBlockProps,
  HtmlBlockProps,
  SocialBlockProps,
  MenuBlockProps,
  Spacing,
} from './props';

// ============================================================
// 共通デフォルト値
// ============================================================

export const defaultSpacing: Spacing = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

// ============================================================
// 基本ブロックのデフォルト値
// ============================================================

export const defaultTextBlockProps: TextBlockProps = {
  content: '<p>ここにテキストを入力</p>',
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  textColor: '#333333',
  textAlign: 'left',
  lineHeight: 1.5,
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  backgroundColor: 'transparent',
  marginBottom: 0,
};

export const defaultImageBlockProps: ImageBlockProps = {
  src: '',
  alt: '',
  width: '100%',
  linkUrl: '',
  align: 'center',
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  borderRadius: 0,
  marginBottom: 0,
};

export const defaultButtonBlockProps: ButtonBlockProps = {
  text: 'クリック',
  linkUrl: '#',
  backgroundColor: '#007bff',
  textColor: '#ffffff',
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  padding: { top: 12, right: 24, bottom: 12, left: 24 },
  borderRadius: 4,
  align: 'center',
  width: 'auto',
  marginBottom: 0,
};

export const defaultDividerBlockProps: DividerBlockProps = {
  color: '#cccccc',
  thickness: 1,
  width: '100%',
  style: 'solid',
  padding: { top: 10, right: 0, bottom: 10, left: 0 },
  marginBottom: 0,
};

// ============================================================
// レイアウトブロックのデフォルト値
// ============================================================

export const defaultSectionBlockProps: SectionBlockProps = {
  backgroundColor: '#ffffff',
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  borderRadius: 0,
  borderWidth: 0,
  borderColor: '#cccccc',
  maxWidth: 600,
};

export const defaultColumnsBlockProps: ColumnsBlockProps = {
  columnCount: 2,
  gap: 16,
  columnWidths: [50, 50],
  verticalAlign: 'top',
  stackOnMobile: true,
};

export const defaultSpacerBlockProps: SpacerBlockProps = {
  height: 20,
  mobileHeight: 20,
  marginBottom: 0,
};

// ============================================================
// 高度なブロックのデフォルト値（Phase 2）
// ============================================================

export const defaultHeadingBlockProps: HeadingBlockProps = {
  content: '見出し',
  level: 2,
  fontSize: 24,
  fontFamily: 'Arial, sans-serif',
  textColor: '#333333',
  textAlign: 'left',
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
};

export const defaultHtmlBlockProps: HtmlBlockProps = {
  htmlContent: '<p>カスタムHTML</p>',
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
};

export const defaultSocialBlockProps: SocialBlockProps = {
  links: [
    { platform: 'facebook', url: 'https://facebook.com', enabled: true },
    { platform: 'twitter', url: 'https://twitter.com', enabled: true },
    { platform: 'instagram', url: 'https://instagram.com', enabled: true },
  ],
  iconSize: 32,
  iconColor: '#333333',
  gap: 12,
  align: 'center',
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
};

export const defaultMenuBlockProps: MenuBlockProps = {
  items: [
    { label: 'ホーム', url: '#' },
    { label: '概要', url: '#' },
    { label: 'お問い合わせ', url: '#' },
  ],
  fontSize: 14,
  fontFamily: 'Arial, sans-serif',
  textColor: '#333333',
  separator: '|',
  align: 'center',
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
};
