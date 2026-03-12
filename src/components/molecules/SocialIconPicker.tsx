'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { SocialPlatform } from '@/types';
import { SOCIAL_PLATFORMS, getPlatformsByCategory } from '@/lib/social/platforms';
import { SocialIcon } from '@/components/atoms/SocialIcon';

interface SocialIconPickerProps {
  usedPlatforms: Set<SocialPlatform>;
  onSelect: (platform: SocialPlatform) => void;
  onClose: () => void;
}

export function SocialIconPicker({
  usedPlatforms,
  onSelect,
  onClose,
}: SocialIconPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'social' | 'messaging' | 'content' | 'community' | 'design'>('all');

  const categories = [
    { id: 'all' as const, label: 'All' },
    { id: 'social' as const, label: 'Social' },
    { id: 'messaging' as const, label: 'Messaging' },
    { id: 'content' as const, label: 'Content' },
    { id: 'community' as const, label: 'Community' },
    { id: 'design' as const, label: 'Design' },
  ];

  const filteredPlatforms = selectedCategory === 'all'
    ? SOCIAL_PLATFORMS
    : getPlatformsByCategory(selectedCategory);

  const availablePlatforms = filteredPlatforms.filter(
    (p) => !usedPlatforms.has(p.id)
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Add Social Icon
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 p-4 border-b border-gray-200 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Icon Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {availablePlatforms.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No available icons in this category
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => onSelect(platform.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <SocialIcon
                      platform={platform.id}
                      iconStyle="circle-light"
                      size={48}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs text-gray-600 text-center">
                      {platform.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
