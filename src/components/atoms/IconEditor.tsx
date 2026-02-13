'use client';

import type { ButtonIcon, IconType } from '@/types';
import { CheckboxInput } from './CheckboxInput';
import { NumberInput } from './NumberInput';
import { ColorPicker } from './ColorPicker';
import { EmojiPicker } from './EmojiPicker';

export interface IconEditorProps {
  value?: ButtonIcon;
  onChange: (value?: ButtonIcon) => void;
  defaultTextColor?: string;
}

export function IconEditor({ value, onChange, defaultTextColor }: IconEditorProps) {
  const handleTypeChange = (type: IconType) => {
    if (value) {
      onChange({
        ...value,
        type,
        // SVG以外の場合は size と color をリセット
        size: type === 'svg' ? value.size || 16 : undefined,
        color: type === 'svg' ? value.color : undefined,
      });
    }
  };

  return (
    <div className="space-y-3">
      <CheckboxInput
        label="Enable Icon"
        checked={!!value}
        onChange={(checked: boolean) => {
          if (checked) {
            // デフォルトアイコン設定
            onChange({
              type: 'emoji',
              content: '→',
              position: 'right',
              spacing: 8,
            });
          } else {
            onChange(undefined);
          }
        }}
      />

      {value && (
        <>
          {/* Icon Type */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Icon Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('emoji')}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${value.type === 'emoji' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                `}
              >
                Emoji
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('unicode')}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${value.type === 'unicode' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                `}
              >
                Unicode
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('svg')}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${value.type === 'svg' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                `}
              >
                SVG
              </button>
            </div>
          </div>

          {/* Icon Content */}
          <div>
            {value.type === 'emoji' && (
              <EmojiPicker
                value={value.content}
                onChange={(emoji) => onChange({ ...value, content: emoji })}
              />
            )}

            {value.type === 'unicode' && (
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Unicode Character
                </label>
                <input
                  type="text"
                  value={value.content}
                  onChange={(e) => onChange({ ...value, content: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., &#8594; or →"
                />
              </div>
            )}

            {value.type === 'svg' && (
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  SVG Content (path data only)
                </label>
                <textarea
                  value={value.content}
                  onChange={(e) => onChange({ ...value, content: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  rows={4}
                  placeholder='<path d="M12 2L2 7l10 5 10-5-10-5z"/>'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter SVG path data only (without &lt;svg&gt; wrapper)
                </p>
              </div>
            )}
          </div>

          {/* Icon Position */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Position
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...value, position: 'left' })}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${value.position === 'left' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                `}
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...value, position: 'right' })}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${value.position === 'right' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                `}
              >
                Right
              </button>
            </div>
          </div>

          {/* Spacing */}
          <NumberInput
            label="Spacing"
            value={value.spacing}
            onChange={(spacing) => onChange({ ...value, spacing })}
            min={0}
            max={50}
            unit="px"
          />

          {/* SVG-specific options */}
          {value.type === 'svg' && (
            <>
              <NumberInput
                label="Size"
                value={value.size || 16}
                onChange={(size) => onChange({ ...value, size })}
                min={8}
                max={64}
                unit="px"
              />
              <ColorPicker
                label="Color"
                value={value.color || defaultTextColor || '#000000'}
                onChange={(color) => onChange({ ...value, color })}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
