# メールエディタ ブロックタイプ分析

## 概要

メールエディタに必要なブロックタイプを、業界標準のメールビルダー（Mailchimp、Klaviyo、Beefree、Stripo等）を参考に洗い出した。

---

## 1. 基本ブロック

| ブロック名 | 説明 | 優先度 |
|-----------|------|--------|
| Text | リッチテキスト編集（段落、見出し、リスト対応） | 必須 |
| Image | 単一画像の配置（リンク設定可） | 必須 |
| Button | CTA ボタン（リンク先設定） | 必須 |
| Divider | 区切り線（水平線） | 必須 |
| HTML | カスタム HTML コード挿入 | 推奨 |
| Heading | 見出し専用（H1-H6） | 推奨 |

### 各ブロックのプロパティ

#### Text ブロック
- `content`: HTML テキスト内容
- `fontSize`: フォントサイズ（px）
- `fontFamily`: フォントファミリー
- `textColor`: テキスト色
- `lineHeight`: 行間
- `textAlign`: 配置（left, center, right）
- `padding`: 内側余白（top, right, bottom, left）
- `backgroundColor`: 背景色

#### Image ブロック
- `src`: 画像 URL
- `alt`: 代替テキスト
- `width`: 幅（px または %）
- `height`: 高さ（auto 推奨）
- `linkUrl`: クリック時の遷移先
- `align`: 配置（left, center, right）
- `padding`: 内側余白
- `borderRadius`: 角丸

#### Button ブロック
- `text`: ボタンテキスト
- `linkUrl`: 遷移先 URL
- `backgroundColor`: ボタン背景色
- `textColor`: テキスト色
- `fontSize`: フォントサイズ
- `fontWeight`: フォント太さ
- `padding`: 内側余白
- `borderRadius`: 角丸
- `borderWidth`: 境界線幅
- `borderColor`: 境界線色
- `align`: 配置
- `width`: 幅（auto, full, fixed）

#### Divider ブロック
- `lineStyle`: 線種（solid, dashed, dotted）
- `lineWidth`: 線の太さ
- `lineColor`: 線の色
- `width`: 幅（%）
- `padding`: 上下余白

#### HTML ブロック
- `content`: 生の HTML コード

---

## 2. レイアウトブロック

| ブロック名 | 説明 | 優先度 |
|-----------|------|--------|
| Columns | 複数カラムのレイアウト | 必須 |
| Section | ブロックをグループ化するコンテナ | 必須 |
| Spacer | 垂直方向の余白 | 推奨 |

### 各ブロックのプロパティ

#### Columns ブロック
- `columns`: カラム配列
  - `width`: 各カラムの幅比率（例: "50%", "33.33%"）
  - `children`: カラム内のブロック配列
- `gap`: カラム間の余白
- `stackOnMobile`: モバイルで縦積みにするか
- `padding`: コンテナの内側余白
- `backgroundColor`: 背景色

**プリセット比率**:
- 1 カラム: 100%
- 2 カラム: 50/50, 33/67, 67/33, 25/75, 75/25
- 3 カラム: 33/33/33, 25/50/25, 50/25/25
- 4 カラム: 25/25/25/25

#### Section ブロック
- `children`: 内包するブロック配列
- `backgroundColor`: 背景色
- `backgroundImage`: 背景画像 URL
- `padding`: 内側余白
- `borderWidth`: 境界線幅
- `borderColor`: 境界線色
- `borderRadius`: 角丸
- `maxWidth`: 最大幅（メールコンテンツ幅制限）

#### Spacer ブロック
- `height`: 高さ（px）
- `mobileHeight`: モバイル時の高さ

---

## 3. 高度なブロック

| ブロック名 | 説明 | 優先度 |
|-----------|------|--------|
| Social | SNS アイコンリンク群 | 推奨 |
| Menu | ナビゲーションメニュー | 任意 |
| Video | ビデオサムネイル + 再生リンク | 任意 |
| Timer | カウントダウンタイマー | 任意 |
| Product | EC 商品表示（動的） | 任意 |
| Dynamic | パーソナライゼーション変数挿入 | 推奨 |

### 各ブロックのプロパティ

#### Social ブロック
- `icons`: SNS アイコン配列
  - `platform`: プラットフォーム名（facebook, twitter, instagram, linkedin, youtube 等）
  - `url`: リンク先 URL
  - `iconStyle`: アイコンスタイル（color, mono, outline）
- `iconSize`: アイコンサイズ
- `iconSpacing`: アイコン間隔
- `align`: 配置

#### Menu ブロック
- `items`: メニュー項目配列
  - `text`: 表示テキスト
  - `url`: リンク先
- `separator`: 区切り文字（"|", "-" 等）
- `fontSize`: フォントサイズ
- `textColor`: テキスト色
- `align`: 配置

#### Video ブロック
- `videoUrl`: 動画 URL（YouTube, Vimeo 等）
- `thumbnailUrl`: サムネイル画像 URL（自動生成 or カスタム）
- `playButtonStyle`: 再生ボタンスタイル
- `width`: 幅

#### Timer ブロック
- `endDate`: 終了日時
- `timezone`: タイムゾーン
- `format`: 表示形式（days, hours, minutes, seconds）
- `digitStyle`: 数字スタイル
- `labelStyle`: ラベルスタイル
- `expiredMessage`: 期限後メッセージ

#### Product ブロック
- `productId`: 商品 ID（動的挿入）
- `showImage`: 画像表示
- `showTitle`: タイトル表示
- `showPrice`: 価格表示
- `showDescription`: 説明表示
- `buttonText`: CTA ボタンテキスト
- `layout`: レイアウト（horizontal, vertical）

#### Dynamic ブロック
- `variable`: 変数名（first_name, company 等）
- `fallback`: フォールバック値

---

## 4. 共通プロパティ（全ブロック）

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `id` | string | ブロック一意識別子（UUID） |
| `type` | string | ブロックタイプ |
| `padding` | object | 内側余白 {top, right, bottom, left} |
| `margin` | object | 外側余白（主に上下） |
| `backgroundColor` | string | 背景色 |
| `borderWidth` | number | 境界線幅 |
| `borderColor` | string | 境界線色 |
| `borderRadius` | number | 角丸 |
| `hideOnMobile` | boolean | モバイルで非表示 |
| `hideOnDesktop` | boolean | デスクトップで非表示 |

---

## 5. ブロック間の制約

### ネスト可否マトリクス

| 親ブロック | ネスト可能な子 |
|-----------|---------------|
| Section | 全ブロック（Section 以外） |
| Columns | 全ブロック（Columns, Section 以外） |
| その他 | ネスト不可（リーフノード） |

### 制約ルール

1. **Section はルートレベルのみ**
   - Section 内に Section は配置不可
   - メールは Section の配列として構成

2. **Columns は Section 内のみ**
   - Columns を Columns 内に配置不可（2 階層以上のネスト禁止）

3. **基本ブロックはリーフノード**
   - Text, Image, Button, Divider, HTML 等は子を持てない

4. **モバイル対応**
   - Columns はモバイルで自動的に縦積み（stackOnMobile: true）

---

## 6. データ構造（案）

```typescript
interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
  children?: Block[]; // Section, Columns のみ
}

type BlockType =
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'html'
  | 'heading'
  | 'columns'
  | 'section'
  | 'spacer'
  | 'social'
  | 'menu'
  | 'video'
  | 'timer'
  | 'product'
  | 'dynamic';

interface EmailDocument {
  id: string;
  name: string;
  sections: Block[]; // type: 'section' のみ
  globalStyles: GlobalStyles;
}
```

---

## 7. 推奨実装フェーズ

### Phase 1（MVP）
- Text, Image, Button, Divider
- Section, Columns, Spacer

### Phase 2
- HTML, Heading
- Social, Menu

### Phase 3
- Video, Timer
- Product, Dynamic

---

## 8. 参考にした既存サービス

| サービス | 特徴 |
|---------|------|
| Mailchimp | シンプルなブロック構成、初心者向け |
| Klaviyo | EC 連携が強力、Product ブロック充実 |
| Beefree | 多彩なレイアウトオプション |
| Stripo | 高度なカスタマイズ、HTML 編集対応 |
| Unlayer | React 対応の埋め込みエディタ |

---

## 作成情報

- 作成日: 2026-01-27
- 作成者: 足軽3号（シニアUIデザイナー ペルソナ）
- 目的: email-editor プロジェクト Phase 1 調査
