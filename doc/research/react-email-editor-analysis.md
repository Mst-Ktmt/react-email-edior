# react-email-editor 機能調査報告書

> **調査日**: 2026-01-27
> **調査者**: 足軽1号（シニアソフトウェアエンジニア）
> **対象**: [react-email-editor](https://www.npmjs.com/package/react-email-editor) by Unlayer

---

## 1. 概要

react-email-editor は、[Unlayer](https://unlayer.com/) が提供するドラッグ＆ドロップ対応のビジュアルメールエディタの React ラッパーコンポーネントである。

```bash
npm install react-email-editor --save
```

---

## 2. 主要機能と特徴

| 機能 | 説明 |
|------|------|
| **ドラッグ＆ドロップ** | 直感的なUIでメールテンプレートを作成 |
| **TypeScript対応** | `EditorRef`, `EmailEditorProps` 型定義あり |
| **レスポンシブデザイン** | デスクトップ・モバイル・タブレット対応、プレビュー機能 |
| **多言語対応** | ローカライゼーション機能で複数言語UI |
| **ESP連携** | HubSpot, Mailchimp, Salesforce 等との統合可能 |
| **再利用可能ブロック** | 保存したブロックを他のデザインで再利用 |

---

## 3. APIとカスタマイズ可能な部分

### 3.1 Props（コンポーネントプロパティ）

| Prop | Type | Default | 説明 |
|------|------|---------|------|
| `editorId` | String | - | エディタコンテナのID |
| `style` | Object | `{}` | コンテナのCSSスタイル |
| `minHeight` | String | `500px` | エディタの最小高さ |
| `onLoad` | Function | - | エディタインスタンス作成時のコールバック |
| `onReady` | Function | - | エディタ読み込み完了時のコールバック |
| `options` | Object | `{}` | Unlayer設定オブジェクト |
| `tools` | Object | `{}` | ツール設定（表示/非表示、順序等） |
| `appearance` | Object | `{}` | テーマ・外観設定 |

### 3.2 Options 詳細

```typescript
options: {
  projectId: number,      // Unlayer プロジェクトID（必須の場合あり）
  displayMode: 'email',   // 表示モード
  version: 'latest',      // エディタバージョン
  amp: boolean,           // AMP対応
  customJS: string,       // カスタムツールJS URL
}
```

### 3.3 Methods（メソッド）

エディタインスタンスは `ref.current.editor` でアクセス：

| メソッド | 引数 | 説明 |
|----------|------|------|
| `loadDesign(data)` | Object | JSONデザインをエディタに読み込み |
| `saveDesign(callback)` | Function | デザインJSONを取得 |
| `exportHtml(callback)` | Function | HTML + デザインJSONを取得 |

### 3.4 基本実装例

```tsx
import React, { useRef } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';

const App = () => {
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    emailEditorRef.current?.editor?.exportHtml((data) => {
      const { design, html } = data;
      console.log('HTML:', html);
      console.log('Design JSON:', design);
    });
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // テンプレート読み込み例
    // unlayer.loadDesign(templateJson);
  };

  return (
    <div>
      <button onClick={exportHtml}>Export HTML</button>
      <EmailEditor ref={emailEditorRef} onReady={onReady} />
    </div>
  );
};
```

---

## 4. ブロックシステムの仕組み

### 4.1 標準ブロック（Built-in Tools）

| ブロック | 説明 |
|----------|------|
| Image | 画像挿入 |
| Text | テキストブロック |
| HTML | カスタムHTML |
| Button | ボタン要素 |
| Video | 動画埋め込み |
| Timer | カウントダウンタイマー |
| Divider | 区切り線 |
| Social | SNSリンク |

### 4.2 カスタムツール（Custom Tools）

独自ブロックを追加可能。`customJS` オプションで外部JSを指定：

```javascript
// custom.js
unlayer.registerTool({
  name: 'my_custom_tool',
  label: 'Custom Block',
  icon: 'fa-star',
  supportedDisplayModes: ['web', 'email'],
  options: { /* ... */ },
  values: { /* ... */ },
  renderer: { /* ... */ },
});
```

**注意**: カスタムツール内で React を使う場合は `window.unlayer.React` を参照。

### 4.3 再利用可能ブロック（Reusable Blocks）

- ユーザーが作成したブロックを保存・再利用
- ヘッダー、フッター、セクション単位で管理
- user-saved blocks 機能で有効化

---

## 5. エクスポート機能（HTML/JSON）

### 5.1 exportHtml()

```typescript
editor.exportHtml((data) => {
  const { design, html } = data;
  // design: JSONオブジェクト（再読み込み用）
  // html: レンダリング済みHTML文字列
});
```

### 5.2 saveDesign()

```typescript
editor.saveDesign((design) => {
  // design: JSONオブジェクトのみ
  // DBに保存して後で loadDesign() で復元
});
```

### 5.3 loadDesign()

```typescript
const templateJson = { /* 保存したJSON */ };
editor.loadDesign(templateJson);
```

---

## 6. 制限事項・注意点

### 6.1 ライセンス・依存

| 項目 | 内容 |
|------|------|
| **Unlayer依存** | Unlayer のサービス・インフラに依存 |
| **projectId** | 一部機能で Unlayer アカウント登録・projectId が必要 |
| **料金体系** | 無料版と有料版で機能差あり（要確認） |

### 6.2 技術的制約

| 項目 | 内容 |
|------|------|
| **カスタムJS** | カスタムツールは外部JSファイルで定義が必要 |
| **React連携** | カスタムツール内では `window.unlayer.React` を使用 |
| **バンドラー設定** | webpack使用時は externals 設定が必要な場合あり |

### 6.3 運用上の注意

- **バージョン管理**: `version: 'latest'` は本番環境では固定バージョン推奨
- **オフライン**: Unlayer CDN に依存するためオフライン環境では動作不可
- **セキュリティ**: ユーザー入力のHTMLはサニタイズが必要

---

## 7. 参考リンク

- [GitHub Repository](https://github.com/unlayer/react-email-editor)
- [Unlayer Documentation](https://docs.unlayer.com/builder/react-component)
- [Custom Tools Examples](https://examples.unlayer.com/custom_tools/)
- [Unlayer Blog - Features](https://unlayer.com/blog/react-email-editor-features)

---

## 8. 総評

react-email-editor は、ドラッグ＆ドロップで直感的にメールテンプレートを作成できる強力なライブラリである。カスタムツールによる拡張性も高い。ただし、Unlayer サービスへの依存度が高く、ライセンス・料金体系の確認が必要。プロダクション導入前に無料版の制限事項を確認することを推奨する。
