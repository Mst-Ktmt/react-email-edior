'use client';

import type { BoxShadow } from '@/types';
import { boxShadowPresets } from '@/types';
import { NumberInput } from './NumberInput';
import { ColorPicker } from './ColorPicker';
import { CheckboxInput } from './CheckboxInput';

export interface BoxShadowEditorProps {
  value?: BoxShadow;
  onChange: (value?: BoxShadow) => void;
}

export function BoxShadowEditor({ value, onChange }: BoxShadowEditorProps) {
  const handlePreset = (preset: BoxShadow) => {
    onChange(preset);
  };

  return (
    <div className="space-y-3">
      <CheckboxInput
        label="Enable Shadow"
        checked={!!value}
        onChange={(checked: boolean) => {
          if (checked) {
            onChange(boxShadowPresets.subtle);
          } else {
            onChange(undefined);
          }
        }}
      />

      {value && (
        <>
          {/* Presets */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Presets</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePreset(boxShadowPresets.subtle)}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Subtle
              </button>
              <button
                type="button"
                onClick={() => handlePreset(boxShadowPresets.medium)}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => handlePreset(boxShadowPresets.strong)}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Strong
              </button>
            </div>
          </div>

          {/* Custom settings */}
          <NumberInput
            label="Horizontal Offset"
            value={value.x}
            onChange={(x) => onChange({ ...value, x })}
            min={-50}
            max={50}
            unit="px"
          />
          <NumberInput
            label="Vertical Offset"
            value={value.y}
            onChange={(y) => onChange({ ...value, y })}
            min={-50}
            max={50}
            unit="px"
          />
          <NumberInput
            label="Blur Radius"
            value={value.blur}
            onChange={(blur) => onChange({ ...value, blur })}
            min={0}
            max={100}
            unit="px"
          />
          <NumberInput
            label="Spread"
            value={value.spread}
            onChange={(spread) => onChange({ ...value, spread })}
            min={-50}
            max={50}
            unit="px"
          />
          <ColorPicker
            label="Shadow Color"
            value={value.color}
            onChange={(color) => onChange({ ...value, color })}
          />
          <CheckboxInput
            label="Inset"
            checked={value.inset ?? false}
            onChange={(inset: boolean) => onChange({ ...value, inset })}
          />
        </>
      )}
    </div>
  );
}
