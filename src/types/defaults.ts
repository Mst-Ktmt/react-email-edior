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
  VideoBlockProps,
  TimerBlockProps,
  Spacing,
  ButtonHoverStyle,
  BoxShadow,
  ButtonIcon,
  BackgroundGradient,
  ButtonTracking,
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
  // 新規プロパティはundefined（無効状態）がデフォルト
  // hoverStyle: undefined,
  // boxShadow: undefined,
  // opacity: 1.0,
  // icon: undefined,
  // backgroundGradient: undefined,
  // minWidth: undefined,
  // maxWidth: undefined,
  // tracking: undefined,
};

// ============================================================
// Buttonブロック拡張機能のデフォルト値
// ============================================================

/**
 * デフォルトホバースタイル
 * 未指定時は通常スタイルから自動生成（背景色を10%暗く）
 */
export const defaultButtonHoverStyle: ButtonHoverStyle = {
  backgroundColor: undefined, // 自動生成
  textColor: undefined,        // 変更なし
  borderColor: undefined,      // 自動生成
  opacity: 1.0,
};

/**
 * デフォルトBox Shadow
 */
export const defaultBoxShadow: BoxShadow = {
  x: 0,
  y: 2,
  blur: 4,
  spread: 0,
  color: 'rgba(0, 0, 0, 0.1)',
  inset: false,
};

/**
 * Box Shadowプリセット
 */
export const boxShadowPresets = {
  subtle: {
    x: 0,
    y: 2,
    blur: 4,
    spread: 0,
    color: 'rgba(0, 0, 0, 0.1)',
    inset: false,
  } as BoxShadow,
  medium: {
    x: 0,
    y: 4,
    blur: 8,
    spread: 0,
    color: 'rgba(0, 0, 0, 0.15)',
    inset: false,
  } as BoxShadow,
  strong: {
    x: 0,
    y: 8,
    blur: 16,
    spread: 0,
    color: 'rgba(0, 0, 0, 0.2)',
    inset: false,
  } as BoxShadow,
};

/**
 * デフォルトアイコン設定
 */
export const defaultButtonIcon: ButtonIcon = {
  type: 'emoji',
  content: '→',
  position: 'right',
  spacing: 8,
  size: 16,
  color: undefined, // textColorを継承
};

/**
 * デフォルトグラデーション設定
 */
export const defaultBackgroundGradient: BackgroundGradient = {
  type: 'linear',
  angle: 90,
  colors: [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ],
};

/**
 * グラデーションプリセット
 */
export const gradientPresets = {
  sunset: {
    type: 'linear' as const,
    angle: 90,
    colors: [
      { color: '#ff6b6b', position: 0 },
      { color: '#feca57', position: 100 },
    ],
  },
  ocean: {
    type: 'linear' as const,
    angle: 90,
    colors: [
      { color: '#4facfe', position: 0 },
      { color: '#00f2fe', position: 100 },
    ],
  },
  purple: {
    type: 'linear' as const,
    angle: 90,
    colors: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 },
    ],
  },
};

/**
 * デフォルトトラッキング設定
 */
export const defaultButtonTracking: ButtonTracking = {
  utmSource: 'email',
  utmMedium: 'newsletter',
  utmCampaign: undefined,
  utmTerm: undefined,
  utmContent: undefined,
  customParams: {},
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
  backgroundColor: 'transparent',
  padding: defaultSpacing,
  borderColor: '#cccccc',
  borderWidth: 0,
  borderStyle: 'solid',
  borderRadius: 0,
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
  backgroundColor: 'transparent',
  marginBottom: 0,
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

// ============================================================
// Phase 3ブロックのデフォルト値
// ============================================================

export const defaultVideoBlockProps: VideoBlockProps = {
  videoUrl: '',
  thumbnailSrc: '',
  alt: '',
  width: '100%',
  align: 'center',
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  borderRadius: 0,
  playButtonColor: '#FF0000',
};

export const defaultTimerBlockProps: TimerBlockProps = {
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  fontSize: 24,
  textColor: '#333333',
  backgroundColor: 'transparent',
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  expiredMessage: 'Expired',
};
