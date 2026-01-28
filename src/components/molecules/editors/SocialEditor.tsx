'use client';

import type { SocialBlockProps, SocialLink, SocialPlatform } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  NumberInput,
  ColorPicker,
  TextInput,
} from '../PropertyEditor';

export interface SocialEditorProps {
  props: SocialBlockProps;
  onChange: (props: Partial<SocialBlockProps>) => void;
}

const PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'pinterest', label: 'Pinterest' },
];

export function SocialEditor({ props, onChange }: SocialEditorProps) {
  const handleLinkChange = (index: number, updates: Partial<SocialLink>) => {
    const newLinks = [...props.links];
    newLinks[index] = { ...newLinks[index], ...updates };
    onChange({ links: newLinks });
  };

  const handleAddLink = () => {
    const usedPlatforms = new Set(props.links.map((l) => l.platform));
    const availablePlatform = PLATFORMS.find((p) => !usedPlatforms.has(p.value));
    if (availablePlatform) {
      onChange({
        links: [
          ...props.links,
          { platform: availablePlatform.value, url: '', enabled: true },
        ],
      });
    }
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = props.links.filter((_, i) => i !== index);
    onChange({ links: newLinks });
  };

  return (
    <>
      <PropertySection title="Social Links">
        <div className="flex flex-col gap-3">
          {props.links.map((link, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <select
                  value={link.platform}
                  onChange={(e) =>
                    handleLinkChange(index, {
                      platform: e.target.value as SocialPlatform,
                    })
                  }
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={link.enabled}
                      onChange={(e) =>
                        handleLinkChange(index, { enabled: e.target.checked })
                      }
                      className="rounded"
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <TextInput
                label="URL"
                value={link.url}
                onChange={(value) => handleLinkChange(index, { url: value })}
              />
            </div>
          ))}
          {props.links.length < PLATFORMS.length && (
            <button
              type="button"
              onClick={handleAddLink}
              className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50"
            >
              + Add Social Link
            </button>
          )}
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
        <ColorPicker
          label="Icon Color"
          value={props.iconColor}
          onChange={(value) => onChange({ iconColor: value })}
        />
        <NumberInput
          label="Gap Between Icons"
          value={props.gap}
          onChange={(value) => onChange({ gap: value })}
          min={0}
          max={48}
          unit="px"
        />
        <AlignEditor
          label="Alignment"
          value={props.align}
          onChange={(value) => onChange({ align: value })}
        />
      </PropertySection>
      <PropertySection title="Spacing">
        <SpacingEditor
          label="Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>
    </>
  );
}
