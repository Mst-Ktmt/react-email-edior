import type { SocialPlatform } from '@/types';

export interface PlatformMetadata {
  id: SocialPlatform;
  label: string;
  iconSlug: string; // Simple Icons slug
  brandColor: string;
  category: 'social' | 'messaging' | 'content' | 'community' | 'design';
}

export const SOCIAL_PLATFORMS: PlatformMetadata[] = [
  // Social
  { id: 'facebook', label: 'Facebook', iconSlug: 'facebook', brandColor: '#1877F2', category: 'social' },
  { id: 'twitter', label: 'X (Twitter)', iconSlug: 'x', brandColor: '#000000', category: 'social' },
  { id: 'instagram', label: 'Instagram', iconSlug: 'instagram', brandColor: '#E4405F', category: 'social' },
  { id: 'threads', label: 'Threads', iconSlug: 'threads', brandColor: '#000000', category: 'social' },
  { id: 'mastodon', label: 'Mastodon', iconSlug: 'mastodon', brandColor: '#6364FF', category: 'social' },
  { id: 'snapchat', label: 'Snapchat', iconSlug: 'snapchat', brandColor: '#FFFC00', category: 'social' },
  { id: 'tiktok', label: 'TikTok', iconSlug: 'tiktok', brandColor: '#000000', category: 'social' },
  { id: 'pinterest', label: 'Pinterest', iconSlug: 'pinterest', brandColor: '#E60023', category: 'social' },
  { id: 'wechat', label: 'WeChat', iconSlug: 'wechat', brandColor: '#07C160', category: 'social' },
  { id: 'weibo', label: 'Weibo', iconSlug: 'sinaweibo', brandColor: '#E6162D', category: 'social' },

  // Messaging
  { id: 'whatsapp', label: 'WhatsApp', iconSlug: 'whatsapp', brandColor: '#25D366', category: 'messaging' },
  { id: 'line', label: 'LINE', iconSlug: 'line', brandColor: '#00B900', category: 'messaging' },
  { id: 'telegram', label: 'Telegram', iconSlug: 'telegram', brandColor: '#26A5E4', category: 'messaging' },

  // Content
  { id: 'youtube', label: 'YouTube', iconSlug: 'youtube', brandColor: '#FF0000', category: 'content' },
  { id: 'medium', label: 'Medium', iconSlug: 'medium', brandColor: '#000000', category: 'content' },
  { id: 'spotify', label: 'Spotify', iconSlug: 'spotify', brandColor: '#1DB954', category: 'content' },
  { id: 'reddit', label: 'Reddit', iconSlug: 'reddit', brandColor: '#FF4500', category: 'content' },
  { id: 'vimeo', label: 'Vimeo', iconSlug: 'vimeo', brandColor: '#1AB7EA', category: 'content' },

  // Community
  { id: 'discord', label: 'Discord', iconSlug: 'discord', brandColor: '#5865F2', category: 'community' },
  { id: 'twitch', label: 'Twitch', iconSlug: 'twitch', brandColor: '#9146FF', category: 'community' },
  { id: 'github', label: 'GitHub', iconSlug: 'github', brandColor: '#181717', category: 'community' },

  // Design
  { id: 'behance', label: 'Behance', iconSlug: 'behance', brandColor: '#1769FF', category: 'design' },
  { id: 'dribbble', label: 'Dribbble', iconSlug: 'dribbble', brandColor: '#EA4C89', category: 'design' },
];

export function getPlatformMetadata(platform: SocialPlatform): PlatformMetadata | undefined {
  return SOCIAL_PLATFORMS.find((p) => p.id === platform);
}

export function getPlatformsByCategory(category: PlatformMetadata['category']): PlatformMetadata[] {
  return SOCIAL_PLATFORMS.filter((p) => p.category === category);
}
