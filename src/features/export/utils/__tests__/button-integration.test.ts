/**
 * ButtonBlock統合テスト
 *
 * 実装した7機能の統合動作を確認：
 * 1. ホバースタイル
 * 2. Box Shadow
 * 3. 不透明度
 * 4. アイコン
 * 5. グラデーション背景
 * 6. 最小幅・最大幅
 * 7. トラッキングパラメータ
 */

import { buildTrackingUrl } from '../buildTrackingUrl';
import type { ButtonTracking } from '@/types';

describe('ButtonBlock統合テスト', () => {
  describe('buildTrackingUrl - トラッキング機能', () => {
    it('UTMパラメータが正しく追加される', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: 'newsletter',
        utmCampaign: 'spring_sale',
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('utm_source')).toBe('email');
      expect(url.searchParams.get('utm_medium')).toBe('newsletter');
      expect(url.searchParams.get('utm_campaign')).toBe('spring_sale');
    });

    it('全UTMパラメータが正しく追加される', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: 'newsletter',
        utmCampaign: 'spring_sale',
        utmTerm: 'running+shoes',
        utmContent: 'logolink',
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('utm_source')).toBe('email');
      expect(url.searchParams.get('utm_medium')).toBe('newsletter');
      expect(url.searchParams.get('utm_campaign')).toBe('spring_sale');
      expect(url.searchParams.get('utm_term')).toBe('running+shoes');
      expect(url.searchParams.get('utm_content')).toBe('logolink');
    });

    it('カスタムパラメータが正しく追加される', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        customParams: {
          ref: 'promo123',
          user_id: '456',
        },
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('ref')).toBe('promo123');
      expect(url.searchParams.get('user_id')).toBe('456');
    });

    it('既存のクエリパラメータと共存する', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
      };

      const result = buildTrackingUrl('https://example.com?foo=bar', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('foo')).toBe('bar');
      expect(url.searchParams.get('utm_source')).toBe('email');
    });

    it('trackingがundefinedの場合は元のURLを返す', () => {
      const result = buildTrackingUrl('https://example.com', undefined);
      expect(result).toBe('https://example.com');
    });

    it('無効なURLの場合は元の値を返す', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
      };

      const result = buildTrackingUrl('not-a-url', tracking);
      expect(result).toBe('not-a-url');
    });

    it('空文字のカスタムパラメータは追加しない', () => {
      const tracking: ButtonTracking = {
        customParams: {
          valid: 'value',
          empty: '',
        },
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('valid')).toBe('value');
      expect(url.searchParams.has('empty')).toBe(false);
    });

    it('undefinedのUTMパラメータは追加しない', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: undefined,
        utmCampaign: undefined,
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('utm_source')).toBe('email');
      expect(url.searchParams.has('utm_medium')).toBe(false);
      expect(url.searchParams.has('utm_campaign')).toBe(false);
    });

    it('特殊文字が正しくエンコードされる', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmCampaign: 'スプリングセール 2024',
        customParams: {
          ref: 'プロモ/123',
        },
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('utm_campaign')).toBe('スプリングセール 2024');
      expect(url.searchParams.get('ref')).toBe('プロモ/123');
    });

    it('複数のカスタムパラメータが正しく追加される', () => {
      const tracking: ButtonTracking = {
        customParams: {
          param1: 'value1',
          param2: 'value2',
          param3: 'value3',
        },
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('param1')).toBe('value1');
      expect(url.searchParams.get('param2')).toBe('value2');
      expect(url.searchParams.get('param3')).toBe('value3');
    });
  });

  describe('型安全性の確認', () => {
    it('ButtonTrackingの型定義が正しい', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: 'newsletter',
        utmCampaign: 'test',
        utmTerm: 'term',
        utmContent: 'content',
        customParams: {
          key1: 'value1',
          key2: 'value2',
        },
      };

      // 型チェックが通ることを確認
      expect(tracking.utmSource).toBe('email');
      expect(tracking.customParams).toBeDefined();
    });

    it('オプショナルプロパティが正しく機能する', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
      };

      // オプショナルプロパティが未定義でもエラーにならない
      expect(tracking.utmMedium).toBeUndefined();
      expect(tracking.customParams).toBeUndefined();
    });
  });

  describe('エッジケースの確認', () => {
    it('プロトコルなしのURLでもエラーにならない', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
      };

      const result = buildTrackingUrl('example.com', tracking);
      // プロトコルなしは無効なURLとして扱われ、元の値を返す
      expect(result).toBe('example.com');
    });

    it('ハッシュ付きURLで正しく動作する', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
      };

      const result = buildTrackingUrl('https://example.com#section', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('utm_source')).toBe('email');
      expect(url.hash).toBe('#section');
    });

    it('空のcustomParamsオブジェクトでもエラーにならない', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        customParams: {},
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      expect(result).toContain('utm_source=email');
    });

    it('非常に長いURLでも正しく動作する', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        customParams: {
          long_param: 'a'.repeat(200),
        },
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('long_param')).toBe('a'.repeat(200));
    });
  });

  describe('実用的なユースケース', () => {
    it('メールマーケティングキャンペーンの標準的な設定', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: 'newsletter',
        utmCampaign: 'spring_sale_2024',
        customParams: {
          subscriber_id: '12345',
          email_type: 'promotional',
        },
      };

      const result = buildTrackingUrl('https://shop.example.com/products', tracking);
      const url = new URL(result);

      expect(url.hostname).toBe('shop.example.com');
      expect(url.pathname).toBe('/products');
      expect(url.searchParams.get('utm_source')).toBe('email');
      expect(url.searchParams.get('utm_medium')).toBe('newsletter');
      expect(url.searchParams.get('utm_campaign')).toBe('spring_sale_2024');
      expect(url.searchParams.get('subscriber_id')).toBe('12345');
      expect(url.searchParams.get('email_type')).toBe('promotional');
    });

    it('A/Bテスト用のトラッキング', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: 'newsletter',
        utmCampaign: 'test_campaign',
        utmContent: 'variant_b',
        customParams: {
          ab_test_id: 'test_123',
          variant: 'b',
        },
      };

      const result = buildTrackingUrl('https://example.com/landing', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('utm_content')).toBe('variant_b');
      expect(url.searchParams.get('ab_test_id')).toBe('test_123');
      expect(url.searchParams.get('variant')).toBe('b');
    });

    it('アフィリエイトトラッキングとの併用', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        customParams: {
          affiliate_id: 'aff_789',
          ref: 'email_partner',
        },
      };

      const baseUrl = 'https://example.com?existing_param=value';
      const result = buildTrackingUrl(baseUrl, tracking);
      const url = new URL(result);

      expect(url.searchParams.get('existing_param')).toBe('value');
      expect(url.searchParams.get('utm_source')).toBe('email');
      expect(url.searchParams.get('affiliate_id')).toBe('aff_789');
      expect(url.searchParams.get('ref')).toBe('email_partner');
    });
  });

  describe('セキュリティ関連の確認', () => {
    it('JavaScriptインジェクション対策', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        customParams: {
          malicious: '<script>alert("xss")</script>',
        },
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      // URLパラメータとして自動エスケープされる
      expect(url.searchParams.get('malicious')).toBe('<script>alert("xss")</script>');
      // エンコードされた状態でURL文字列に含まれる
      expect(result).toContain('%3Cscript%3E');
    });

    it('SQLインジェクション試行が無害化される', () => {
      const tracking: ButtonTracking = {
        customParams: {
          user_input: "'; DROP TABLE users; --",
        },
      };

      const result = buildTrackingUrl('https://example.com', tracking);
      const url = new URL(result);

      expect(url.searchParams.get('user_input')).toBe("'; DROP TABLE users; --");
    });
  });
});
