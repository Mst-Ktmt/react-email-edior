'use client';

import { useMemo } from 'react';
import * as SimpleIcons from 'simple-icons';
import type { SocialPlatform, IconStyle } from '@/types';
import { getPlatformMetadata } from '@/lib/social/platforms';

interface SocialIconProps {
  platform: SocialPlatform;
  iconStyle: IconStyle;
  size: number;
  color?: string;
  className?: string;
}

export function SocialIcon({
  platform,
  iconStyle,
  size,
  color,
  className = '',
}: SocialIconProps) {
  const iconData = useMemo(() => {
    const metadata = getPlatformMetadata(platform);
    if (!metadata) return null;

    // Get icon from Simple Icons
    const iconKey = `si${metadata.iconSlug.charAt(0).toUpperCase()}${metadata.iconSlug.slice(1)}`;
    const icon = (SimpleIcons as Record<string, { svg: string; hex: string }>)[iconKey];

    if (!icon) return null;

    return {
      svg: icon.svg,
      brandColor: metadata.brandColor,
    };
  }, [platform]);

  if (!iconData) return null;

  const finalColor = color || iconData.brandColor;

  // Determine background and icon color based on style
  const getStyleClasses = () => {
    const baseRadius = {
      circle: 'rounded-full',
      'circle-dark': 'rounded-full',
      'circle-light': 'rounded-full',
      square: 'rounded-none',
      'square-dark': 'rounded-none',
      rounded: 'rounded-lg',
      'rounded-dark': 'rounded-lg',
      none: '',
    }[iconStyle];

    const bgColor = {
      circle: finalColor,
      'circle-dark': '#000000',
      'circle-light': '#FFFFFF',
      square: 'transparent',
      'square-dark': '#000000',
      rounded: finalColor,
      'rounded-dark': '#000000',
      none: 'transparent',
    }[iconStyle];

    const iconColor = {
      circle: '#FFFFFF',
      'circle-dark': '#FFFFFF',
      'circle-light': finalColor,
      square: finalColor,
      'square-dark': '#FFFFFF',
      rounded: '#FFFFFF',
      'rounded-dark': '#FFFFFF',
      none: finalColor,
    }[iconStyle];

    return { baseRadius, bgColor, iconColor };
  };

  const { baseRadius, bgColor, iconColor } = getStyleClasses();

  return (
    <div
      className={`inline-flex items-center justify-center ${baseRadius} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor,
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: iconData.svg }}
        style={{
          width: `${size * 0.6}px`,
          height: `${size * 0.6}px`,
          color: iconColor,
        }}
        className="[&>svg]:fill-current [&>svg]:w-full [&>svg]:h-full"
      />
    </div>
  );
}
