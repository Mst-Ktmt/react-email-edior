/**
 * 型定義のエントリーポイント
 * すべての型をここから再エクスポート
 */

// プロパティ型
export type {
  Spacing,
  TextAlign,
  ButtonWidth,
  LinkTarget,
  ResponsiveSettings,
  TextBlockProps,
  ImageBlockProps,
  ButtonBlockProps,
  DividerBlockProps,
  SectionBlockProps,
  ColumnCount,
  ColumnsBlockProps,
  SpacerBlockProps,
  HeadingLevel,
  HeadingBlockProps,
  HtmlBlockProps,
  SocialPlatform,
  SocialLink,
  IconStyle,
  SocialBlockProps,
  MenuItem,
  MenuLayout,
  MenuBlockProps,
  VideoBlockProps,
  TimerBlockProps,
  BlockPropsMap,
  BlockProps,
} from './props';

// ブロック型
export type {
  BasicBlockType,
  LayoutBlockType,
  AdvancedBlockType,
  ContainerBlockType,
  LeafBlockType,
  BlockType,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SectionBlock,
  Column,
  ColumnsBlock,
  SpacerBlock,
  HeadingBlock,
  HtmlBlock,
  SocialBlock,
  MenuBlock,
  VideoBlock,
  TimerBlock,
  ContainerBlock,
  LeafBlock,
  Block,
  PropsForBlockType,
  BlockForType,
} from './block';

// ブロック型ガード
export {
  isContainerBlock,
  isSectionBlock,
  isColumnsBlock,
} from './block';

// ドキュメント型
export type {
  GlobalStyles,
  EmailDocument,
  HtmlExportResult,
  JsonExportResult,
  PreviewMode,
  EditorState,
  HistoryEntry,
  HistoryState,
  UIState,
} from './document';

// デフォルト値・ファクトリ
export {
  DEFAULT_GLOBAL_STYLES,
  createEmptyDocument,
} from './document';

// ブロックプロパティのデフォルト値
export {
  defaultSpacing,
  defaultTextBlockProps,
  defaultImageBlockProps,
  defaultButtonBlockProps,
  defaultDividerBlockProps,
  defaultSectionBlockProps,
  defaultColumnsBlockProps,
  defaultSpacerBlockProps,
  defaultVideoBlockProps,
  defaultTimerBlockProps,
} from './defaults';
