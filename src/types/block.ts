/**
 * ブロック関連の型定義
 * メールエディタのブロック構造を定義
 */

import type {
  BlockPropsMap,
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
  TextAlign,
  ButtonWidth,
  ColumnCount,
  HeadingLevel,
  SocialPlatform,
  SocialLink,
  MenuItem,
  BlockProps,
} from './props';

// Re-export all props types for convenience
export type {
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
  TextAlign,
  ButtonWidth,
  ColumnCount,
  HeadingLevel,
  SocialPlatform,
  SocialLink,
  MenuItem,
  BlockProps,
  BlockPropsMap,
};

// ============================================================
// ブロックタイプ定義
// ============================================================

/**
 * 基本ブロックタイプ（Phase 1）
 */
export type BasicBlockType = 'text' | 'image' | 'button' | 'divider';

/**
 * レイアウトブロックタイプ（Phase 1）
 */
export type LayoutBlockType = 'section' | 'columns' | 'spacer';

/**
 * 高度なブロックタイプ（Phase 2以降）
 */
export type AdvancedBlockType = 'html' | 'heading' | 'social' | 'menu' | 'video' | 'timer';

/**
 * コンテナブロックタイプ（子要素を持てるブロック）
 */
export type ContainerBlockType = 'section' | 'columns';

/**
 * リーフブロックタイプ（子要素を持たないブロック）
 */
export type LeafBlockType = Exclude<BlockType, ContainerBlockType>;

/**
 * 全ブロックタイプ
 */
export type BlockType = BasicBlockType | LayoutBlockType | AdvancedBlockType;

// ============================================================
// ブロック定義（型安全版）
// ============================================================

/**
 * ブロックの基底インターフェース
 */
interface BaseBlock<T extends BlockType, P> {
  id: string;
  type: T;
  props: P;
}

// ============================================================
// 基本ブロック（Phase 1）
// ============================================================

/**
 * テキストブロック
 */
export interface TextBlock extends BaseBlock<'text', TextBlockProps> {
  type: 'text';
}

/**
 * 画像ブロック
 */
export interface ImageBlock extends BaseBlock<'image', ImageBlockProps> {
  type: 'image';
}

/**
 * ボタンブロック
 */
export interface ButtonBlock extends BaseBlock<'button', ButtonBlockProps> {
  type: 'button';
}

/**
 * 区切り線ブロック
 */
export interface DividerBlock extends BaseBlock<'divider', DividerBlockProps> {
  type: 'divider';
}

// ============================================================
// レイアウトブロック（Phase 1）
// ============================================================

/**
 * セクションブロック（ルートコンテナ）
 */
export interface SectionBlock extends BaseBlock<'section', SectionBlockProps> {
  type: 'section';
  children: Block[];
}

/**
 * カラム内のコンテンツ
 */
export interface Column {
  id: string;
  children: LeafBlock[];
}

/**
 * カラムブロック
 */
export interface ColumnsBlock extends BaseBlock<'columns', ColumnsBlockProps> {
  type: 'columns';
  columns: Column[];
}

/**
 * スペーサーブロック
 */
export interface SpacerBlock extends BaseBlock<'spacer', SpacerBlockProps> {
  type: 'spacer';
}

// ============================================================
// 高度なブロック（Phase 2以降）
// ============================================================

/**
 * 見出しブロック
 */
export interface HeadingBlock extends BaseBlock<'heading', HeadingBlockProps> {
  type: 'heading';
}

/**
 * HTMLブロック
 */
export interface HtmlBlock extends BaseBlock<'html', HtmlBlockProps> {
  type: 'html';
}

/**
 * ソーシャルブロック
 */
export interface SocialBlock extends BaseBlock<'social', SocialBlockProps> {
  type: 'social';
}

/**
 * メニューブロック
 */
export interface MenuBlock extends BaseBlock<'menu', MenuBlockProps> {
  type: 'menu';
}

/**
 * ビデオブロック
 */
export interface VideoBlock extends BaseBlock<'video', VideoBlockProps> {
  type: 'video';
}

/**
 * タイマーブロック
 */
export interface TimerBlock extends BaseBlock<'timer', TimerBlockProps> {
  type: 'timer';
}

// ============================================================
// ブロックユニオン型
// ============================================================

/**
 * コンテナブロック（子要素を持つ）
 */
export type ContainerBlock = SectionBlock | ColumnsBlock;

/**
 * リーフブロック（子要素を持たない）
 */
export type LeafBlock =
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock
  | HeadingBlock
  | HtmlBlock
  | SocialBlock
  | MenuBlock
  | VideoBlock
  | TimerBlock;

/**
 * 全ブロックのユニオン型
 */
export type Block = ContainerBlock | LeafBlock;

// ============================================================
// 型ユーティリティ
// ============================================================

/**
 * ブロックタイプからプロパティ型を取得
 */
export type PropsForBlockType<T extends BlockType> = BlockPropsMap[T];

/**
 * ブロックタイプからブロック型を取得
 */
export type BlockForType<T extends BlockType> =
  T extends 'text' ? TextBlock :
  T extends 'image' ? ImageBlock :
  T extends 'button' ? ButtonBlock :
  T extends 'divider' ? DividerBlock :
  T extends 'section' ? SectionBlock :
  T extends 'columns' ? ColumnsBlock :
  T extends 'spacer' ? SpacerBlock :
  T extends 'heading' ? HeadingBlock :
  T extends 'html' ? HtmlBlock :
  T extends 'social' ? SocialBlock :
  T extends 'menu' ? MenuBlock :
  T extends 'video' ? VideoBlock :
  T extends 'timer' ? TimerBlock :
  never;

/**
 * ブロックがコンテナかどうかを判定する型ガード
 */
export function isContainerBlock(block: Block): block is ContainerBlock {
  return block.type === 'section' || block.type === 'columns';
}

/**
 * ブロックがセクションかどうかを判定する型ガード
 */
export function isSectionBlock(block: Block): block is SectionBlock {
  return block.type === 'section';
}

/**
 * ブロックがカラムかどうかを判定する型ガード
 */
export function isColumnsBlock(block: Block): block is ColumnsBlock {
  return block.type === 'columns';
}
