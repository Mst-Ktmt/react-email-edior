/**
 * プロパティ関連の型定義
 * メールエディタの各ブロックで使用するプロパティ型
 */

// ============================================================
// 共通型
// ============================================================

/**
 * 余白・パディング用の4方向指定
 */
export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * テキスト配置
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * ボタン幅の指定方法
 */
export type ButtonWidth = 'auto' | 'full' | number;

/**
 * リンクターゲット
 */
export type LinkTarget = '_self' | '_blank';

/**
 * レスポンシブ表示設定（共通）
 */
export interface ResponsiveSettings {
  hideOnDesktop?: boolean;
  hideOnMobile?: boolean;
}

// ============================================================
// 基本ブロックのプロパティ（Phase 1）
// ============================================================

/**
 * テキストブロックのプロパティ
 */
export interface TextBlockProps extends ResponsiveSettings {
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: string;
  textColor: string;
  textAlign: TextAlign;
  lineHeight: number;
  letterSpacing?: number;
  padding: Spacing;
  backgroundColor: string;
  marginBottom: number;
}

/**
 * 画像ブロックのプロパティ
 */
export interface ImageBlockProps extends ResponsiveSettings {
  src: string;
  alt: string;
  width: number | '100%';
  linkUrl: string;
  linkTarget?: LinkTarget;
  align: TextAlign;
  padding: Spacing;
  borderRadius: number;
  marginBottom: number;
}

/**
 * ボタンブロックのプロパティ
 */
export interface ButtonBlockProps extends ResponsiveSettings {
  text: string;
  linkUrl: string;
  linkTarget?: LinkTarget;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: string;
  lineHeight?: number;
  letterSpacing?: number;
  padding: Spacing;
  borderRadius: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  align: TextAlign;
  width: ButtonWidth;
  marginBottom: number;
}

/**
 * 区切り線ブロックのプロパティ
 */
export interface DividerBlockProps extends ResponsiveSettings {
  color: string;
  thickness: number;
  width: number | '100%';
  style: 'solid' | 'dashed' | 'dotted';
  align?: TextAlign;
  padding: Spacing;
  marginBottom: number;
}

// ============================================================
// レイアウトブロックのプロパティ（Phase 1）
// ============================================================

/**
 * セクションブロックのプロパティ
 */
export interface SectionBlockProps {
  backgroundColor: string;
  padding: Spacing;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  maxWidth: number;
}

/**
 * カラム数
 */
export type ColumnCount = 1 | 2 | 3 | 4;

/**
 * カラムブロックのプロパティ
 */
export interface ColumnsBlockProps {
  columnCount: ColumnCount;
  columnWidths: number[];
  gap: number;
  verticalAlign: 'top' | 'middle' | 'bottom';
  stackOnMobile: boolean;
}

/**
 * スペーサーブロックのプロパティ
 */
export interface SpacerBlockProps extends ResponsiveSettings {
  height: number;
  mobileHeight: number;
  marginBottom: number;
}

// ============================================================
// 高度なブロックのプロパティ（Phase 2以降）
// ============================================================

/**
 * 見出しレベル
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 見出しブロックのプロパティ
 */
export interface HeadingBlockProps extends ResponsiveSettings {
  content: string;
  level: HeadingLevel;
  fontSize: number;
  fontFamily: string;
  fontWeight?: string;
  textColor: string;
  textAlign: TextAlign;
  lineHeight?: number;
  letterSpacing?: number;
  padding: Spacing;
}

/**
 * HTMLブロックのプロパティ
 */
export interface HtmlBlockProps extends ResponsiveSettings {
  htmlContent: string;
  padding: Spacing;
}

/**
 * ソーシャルアイコンの種類
 */
export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest';

/**
 * ソーシャルリンク
 */
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
}

/**
 * アイコンスタイル
 */
export type IconStyle = 'circle' | 'square' | 'rounded' | 'none';

/**
 * ソーシャルブロックのプロパティ
 */
export interface SocialBlockProps extends ResponsiveSettings {
  links: SocialLink[];
  iconSize: number;
  iconColor: string;
  iconStyle?: IconStyle;
  gap: number;
  align: TextAlign;
  padding: Spacing;
}

/**
 * メニューアイテム
 */
export interface MenuItem {
  label: string;
  url: string;
  target?: LinkTarget;
}

/**
 * メニューレイアウト
 */
export type MenuLayout = 'horizontal' | 'vertical';

/**
 * メニューブロックのプロパティ
 */
export interface MenuBlockProps extends ResponsiveSettings {
  items: MenuItem[];
  fontSize: number;
  fontFamily: string;
  fontWeight?: string;
  letterSpacing?: number;
  textColor: string;
  linkColor?: string;
  separator: string;
  layout?: MenuLayout;
  itemPadding?: Spacing;
  align: TextAlign;
  padding: Spacing;
}

/**
 * ビデオブロックのプロパティ
 */
export interface VideoBlockProps {
  videoUrl: string;
  thumbnailSrc: string;
  alt: string;
  width: number | '100%';
  align: TextAlign;
  padding: Spacing;
  borderRadius: number;
  playButtonColor: string;
}

/**
 * タイマーブロックのプロパティ
 */
export interface TimerBlockProps {
  endDate: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  padding: Spacing;
  expiredMessage: string;
}

// ============================================================
// ブロックプロパティのユニオン型
// ============================================================

/**
 * 全ブロックプロパティのマップ
 */
export interface BlockPropsMap {
  text: TextBlockProps;
  image: ImageBlockProps;
  button: ButtonBlockProps;
  divider: DividerBlockProps;
  section: SectionBlockProps;
  columns: ColumnsBlockProps;
  spacer: SpacerBlockProps;
  heading: HeadingBlockProps;
  html: HtmlBlockProps;
  social: SocialBlockProps;
  menu: MenuBlockProps;
  video: VideoBlockProps;
  timer: TimerBlockProps;
}

/**
 * 全ブロックプロパティのユニオン型
 */
export type BlockProps = BlockPropsMap[keyof BlockPropsMap];
