# Unlayer機能パリティ仕様書

## Meta
- Created: 2026-01-28
- Updated: 2026-01-28
- Status: approved
- Related: [Unlayer Docs](https://docs.unlayer.com/builder/email-builder)

## Overview

react-email-editor (Unlayer) と同等の機能を実装するための仕様書。
ハイブリッド戦略で段階的に機能を追加していく。

---

## Phase 1: 基本インタラクション

### 1.1 Headingインライン編集
**現状**: クリックしても選択のみ、編集はPropertyEditorからのみ
**目標**: TextBlockと同様にダブルクリックでインライン編集可能にする

**実装内容**:
- HeadingBlockにcontentEditable対応追加
- RichTextToolbar表示（簡易版: B, I, U, S, リンク）
- onUpdateContent コールバック追加
- Escでキャンセル、Enterで確定

### 1.2 Buttonテキストインライン編集
**現状**: クリックしても選択のみ
**目標**: ダブルクリックでボタンテキストを直接編集可能

**実装内容**:
- ButtonBlockにcontentEditable対応追加
- シンプルなテキスト入力（リッチテキスト不要）
- onUpdateText コールバック追加

### 1.3 ツールバーにテキスト色追加
**現状**: B, I, U, S, リンク, 上付き, 下付き, 絵文字
**目標**: テキスト色変更ボタン追加

**実装内容**:
- RichTextToolbarにColorPickerポップオーバー追加
- document.execCommand('foreColor', false, color) で適用
- 現在の選択テキストの色を検出して表示

---

## Phase 2: 共通コンポーネント化

### 2.1 FontFamilySelect
```typescript
interface FontFamilySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const FONT_OPTIONS = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
];
```

### 2.2 FontWeightSelect
```typescript
interface FontWeightSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const WEIGHT_OPTIONS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
];
```

### 2.3 LinkTargetSelect
```typescript
interface LinkTargetSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const TARGET_OPTIONS = [
  { value: '_self', label: 'Same Tab' },
  { value: '_blank', label: 'New Tab' },
];
```

### 2.4 ResponsiveToggle
```typescript
interface ResponsiveToggleProps {
  hideOnDesktop: boolean;
  hideOnMobile: boolean;
  onChangeDesktop: (value: boolean) => void;
  onChangeMobile: (value: boolean) => void;
}
```

---

## Phase 3: 全ブロック適用

各エディタに共通コンポーネントを追加:

| ブロック | FontFamily | FontWeight | LetterSpacing | LinkTarget | Responsive |
|----------|------------|------------|---------------|------------|------------|
| Text | ✅ | ✅ | ✅ | - | ✅ |
| Heading | ✅ | ✅ | ✅ | - | ✅ |
| Button | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image | - | - | - | ✅ | ✅ |
| Menu | ✅ | ✅ | ✅ | ✅ | ✅ |
| Social | - | - | - | - | ✅ |
| Divider | - | - | - | - | ✅ |
| Spacer | - | - | - | - | ✅ |
| HTML | - | - | - | - | ✅ |

---

## Phase 4: 高度な機能

### 4.1 ビジュアル列選択UI
- Columnsセクションに視覚的なレイアウトグリッド表示
- クリックで列構成を変更（1列、2列50/50、2列33/66など）
- ドラッグで列幅を調整

### 4.2 セクション間/列間ブロック移動
- ブロックを別セクションにドラッグ可能
- Columnsの列間でブロック移動可能

### 4.3 Body設定強化
- Preheader Text
- グローバルFont Family/Weight
- Link Color/Underline設定
- HTML Title (Accessibility)

---

## Change Log

| Date | Changes |
|------|---------|
| 2026-01-28 | 初版作成、Phase 1-4の計画策定 |
