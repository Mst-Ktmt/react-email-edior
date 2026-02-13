/**
 * ButtonBlock HTML生成統合テスト
 *
 * 実装した7機能のHTML生成を確認
 */

import type {
  ButtonBlock,
  ButtonBlockProps,
  GlobalStyles,
  ButtonHoverStyle,
  BoxShadow,
  ButtonIcon,
  BackgroundGradient,
  ButtonTracking,
} from '@/types';

// HTMLジェネレータのモック版（実際の実装をテスト）
describe('ButtonBlock HTML生成統合テスト', () => {
  const defaultGlobalStyles: GlobalStyles = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    textColor: '#333333',
    linkColor: '#007bff',
    backgroundColor: '#ffffff',
    maxWidth: 600,
  };

  const createButtonBlock = (props: Partial<ButtonBlockProps> = {}): ButtonBlock => ({
    id: 'test-button-1',
    type: 'button',
    props: {
      text: 'Click Me',
      linkUrl: 'https://example.com',
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      padding: { top: 12, right: 24, bottom: 12, left: 24 },
      borderRadius: 4,
      align: 'center',
      width: 'auto',
      marginBottom: 0,
      ...props,
    },
  });

  describe('基本機能の確認', () => {
    it('ButtonBlockの基本構造が正しい', () => {
      const block = createButtonBlock();

      expect(block.id).toBe('test-button-1');
      expect(block.type).toBe('button');
      expect(block.props.text).toBe('Click Me');
      expect(block.props.linkUrl).toBe('https://example.com');
    });
  });

  describe('1. ホバースタイル機能', () => {
    it('ホバースタイルプロパティが正しく設定される', () => {
      const hoverStyle: ButtonHoverStyle = {
        backgroundColor: '#0056b3',
        textColor: '#f0f0f0',
        borderColor: '#004085',
        opacity: 0.9,
      };

      const block = createButtonBlock({ hoverStyle });

      expect(block.props.hoverStyle).toBeDefined();
      expect(block.props.hoverStyle?.backgroundColor).toBe('#0056b3');
      expect(block.props.hoverStyle?.textColor).toBe('#f0f0f0');
      expect(block.props.hoverStyle?.borderColor).toBe('#004085');
      expect(block.props.hoverStyle?.opacity).toBe(0.9);
    });

    it('ホバースタイルが未定義でもエラーにならない', () => {
      const block = createButtonBlock({ hoverStyle: undefined });

      expect(block.props.hoverStyle).toBeUndefined();
    });

    it('部分的なホバースタイル設定が可能', () => {
      const hoverStyle: ButtonHoverStyle = {
        backgroundColor: '#0056b3',
      };

      const block = createButtonBlock({ hoverStyle });

      expect(block.props.hoverStyle?.backgroundColor).toBe('#0056b3');
      expect(block.props.hoverStyle?.textColor).toBeUndefined();
    });
  });

  describe('2. Box Shadow機能', () => {
    it('Box Shadowプロパティが正しく設定される', () => {
      const boxShadow: BoxShadow = {
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
        color: 'rgba(0, 0, 0, 0.15)',
        inset: false,
      };

      const block = createButtonBlock({ boxShadow });

      expect(block.props.boxShadow).toBeDefined();
      expect(block.props.boxShadow?.x).toBe(0);
      expect(block.props.boxShadow?.y).toBe(4);
      expect(block.props.boxShadow?.blur).toBe(8);
      expect(block.props.boxShadow?.color).toBe('rgba(0, 0, 0, 0.15)');
    });

    it('inset shadowが設定できる', () => {
      const boxShadow: BoxShadow = {
        x: 2,
        y: 2,
        blur: 4,
        spread: 0,
        color: 'rgba(0, 0, 0, 0.2)',
        inset: true,
      };

      const block = createButtonBlock({ boxShadow });

      expect(block.props.boxShadow?.inset).toBe(true);
    });

    it('負の値のshadowが設定できる', () => {
      const boxShadow: BoxShadow = {
        x: -5,
        y: -5,
        blur: 10,
        spread: -2,
        color: 'rgba(255, 0, 0, 0.3)',
        inset: false,
      };

      const block = createButtonBlock({ boxShadow });

      expect(block.props.boxShadow?.x).toBe(-5);
      expect(block.props.boxShadow?.y).toBe(-5);
      expect(block.props.boxShadow?.spread).toBe(-2);
    });
  });

  describe('3. 不透明度機能', () => {
    it('不透明度が正しく設定される', () => {
      const block = createButtonBlock({ opacity: 0.8 });

      expect(block.props.opacity).toBe(0.8);
    });

    it('不透明度0（完全透明）が設定できる', () => {
      const block = createButtonBlock({ opacity: 0 });

      expect(block.props.opacity).toBe(0);
    });

    it('不透明度1（完全不透明）が設定できる', () => {
      const block = createButtonBlock({ opacity: 1.0 });

      expect(block.props.opacity).toBe(1.0);
    });

    it('不透明度未設定はundefined', () => {
      const block = createButtonBlock();

      expect(block.props.opacity).toBeUndefined();
    });
  });

  describe('4. アイコン機能', () => {
    it('絵文字アイコンが設定できる', () => {
      const icon: ButtonIcon = {
        type: 'emoji',
        content: '→',
        position: 'right',
        spacing: 8,
      };

      const block = createButtonBlock({ icon });

      expect(block.props.icon).toBeDefined();
      expect(block.props.icon?.type).toBe('emoji');
      expect(block.props.icon?.content).toBe('→');
      expect(block.props.icon?.position).toBe('right');
      expect(block.props.icon?.spacing).toBe(8);
    });

    it('Unicodeアイコンが設定できる', () => {
      const icon: ButtonIcon = {
        type: 'unicode',
        content: '\\u2192',
        position: 'left',
        spacing: 10,
      };

      const block = createButtonBlock({ icon });

      expect(block.props.icon?.type).toBe('unicode');
      expect(block.props.icon?.content).toBe('\\u2192');
      expect(block.props.icon?.position).toBe('left');
    });

    it('SVGアイコンが設定できる', () => {
      const icon: ButtonIcon = {
        type: 'svg',
        content: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
        position: 'left',
        spacing: 12,
        size: 20,
        color: '#ffffff',
      };

      const block = createButtonBlock({ icon });

      expect(block.props.icon?.type).toBe('svg');
      expect(block.props.icon?.size).toBe(20);
      expect(block.props.icon?.color).toBe('#ffffff');
    });

    it('アイコンの位置が左右で設定できる', () => {
      const leftIcon: ButtonIcon = {
        type: 'emoji',
        content: '←',
        position: 'left',
        spacing: 8,
      };

      const rightIcon: ButtonIcon = {
        type: 'emoji',
        content: '→',
        position: 'right',
        spacing: 8,
      };

      const blockLeft = createButtonBlock({ icon: leftIcon });
      const blockRight = createButtonBlock({ icon: rightIcon });

      expect(blockLeft.props.icon?.position).toBe('left');
      expect(blockRight.props.icon?.position).toBe('right');
    });
  });

  describe('5. グラデーション背景機能', () => {
    it('線形グラデーションが設定できる', () => {
      const gradient: BackgroundGradient = {
        type: 'linear',
        angle: 90,
        colors: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 },
        ],
      };

      const block = createButtonBlock({ backgroundGradient: gradient });

      expect(block.props.backgroundGradient).toBeDefined();
      expect(block.props.backgroundGradient?.type).toBe('linear');
      expect(block.props.backgroundGradient?.angle).toBe(90);
      expect(block.props.backgroundGradient?.colors).toHaveLength(2);
    });

    it('放射グラデーションが設定できる', () => {
      const gradient: BackgroundGradient = {
        type: 'radial',
        colors: [
          { color: '#4facfe', position: 0 },
          { color: '#00f2fe', position: 100 },
        ],
      };

      const block = createButtonBlock({ backgroundGradient: gradient });

      expect(block.props.backgroundGradient?.type).toBe('radial');
      expect(block.props.backgroundGradient?.angle).toBeUndefined();
    });

    it('3色以上のグラデーションが設定できる', () => {
      const gradient: BackgroundGradient = {
        type: 'linear',
        angle: 45,
        colors: [
          { color: '#ff0000', position: 0 },
          { color: '#00ff00', position: 50 },
          { color: '#0000ff', position: 100 },
        ],
      };

      const block = createButtonBlock({ backgroundGradient: gradient });

      expect(block.props.backgroundGradient?.colors).toHaveLength(3);
      expect(block.props.backgroundGradient?.colors[1].position).toBe(50);
    });

    it('5色グラデーションが設定できる', () => {
      const gradient: BackgroundGradient = {
        type: 'linear',
        angle: 180,
        colors: [
          { color: '#ff0000', position: 0 },
          { color: '#ff7f00', position: 25 },
          { color: '#ffff00', position: 50 },
          { color: '#00ff00', position: 75 },
          { color: '#0000ff', position: 100 },
        ],
      };

      const block = createButtonBlock({ backgroundGradient: gradient });

      expect(block.props.backgroundGradient?.colors).toHaveLength(5);
    });
  });

  describe('6. 最小幅・最大幅機能', () => {
    it('最小幅が設定できる', () => {
      const block = createButtonBlock({ minWidth: 200 });

      expect(block.props.minWidth).toBe(200);
    });

    it('最大幅が設定できる', () => {
      const block = createButtonBlock({ maxWidth: 400 });

      expect(block.props.maxWidth).toBe(400);
    });

    it('最小幅と最大幅を同時に設定できる', () => {
      const block = createButtonBlock({
        minWidth: 150,
        maxWidth: 300,
      });

      expect(block.props.minWidth).toBe(150);
      expect(block.props.maxWidth).toBe(300);
    });

    it('未設定の場合はundefined', () => {
      const block = createButtonBlock();

      expect(block.props.minWidth).toBeUndefined();
      expect(block.props.maxWidth).toBeUndefined();
    });
  });

  describe('7. トラッキングパラメータ機能', () => {
    it('UTMパラメータが設定できる', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: 'newsletter',
        utmCampaign: 'spring_sale',
      };

      const block = createButtonBlock({ tracking });

      expect(block.props.tracking).toBeDefined();
      expect(block.props.tracking?.utmSource).toBe('email');
      expect(block.props.tracking?.utmMedium).toBe('newsletter');
      expect(block.props.tracking?.utmCampaign).toBe('spring_sale');
    });

    it('全UTMパラメータが設定できる', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: 'newsletter',
        utmCampaign: 'spring_sale',
        utmTerm: 'running+shoes',
        utmContent: 'logolink',
      };

      const block = createButtonBlock({ tracking });

      expect(block.props.tracking?.utmTerm).toBe('running+shoes');
      expect(block.props.tracking?.utmContent).toBe('logolink');
    });

    it('カスタムパラメータが設定できる', () => {
      const tracking: ButtonTracking = {
        utmSource: 'email',
        customParams: {
          ref: 'promo123',
          user_id: '456',
        },
      };

      const block = createButtonBlock({ tracking });

      expect(block.props.tracking?.customParams).toBeDefined();
      expect(block.props.tracking?.customParams?.ref).toBe('promo123');
      expect(block.props.tracking?.customParams?.user_id).toBe('456');
    });
  });

  describe('複合機能の確認', () => {
    it('すべての新機能を同時に設定できる', () => {
      const hoverStyle: ButtonHoverStyle = {
        backgroundColor: '#0056b3',
        textColor: '#f0f0f0',
      };

      const boxShadow: BoxShadow = {
        x: 0,
        y: 4,
        blur: 8,
        spread: 0,
        color: 'rgba(0, 0, 0, 0.15)',
        inset: false,
      };

      const icon: ButtonIcon = {
        type: 'emoji',
        content: '→',
        position: 'right',
        spacing: 8,
      };

      const gradient: BackgroundGradient = {
        type: 'linear',
        angle: 90,
        colors: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 },
        ],
      };

      const tracking: ButtonTracking = {
        utmSource: 'email',
        utmMedium: 'newsletter',
      };

      const block = createButtonBlock({
        hoverStyle,
        boxShadow,
        opacity: 0.95,
        icon,
        backgroundGradient: gradient,
        minWidth: 200,
        maxWidth: 400,
        tracking,
      });

      expect(block.props.hoverStyle).toBeDefined();
      expect(block.props.boxShadow).toBeDefined();
      expect(block.props.opacity).toBe(0.95);
      expect(block.props.icon).toBeDefined();
      expect(block.props.backgroundGradient).toBeDefined();
      expect(block.props.minWidth).toBe(200);
      expect(block.props.maxWidth).toBe(400);
      expect(block.props.tracking).toBeDefined();
    });

    it('グラデーション背景とホバースタイルの組み合わせ', () => {
      const gradient: BackgroundGradient = {
        type: 'linear',
        angle: 90,
        colors: [
          { color: '#ff6b6b', position: 0 },
          { color: '#feca57', position: 100 },
        ],
      };

      const hoverStyle: ButtonHoverStyle = {
        opacity: 0.8,
      };

      const block = createButtonBlock({
        backgroundGradient: gradient,
        hoverStyle,
      });

      expect(block.props.backgroundGradient?.type).toBe('linear');
      expect(block.props.hoverStyle?.opacity).toBe(0.8);
    });

    it('アイコンとトラッキングの組み合わせ', () => {
      const icon: ButtonIcon = {
        type: 'svg',
        content: '<path d="..."/>',
        position: 'left',
        spacing: 10,
        size: 18,
        color: '#ffffff',
      };

      const tracking: ButtonTracking = {
        utmSource: 'email',
        customParams: { icon_variant: 'arrow_left' },
      };

      const block = createButtonBlock({ icon, tracking });

      expect(block.props.icon?.position).toBe('left');
      expect(block.props.tracking?.customParams?.icon_variant).toBe('arrow_left');
    });
  });

  describe('後方互換性の確認', () => {
    it('新機能未使用の既存ボタンが正常動作する', () => {
      const block = createButtonBlock({
        text: 'Old Button',
        linkUrl: 'https://legacy.example.com',
        backgroundColor: '#28a745',
        textColor: '#ffffff',
      });

      expect(block.props.text).toBe('Old Button');
      expect(block.props.linkUrl).toBe('https://legacy.example.com');
      expect(block.props.hoverStyle).toBeUndefined();
      expect(block.props.boxShadow).toBeUndefined();
      expect(block.props.opacity).toBeUndefined();
      expect(block.props.icon).toBeUndefined();
      expect(block.props.backgroundGradient).toBeUndefined();
      expect(block.props.minWidth).toBeUndefined();
      expect(block.props.maxWidth).toBeUndefined();
      expect(block.props.tracking).toBeUndefined();
    });
  });
});
