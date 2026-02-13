'use client';

import type { BackgroundGradient, GradientColor, GradientType } from '@/types';
import { gradientPresets } from '@/types';
import { NumberInput } from './NumberInput';
import { ColorPicker } from './ColorPicker';

export interface GradientEditorProps {
  value?: BackgroundGradient;
  onChange: (value?: BackgroundGradient) => void;
}

export function GradientEditor({ value, onChange }: GradientEditorProps) {
  const handleAddColor = () => {
    if (!value) return;
    if (value.colors.length >= 5) return; // Max 5 colors

    const newColor: GradientColor = {
      color: '#667eea',
      position: 50,
    };

    onChange({
      ...value,
      colors: [...value.colors, newColor],
    });
  };

  const handleRemoveColor = (index: number) => {
    if (!value) return;
    if (value.colors.length <= 2) return; // Min 2 colors

    const newColors = value.colors.filter((_, i) => i !== index);
    onChange({
      ...value,
      colors: newColors,
    });
  };

  const handleColorChange = (index: number, field: keyof GradientColor, newValue: string | number) => {
    if (!value) return;

    const newColors = value.colors.map((color, i) =>
      i === index ? { ...color, [field]: newValue } : color
    );

    onChange({
      ...value,
      colors: newColors,
    });
  };

  const handlePreset = (preset: BackgroundGradient) => {
    onChange(preset);
  };

  const handleTypeChange = (type: GradientType) => {
    if (!value) return;

    onChange({
      ...value,
      type,
      // Reset angle for radial
      angle: type === 'linear' ? value.angle || 90 : undefined,
    });
  };

  return (
    <div className="space-y-3">
      {/* Presets */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-2 block">Presets</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handlePreset(gradientPresets.sunset)}
            className="flex-1 h-8 rounded border border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: 'linear-gradient(90deg, #ff6b6b 0%, #feca57 100%)',
            }}
            title="Sunset"
          />
          <button
            type="button"
            onClick={() => handlePreset(gradientPresets.ocean)}
            className="flex-1 h-8 rounded border border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
            }}
            title="Ocean"
          />
          <button
            type="button"
            onClick={() => handlePreset(gradientPresets.purple)}
            className="flex-1 h-8 rounded border border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            }}
            title="Purple"
          />
        </div>
      </div>

      {value && (
        <>
          {/* Gradient Type */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Gradient Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('linear')}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${value.type === 'linear' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                `}
              >
                Linear
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('radial')}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${value.type === 'radial' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                `}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Angle (Linear only) */}
          {value.type === 'linear' && (
            <NumberInput
              label="Angle"
              value={value.angle || 90}
              onChange={(angle) => onChange({ ...value, angle })}
              min={0}
              max={360}
              unit="°"
            />
          )}

          {/* Colors */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Colors ({value.colors.length}/5)
            </label>
            <div className="space-y-2">
              {value.colors.map((color, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <ColorPicker
                      label={`Color ${index + 1}`}
                      value={color.color}
                      onChange={(newColor) => handleColorChange(index, 'color', newColor)}
                    />
                  </div>
                  <div className="flex-1">
                    <NumberInput
                      label="Position"
                      value={color.position}
                      onChange={(position) => handleColorChange(index, 'position', position)}
                      min={0}
                      max={100}
                      unit="%"
                    />
                  </div>
                  {value.colors.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Remove color"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {value.colors.length < 5 && (
              <button
                type="button"
                onClick={handleAddColor}
                className="mt-2 w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                + Add Color
              </button>
            )}
          </div>

          {/* Preview */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Preview</label>
            <div
              className="w-full h-16 rounded border border-gray-300"
              style={{
                background:
                  value.type === 'linear'
                    ? `linear-gradient(${value.angle || 90}deg, ${value.colors.map((c) => `${c.color} ${c.position}%`).join(', ')})`
                    : `radial-gradient(circle, ${value.colors.map((c) => `${c.color} ${c.position}%`).join(', ')})`,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
