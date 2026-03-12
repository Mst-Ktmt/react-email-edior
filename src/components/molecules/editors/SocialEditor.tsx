'use client';

import { useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import type { SocialBlockProps, SocialLink, SocialPlatform } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  NumberInput,
  ColorPicker,
  TextInput,
  ResponsiveToggle,
} from '../PropertyEditor';
import { SocialIconPicker } from '../SocialIconPicker';
import { SocialIcon } from '@/components/atoms/SocialIcon';
import { getPlatformMetadata } from '@/lib/social/platforms';

export interface SocialEditorProps {
  props: SocialBlockProps;
  onChange: (props: Partial<SocialBlockProps>) => void;
}

const ICON_STYLES = [
  { value: 'circle' as const, label: 'Circle' },
  { value: 'circle-dark' as const, label: 'Circle Dark' },
  { value: 'circle-light' as const, label: 'Circle Light' },
  { value: 'square' as const, label: 'Square' },
  { value: 'square-dark' as const, label: 'Square Dark' },
  { value: 'rounded' as const, label: 'Rounded' },
  { value: 'rounded-dark' as const, label: 'Rounded Dark' },
  { value: 'none' as const, label: 'None' },
];

export function SocialEditor({ props, onChange }: SocialEditorProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleLinkChange = (index: number, updates: Partial<SocialLink>) => {
    const newLinks = [...props.links];
    newLinks[index] = { ...newLinks[index], ...updates };
    onChange({ links: newLinks });
  };

  const handleAddLink = (platform: SocialPlatform) => {
    onChange({
      links: [
        ...props.links,
        { platform, url: '', enabled: true },
      ],
    });
    setShowPicker(false);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = props.links.filter((_, i) => i !== index);
    onChange({ links: newLinks });
  };

  const usedPlatforms = new Set(props.links.map((l) => l.platform));

  return (
    <>
      <PropertySection title="Icons">
        <div className="flex flex-col gap-1 mb-3">
          <span className="text-xs font-medium text-gray-600">Icon Style</span>
          <div className="grid grid-cols-2 gap-2">
            {ICON_STYLES.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => onChange({ iconStyle: style.value })}
                className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                  (props.iconStyle ?? 'circle') === style.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {props.links.map((link, index) => {
            const metadata = getPlatformMetadata(link.platform);
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group"
              >
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />

                <SocialIcon
                  platform={link.platform}
                  iconStyle={props.iconStyle ?? 'circle-light'}
                  size={32}
                />

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700 truncate">
                    {metadata?.label ?? link.platform}
                  </div>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, { url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={link.enabled}
                    onChange={(e) => handleLinkChange(index, { enabled: e.target.checked })}
                    className="rounded"
                  />
                  <span className="hidden sm:inline">Show</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="w-full py-3 text-sm font-medium text-blue-600 border-2 border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
          >
            + Add Social Icon
          </button>
        </div>
      </PropertySection>

      <PropertySection title="Icon Style">
        <NumberInput
          label="Icon Size"
          value={props.iconSize}
          onChange={(value) => onChange({ iconSize: value })}
          min={16}
          max={64}
          unit="px"
        />
        <NumberInput
          label="Icon Spacing"
          value={props.gap}
          onChange={(value) => onChange({ gap: value })}
          min={0}
          max={48}
          unit="px"
        />
        <ColorPicker
          label="Icon Color"
          value={props.iconColor}
          onChange={(value) => onChange({ iconColor: value })}
        />
        <AlignEditor
          label="Alignment"
          value={props.align}
          onChange={(value) => onChange({ align: value })}
        />
      </PropertySection>

      <PropertySection title="General">
        <SpacingEditor
          label="Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>

      <PropertySection title="Responsive Design">
        <ResponsiveToggle
          hideOnDesktop={props.hideOnDesktop ?? false}
          hideOnMobile={props.hideOnMobile ?? false}
          onChangeDesktop={(value) => onChange({ hideOnDesktop: value })}
          onChangeMobile={(value) => onChange({ hideOnMobile: value })}
        />
      </PropertySection>

      {showPicker && (
        <SocialIconPicker
          usedPlatforms={usedPlatforms}
          onSelect={handleAddLink}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
