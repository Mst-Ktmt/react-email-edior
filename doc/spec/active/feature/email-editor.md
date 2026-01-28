# メールエディタ仕様書

## Meta

- Created: 2026-01-27
- Updated: 2026-01-28
- Status: review
- Related:
  - [react-email-editor調査](../../research/react-email-editor-analysis.md)
  - [UI分析](../../research/ui-analysis.md)
  - [ブロックタイプ分析](../../research/block-types-analysis.md)

## Overview

ドラッグ＆ドロップ対応のメールテンプレートエディタ。ユーザーはブロックを組み合わせてメールを作成し、HTML/JSON形式でエクスポートできる。

## Details

---

### 1. 概要・目的

| 項目 | 内容 |
|------|------|
| 目的 | 直感的なUIでメールテンプレートを作成できるエディタ |
| ターゲット | マーケター、非エンジニア |
| コア機能 | ドラッグ＆ドロップ編集、HTML/JSONエクスポート、レスポンシブ対応 |

---

### 2. 画面構成・UI設計

#### 2.1 3カラムレイアウト

```
┌─────────────────────────────────────────────────────────────┐
│                      ヘッダーバー (56px)                     │
│  [保存] [プレビュー] [デバイス切替] [Undo/Redo] [エクスポート] │
├────────────┬──────────────────────────┬─────────────────────┤
│ サイドバー  │       キャンバス          │  プロパティパネル    │
│ (260px)    │       (flex: 1)          │  (300px)           │
│            │                          │                     │
│ ブロック    │  ┌──────────────────┐   │  選択ブロックの      │
│ パレット   │  │  600px固定幅     │   │  プロパティ編集      │
│            │  │  メールプレビュー  │   │                     │
└────────────┴──┴──────────────────┴───┴─────────────────────┘
```

#### 2.2 各エリアの責務

| エリア | 幅 | 責務 |
|--------|-----|------|
| ヘッダーバー | 100% x 56px | グローバルアクション |
| サイドバー | 260px | ブロックパレット（DnDソース） |
| キャンバス | flex: 1 | メール編集領域（DnDターゲット） |
| プロパティパネル | 300px | 選択ブロックの設定編集 |

---

### 3. ブロックタイプ定義

#### 3.1 基本ブロック（Phase 1）

| タイプ | 説明 |
|--------|------|
| `text` | リッチテキスト |
| `image` | 画像（リンク設定可） |
| `button` | CTAボタン |
| `divider` | 区切り線 |

#### 3.2 レイアウトブロック（Phase 1）

| タイプ | 説明 |
|--------|------|
| `section` | ルートコンテナ |
| `columns` | マルチカラム（1-4列） |
| `spacer` | 垂直余白 |

#### 3.3 高度なブロック（Phase 2以降）

| タイプ | 説明 | Phase |
|--------|------|-------|
| `html` | カスタムHTML | 2 |
| `heading` | 見出し（H1-H6） | 2 |
| `social` | SNSアイコン群 | 2 |
| `menu` | ナビゲーション | 2 |
| `video` | ビデオサムネイル | 3 |
| `timer` | カウントダウン | 3 |

#### 3.4 ネスト制約

```
EmailDocument
  └─ Section[]（ルートレベルのみ）
       └─ Block | Columns
            └─ Block[]（Columnsの場合のみ）
```

- Section内にSectionは配置不可
- Columns内にColumnsは配置不可

---

### 4. コンポーネント設計（Atomic Design）

#### 4.1 Atoms

| コンポーネント | 用途 |
|----------------|------|
| `Button` | 汎用ボタン |
| `Input` | テキスト入力 |
| `ColorPicker` | カラー選択 |
| `Slider` | 数値スライダー |
| `Toggle` | ON/OFF切替 |
| `Icon` | アイコン表示 |

#### 4.2 Molecules

| コンポーネント | 用途 |
|----------------|------|
| `BlockThumbnail` | パレット内のブロックカード |
| `PropertyField` | ラベル+入力のペア |
| `DeviceToggle` | デスクトップ/モバイル切替 |
| `ActionToolbar` | ブロックのアクションボタン群 |

#### 4.3 Organisms

| コンポーネント | 用途 |
|----------------|------|
| `Sidebar` | ブロックパレット |
| `Canvas` | メール編集領域 |
| `PropertyPanel` | プロパティ編集パネル |
| `HeaderBar` | ヘッダーアクション |
| `BlockRenderer` | ブロック描画（タイプ別） |

#### 4.4 Templates

| コンポーネント | 用途 |
|----------------|------|
| `EditorLayout` | 3カラムレイアウト |

#### 4.5 Pages

| コンポーネント | 用途 |
|----------------|------|
| `EditorPage` | エディタページ本体 |

---

### 5. 状態管理設計（Zustand store構成）

#### 5.1 Store分割

```typescript
// stores/editorStore.ts - エディタ全体の状態
interface EditorStore {
  document: EmailDocument | null;
  selectedBlockId: string | null;
  previewMode: 'desktop' | 'mobile';
  isDirty: boolean;

  // Actions
  setDocument: (doc: EmailDocument) => void;
  selectBlock: (id: string | null) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
}

// stores/historyStore.ts - Undo/Redo履歴
interface HistoryStore {
  past: EmailDocument[];
  future: EmailDocument[];

  // Actions
  pushState: (doc: EmailDocument) => void;
  undo: () => EmailDocument | null;
  redo: () => EmailDocument | null;
}

// stores/uiStore.ts - UI状態
interface UIStore {
  sidebarCollapsed: boolean;
  propertyPanelCollapsed: boolean;

  // Actions
  toggleSidebar: () => void;
  togglePropertyPanel: () => void;
}
```

#### 5.2 ドキュメント操作

```typescript
// stores/documentActions.ts
interface DocumentActions {
  addBlock: (parentId: string, block: Block, index?: number) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, props: Partial<BlockProps>) => void;
  moveBlock: (blockId: string, newParentId: string, newIndex: number) => void;
  duplicateBlock: (blockId: string) => void;
}
```

---

### 6. 型定義設計（TypeScript types/interfaces）

```typescript
// types/block.ts

type BlockType =
  | 'text' | 'image' | 'button' | 'divider'
  | 'section' | 'columns' | 'spacer'
  | 'html' | 'heading' | 'social' | 'menu'
  | 'video' | 'timer';

interface BaseBlock {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

interface ContainerBlock extends BaseBlock {
  type: 'section' | 'columns';
  children: Block[];
}

interface LeafBlock extends BaseBlock {
  type: Exclude<BlockType, 'section' | 'columns'>;
}

type Block = ContainerBlock | LeafBlock;

// types/document.ts

interface EmailDocument {
  id: string;
  name: string;
  sections: ContainerBlock[];
  globalStyles: GlobalStyles;
  createdAt: string;
  updatedAt: string;
}

interface GlobalStyles {
  fontFamily: string;
  contentWidth: number;
  backgroundColor: string;
  linkColor: string;
}

// types/props.ts（各ブロックのprops型）

interface TextBlockProps {
  content: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  padding: Spacing;
  backgroundColor: string;
}

interface ImageBlockProps {
  src: string;
  alt: string;
  width: number | string;
  linkUrl?: string;
  align: 'left' | 'center' | 'right';
  padding: Spacing;
  borderRadius: number;
}

interface ButtonBlockProps {
  text: string;
  linkUrl: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  padding: Spacing;
  borderRadius: number;
  align: 'left' | 'center' | 'right';
  width: 'auto' | 'full' | number;
}

interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

---

### 7. ディレクトリ構成

```
src/
├── app/                        # Next.js App Router
│   ├── editor/
│   │   └── page.tsx           # エディタページ
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── ColorPicker/
│   │   ├── Slider/
│   │   └── Toggle/
│   ├── molecules/
│   │   ├── BlockThumbnail/
│   │   ├── PropertyField/
│   │   └── DeviceToggle/
│   ├── organisms/
│   │   ├── Sidebar/
│   │   ├── Canvas/
│   │   ├── PropertyPanel/
│   │   ├── HeaderBar/
│   │   └── BlockRenderer/
│   └── templates/
│       └── EditorLayout/
│
├── stores/
│   ├── editorStore.ts
│   ├── historyStore.ts
│   ├── uiStore.ts
│   └── documentActions.ts
│
├── types/
│   ├── block.ts
│   ├── document.ts
│   └── props.ts
│
├── lib/
│   ├── blockFactory.ts        # ブロック生成
│   ├── htmlExporter.ts        # HTMLエクスポート
│   └── jsonExporter.ts        # JSONエクスポート
│
├── hooks/
│   ├── useEditor.ts
│   ├── useDragAndDrop.ts
│   └── useHistory.ts
│
└── constants/
    ├── blockDefaults.ts       # ブロックのデフォルト値
    └── blockRegistry.ts       # ブロック定義一覧
```

---

### 8. 実装フェーズ計画

#### Phase 1: MVP（基盤構築）

| タスク | 内容 | 完了基準 |
|--------|------|----------|
| 1-1 | プロジェクトセットアップ（Next.js + Tailwind + Zustand） | ビルド・起動可能 |
| 1-2 | 型定義作成（block.ts, document.ts, props.ts） | 全ブロック型を網羅 |
| 1-3 | EditorLayout（3カラム: サイドバー260px, キャンバスflex, プロパティ300px） | レスポンシブ対応 |
| 1-4 | 基本ブロック実装（Text, Image, Button, Divider） | 各ブロック単体表示可能 |
| 1-5 | レイアウトブロック実装（Section, Columns, Spacer） | ネスト制約を満たす |
| 1-6 | dnd-kit統合（サイドバー→キャンバス、キャンバス内並べ替え） | ドラッグ&ドロップで追加・移動可能 |
| 1-7 | プロパティパネル（選択ブロックのprops編集） | 全Phase1ブロックの編集対応 |
| 1-8 | HTMLエクスポート（CSSインライン化） | Gmail/Outlookで表示確認 |

##### Phase 1 完了の定義

- [ ] 全基本ブロック（Text, Image, Button, Divider）がDnDで配置可能
- [ ] Section/Columnsでレイアウト構成可能
- [ ] 選択ブロックのプロパティ編集可能
- [ ] HTMLエクスポートでメールクライアント互換のHTML出力

#### Phase 2: 機能拡張

| タスク | 内容 |
|--------|------|
| 2-1 | Undo/Redo |
| 2-2 | 自動保存 |
| 2-3 | 高度なブロック（HTML, Heading, Social, Menu） |
| 2-4 | モバイルプレビュー |
| 2-5 | JSONエクスポート/インポート |

#### Phase 3: 高度な機能

| タスク | 内容 |
|--------|------|
| 3-1 | Video, Timerブロック |
| 3-2 | テンプレート保存/読み込み |
| 3-3 | 再利用可能ブロック |
| 3-4 | キーボードショートカット |

---

### 9. テスト方針

#### 9.1 テストレベル

| レベル | 対象 | ツール |
|--------|------|--------|
| Unit | ユーティリティ関数、ストアロジック | Vitest |
| Component | 個別コンポーネント | Vitest + Testing Library |
| Integration | DnD操作、エクスポート処理 | Playwright |
| E2E | エディタ全体のユーザーフロー | Playwright |

#### 9.2 Phase 1 必須テスト

| テスト対象 | テスト内容 |
|------------|------------|
| ブロック生成 | 各ブロックタイプのデフォルト値でインスタンス生成 |
| DnD操作 | サイドバー→キャンバスへのドロップ |
| プロパティ編集 | props変更が即時反映 |
| HTMLエクスポート | 出力HTMLが妥当（タグ閉じ、インラインCSS） |

#### 9.3 テストファイル配置

```
src/
├── __tests__/
│   ├── unit/           # ユニットテスト
│   ├── integration/    # 統合テスト
│   └── e2e/            # E2Eテスト
```

---

## Change Log

| Date | Changes |
|------|---------|
| 2026-01-27 | 初版作成（Phase 1調査結果統合） |
| 2026-01-28 | Phase 1スコープ明確化、テスト方針追加、Status: review |
