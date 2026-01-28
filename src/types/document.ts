/**
 * ドキュメント関連の型定義
 * メールドキュメント全体の構造を定義
 */

import type { SectionBlock } from './block';

// ============================================================
// グローバルスタイル
// ============================================================

/**
 * メール全体に適用されるグローバルスタイル
 */
export interface GlobalStyles {
  /** 基本フォントファミリー */
  fontFamily: string;
  /** コンテンツ幅（px） */
  contentWidth: number;
  /** 背景色 */
  backgroundColor: string;
  /** リンクカラー */
  linkColor: string;
  /** 基本テキストカラー */
  textColor: string;
  /** 基本フォントサイズ（px） */
  baseFontSize: number;
  /** 基本行間 */
  baseLineHeight: number;
}

// ============================================================
// メールドキュメント
// ============================================================

/**
 * メールドキュメント
 * エディタで編集する1つのメールテンプレート
 */
export interface EmailDocument {
  /** ドキュメントID */
  id: string;
  /** ドキュメント名 */
  name: string;
  /** セクション一覧（ルートレベルのブロック） */
  sections: SectionBlock[];
  /** グローバルスタイル設定 */
  globalStyles: GlobalStyles;
  /** 作成日時（ISO 8601形式） */
  createdAt: string;
  /** 更新日時（ISO 8601形式） */
  updatedAt: string;
  /** ドキュメントバージョン */
  version: number;
}

// ============================================================
// エクスポート形式
// ============================================================

/**
 * HTMLエクスポート結果
 */
export interface HtmlExportResult {
  /** 完全なHTML文字列 */
  html: string;
  /** テキストのみ版（プレーンテキスト） */
  plainText: string;
}

/**
 * JSONエクスポート結果
 */
export interface JsonExportResult {
  /** ドキュメントのJSON文字列 */
  json: string;
  /** パース済みのドキュメントオブジェクト */
  document: EmailDocument;
}

// ============================================================
// エディタ状態
// ============================================================

/**
 * プレビューモード
 */
export type PreviewMode = 'desktop' | 'mobile';

/**
 * エディタ状態
 */
export interface EditorState {
  /** 現在編集中のドキュメント */
  document: EmailDocument | null;
  /** 選択中のブロックID */
  selectedBlockId: string | null;
  /** プレビューモード */
  previewMode: PreviewMode;
  /** 未保存の変更があるか */
  isDirty: boolean;
  /** 読み込み中か */
  isLoading: boolean;
  /** 保存中か */
  isSaving: boolean;
}

// ============================================================
// 履歴管理
// ============================================================

/**
 * 履歴エントリ
 */
export interface HistoryEntry {
  /** ドキュメントのスナップショット */
  document: EmailDocument;
  /** タイムスタンプ */
  timestamp: string;
  /** 操作の説明 */
  description: string;
}

/**
 * 履歴状態
 */
export interface HistoryState {
  /** 過去の状態スタック */
  past: HistoryEntry[];
  /** 未来の状態スタック（Undo後にRedo可能） */
  future: HistoryEntry[];
  /** 履歴の最大保持数 */
  maxSize: number;
}

// ============================================================
// UI状態
// ============================================================

/**
 * UI状態
 */
export interface UIState {
  /** サイドバーが折りたたまれているか */
  sidebarCollapsed: boolean;
  /** プロパティパネルが折りたたまれているか */
  propertyPanelCollapsed: boolean;
  /** ズームレベル（パーセント） */
  zoomLevel: number;
  /** グリッド表示 */
  showGrid: boolean;
}

// ============================================================
// デフォルト値
// ============================================================

/**
 * グローバルスタイルのデフォルト値
 */
export const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  contentWidth: 600,
  backgroundColor: '#ffffff',
  linkColor: '#0066cc',
  textColor: '#333333',
  baseFontSize: 14,
  baseLineHeight: 1.5,
};

/**
 * 新規ドキュメントを作成
 */
export function createEmptyDocument(id: string, name: string): EmailDocument {
  const now = new Date().toISOString();
  return {
    id,
    name,
    sections: [],
    globalStyles: { ...DEFAULT_GLOBAL_STYLES },
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}
