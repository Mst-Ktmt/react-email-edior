# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### ButtonBlock Enhancement - 7つの高度な機能

**1. ホバー時スタイル**
- ボタンにマウスホバー時の視覚効果を追加
- 背景色、テキスト色、ボーダー色、不透明度のカスタマイズが可能
- デフォルトで背景色を10%暗くする自動生成機能
- メールクライアント別CSS（`:hover`疑似クラス）で実装
- 型定義: `ButtonHoverStyle`
- UI: `ButtonEditor.tsx` - Hover Style セクション

**2. Box Shadow（影効果）**
- ボタンに立体感を与える影効果を追加
- 3つのプリセット（Subtle / Medium / Strong）
- カスタム設定：オフセット（X/Y）、ぼかし、広がり、色、内側影
- 負の値のサポート（影を反対方向に適用）
- 型定義: `BoxShadow`
- UI: `components/atoms/BoxShadowEditor.tsx`
- エクスポート: `box-shadow` CSS プロパティとして生成

**3. 不透明度（Opacity）**
- ボタン全体の不透明度を0-1.0の範囲で調整
- 0.1刻みでの微調整が可能
- Outlook互換性のためコンテナレベルで適用
- プロパティ: `opacity?: number`
- UI: `ButtonEditor.tsx` - Button Options セクション
- エクスポート: コンテナ `<td>` の `opacity` スタイルとして適用

**4. アイコン**
- ボタンテキストの左または右にアイコンを追加
- 3つのアイコンタイプをサポート:
  - **Emoji**: 24種類のプリセット + カスタム入力
  - **Unicode**: Unicode文字コード（例: `\u2192`）
  - **SVG**: カスタムSVGパス（サイズ・色のカスタマイズ可能）
- テキストとの間隔調整（0-50px）
- 型定義: `ButtonIcon`, `IconType`
- UI: `components/atoms/IconEditor.tsx`, `EmojiPicker.tsx`
- エクスポート: HTML `<span>` でアイコンを生成、VML版では絵文字/Unicode のみサポート

**5. グラデーション背景**
- 単色背景の代わりにグラデーションを設定
- 線形グラデーション（Linear）と放射グラデーション（Radial）をサポート
- 2-5色のカラーストップを設定可能
- 角度調整（線形グラデーションのみ、0-360度）
- 3つのプリセット（Sunset / Ocean / Purple）
- 型定義: `BackgroundGradient`, `GradientColor`, `GradientType`
- UI: `components/atoms/GradientEditor.tsx`
- エクスポート: `linear-gradient()` / `radial-gradient()` CSS関数として生成
- Outlook対応: VML版では線形グラデーション（2色まで）のみサポート

**6. 最小幅・最大幅（Width Constraints）**
- ボタンの最小幅と最大幅を設定可能
- 範囲: 0-1000px
- 固定幅ボタンの作成（minWidth = maxWidth）
- レスポンシブな幅制約
- プロパティ: `minWidth?: number`, `maxWidth?: number`
- UI: `ButtonEditor.tsx` - Width Constraints セクション
- エクスポート: `min-width` / `max-width` CSS プロパティとして生成

**7. トラッキングパラメータ**
- ボタンURLにUTMパラメータとカスタムパラメータを自動追加
- 5つの標準UTMパラメータをサポート:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- カスタムパラメータの動的追加（キー・バリュー形式）
- 既存のクエリパラメータと共存可能
- 無効なURLに対する安全な処理
- 型定義: `ButtonTracking`
- UI: `ButtonEditor.tsx` - Tracking Parameters セクション
- ユーティリティ関数: `buildTrackingUrl()`
- エクスポート: VML版と標準HTML版の両方のリンクに適用

#### テストカバレッジ

- **統合テスト**: 51個のテストケースを追加
  - `button-integration.test.ts`: buildTrackingUrl関数のテスト（21ケース）
  - `button-html-generation.test.ts`: ButtonBlock型定義のテスト（30ケース）
- テスト内容:
  - UTMパラメータの正しい生成
  - カスタムパラメータの追加
  - エッジケース（無効URL、特殊文字、セキュリティ）
  - 各機能の型安全性
  - 複合機能の動作確認
  - 後方互換性の保証
- すべてのテストが成功（100%パス）

#### ドキュメント

- **ユーザーガイド**: `doc/guides/features/button-block.md`
  - 7つの新機能の詳細な使い方
  - 実装の注意点とメールクライアント互換性
  - 推奨設定と実用的な例
  - 複合利用例（プレミアムCTA、セカンダリボタン、ソーシャルボタン）
  - トラブルシューティングガイド
  - ベストプラクティス
- **CHANGELOG.md**: プロジェクトルートに作成（本ファイル）

### Changed

- `ButtonBlockProps` インターフェースを拡張（8つの新プロパティを追加）
- `ButtonEditor.tsx` を大幅に拡張（250行以上のコード追加）
- `generateButtonHtml()` 関数を拡張（全機能のHTML生成対応）
- `src/types/defaults.ts` にデフォルト値とプリセットを追加

### Technical Details

#### 新規ファイル
- `src/types/props.ts`: 型定義の拡張
- `src/types/defaults.ts`: デフォルト値とプリセットの追加
- `src/components/atoms/BoxShadowEditor.tsx`: Box Shadow編集UI（100行）
- `src/components/atoms/EmojiPicker.tsx`: 絵文字選択UI（70行）
- `src/components/atoms/IconEditor.tsx`: アイコン設定UI（200行）
- `src/components/atoms/GradientEditor.tsx`: グラデーション編集UI（230行）
- `src/features/export/utils/buildTrackingUrl.ts`: URLトラッキングユーティリティ（75行）
- `src/features/export/utils/__tests__/button-integration.test.ts`: 統合テスト（21ケース）
- `src/features/export/utils/__tests__/button-html-generation.test.ts`: 型定義テスト（30ケース）
- `doc/guides/features/button-block.md`: ユーザーガイド
- `CHANGELOG.md`: 変更履歴（本ファイル）

#### 修正ファイル
- `src/components/molecules/editors/ButtonEditor.tsx`: 7機能のUI統合
- `src/features/export/utils/htmlGenerator.ts`: HTML生成ロジックの拡張
- `src/components/atoms/index.ts`: 新規コンポーネントのエクスポート追加
- `src/types/index.ts`: 新規型定義のエクスポート追加

#### 互換性
- 既存のButtonBlockに対する完全な後方互換性を保証
- すべての新プロパティはオプショナル（`?`）
- 新機能未使用の既存ボタンは変更なしで動作

#### メールクライアント対応
- **完全対応**: Gmail, Apple Mail, Thunderbird, Yahoo Mail
- **部分対応**: Outlook（VMLフォールバック実装）
  - ホバースタイル: 非対応
  - Box Shadow: 非対応
  - 不透明度: コンテナレベルで対応
  - アイコン: 絵文字/Unicodeのみ対応（SVG非対応）
  - グラデーション: 線形・2色のみ対応（VML実装）
  - 幅制約: 対応
  - トラッキング: 対応

#### パフォーマンス
- TypeScriptコンパイル: 成功（エラー0件）
- ビルド時間: 2.9秒（影響なし）
- テスト実行: 51ケース、607ms
- 全テスト: 73ケース、1.35秒

### Breaking Changes

なし - 完全な後方互換性を維持

---

## [1.0.0] - 2024-01-27

### Added
- 初版リリース
- 基本的なメールエディタ機能
- 13種類のブロックタイプ
- グローバルスタイル設定
- HTML/JSON エクスポート

---

## リリースノート形式

### バージョン番号の規則

- **Major (X.0.0)**: 破壊的変更
- **Minor (0.X.0)**: 新機能追加（後方互換性あり）
- **Patch (0.0.X)**: バグ修正

### カテゴリ

- **Added**: 新機能
- **Changed**: 既存機能の変更
- **Deprecated**: 非推奨となった機能
- **Removed**: 削除された機能
- **Fixed**: バグ修正
- **Security**: セキュリティ関連の変更

---

[Unreleased]: https://github.com/your-org/email-editor/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-org/email-editor/releases/tag/v1.0.0
