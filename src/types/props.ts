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
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

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
// Buttonブロック拡張型定義
// ============================================================

/**
 * ホバー時スタイル
 */
export interface ButtonHoverStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  opacity?: number; // 0-1
}

/**
 * Box Shadow設定
 */
export interface BoxShadow {
  x: number;          // 水平オフセット（px）
  y: number;          // 垂直オフセット（px）
  blur: number;       // ぼかし半径（px）
  spread: number;     // 広がり（px）
  color: string;      // 影の色
  inset?: boolean;    // 内側の影
}

/**
 * アイコンタイプ
 */
export type IconType = 'svg' | 'emoji' | 'unicode';

/**
 * ボタンアイコン設定
 */
export interface ButtonIcon {
  type: IconType;
  content: string;        // SVGコード or 絵文字 or Unicode文字
  position: 'left' | 'right';
  spacing: number;        // アイコンとテキストの間隔（px）
  size?: number;          // アイコンサイズ（px、SVGのみ）
  color?: string;         // アイコン色（SVGのみ）
}

/**
 * グラデーションタイプ
 */
export type GradientType = 'linear' | 'radial';

/**
 * グラデーションカラー
 */
export interface GradientColor {
  color: string;
  position: number; // 0-100
}

/**
 * 背景グラデーション設定
 */
export interface BackgroundGradient {
  type: GradientType;
  angle?: number;           // linear用（0-360度）
  colors: GradientColor[];  // 2色以上
}

/**
 * トラッキングパラメータ設定
 */
export interface ButtonTracking {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  customParams?: Record<string, string>; // カスタムパラメータ
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
  // ========== 既存プロパティ ==========

  // テキスト・リンク
  text: string;
  linkUrl: string;
  linkTarget?: LinkTarget;

  // スタイル
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: string;
  lineHeight?: number;
  letterSpacing?: number;

  // レイアウト
  padding: Spacing;
  align: TextAlign;
  width: ButtonWidth;
  marginBottom: number;

  // ボーダー
  borderRadius: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';

  // ========== 新規プロパティ（Phase 1-3） ==========

  // ホバー時スタイル（Phase 1）
  hoverStyle?: ButtonHoverStyle;

  // Box Shadow（Phase 1）
  boxShadow?: BoxShadow;

  // 不透明度（Phase 1）
  opacity?: number; // 0-1

  // アイコン（Phase 2）
  icon?: ButtonIcon;

  // グラデーション背景（Phase 2）
  backgroundGradient?: BackgroundGradient;

  // 最小幅・最大幅（Phase 2）
  minWidth?: number; // px
  maxWidth?: number; // px

  // トラッキング（Phase 3）
  tracking?: ButtonTracking;
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
  backgroundColor?: string;
  marginBottom?: number;
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
export interface VideoBlockProps extends ResponsiveSettings {
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
export interface TimerBlockProps extends ResponsiveSettings {
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
