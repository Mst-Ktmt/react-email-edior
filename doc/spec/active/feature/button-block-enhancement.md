# Buttonブロック機能拡張仕様書

## Meta

- **Created:** 2026-02-06
- **Updated:** 2026-02-06
- **Status:** approved
- **Related:**
  - メールエディタ 不足機能の網羅的リスト（2026年版）
  - doc/spec/active/feature/email-editor.md

---

## 概要

現在のButtonブロックに不足している7つの機能を追加し、競合製品（Unlayer、Stripo）との機能パリティを実現します。これにより、ボタンのデザイン表現力とインタラクティブ性を大幅に向上させます。

**実装期間:** 2-3週間（全7機能）

---

## 現在の実装状況

### 既存プロパティ（ButtonBlockProps）

```typescript
export interface ButtonBlockProps extends ResponsiveSettings {
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

  // レスポンシブ（継承）
  hideOnDesktop?: boolean;
  hideOnMobile?: boolean;
}
```

---

## 追加機能仕様

### 1. ホバー時スタイル（Priority: 1）

#### 概要
ボタンにマウスホバー時の視覚的フィードバックを追加し、インタラクティブ性を向上させます。

#### 型定義

```typescript
export interface ButtonHoverStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  opacity?: number; // 0-1
}

// ButtonBlockPropsに追加
export interface ButtonBlockProps extends ResponsiveSettings {
  // ... 既存プロパティ ...
  hoverStyle?: ButtonHoverStyle;
}
```

#### デフォルト値

```typescript
const DEFAULT_HOVER_STYLE: ButtonHoverStyle = {
  // 未指定時は通常スタイルから自動生成
  // - backgroundColorを10%暗く
  // - textColorは変更なし
  // - borderColorを10%暗く
  // - opacityは1.0
};
```

#### UI設計

**プロパティパネル:**
```
Button Options
├─ Background Color: [#3b82f6]
├─ Text Color: [#ffffff]
└─ [▼] Hover Style (折りたたみ可能)
    ├─ Enable Hover Effect: [✓] (トグル)
    ├─ Hover Background Color: [#2563eb] (オプション)
    ├─ Hover Text Color: [#ffffff] (オプション)
    ├─ Hover Border Color: [#1d4ed8] (オプション)
    └─ Hover Opacity: [1.0] (0-1スライダー)
```

#### HTML/CSSエクスポート仕様

```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="{{ align }}">
  <tr>
    <td class="button-container" style="border-radius: {{ borderRadius }}px; background-color: {{ backgroundColor }};">
      <a href="{{ linkUrl }}"
         target="{{ linkTarget }}"
         class="button-link"
         style="
           display: inline-block;
           padding: {{ padding.top }}px {{ padding.right }}px {{ padding.bottom }}px {{ padding.left }}px;
           color: {{ textColor }};
           font-size: {{ fontSize }}px;
           font-family: {{ fontFamily }};
           text-decoration: none;
           border-radius: {{ borderRadius }}px;
           {{#if borderWidth}}
           border: {{ borderWidth }}px {{ borderStyle }} {{ borderColor }};
           {{/if}}
         ">
        {{ text }}
      </a>
    </td>
  </tr>
</table>

<style>
  .button-link:hover {
    {{#if hoverStyle.backgroundColor}}
    background-color: {{ hoverStyle.backgroundColor }} !important;
    {{/if}}
    {{#if hoverStyle.textColor}}
    color: {{ hoverStyle.textColor }} !important;
    {{/if}}
    {{#if hoverStyle.borderColor}}
    border-color: {{ hoverStyle.borderColor }} !important;
    {{/if}}
    {{#if hoverStyle.opacity}}
    opacity: {{ hoverStyle.opacity }};
    {{/if}}
  }
</style>
```

**VML対応（Outlook）:**
```html
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
             xmlns:w="urn:schemas-microsoft-com:office:word"
             href="{{ linkUrl }}"
             style="height:{{ totalHeight }}px;v-text-anchor:middle;width:{{ totalWidth }}px;"
             arcsize="{{ arcsize }}%"
             stroke="f"
             fillcolor="{{ backgroundColor }}">
  <w:anchorlock/>
  <center style="color:{{ textColor }};font-family:{{ fontFamily }};font-size:{{ fontSize }}px;">
    {{ text }}
  </center>
</v:roundrect>
<![endif]-->
```

**注意:** VMLではホバー効果は非対応のため、通常のスタイルのみ適用されます。

#### 実装難易度: 低

#### 推定工数: 1-2日

---

### 2. Box Shadow（影効果）（Priority: 2）

#### 概要
ボタンに影効果を追加し、立体感・奥行きを表現します。CTA（Call To Action）の視覚的強調に効果的です。

#### 型定義

```typescript
export interface BoxShadow {
  x: number;          // 水平オフセット（px）
  y: number;          // 垂直オフセット（px）
  blur: number;       // ぼかし半径（px）
  spread: number;     // 広がり（px）
  color: string;      // 影の色（rgba推奨）
  inset?: boolean;    // 内側の影
}

// ButtonBlockPropsに追加
export interface ButtonBlockProps extends ResponsiveSettings {
  // ... 既存プロパティ ...
  boxShadow?: BoxShadow;
}
```

#### デフォルト値

```typescript
const DEFAULT_BOX_SHADOW: BoxShadow = {
  x: 0,
  y: 2,
  blur: 4,
  spread: 0,
  color: 'rgba(0, 0, 0, 0.1)',
  inset: false,
};
```

#### UI設計

**プロパティパネル:**
```
Button Options
└─ [▼] Box Shadow (折りたたみ可能)
    ├─ Enable Shadow: [✓] (トグル)
    ├─ Horizontal Offset: [0] px
    ├─ Vertical Offset: [2] px
    ├─ Blur Radius: [4] px
    ├─ Spread: [0] px
    ├─ Shadow Color: [rgba(0,0,0,0.1)]
    ├─ Inset: [ ] (チェックボックス)
    └─ Presets: [Subtle | Medium | Strong] (プリセットボタン)
```

**プリセット:**
- **Subtle:** `0px 2px 4px 0px rgba(0,0,0,0.1)`
- **Medium:** `0px 4px 8px 0px rgba(0,0,0,0.15)`
- **Strong:** `0px 8px 16px 0px rgba(0,0,0,0.2)`

#### HTML/CSSエクスポート仕様

```css
.button-link {
  box-shadow: {{ boxShadow.inset ? 'inset' : '' }}
              {{ boxShadow.x }}px
              {{ boxShadow.y }}px
              {{ boxShadow.blur }}px
              {{ boxShadow.spread }}px
              {{ boxShadow.color }};
}
```

**メールクライアント対応:**
- Gmail, Apple Mail, Outlook.com: 完全対応
- Outlook 2007-2019: 非対応（影が表示されない）

#### 実装難易度: 低

#### 推定工数: 1-2日

---

### 3. アイコン追加機能（Priority: 3）

#### 概要
ボタンテキストの左右にアイコン（SVG/絵文字/Unicode）を追加できる機能。視覚的な訴求力向上とアクション種別の明示化に貢献します。

#### 型定義

```typescript
export type IconType = 'svg' | 'emoji' | 'unicode';

export interface ButtonIcon {
  type: IconType;
  content: string;        // SVGコード or 絵文字 or Unicode文字
  position: 'left' | 'right';
  spacing: number;        // アイコンとテキストの間隔（px）
  size?: number;          // アイコンサイズ（px、SVGのみ）
  color?: string;         // アイコン色（SVGのみ）
}

// ButtonBlockPropsに追加
export interface ButtonBlockProps extends ResponsiveSettings {
  // ... 既存プロパティ ...
  icon?: ButtonIcon;
}
```

#### デフォルト値

```typescript
const DEFAULT_ICON: ButtonIcon = {
  type: 'emoji',
  content: '→',
  position: 'right',
  spacing: 8,
  size: 16,
  color: undefined, // textColorを継承
};
```

#### UI設計

**プロパティパネル:**
```
Button Options
└─ [▼] Icon (折りたたみ可能)
    ├─ Enable Icon: [✓] (トグル)
    ├─ Icon Type: [Emoji ▼] (Emoji | Unicode | SVG)
    ├─ Icon Content:
    │   - Emoji: [絵文字ピッカー]
    │   - Unicode: [テキスト入力]
    │   - SVG: [テキストエリア]
    ├─ Position: [● Left  ○ Right]
    ├─ Spacing: [8] px
    └─ (SVGのみ表示)
        ├─ Size: [16] px
        └─ Color: [inherit | カラーピッカー]
```

**プリセットアイコン（絵文字）:**
```
→  ←  ↓  ↑  ✓  ✕  ★  ♥  📧  📞  🛒  ⬇  ⬆  ▶  ◀
```

#### HTML/CSSエクスポート仕様

**Emoji/Unicode:**
```html
<a href="{{ linkUrl }}" class="button-link" style="...">
  {{#if icon && icon.position === 'left'}}
    <span class="button-icon-left" style="margin-right: {{ icon.spacing }}px;">
      {{ icon.content }}
    </span>
  {{/if}}
  {{ text }}
  {{#if icon && icon.position === 'right'}}
    <span class="button-icon-right" style="margin-left: {{ icon.spacing }}px;">
      {{ icon.content }}
    </span>
  {{/if}}
</a>
```

**SVG:**
```html
<a href="{{ linkUrl }}" class="button-link" style="...">
  {{#if icon && icon.position === 'left'}}
    <span class="button-icon-left" style="display: inline-block; margin-right: {{ icon.spacing }}px; vertical-align: middle;">
      <svg width="{{ icon.size }}" height="{{ icon.size }}" fill="{{ icon.color || textColor }}" viewBox="0 0 24 24">
        {{ icon.content }}
      </svg>
    </span>
  {{/if}}
  <span style="vertical-align: middle;">{{ text }}</span>
  {{#if icon && icon.position === 'right'}}
    <span class="button-icon-right" style="display: inline-block; margin-left: {{ icon.spacing }}px; vertical-align: middle;">
      <svg width="{{ icon.size }}" height="{{ icon.size }}" fill="{{ icon.color || textColor }}" viewBox="0 0 24 24">
        {{ icon.content }}
      </svg>
    </span>
  {{/if}}
</a>
```

**VML対応（Outlook）:**
```html
<!--[if mso]>
<v:roundrect ... >
  <center style="...">
    {{ icon.position === 'left' ? icon.content + ' ' : '' }}{{ text }}{{ icon.position === 'right' ? ' ' + icon.content : '' }}
  </center>
</v:roundrect>
<![endif]-->
```

**注意:** SVGはOutlook 2007-2019では非対応。絵文字/Unicode推奨。

#### 実装難易度: 中

#### 推定工数: 3-5日

---

### 4. 不透明度制御（Priority: 4）

#### 概要
ボタン全体の不透明度を制御し、無効状態や背景画像上での視認性調整を可能にします。

#### 型定義

```typescript
// ButtonBlockPropsに追加
export interface ButtonBlockProps extends ResponsiveSettings {
  // ... 既存プロパティ ...
  opacity?: number; // 0-1（0.5 = 50%透明）
}
```

#### デフォルト値

```typescript
const DEFAULT_OPACITY = 1.0;
```

#### UI設計

**プロパティパネル:**
```
Button Options
└─ Opacity: [1.0] (0-1スライダー、表示は0-100%)
```

#### HTML/CSSエクスポート仕様

```css
.button-container {
  opacity: {{ opacity }};
}
```

**メールクライアント対応:**
- Gmail, Apple Mail, Outlook.com: 完全対応
- Outlook 2007-2019: 部分対応（filter: alpha(opacity=...)を使用）

```html
<!--[if mso]>
<div style="filter: alpha(opacity={{ opacity * 100 }});">
<![endif]-->
```

#### 実装難易度: 低

#### 推定工数: 1日

---

### 5. グラデーション背景（Priority: 5）

#### 概要
ボタン背景に線形/放射グラデーションを適用し、モダンなデザインを実現します。

#### 型定義

```typescript
export type GradientType = 'linear' | 'radial';

export interface GradientColor {
  color: string;
  position: number; // 0-100%
}

export interface BackgroundGradient {
  type: GradientType;
  angle?: number;           // linear用（0-360度）
  colors: GradientColor[];  // 2色以上
}

// ButtonBlockPropsに追加
export interface ButtonBlockProps extends ResponsiveSettings {
  // ... 既存プロパティ ...
  backgroundGradient?: BackgroundGradient;
}
```

#### デフォルト値

```typescript
const DEFAULT_GRADIENT: BackgroundGradient = {
  type: 'linear',
  angle: 90,
  colors: [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ],
};
```

#### UI設計

**プロパティパネル:**
```
Button Options
├─ Background Type: [● Solid  ○ Gradient]
├─ (Solidの場合) Background Color: [#3b82f6]
└─ (Gradientの場合)
    ├─ Gradient Type: [● Linear  ○ Radial]
    ├─ Angle: [90°] (Linear時のみ、0-360スライダー)
    ├─ Colors:
    │   ├─ Color 1: [#667eea] Position: [0%]
    │   ├─ Color 2: [#764ba2] Position: [100%]
    │   └─ [+ Add Color] (最大5色)
    └─ Presets: [Sunset | Ocean | Purple] (プリセットボタン)
```

**プリセット:**
- **Sunset:** `linear-gradient(90deg, #ff6b6b 0%, #feca57 100%)`
- **Ocean:** `linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)`
- **Purple:** `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`

#### HTML/CSSエクスポート仕様

```css
.button-container {
  {{#if backgroundGradient}}
    {{#if backgroundGradient.type === 'linear'}}
      background: linear-gradient(
        {{ backgroundGradient.angle }}deg,
        {{#each backgroundGradient.colors}}
          {{ color }} {{ position }}%{{#unless @last}},{{/unless}}
        {{/each}}
      );
    {{else}}
      background: radial-gradient(
        circle,
        {{#each backgroundGradient.colors}}
          {{ color }} {{ position }}%{{#unless @last}},{{/unless}}
        {{/each}}
      );
    {{/if}}
  {{else}}
    background-color: {{ backgroundColor }};
  {{/if}}
}
```

**VML対応（Outlook）:**
```html
<!--[if mso]>
<v:fill type="gradient" color="{{ backgroundGradient.colors[0].color }}" color2="{{ backgroundGradient.colors[backgroundGradient.colors.length - 1].color }}" />
<![endif]-->
```

**注意:** Outlookでは線形グラデーションのみ部分対応（2色のみ、角度は非対応）。

#### 実装難易度: 中

#### 推定工数: 2-3日

---

### 6. 最小幅・最大幅制御（Priority: 6）

#### 概要
ボタンの最小幅・最大幅を制御し、レスポンシブデザインでの柔軟性を向上させます。

#### 型定義

```typescript
// ButtonBlockPropsに追加
export interface ButtonBlockProps extends ResponsiveSettings {
  // ... 既存プロパティ ...
  minWidth?: number; // px
  maxWidth?: number; // px
}
```

#### デフォルト値

```typescript
const DEFAULT_MIN_WIDTH = undefined; // 制限なし
const DEFAULT_MAX_WIDTH = undefined; // 制限なし
```

#### UI設計

**プロパティパネル:**
```
Button Options
├─ Width: [Auto ▼] (Auto | Full | Custom)
└─ (Auto/Fullの場合)
    ├─ Min Width: [ ] px (オプション)
    └─ Max Width: [ ] px (オプション)
```

#### HTML/CSSエクスポート仕様

```css
.button-link {
  {{#if minWidth}}
  min-width: {{ minWidth }}px;
  {{/if}}
  {{#if maxWidth}}
  max-width: {{ maxWidth }}px;
  {{/if}}
}
```

**メールクライアント対応:**
- Gmail, Apple Mail, Outlook.com: 完全対応
- Outlook 2007-2019: 部分対応（min-widthは無視される場合あり）

#### 実装難易度: 低

#### 推定工数: 1日

---

### 7. トラッキング機能（Priority: 7）

#### 概要
ボタンURLにUTMパラメータやカスタムパラメータを自動付与し、クリックトラッキングを容易にします。

#### 型定義

```typescript
export interface ButtonTracking {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  customParams?: Record<string, string>; // カスタムパラメータ
}

// ButtonBlockPropsに追加
export interface ButtonBlockProps extends ResponsiveSettings {
  // ... 既存プロパティ ...
  tracking?: ButtonTracking;
}
```

#### デフォルト値

```typescript
const DEFAULT_TRACKING: ButtonTracking = {
  utmSource: 'email',
  utmMedium: 'newsletter',
  utmCampaign: undefined,
  utmTerm: undefined,
  utmContent: undefined,
  customParams: {},
};
```

#### UI設計

**プロパティパネル:**
```
Action
├─ URL: [https://example.com]
└─ [▼] Tracking Parameters (折りたたみ可能)
    ├─ UTM Source: [email]
    ├─ UTM Medium: [newsletter]
    ├─ UTM Campaign: [ ]
    ├─ UTM Term: [ ]
    ├─ UTM Content: [ ]
    └─ Custom Parameters:
        ├─ Key: [ref] Value: [promo123] [×]
        └─ [+ Add Parameter]
```

#### URL生成ロジック

```typescript
function buildTrackingUrl(baseUrl: string, tracking?: ButtonTracking): string {
  if (!tracking) return baseUrl;

  const url = new URL(baseUrl);

  // UTMパラメータ追加
  if (tracking.utmSource) url.searchParams.set('utm_source', tracking.utmSource);
  if (tracking.utmMedium) url.searchParams.set('utm_medium', tracking.utmMedium);
  if (tracking.utmCampaign) url.searchParams.set('utm_campaign', tracking.utmCampaign);
  if (tracking.utmTerm) url.searchParams.set('utm_term', tracking.utmTerm);
  if (tracking.utmContent) url.searchParams.set('utm_content', tracking.utmContent);

  // カスタムパラメータ追加
  if (tracking.customParams) {
    Object.entries(tracking.customParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}
```

#### HTML/CSSエクスポート仕様

```html
<a href="{{ buildTrackingUrl(linkUrl, tracking) }}" ...>
  {{ text }}
</a>
```

**出力例:**
```
元のURL: https://example.com
↓
トラッキング付きURL: https://example.com?utm_source=email&utm_medium=newsletter&utm_campaign=spring_sale&ref=promo123
```

#### 実装難易度: 低

#### 推定工数: 2-3日

---

## 更新された型定義（完全版）

```typescript
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
 * アイコン設定
 */
export type IconType = 'svg' | 'emoji' | 'unicode';

export interface ButtonIcon {
  type: IconType;
  content: string;
  position: 'left' | 'right';
  spacing: number;
  size?: number;
  color?: string;
}

/**
 * グラデーション設定
 */
export type GradientType = 'linear' | 'radial';

export interface GradientColor {
  color: string;
  position: number; // 0-100
}

export interface BackgroundGradient {
  type: GradientType;
  angle?: number;
  colors: GradientColor[];
}

/**
 * トラッキング設定
 */
export interface ButtonTracking {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  customParams?: Record<string, string>;
}

/**
 * ボタンブロックのプロパティ（拡張版）
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

  // レスポンシブ（継承）
  // hideOnDesktop?: boolean;
  // hideOnMobile?: boolean;

  // ========== 新規プロパティ ==========

  // ホバー時スタイル
  hoverStyle?: ButtonHoverStyle;

  // Box Shadow
  boxShadow?: BoxShadow;

  // アイコン
  icon?: ButtonIcon;

  // 不透明度
  opacity?: number; // 0-1

  // グラデーション背景
  backgroundGradient?: BackgroundGradient;

  // 最小幅・最大幅
  minWidth?: number; // px
  maxWidth?: number; // px

  // トラッキング
  tracking?: ButtonTracking;
}
```

---

## 実装フェーズ計画

### Phase 1: 基本強化（1週間）
**期間:** 2026-02-07 〜 2026-02-13

1. **型定義追加**（1日）
   - `src/types/props.ts` に新規型を追加
   - `ButtonBlockProps` を拡張

2. **ホバー時スタイル実装**（1-2日）
   - UI: `ButtonStylePanel` にホバー設定追加
   - エクスポート: HTML/CSS生成ロジック更新

3. **Box Shadow実装**（1-2日）
   - UI: `ButtonStylePanel` にシャドウ設定追加
   - プリセット機能実装

4. **不透明度制御実装**（1日）
   - UI: スライダー追加
   - エクスポート: opacity CSS追加

**成果物:**
- 型定義ファイル更新
- UIコンポーネント更新
- エクスポート機能更新
- 単体テスト追加

---

### Phase 2: デザイン拡張（1週間）
**期間:** 2026-02-14 〜 2026-02-20

1. **アイコン追加機能実装**（3-5日）
   - UI: アイコンタイプ選択、絵文字ピッカー、SVG入力
   - エクスポート: アイコン付きHTML生成
   - VML対応（Outlook）

2. **グラデーション背景実装**（2-3日）
   - UI: グラデーションエディタ
   - プリセット機能
   - エクスポート: グラデーションCSS生成

3. **最小幅・最大幅実装**（1日）
   - UI: 入力フィールド追加
   - エクスポート: CSS追加

**成果物:**
- アイコン機能完成
- グラデーション機能完成
- 幅制御機能完成
- 統合テスト追加

---

### Phase 3: マーケティング強化（1週間）
**期間:** 2026-02-21 〜 2026-02-27

1. **トラッキング機能実装**（2-3日）
   - UI: トラッキングパラメータ入力
   - URL生成ロジック実装
   - バリデーション追加

2. **統合テスト・品質保証**（2-3日）
   - 全機能の統合テスト
   - メールクライアント互換性テスト
   - リグレッションテスト

3. **ドキュメント作成**（1-2日）
   - ユーザーガイド作成
   - API仕様書更新
   - サンプルテンプレート作成

**成果物:**
- トラッキング機能完成
- 全機能テスト完了
- ドキュメント完成

---

## テスト要件

### 単体テスト

```typescript
// src/__tests__/types/button-props.test.ts
describe('ButtonBlockProps', () => {
  it('should accept hover style', () => {
    const props: ButtonBlockProps = {
      // ... 既存プロパティ ...
      hoverStyle: {
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        opacity: 0.9,
      },
    };
    expect(props.hoverStyle).toBeDefined();
  });

  it('should accept box shadow', () => {
    const props: ButtonBlockProps = {
      // ... 既存プロパティ ...
      boxShadow: {
        x: 0,
        y: 2,
        blur: 4,
        spread: 0,
        color: 'rgba(0,0,0,0.1)',
      },
    };
    expect(props.boxShadow).toBeDefined();
  });

  // ... 各プロパティのテスト ...
});
```

### 統合テスト

```typescript
// src/__tests__/export/button-export.test.ts
describe('Button HTML Export', () => {
  it('should export button with hover style', () => {
    const button: ButtonBlock = {
      id: '1',
      type: 'button',
      props: {
        text: 'Click Me',
        linkUrl: 'https://example.com',
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        hoverStyle: {
          backgroundColor: '#2563eb',
        },
        // ... その他のプロパティ ...
      },
    };

    const html = exportButtonToHtml(button);
    expect(html).toContain('.button-link:hover');
    expect(html).toContain('background-color: #2563eb');
  });

  // ... 各機能のエクスポートテスト ...
});
```

### メールクライアント互換性テスト

**対象クライアント:**
- Gmail（Desktop/Mobile）
- Apple Mail（macOS/iOS）
- Outlook.com
- Outlook 2007/2010/2013/2016/2019
- Yahoo Mail
- Android Gmail App

**テスト項目:**
- ホバー効果の動作確認
- Box Shadowの表示確認
- アイコンの表示確認（SVG/絵文字）
- グラデーション背景の表示確認
- 不透明度の表示確認

---

## ファイル変更一覧

### 型定義
- `src/types/props.ts` - ButtonBlockProps拡張、新規型追加

### UIコンポーネント
- `src/components/editor/properties/ButtonStylePanel.tsx` - スタイル設定UI更新
- `src/components/editor/properties/ButtonActionPanel.tsx` - トラッキング設定UI追加
- `src/components/editor/properties/IconPicker.tsx` - **新規作成**（絵文字ピッカー）
- `src/components/editor/properties/GradientEditor.tsx` - **新規作成**（グラデーションエディタ）

### エクスポート
- `src/export/html/blocks/exportButton.ts` - HTML生成ロジック更新
- `src/export/html/utils/buildTrackingUrl.ts` - **新規作成**（URL生成ユーティリティ）

### テスト
- `src/__tests__/types/button-props.test.ts` - **新規作成**
- `src/__tests__/export/button-export.test.ts` - **新規作成**

---

## 依存関係・技術スタック

### 既存ライブラリ
- React 18+
- TypeScript 5+
- Zustand（状態管理）
- Tailwind CSS（UI）

### 新規ライブラリ（不要、すべて標準機能で実装可能）
なし

---

## パフォーマンス考慮事項

### レンダリングパフォーマンス
- グラデーションエディタの色変更時はdebounce処理（300ms）を適用
- アイコンSVGの最大ファイルサイズ: 10KB（警告表示）

### HTMLエクスポートサイズ
- アイコンSVGを含む場合、HTMLサイズが増加（1ボタンあたり約1-2KB増）
- グラデーションはCSSのみのため影響小

---

## セキュリティ考慮事項

### XSS対策
- アイコンSVGコンテンツのサニタイゼーション必須
- トラッキングパラメータのURL検証

```typescript
// SVGサニタイゼーション例
import DOMPurify from 'dompurify';

function sanitizeSvg(svgContent: string): string {
  return DOMPurify.sanitize(svgContent, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
  });
}
```

### URL検証
```typescript
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

---

## 互換性・移行計画

### 後方互換性
すべての新規プロパティは**オプショナル**のため、既存のButtonBlockは変更なしで動作します。

### 既存データの移行
不要（新規プロパティはすべてオプショナル）

### バージョニング
- `ButtonBlockProps` バージョン: v1.0 → v2.0
- `EmailDocument` スキーマバージョン: 変更なし

---

## 今後の拡張可能性

### Phase 4以降で検討する機能
1. **アニメーション効果**（AMP Email対応時）
   - `animation?: { type: 'pulse' | 'shake', duration: number }`

2. **条件付き表示**（パーソナライゼーション機能統合時）
   - `conditionalDisplay?: { variable: string, operator: string, value: string }`

3. **A/Bテスト対応**
   - `variants?: ButtonBlockProps[]`

---

## 参考資料

### 競合製品
- [Unlayer Email Builder](https://unlayer.com/)
- [Stripo Email Template Builder](https://stripo.email/)

### ベストプラクティス
- [CSS Box Shadow Generator](https://cssgenerator.org/box-shadow-css-generator.html)
- [Email Client CSS Support](https://www.caniemail.com/)
- [VML Reference - Parcel](https://parcel.io/blog/is-vml-accessible)

### 技術仕様
- [HTML Email Best Practices](https://www.campaignmonitor.com/css/)
- [UTM Parameters Guide](https://support.google.com/analytics/answer/1033863)

---

## Change Log

| Date | Changes |
|------|---------|
| 2026-02-06 | 初版作成 - 7機能の詳細仕様を定義 |

---

## 承認

- [ ] 仕様レビュー完了
- [ ] 技術レビュー完了
- [ ] 実装開始承認

**レビュー担当:**
**承認日:**
