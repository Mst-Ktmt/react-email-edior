# ButtonBlock ユーザーガイド

## 概要

ButtonBlockは、メールテンプレート内でCTA（Call-to-Action）ボタンを作成するための強力なブロックです。このガイドでは、2024年に追加された7つの高度な機能の使い方を説明します。

---

## 目次

1. [基本設定](#基本設定)
2. [ホバー時スタイル](#1-ホバー時スタイル)
3. [Box Shadow（影効果）](#2-box-shadow影効果)
4. [不透明度](#3-不透明度)
5. [アイコン](#4-アイコン)
6. [グラデーション背景](#5-グラデーション背景)
7. [最小幅・最大幅](#6-最小幅最大幅)
8. [トラッキングパラメータ](#7-トラッキングパラメータ)
9. [複合利用例](#複合利用例)

---

## 基本設定

ButtonBlockの基本プロパティ：

- **Button Text**: ボタンに表示されるテキスト
- **Link URL**: クリック時の遷移先URL
- **Link Target**: `_blank`（新しいタブ）または`_self`（同じタブ）
- **Background Color**: ボタンの背景色
- **Text Color**: テキストの色
- **Font Size**: フォントサイズ（8-48px）
- **Border Radius**: 角丸の半径（0-50px）
- **Padding**: ボタン内側の余白
- **Alignment**: 左寄せ / 中央 / 右寄せ

---

## 1. ホバー時スタイル

マウスホバー時にボタンの見た目を変更する機能です。

### 使い方

1. **Hover Style**セクションで「Enable Hover Effect」をチェック
2. デフォルトでは背景色が10%暗くなる設定が自動適用されます
3. 以下の項目をカスタマイズ可能：
   - **Hover Background Color**: ホバー時の背景色
   - **Hover Text Color**: ホバー時のテキスト色
   - **Hover Border Color**: ホバー時のボーダー色（ボーダー幅 > 0の場合のみ）
   - **Hover Opacity**: ホバー時の不透明度（0-1）

### 実装の注意点

- メールクライアントによってホバー効果の対応状況が異なります
- Outlookではホバー効果が動作しません
- Gmail、Apple Mail、Thunderbirdなどのモダンクライアントで対応

### 推奨設定

```typescript
hoverStyle: {
  backgroundColor: '#0056b3', // 通常:#007bffより暗い色
  textColor: undefined,       // 変更なし
  opacity: 0.95,              // わずかに透明に
}
```

---

## 2. Box Shadow（影効果）

ボタンに立体感を与える影効果を追加します。

### 使い方

1. **Box Shadow**セクションで「Enable Shadow」をチェック
2. プリセットから選択：
   - **Subtle**: 控えめな影（推奨）
   - **Medium**: 中程度の影
   - **Strong**: 強い影
3. カスタム設定も可能：
   - **Horizontal Offset**: 水平方向のずれ（-50〜50px）
   - **Vertical Offset**: 垂直方向のずれ（-50〜50px）
   - **Blur Radius**: ぼかしの半径（0〜100px）
   - **Spread**: 影の広がり（-50〜50px）
   - **Shadow Color**: 影の色（RGBAで透明度指定可能）
   - **Inset**: 内側の影にする

### 推奨設定

```typescript
// 控えめな影（ほとんどのメールで有効）
boxShadow: {
  x: 0,
  y: 2,
  blur: 4,
  spread: 0,
  color: 'rgba(0, 0, 0, 0.1)',
  inset: false,
}
```

### 実装の注意点

- Outlookではbox-shadowが表示されません
- 影が強すぎるとスパムフィルターに引っかかる可能性があります
- Subtleプリセットを推奨

---

## 3. 不透明度

ボタン全体の不透明度を調整します。

### 使い方

1. **Button Options**セクションの「Opacity」スライダーを調整
2. 範囲：0（完全透明）〜 1.0（完全不透明）
3. ステップ：0.1

### 使用例

- **0.9**: わずかに透明（背景が少し透ける）
- **0.7**: 半透明効果（オーバーレイボタンに適用）
- **0.5**: 非活性状態の表現

### 実装の注意点

- Outlookでは`opacity`プロパティが動作しないため、コンテナの`opacity`として適用
- 透明度が低すぎるとクリック可能であることが伝わりにくくなります
- 推奨値：0.8〜1.0

---

## 4. アイコン

ボタンテキストの左または右にアイコンを追加します。

### 使い方

1. **Icon**セクションで「Enable Icon」をチェック
2. アイコンタイプを選択：
   - **Emoji**: 絵文字（プリセットまたはカスタム）
   - **Unicode**: Unicode文字（例：`\u2192`）
   - **SVG**: カスタムSVGパス
3. 設定項目：
   - **Position**: Left（左側）/ Right（右側）
   - **Spacing**: テキストとの間隔（0-50px）
   - **Size**: サイズ（SVGのみ、8-64px）
   - **Color**: 色（SVGのみ）

### アイコンタイプ別の特徴

#### Emoji
- **利点**: シンプル、全てのクライアントで表示可能
- **欠点**: OSによって見た目が異なる
- **推奨用途**: 矢印（→）、チェックマーク（✓）など

#### Unicode
- **利点**: 軽量、カスタマイズ可能
- **欠点**: 表示可能な記号が限定的
- **推奨用途**: 特殊記号、矢印記号

#### SVG
- **利点**: 完全カスタマイズ可能、サイズ・色を調整可能
- **欠点**: Outlookで表示されない（VML版では絵文字にフォールバック）
- **推奨用途**: ブランドアイコン、カスタムデザイン

### 推奨設定

```typescript
// 右矢印アイコン（最も汎用的）
icon: {
  type: 'emoji',
  content: '→',
  position: 'right',
  spacing: 8,
}

// カスタムSVGアイコン（モダンクライアント向け）
icon: {
  type: 'svg',
  content: '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
  position: 'left',
  spacing: 10,
  size: 18,
  color: '#ffffff',
}
```

---

## 5. グラデーション背景

単色ではなくグラデーション背景を設定します。

### 使い方

1. **Button Options**セクションで「Background Type」を「Gradient」に変更
2. プリセットから選択：
   - **Sunset**: 赤からオレンジへ
   - **Ocean**: 青から水色へ
   - **Purple**: 紫から濃い紫へ
3. カスタム設定：
   - **Gradient Type**: Linear（線形）/ Radial（放射）
   - **Angle**: 角度（Linearのみ、0-360度）
   - **Colors**: 2-5色のカラーストップ

### カラーストップの追加

1. 「+ Add Color」をクリック（最大5色）
2. 各色の設定：
   - **Color**: 色を選択
   - **Position**: グラデーション内の位置（0-100%）
3. 不要な色は「×」ボタンで削除（最低2色必要）

### 推奨設定

```typescript
// 線形グラデーション（左から右へ）
backgroundGradient: {
  type: 'linear',
  angle: 90,
  colors: [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ],
}

// 放射グラデーション（中心から外側へ）
backgroundGradient: {
  type: 'radial',
  colors: [
    { color: '#4facfe', position: 0 },
    { color: '#00f2fe', position: 100 },
  ],
}

// 3色グラデーション
backgroundGradient: {
  type: 'linear',
  angle: 45,
  colors: [
    { color: '#ff6b6b', position: 0 },
    { color: '#feca57', position: 50 },
    { color: '#ee5a6f', position: 100 },
  ],
}
```

### 実装の注意点

- Outlook 2007-2016では線形グラデーションのみ対応（VMLで2色まで）
- 放射グラデーションはOutlookで表示されません（単色フォールバック）
- 色数が多いほどファイルサイズが増加します
- 3色以内を推奨

---

## 6. 最小幅・最大幅

ボタンの幅に制約を設定します。

### 使い方

1. **Button Options**セクションの「Width Constraints」で設定
2. **Min Width**: 最小幅（0-1000px）
3. **Max Width**: 最大幅（0-1000px）
4. 0を設定すると制約なし

### 使用例

#### 固定幅ボタン
```typescript
minWidth: 200,
maxWidth: 200,
```

#### 可変幅（範囲指定）
```typescript
minWidth: 150,
maxWidth: 300,
```

#### 最小幅のみ指定
```typescript
minWidth: 180,
maxWidth: undefined,
```

### 推奨設定

- **短いテキスト**: `minWidth: 150px`（小さすぎる防止）
- **長いテキスト**: `maxWidth: 400px`（はみ出し防止）
- **レスポンシブ**: 最小幅のみ設定し、最大幅は未設定

---

## 7. トラッキングパラメータ

ボタンURLにUTMパラメータやカスタムパラメータを自動追加します。

### 使い方

1. **Tracking Parameters**セクションで「Enable Tracking」をチェック
2. UTMパラメータを設定：
   - **UTM Source**: トラフィックの発生源（例：`email`）
   - **UTM Medium**: メディアタイプ（例：`newsletter`）
   - **UTM Campaign**: キャンペーン名（例：`spring_sale`）
   - **UTM Term**: 検索キーワード（オプション）
   - **UTM Content**: コンテンツの種類（オプション）
3. カスタムパラメータを追加（オプション）：
   - 「+ Add Custom Parameter」をクリック
   - キーと値を入力（例：`ref: promo123`）

### 生成されるURL例

**設定:**
```typescript
linkUrl: 'https://example.com/products'
tracking: {
  utmSource: 'email',
  utmMedium: 'newsletter',
  utmCampaign: 'spring_sale_2024',
  customParams: {
    ref: 'promo123',
    user_segment: 'premium',
  },
}
```

**生成されるURL:**
```
https://example.com/products?utm_source=email&utm_medium=newsletter&utm_campaign=spring_sale_2024&ref=promo123&user_segment=premium
```

### UTMパラメータの推奨値

| パラメータ | 推奨値 | 説明 |
|----------|--------|------|
| utm_source | `email` | メール経由のトラフィック |
| utm_medium | `newsletter` / `promotional` / `transactional` | メールの種類 |
| utm_campaign | キャンペーン名 | `spring_sale_2024`等の識別子 |
| utm_content | ボタンの位置 | `hero_button` / `footer_button`等 |
| utm_term | A/Bテストのバリアント | `variant_a` / `variant_b`等 |

### 使用例

#### メールマーケティングキャンペーン
```typescript
tracking: {
  utmSource: 'email',
  utmMedium: 'newsletter',
  utmCampaign: 'spring_sale_2024',
  utmContent: 'hero_cta',
}
```

#### A/Bテスト
```typescript
tracking: {
  utmSource: 'email',
  utmMedium: 'promotional',
  utmCampaign: 'welcome_series',
  utmContent: 'variant_b',
  customParams: {
    ab_test_id: 'test_123',
  },
}
```

#### アフィリエイトトラッキング
```typescript
tracking: {
  utmSource: 'email',
  customParams: {
    affiliate_id: 'partner_456',
    commission_rate: '10',
  },
}
```

### 実装の注意点

- 既存のクエリパラメータとも共存可能
- 無効なURLの場合はパラメータを追加せず元のURLを維持
- 特殊文字は自動的にエンコードされます
- トラッキングパラメータはメールクライアント、VML版の両方に適用されます

---

## 複合利用例

複数の機能を組み合わせた実用的な例を紹介します。

### 例1: プレミアムCTAボタン

目立つ、高品質なCTAボタン

```typescript
{
  text: '今すぐ購入',
  linkUrl: 'https://shop.example.com/products',

  // グラデーション背景
  backgroundGradient: {
    type: 'linear',
    angle: 135,
    colors: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 },
    ],
  },

  // Box Shadow
  boxShadow: {
    x: 0,
    y: 4,
    blur: 12,
    spread: 0,
    color: 'rgba(102, 126, 234, 0.4)',
    inset: false,
  },

  // ホバー効果
  hoverStyle: {
    opacity: 0.9,
  },

  // アイコン
  icon: {
    type: 'emoji',
    content: '→',
    position: 'right',
    spacing: 10,
  },

  // 幅制約
  minWidth: 200,

  // トラッキング
  tracking: {
    utmSource: 'email',
    utmMedium: 'newsletter',
    utmCampaign: 'product_launch',
    utmContent: 'hero_cta',
  },
}
```

### 例2: 控えめなセカンダリボタン

サブアクション用の控えめなボタン

```typescript
{
  text: '詳細を見る',
  linkUrl: 'https://example.com/about',

  // 単色背景（透明度あり）
  backgroundColor: '#6c757d',
  opacity: 0.85,

  // 軽い影
  boxShadow: {
    x: 0,
    y: 1,
    blur: 3,
    spread: 0,
    color: 'rgba(0, 0, 0, 0.08)',
    inset: false,
  },

  // ホバー時に少し濃く
  hoverStyle: {
    opacity: 1.0,
  },

  // 最小幅のみ設定
  minWidth: 120,

  tracking: {
    utmSource: 'email',
    utmContent: 'secondary_cta',
  },
}
```

### 例3: アイコンのみのソーシャルボタン

SNSシェアボタンなど

```typescript
{
  text: '',  // テキストなし
  linkUrl: 'https://twitter.com/share',

  backgroundColor: '#1DA1F2',  // Twitter色

  // SVGアイコン（Twitterロゴ）
  icon: {
    type: 'svg',
    content: '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>',
    position: 'left',
    spacing: 0,
    size: 20,
    color: '#ffffff',
  },

  // 正方形
  minWidth: 48,
  maxWidth: 48,
  padding: { top: 14, right: 14, bottom: 14, left: 14 },
  borderRadius: 24,  // 円形

  boxShadow: {
    x: 0,
    y: 2,
    blur: 4,
    spread: 0,
    color: 'rgba(29, 161, 242, 0.3)',
    inset: false,
  },

  tracking: {
    utmSource: 'email',
    customParams: {
      social_network: 'twitter',
    },
  },
}
```

---

## トラブルシューティング

### ホバー効果が動作しない

- **原因**: Outlookなど一部のメールクライアントでは非対応
- **解決策**: デフォルトの状態を十分に目立たせ、ホバーは「追加の演出」と位置づける

### Box Shadowが表示されない

- **原因**: Outlookでは`box-shadow`が非対応
- **解決策**: 影なしでも十分に視認できるデザインにする

### グラデーションが単色になる

- **原因**: Outlookでは放射グラデーションや3色以上のグラデーションが非対応
- **解決策**: 線形グラデーション（2色）を使用するか、単色背景にフォールバック

### SVGアイコンが表示されない

- **原因**: Outlookでは SVG 非対応
- **解決策**: VML版では絵文字にフォールバックするため、重要な情報はテキストで表現

### トラッキングパラメータが追加されない

- **原因**: URLが無効な形式（プロトコルなしなど）
- **解決策**: `https://`から始まる完全なURLを指定

---

## ベストプラクティス

### 1. メールクライアント互換性を意識する

- **優先度**: Outlook対応 > モダンクライアント対応
- Outlookで表示崩れがない設計を基本とし、モダンクライアントでの追加演出と位置づける

### 2. 控えめなデザインから始める

- 過度な装飾はスパムフィルターに引っかかるリスクあり
- 影は「Subtle」、不透明度は0.9以上を推奨

### 3. A/Bテストで効果測定

- トラッキングパラメータを活用してボタンデザインの効果を測定
- `utm_content`に`button_v1`, `button_v2`等を設定

### 4. レスポンシブデザインを考慮

- モバイルでの表示も確認（プレビュー機能を活用）
- 最小幅を設定してモバイルでタップしやすいサイズを確保（推奨: 150px以上）

### 5. アクセシビリティを忘れずに

- テキストと背景のコントラスト比を確保（WCAG AA準拠: 4.5:1以上）
- アイコンだけでなく必ずテキストも含める
- ボタンの目的が明確に伝わるテキストを使用

---

## 更新履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2024-02-12 | 1.0.0 | 初版作成。7つの新機能を追加 |

---

## 関連ドキュメント

- [仕様書: button-block-enhancement.md](../../spec/active/feature/button-block-enhancement.md)
- [メールエディタ全体仕様](../../spec/active/feature/email-editor.md)
- [Unlayer機能パリティ](../../spec/active/feature/unlayer-parity.md)
